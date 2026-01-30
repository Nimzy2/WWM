-- Create gallery_images table for storing image metadata and captions
-- Run this SQL in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL UNIQUE, -- Matches the file name in Supabase Storage
    file_path TEXT NOT NULL, -- Full path in storage bucket
    caption TEXT, -- Image caption/description
    alt_text TEXT, -- Alternative text for accessibility
    category TEXT, -- Optional category (e.g., "events", "team", "activities")
    tags TEXT[], -- Array of tags
    display_order INTEGER DEFAULT 0, -- For manual ordering
    is_featured BOOLEAN DEFAULT false, -- Featured images
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_file_name ON gallery_images(file_name);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_featured ON gallery_images(is_featured);

-- Enable Row Level Security (RLS)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view gallery images
CREATE POLICY "Allow public to view gallery images" ON gallery_images
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert gallery images
CREATE POLICY "Allow authenticated users to insert gallery images" ON gallery_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update gallery images
CREATE POLICY "Allow authenticated users to update gallery images" ON gallery_images
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete gallery images
CREATE POLICY "Allow authenticated users to delete gallery images" ON gallery_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_gallery_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at when a row is updated
CREATE TRIGGER update_gallery_images_updated_at 
    BEFORE UPDATE ON gallery_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_gallery_images_updated_at();
