-- Create publications table for research papers and publications
-- Run this SQL in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS publications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    author TEXT,
    authors TEXT[], -- Array of authors
    publication_date DATE,
    category TEXT, -- e.g., "Research", "Policy Brief", "Report", etc.
    file_url TEXT, -- URL to the PDF/document file
    file_name TEXT, -- Original filename
    file_size INTEGER, -- File size in bytes
    thumbnail_url TEXT, -- Optional cover image
    tags TEXT[], -- Array of tags
    published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_publications_published ON publications(published);
CREATE INDEX IF NOT EXISTS idx_publications_created_at ON publications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_publications_category ON publications(category);
CREATE INDEX IF NOT EXISTS idx_publications_publication_date ON publications(publication_date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view published publications
CREATE POLICY "Allow public to view published publications" ON publications
    FOR SELECT USING (published = true);

-- Create policy to allow authenticated users to view all publications
CREATE POLICY "Allow authenticated users to view all publications" ON publications
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert publications
CREATE POLICY "Allow authenticated users to insert publications" ON publications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update publications
CREATE POLICY "Allow authenticated users to update publications" ON publications
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete publications
CREATE POLICY "Allow authenticated users to delete publications" ON publications
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_publications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_publications_updated_at 
    BEFORE UPDATE ON publications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_publications_updated_at();











