param(
  [string]$EnvFile = ".env.supabase.local",
  [string]$BackupDir
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

    $values[$parts[0].Trim()] = $parts[1].Trim()
  }

  return $values
}

if ([string]::IsNullOrWhiteSpace($BackupDir)) {
  throw "Passe le dossier de backup via -BackupDir avant toute remise a zero."
}

$resolvedBackupDir = Resolve-RepoPath $BackupDir
if (-not (Test-Path -LiteralPath $resolvedBackupDir)) {
  throw "Backup introuvable: $resolvedBackupDir"
}

if (-not (Test-Path -LiteralPath (Join-Path $resolvedBackupDir "database-context.json"))) {
  throw "Backup incomplet: database-context.json absent dans $resolvedBackupDir"
}

$config = Load-DotEnv -PathValue $EnvFile

foreach ($requiredKey in @("SUPABASE_ACCESS_TOKEN", "SUPABASE_PROJECT_REF")) {
  if (-not $config.ContainsKey($requiredKey) -or [string]::IsNullOrWhiteSpace($config[$requiredKey])) {
    throw "Variable requise manquante dans $EnvFile : $requiredKey"
  }
}

$projectRef = $config["SUPABASE_PROJECT_REF"]
$headers = @{
  Authorization = "Bearer $($config["SUPABASE_ACCESS_TOKEN"])"
  "Content-Type" = "application/json"
}

$sql = @"
drop schema if exists public cascade;
create schema public;
grant usage on schema public to postgres, anon, authenticated, service_role;
grant create on schema public to postgres, service_role;
comment on schema public is 'standard public schema';

truncate table
  auth.audit_log_entries,
  auth.flow_state,
  auth.identities,
  auth.mfa_amr_claims,
  auth.mfa_challenges,
  auth.mfa_factors,
  auth.oauth_authorizations,
  auth.oauth_client_states,
  auth.oauth_consents,
  auth.one_time_tokens,
  auth.refresh_tokens,
  auth.sessions,
  auth.users,
  auth.webauthn_challenges,
  auth.webauthn_credentials
cascade;

truncate table
  realtime.messages,
  realtime.subscription
cascade;

truncate table
  supabase_migrations.schema_migrations
cascade;
"@

$body = @{ query = $sql } | ConvertTo-Json -Compress
Invoke-RestMethod -Method Post -Headers $headers -Uri "https://api.supabase.com/v1/projects/$projectRef/database/query" -Body $body | Out-Null

Write-Host "Schema public recree avec succes pour le projet $projectRef"
