import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const ROOT_DIR = process.cwd();
const SRC_DIR = join(ROOT_DIR, "src");
const ALLOWED_EXTENSIONS = new Set([".ts", ".tsx"]);
const warnings = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!ALLOWED_EXTENSIONS.has(extname(fullPath))) {
      continue;
    }

    inspectFile(fullPath);
  }
}

function countMatches(content, pattern) {
  return (content.match(pattern) || []).length;
}

function inspectFile(filePath) {
  const relativePath = relative(ROOT_DIR, filePath);
  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const lineCount = lines.length;
  const componentCount = countMatches(
    content,
    /export\s+(default\s+)?function\s+[A-Z]|\bconst\s+[A-Z][A-Za-z0-9_]*\s*=\s*\(/g,
  );
  const effectCount = countMatches(content, /\buseEffect\s*\(/g);
  const hasInlineMockData =
    !relativePath.includes("\\mocks\\") &&
    !relativePath.endsWith("constants.ts") &&
    /\bconst\s+[A-Z0-9_]+_DATA\b/.test(content);
  const hasQueryAndHeavyJsx =
    /\buseQuery\s*\(/.test(content) && countMatches(content, /<div|<Card|<table|<main|<aside/g) > 20;

  if (lineCount > 250) {
    warnings.push(`HIGH  ${relativePath}: ${lineCount} lignes (>250)`);
  } else if (lineCount > 180) {
    warnings.push(`WARN  ${relativePath}: ${lineCount} lignes (>180)`);
  }

  if (componentCount > 3) {
    warnings.push(`WARN  ${relativePath}: ${componentCount} composants/fonctions UI detectes`);
  }

  if (effectCount > 2 && extname(filePath) === ".tsx" && componentCount > 0) {
    warnings.push(`WARN  ${relativePath}: ${effectCount} useEffect detectes`);
  }

  if (hasInlineMockData) {
    warnings.push(`WARN  ${relativePath}: mock data inline detectee`);
  }

  if (hasQueryAndHeavyJsx) {
    warnings.push(`WARN  ${relativePath}: useQuery + gros rendu JSX dans le meme fichier`);
  }
}

walk(SRC_DIR);

if (warnings.length === 0) {
  console.log("Refactor Watch: aucun signal critique detecte.");
  process.exit(0);
}

console.log("Refactor Watch:");
for (const warning of warnings) {
  console.log(`- ${warning}`);
}

process.exit(0);
