# Publications Storage Setup Guide

To enable file uploads for publications, you need to set up a Supabase Storage bucket.

## Steps to Create Storage Bucket

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Click on "Storage" in the left sidebar

2. **Create a New Bucket**
   - Click "New bucket"
   - Name: `publications`
   - Make it **Public** (so files can be accessed via public URLs)
   - Click "Create bucket"

3. **Set Up Storage Policies (Optional but Recommended)**
   - Go to Storage → Policies
   - Select the `publications` bucket
   - Add policies for:
     - **Upload**: Allow authenticated users to upload files
     - **Read**: Allow public to read files (if bucket is public, this is automatic)

## Storage Policies SQL (REQUIRED)

**IMPORTANT:** You MUST set up storage policies for uploads to work. Run this SQL in your Supabase SQL Editor:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'publications');

-- Allow public to read files
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'publications');

-- Allow authenticated users to update their own files (optional)
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'publications');

-- Allow authenticated users to delete files (optional)
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'publications');
```

**Note:** If you get an error that the policy already exists, you can drop and recreate it:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Then create them again using the SQL above
```

## File Size Limits

- Maximum file size: **50MB**
- Supported formats: **PDF, DOC, DOCX**

## Notes

- Files are stored in the `publications/` folder within the bucket
- Each file gets a unique timestamp-based filename to prevent conflicts
- The public URL is automatically generated and stored in the database

