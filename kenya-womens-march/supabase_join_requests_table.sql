-- Create join_requests table for the World March of Women Kenya website
-- Run this SQL in your Supabase SQL editor

-- Create the join_requests table
CREATE TABLE IF NOT EXISTS join_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    county TEXT NOT NULL,
    involvement_level TEXT NOT NULL,
    interests TEXT[] NOT NULL,
    skills TEXT,
    motivation TEXT,
    organization TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'contacted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_join_requests_created_at ON join_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_join_requests_email ON join_requests(email);
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON join_requests(status);
CREATE INDEX IF NOT EXISTS idx_join_requests_county ON join_requests(county);

-- Enable Row Level Security (RLS)
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert join requests
CREATE POLICY "Allow public to insert join requests" ON join_requests
    FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to view join requests
CREATE POLICY "Allow authenticated users to view join requests" ON join_requests
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update join requests (for admin approval/rejection)
CREATE POLICY "Allow authenticated users to update join requests" ON join_requests
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at when a row is updated
CREATE TRIGGER update_join_requests_updated_at 
    BEFORE UPDATE ON join_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add some sample data for testing
-- INSERT INTO join_requests (
--     first_name, last_name, email, phone, county, involvement_level, 
--     interests, skills, motivation, organization
-- ) VALUES (
--     'Amina', 'Hassan', 'amina@example.com', '+254700123456', 'Mombasa', 'volunteer',
--     ARRAY['Women''s Rights Advocacy', 'Community Outreach'], 
--     'Event planning, community organizing, Swahili translation',
--     'I want to help empower women in my community and create positive change.',
--     'Community Women''s Group'
-- );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON join_requests TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 