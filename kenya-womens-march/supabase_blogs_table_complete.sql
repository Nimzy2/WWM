-- Complete blogs table migration
-- Run this in your Supabase SQL editor to ensure all required columns exist

-- Add published column if it doesn't exist
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- Add published_at column if it doesn't exist
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Add tags column if it doesn't exist (as TEXT array)
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add updated_at column if it doesn't exist
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add image column if it doesn't exist (for featured image URL)
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS image TEXT;

-- Add image_url column if it doesn't exist (alternative name for image)
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing posts to have published = true if null
UPDATE blogs 
SET published = true, published_at = created_at 
WHERE published IS NULL AND created_at IS NOT NULL;

-- Update existing posts to have updated_at = created_at if null
UPDATE blogs 
SET updated_at = created_at 
WHERE updated_at IS NULL AND created_at IS NOT NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);

-- Ensure required columns have NOT NULL constraints where appropriate
-- (Only if your table allows it - adjust as needed)
-- ALTER TABLE blogs ALTER COLUMN title SET NOT NULL;
-- ALTER TABLE blogs ALTER COLUMN content SET NOT NULL;

