# Gallery Storage Setup Guide

To enable the photo gallery feature, you need to set up a Supabase Storage bucket for gallery images.

## Steps to Create Storage Bucket

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Click on "Storage" in the left sidebar

2. **Create a New Bucket**
   - Click "New bucket"
   - Name: `gallery`
   - Make it **Public** (so images can be accessed via public URLs)
   - Click "Create bucket"

3. **Set Up Storage Policies (REQUIRED)**

   You MUST set up storage policies for uploads to work. Run this SQL in your Supabase SQL Editor:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated gallery uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- Allow public to read images (if bucket is public, this is automatic but recommended)
CREATE POLICY "Allow public gallery reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- Allow authenticated users to update their own files (optional)
CREATE POLICY "Allow authenticated gallery updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery');

-- Allow authenticated users to delete images (optional)
CREATE POLICY "Allow authenticated gallery deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery');
```

**Note:** If you get an error that the policy already exists, you can drop and recreate it:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated gallery uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public gallery reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated gallery updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated gallery deletes" ON storage.objects;

-- Then run the CREATE POLICY statements above
```

## Usage

### For Admins: Uploading Images

1. **Log in to the admin dashboard**
   - Navigate to `/admin/login`
   - Log in with your admin credentials

2. **Access Gallery Management**
   - Navigate to `/admin/gallery`
   - Or go to Admin Dashboard → Gallery Management

3. **Upload Images**
   - **Option 1: Select Multiple Images**
     - Click "Select Images" button
     - Choose multiple image files from your computer
     - Images will be uploaded automatically
   
   - **Option 2: Upload a Folder**
     - Click "Upload Folder" button
     - Select a folder containing images
     - All images in the folder will be uploaded automatically

4. **Supported Formats**
   - JPG, JPEG
   - PNG
   - GIF
   - WEBP
   - SVG

5. **File Size Limit**
   - Maximum 10MB per image

### For Visitors: Viewing the Gallery

1. Navigate to `/gallery` from the main navigation
2. Browse images in the modern masonry grid layout
3. Click any image to view it in full-screen lightbox mode
4. Use arrow keys or navigation buttons to browse through images
5. Press ESC or click outside to close the lightbox

## Features

- **Automatic Image Detection**: The gallery automatically detects and displays all images uploaded to the `gallery` bucket
- **Modern Design**: Beautiful masonry grid layout with hover effects
- **Lightbox View**: Full-screen image viewing with keyboard navigation
- **Responsive**: Works perfectly on all devices (mobile, tablet, desktop)
- **Optimized Loading**: Images are lazy-loaded for better performance
- **Drag & Drop**: Admins can drag and drop images directly onto the upload area

## Troubleshooting

### Images not showing up?

1. **Check if the bucket exists**
   - Go to Supabase Dashboard → Storage
   - Verify that a bucket named `gallery` exists

2. **Check bucket is public**
   - The bucket should be set to "Public" for images to be accessible

3. **Check storage policies**
   - Make sure you've run the SQL policies above
   - Go to Storage → Policies to verify they exist

4. **Check browser console**
   - Open browser developer tools (F12)
   - Look for any error messages in the Console tab

### Upload failing?

1. **Check authentication**
   - Make sure you're logged in as an admin
   - Try logging out and logging back in

2. **Check file format**
   - Only image files are allowed (jpg, jpeg, png, gif, webp, svg)
   - Check file size (max 10MB per image)

3. **Check storage policies**
   - Verify the upload policy exists in Supabase
   - Make sure you have admin role

4. **Check Supabase Storage quota**
   - Verify you haven't exceeded your storage limit

## Notes

- Images are stored with unique timestamps to prevent naming conflicts
- File names are sanitized to remove special characters
- The gallery automatically refreshes when new images are uploaded
- Images are sorted by upload date (newest first)
