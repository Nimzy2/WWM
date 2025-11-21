# Start User Role Manager
# This will open a web interface at http://localhost:3001

Write-Host "Starting User Role Manager..." -ForegroundColor Green
Write-Host ""

# Check if environment variables are set
if (-not $env:SUPABASE_URL -or -not $env:SUPABASE_SERVICE_ROLE_KEY) {
    Write-Host "⚠️  Environment variables not set!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please set them first:" -ForegroundColor Yellow
    Write-Host '  $env:SUPABASE_URL="https://YOUR_PROJECT.supabase.co"' -ForegroundColor Cyan
    Write-Host '  $env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or edit this script and add them at the top." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

Write-Host "✅ Environment variables found" -ForegroundColor Green
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Green
Write-Host ""

# Start the server
node scripts/user-role-manager.js

