# Example script to set user role
# Replace the values below with your actual Supabase credentials

# Set your Supabase URL (get it from Supabase Dashboard or your browser URL)
$env:SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"

# Set your Service Role Key (get it from Supabase Dashboard → Settings → API → service_role key)
$env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Run the script to set role
# Replace email and role as needed
node scripts/setUserRole.mjs nimohkariuki9@gmail.com admin

