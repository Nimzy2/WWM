# Gallery Captions Setup Guide

This guide explains how to set up and use captions for gallery images.

## Step 1: Create the Database Table

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Click on "SQL Editor" in the left sidebar

2. **Run the SQL Script**
   - Open the file `supabase_gallery_images_table.sql`
   - Copy all the SQL code
   - Paste it into the SQL Editor
   - Click "Run" to execute

This creates a `gallery_images` table that stores:
- Captions
- Alt text (for accessibility)
- Categories
- Tags
- Display order
- Featured status

## Step 2: Using Captions

### For Admins: Adding/Editing Captions

1. **Upload Images First**
   - Go to `/admin/gallery`
   - Upload your images

2. **Add Captions**
   - Go to `/admin/gallery/manage` (or click "Manage Captions" from the upload page)
   - You'll see all uploaded images in a grid
   - Click "Edit Caption" on any image
   - Fill in:
     - **Caption**: The main description that appears below images
     - **Alt Text**: Text for screen readers (accessibility)
     - **Category**: Optional category (e.g., "Events", "Team", "Activities")
     - **Tags**: Comma-separated tags for filtering
     - **Display Order**: Number to control sorting (lower numbers appear first)
     - **Featured**: Checkbox to mark images as featured
   - Click "Save"

### For Visitors: Viewing Captions

- Captions appear:
  - **On hover** over images in the gallery grid
  - **Below images** in the full-screen lightbox view
  - Images without captions show the filename instead

## Features

- **Automatic Fallback**: If no caption is set, the filename is displayed
- **Accessibility**: Alt text is used for screen readers
- **Organization**: Categories and tags help organize images
- **Sorting**: Display order lets you control image sequence
- **Featured Images**: Mark important images as featured

## Notes

- Captions are optional - images work fine without them
- You can edit captions anytime from the management page
- Changes appear immediately on the public gallery
- The database table is optional - if it doesn't exist, images still work but without captions
