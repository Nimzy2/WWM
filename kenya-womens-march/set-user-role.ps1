# Script to set user role in Supabase
# Instructions:
# 1. Open this file in a text editor
# 2. Replace YOUR_PROJECT_REF with your Supabase project reference (from the URL)
# 3. Replace YOUR_SERVICE_ROLE_KEY with your service role key from Supabase Dashboard
# 4. Replace the email and role at the bottom
# 5. Save and run: .\set-user-role.ps1

# Get Supabase credentials (edit these!)
$SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co"
$SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY"

# Set environment variables
$env:SUPABASE_URL = $SUPABASE_URL
$env:SUPABASE_SERVICE_ROLE_KEY = $SUPABASE_SERVICE_ROLE_KEY

# Set user role (edit email and role here!)
$USER_EMAIL = "nimohkariuki9@gmail.com"
$USER_ROLE = "admin"  # or "writer"

# Run the script
Write-Host "Setting role '$USER_ROLE' for user: $USER_EMAIL" -ForegroundColor Green
node scripts/setUserRole.mjs $USER_EMAIL $USER_ROLE

