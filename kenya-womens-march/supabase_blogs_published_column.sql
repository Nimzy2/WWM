-- Migration: Add published column to blogs table
-- Run this in your Supabase SQL editor if the 'published' column doesn't exist

-- Add published column (defaults to true for existing posts)
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- Add published_at column for tracking when posts were published
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Update existing posts to be published
UPDATE blogs 
SET published = true, published_at = created_at 
WHERE published IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);

