param(
  [string]$ProjectRef = "xvwbtxsryehozinshyfr",
  [string]$DbPassword = $env:SUPABASE_DB_PASSWORD,
  [switch]$SkipFunctions
)

$ErrorActionPreference = "Stop"

function Invoke-Supabase {
  param([string[]]$Arguments)

  $displayArguments = [string[]]$Arguments.Clone()
  for ($index = 0; $index -lt $displayArguments.Length; $index++) {
    if ($displayArguments[$index] -eq "--password" -and $index + 1 -lt $displayArguments.Length) {
      $displayArguments[$index + 1] = "***"
    }

    if ($displayArguments[$index] -eq "--db-url" -and $index + 1 -lt $displayArguments.Length) {
      $displayArguments[$index + 1] = "***"
    }

  }

  Write-Host ""
  Write-Host "npx $($displayArguments -join ' ')" -ForegroundColor DarkGray
  & npx.cmd @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Supabase CLI failed with exit code $LASTEXITCODE."
  }
}

if (-not (Get-Command npx.cmd -ErrorAction SilentlyContinue)) {
  throw "npx was not found. Install Node.js 20+ before deploying Supabase."
}

if (-not $ProjectRef) {
  throw "ProjectRef is required."
}

Write-Host "Deploying Drive Astral Supabase project: $ProjectRef"
Write-Host "Secrets are read from environment variables and are not stored in the repo."

if ($DbPassword) {
  $encodedPassword = [System.Uri]::EscapeDataString($DbPassword)
  $dbUrl = "postgresql://postgres:$encodedPassword@db.$ProjectRef.supabase.co:5432/postgres"
  Invoke-Supabase @("supabase", "db", "push", "--db-url", $dbUrl, "--yes")
} else {
  Write-Host "SUPABASE_DB_PASSWORD is not set. Falling back to the linked project."
  Invoke-Supabase @("supabase", "db", "push", "--linked", "--yes")
}

if ($SkipFunctions) {
  Write-Host ""
  Write-Host "Skipping Edge Functions deploy." -ForegroundColor Yellow
} else {
  Invoke-Supabase @(
    "supabase",
    "functions",
    "deploy",
    "delete-account",
    "--project-ref",
    $ProjectRef,
    "--use-api"
  )
}

Write-Host ""
Write-Host "Supabase deploy finished."
