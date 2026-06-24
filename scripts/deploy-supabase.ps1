param(
  [string]$ProjectRef = "jjnmxkfumiwoeyyregzb",
  [string]$DbPassword = $env:SUPABASE_DB_PASSWORD,
  [string]$PaymentWebhookSecret = $env:PAYMENT_WEBHOOK_SECRET,
  [string]$PaymentProductPlanMap = $env:PAYMENT_PRODUCT_PLAN_MAP,
  [switch]$SkipFunctions,
  [switch]$SkipSecrets
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

    if ($displayArguments[$index] -like "PAYMENT_WEBHOOK_SECRET=*") {
      $displayArguments[$index] = "PAYMENT_WEBHOOK_SECRET=***"
    }

    if ($displayArguments[$index] -like "PAYMENT_PRODUCT_PLAN_MAP=*") {
      $displayArguments[$index] = "PAYMENT_PRODUCT_PLAN_MAP=***"
    }
  }

  Write-Host ""
  Write-Host "npx $($displayArguments -join ' ')" -ForegroundColor DarkGray
  & npx @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Supabase CLI failed with exit code $LASTEXITCODE."
  }
}

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
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
    "payment-webhook",
    "--project-ref",
    $ProjectRef,
    "--no-verify-jwt",
    "--use-api"
  )

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

if (-not $SkipSecrets) {
  if ($PaymentWebhookSecret -and $PaymentProductPlanMap) {
    Invoke-Supabase @(
      "supabase",
      "secrets",
      "set",
      "--project-ref",
      $ProjectRef,
      "PAYMENT_WEBHOOK_SECRET=$PaymentWebhookSecret",
      "PAYMENT_PRODUCT_PLAN_MAP=$PaymentProductPlanMap"
    )
  } else {
    Write-Host ""
    Write-Host "Payment secrets were not configured." -ForegroundColor Yellow
    Write-Host "Set PAYMENT_WEBHOOK_SECRET and PAYMENT_PRODUCT_PLAN_MAP locally, then rerun this script or configure them in the Supabase dashboard."
  }
}

Write-Host ""
Write-Host "Supabase deploy finished."
