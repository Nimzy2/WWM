# User Management Guide - Admin & Writer Accounts

This guide explains how to create and manage admin and writer login accounts for the Kenya Women's March website.

## Overview

- **Admin accounts**: Full access to all features (dashboard, posts, users, messages, subscribers, join requests)
- **Writer accounts**: Limited access to blog management only (create, edit, and manage posts)

---

## Method 1: Supabase Dashboard (Recommended for First-Time Setup)

### Step 1: Create User Account

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Users** in the left sidebar
4. Click **"Add user"** or **"Invite user"** button
5. Fill in:
   - **Email**: The user's email address
   - **Password**: Set a temporary password (user can change it later)
   - **Auto Confirm User**: Check this box (so they can login immediately)
6. Click **"Create user"**

### Step 2: Set User Role

After creating the user:

1. Find the user in the Users list
2. Click on the user to open their details
3. Scroll down to **"User Metadata"** section
4. Click **"Edit"** or the pencil icon
5. Add or update the JSON:
   ```json
   {
     "role": "admin"
   }
   ```
   OR
   ```json
   {
     "role": "writer"
   }
   ```
6. Click **"Save"**

**Note**: If the user already has metadata, add `"role"` to the existing JSON object.

---

## Method 2: Command Line Script (Quick Role Assignment)

If you already have users created and just need to set/change their roles:

### Prerequisites

1. Node.js installed
2. Your Supabase credentials:
   - `SUPABASE_URL` (e.g., `https://xxxxx.supabase.co`)
   - `SUPABASE_SERVICE_ROLE_KEY` (found in Supabase Dashboard → Settings → API)

### Steps

1. **Open Command Prompt** in your project folder:
   ```cmd
   cd C:\Users\user\Documents\WMWK\kenya-womens-march
   ```

2. **Set environment variables** (PowerShell):
   ```powershell
   $env:SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
   $env:SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
   ```

3. **Run the script** to set a role:
   ```cmd
   node scripts/setUserRole.mjs writer@example.com writer
   ```
   OR for admin:
   ```cmd
   node scripts/setUserRole.mjs admin@example.com admin
   ```

**Example:**
```cmd
node scripts/setUserRole.mjs john@example.com writer
node scripts/setUserRole.mjs jane@example.com admin
```

---

## Method 3: User Management UI (For Admins Only)

If you're already logged in as an admin:

1. Go to `/admin/users` in your browser
2. Enter the user's email address
3. Select the role (Admin or Writer)
4. Click **"Set Role"**

**Note**: This requires the Edge Function to be deployed. See deployment instructions below.

---

## Creating Your First Admin Account

Since you need an admin to create other admins, here's how to set up the first one:

### Option A: Via Supabase Dashboard

1. Create a user in Supabase Dashboard (Method 1, Step 1)
2. Set their role to `"admin"` in user metadata (Method 1, Step 2)
3. They can now login at `/admin/login`

### Option B: Via Command Line

1. Create a user in Supabase Dashboard (Method 1, Step 1)
2. Use the script to set their role:
   ```cmd
   node scripts/setUserRole.mjs firstadmin@example.com admin
   ```

---

## Verifying User Roles

To check if a user's role is set correctly:

1. Go to Supabase Dashboard → Authentication → Users
2. Click on the user
3. Check the **"User Metadata"** section
4. You should see: `{"role": "admin"}` or `{"role": "writer"}`

---

## Login Process

1. Users go to `/admin/login`
2. They select their role type (Admin or Writer) - this is just visual
3. Enter their email and password
4. System automatically redirects:
   - **Writers** → `/admin/posts` (blog management)
   - **Admins** → `/admin/dashboard` (full dashboard)

---

## Troubleshooting

### User can't login
- Check if user exists in Supabase → Authentication → Users
- Verify email is correct
- Check if "Auto Confirm User" was enabled when creating the account

### User has wrong permissions
- Verify the role in user metadata (should be `"admin"` or `"writer"`)
- Make sure there are no typos in the role value
- Try logging out and back in

### Script doesn't work
- Verify environment variables are set correctly
- Check that you're using the Service Role Key (not the anon key)
- Make sure the user exists in Supabase

---

## Security Notes

⚠️ **Important:**
- Never share your Service Role Key publicly
- Keep it in environment variables, not in code
- The Service Role Key has full admin access to your database
- Writers can only access blog management - they cannot see other admin features

---

## Quick Reference

| Task | Method | Location |
|------|--------|----------|
| Create new user | Supabase Dashboard | Authentication → Users → Add user |
| Set role (first time) | Supabase Dashboard | User details → User Metadata |
| Change existing role | Command script | `node scripts/setUserRole.mjs <email> <role>` |
| Change role (as admin) | User Management UI | `/admin/users` |
| View all users | Supabase Dashboard | Authentication → Users |

---

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase credentials are correct
3. Ensure users are created and confirmed in Supabase
4. Check that roles are set in user metadata correctly

