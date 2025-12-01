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

## Storage Policies SQL (Optional)

If you want to set up Row Level Security policies for the storage bucket, run this SQL in your Supabase SQL Editor:

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
```

## File Size Limits

- Maximum file size: **50MB**
- Supported formats: **PDF, DOC, DOCX**

## Notes

- Files are stored in the `publications/` folder within the bucket
- Each file gets a unique timestamp-based filename to prevent conflicts
- The public URL is automatically generated and stored in the database

