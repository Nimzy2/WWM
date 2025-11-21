-- Create blog_comments table for blog post comments
-- Run this SQL in your Supabase SQL editor

-- Create the blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert comments
CREATE POLICY "Allow public to insert comments" ON blog_comments
    FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to view comments
CREATE POLICY "Allow public to view comments" ON blog_comments
    FOR SELECT USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at when a row is updated
CREATE TRIGGER update_blog_comments_updated_at 
    BEFORE UPDATE ON blog_comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

