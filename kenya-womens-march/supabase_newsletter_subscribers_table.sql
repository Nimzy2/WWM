-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100) DEFAULT 'website', -- website, admin, import
    tags TEXT[], -- Array of tags for segmentation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Create index on is_active for filtering active subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);

-- Create index on subscribed_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at);

-- Enable Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert (subscribe)
CREATE POLICY "Allow public subscription" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own subscription (unsubscribe)
CREATE POLICY "Allow self unsubscribe" ON newsletter_subscribers
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Allow authenticated users to view all subscribers (for admin)
CREATE POLICY "Allow admin view" ON newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at
    BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle unsubscribe
CREATE OR REPLACE FUNCTION unsubscribe_newsletter(email_address VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE newsletter_subscribers 
    SET is_active = false, unsubscribed_at = NOW()
    WHERE email = email_address AND is_active = true;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data for testing
INSERT INTO newsletter_subscribers (email, first_name, last_name, source) VALUES
('test1@example.com', 'Jane', 'Doe', 'website'),
('test2@example.com', 'John', 'Smith', 'admin'),
('test3@example.com', 'Mary', 'Johnson', 'website')
ON CONFLICT (email) DO NOTHING; 