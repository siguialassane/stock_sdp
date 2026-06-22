param(
  [string]$EnvFile = ".env.supabase.local",
  [string]$OutputRoot = "backups.local/supabase",
  [switch]$IncludeApiKeys
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-RepoPath {
  param([string]$PathValue)

  if ([System.IO.Path]::IsPathRooted($PathValue)) {
    return $PathValue
  }

  return Join-Path (Get-Location) $PathValue
}

function Load-DotEnv {
  param([string]$PathValue)

  $resolved = Resolve-RepoPath $PathValue
  if (-not (Test-Path -LiteralPath $resolved)) {
    throw "Fichier d'environnement introuvable: $resolved"
  }

  $values = @{}

  foreach ($line in Get-Content -LiteralPath $resolved) {
    $trimmed = $line.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed) -or $trimmed.StartsWith("#")) {
      continue
    }

    $parts = $trimmed -split "=", 2
    if ($parts.Count -ne 2) {
      continue
    }

    $key = $parts[0].Trim()
    $value = $parts[1].Trim()
    $values[$key] = $value
    [Environment]::SetEnvironmentVariable($key, $value, "Process")
  }

  return $values
}

function Invoke-JsonGet {
  param(
    [string]$Uri,
    [hashtable]$Headers
  )

  return Invoke-RestMethod -Method Get -Headers $Headers -Uri $Uri
}

function Invoke-SqlResult {
  param(
    [string]$Uri,
    [hashtable]$Headers,
    [string]$Query
  )

  $body = @{ query = $Query } | ConvertTo-Json -Compress
  return @(Invoke-RestMethod -Method Post -Headers $Headers -Uri $Uri -Body $body)
}

function Write-JsonFile {
  param(
    [string]$PathValue,
    [Parameter(ValueFromPipeline = $true)]
    $InputObject
  )

  $parent = Split-Path -Parent $PathValue
  if ($parent) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }

  $json = $InputObject | ConvertTo-Json -Depth 100
  [System.IO.File]::WriteAllText($PathValue, $json, [System.Text.Encoding]::UTF8)
}

$config = Load-DotEnv -PathValue $EnvFile

foreach ($requiredKey in @("SUPABASE_ACCESS_TOKEN", "SUPABASE_PROJECT_REF", "SUPABASE_PROJECT_URL")) {
  if (-not $config.ContainsKey($requiredKey) -or [string]::IsNullOrWhiteSpace($config[$requiredKey])) {
    throw "Variable requise manquante dans $EnvFile : $requiredKey"
  }
}

$projectRef = $config["SUPABASE_PROJECT_REF"]
$projectName = if ($config.ContainsKey("SUPABASE_PROJECT_NAME") -and $config["SUPABASE_PROJECT_NAME"]) {
  $config["SUPABASE_PROJECT_NAME"]
} else {
  $projectRef
}

$headers = @{
  Authorization = "Bearer $($config["SUPABASE_ACCESS_TOKEN"])"
}

$jsonHeaders = @{
  Authorization = "Bearer $($config["SUPABASE_ACCESS_TOKEN"])"
  "Content-Type" = "application/json"
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$resolvedOutputRoot = Resolve-RepoPath $OutputRoot
$backupDir = Join-Path $resolvedOutputRoot "$projectRef-$timestamp"
$dataRoot = Join-Path $backupDir "data"

New-Item -ItemType Directory -Force -Path $dataRoot | Out-Null

$project = Invoke-JsonGet -Headers $headers -Uri "https://api.supabase.com/v1/projects/$projectRef"
$context = Invoke-JsonGet -Headers $headers -Uri "https://api.supabase.com/v1/projects/$projectRef/database/context"

$tableList = Invoke-SqlResult -Headers $jsonHeaders -Uri "https://api.supabase.com/v1/projects/$projectRef/database/query/read-only" -Query @"
select table_schema, table_name
from information_schema.tables
where table_schema not in ('pg_catalog', 'information_schema')
  and table_type = 'BASE TABLE'
order by table_schema, table_name;
"@

Write-JsonFile -PathValue (Join-Path $backupDir "project.json") -InputObject $project
Write-JsonFile -PathValue (Join-Path $backupDir "database-context.json") -InputObject $context
Write-JsonFile -PathValue (Join-Path $backupDir "table-list.json") -InputObject $tableList

if ($IncludeApiKeys) {
  $apiKeys = Invoke-JsonGet -Headers $headers -Uri "https://api.supabase.com/v1/projects/$projectRef/api-keys"
  Write-JsonFile -PathValue (Join-Path $backupDir "project-api-keys.json") -InputObject $apiKeys
}

$exportedTables = @()
$exactRowCounts = @()

foreach ($table in $tableList) {
  $schemaName = $table.table_schema
  $tableName = $table.table_name
  $schemaDir = Join-Path $dataRoot $schemaName
  New-Item -ItemType Directory -Force -Path $schemaDir | Out-Null

  $tableExport = Invoke-SqlResult -Headers $jsonHeaders -Uri "https://api.supabase.com/v1/projects/$projectRef/database/query/read-only" -Query @"
select coalesce(json_agg(t), '[]'::json) as rows
from (
  select *
  from "$schemaName"."$tableName"
) as t;
"@

  $rows = if ($tableExport.Count -gt 0 -and $null -ne $tableExport[0].rows) {
    @($tableExport[0].rows)
  } else {
    @()
  }

  $outputFile = Join-Path $schemaDir "$tableName.json"
  Write-JsonFile -PathValue $outputFile -InputObject $rows

  $rowCount = @($rows).Count

  $exactRowCounts += [pscustomobject]@{
    schema = $schemaName
    table = $tableName
    row_count = $rowCount
  }

  $exportedTables += [pscustomobject]@{
    schema = $schemaName
    table = $tableName
    rows_exported = $rowCount
    file = $outputFile
  }
}

Write-JsonFile -PathValue (Join-Path $backupDir "row-counts.json") -InputObject $exactRowCounts

$summary = [pscustomobject]@{
  project_ref = $projectRef
  project_name = $projectName
  project_url = $config["SUPABASE_PROJECT_URL"]
  backup_dir = $backupDir
  exported_at = (Get-Date).ToString("o")
  table_count = @($tableList).Count
  exported_tables = $exportedTables
}

Write-JsonFile -PathValue (Join-Path $backupDir "summary.json") -InputObject $summary

Write-Host "Backup exporte dans: $backupDir"
