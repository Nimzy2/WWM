-- Team section tables for the About page "Meet Our Team" area
-- Run this SQL in your Supabase SQL editor
--
-- Optional: create a public "team" storage bucket in Supabase Storage for photo uploads
-- from the admin Team Management page. You can also use static paths like /team/name.jpeg.

CREATE TABLE IF NOT EXISTS team_section (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Meet Our Team',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    layout TEXT NOT NULL DEFAULT 'compact',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES team_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    photo_url TEXT,
    display_order INTEGER DEFAULT 0,
    image_object_position TEXT DEFAULT 'center',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_groups_display_order ON team_groups(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_group_id ON team_members(group_id);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);

ALTER TABLE team_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to view team section" ON team_section
    FOR SELECT USING (true);

CREATE POLICY "Allow public to view team groups" ON team_groups
    FOR SELECT USING (true);

CREATE POLICY "Allow public to view team members" ON team_members
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage team section" ON team_section
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage team groups" ON team_groups
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage team members" ON team_members
    FOR ALL USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_team_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_section_updated_at
    BEFORE UPDATE ON team_section
    FOR EACH ROW EXECUTE FUNCTION update_team_updated_at();

CREATE TRIGGER update_team_groups_updated_at
    BEFORE UPDATE ON team_groups
    FOR EACH ROW EXECUTE FUNCTION update_team_updated_at();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_team_updated_at();

-- Seed default data (only if tables are empty)
INSERT INTO team_section (title)
SELECT 'Meet Our Team'
WHERE NOT EXISTS (SELECT 1 FROM team_section);

DO $$
DECLARE
    working_group_id UUID;
    secretariat_group_id UUID;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM team_groups) THEN
        INSERT INTO team_groups (title, display_order, layout)
        VALUES ('Working Team', 0, 'compact')
        RETURNING id INTO working_group_id;

        INSERT INTO team_members (group_id, name, photo_url, display_order, image_object_position) VALUES
            (working_group_id, 'Sophie Ogutu', '/team/sophie-ogutu.jpeg', 0, 'center'),
            (working_group_id, 'Beatrice Kamau', '/team/beatrice-kamau.jpeg', 1, 'center'),
            (working_group_id, 'Anne Wanjiru', '/team/anne-wanjiku.jpeg', 2, 'center'),
            (working_group_id, 'Esther Mwakali', '/team/esther-mwakali.jpeg', 3, 'center'),
            (working_group_id, 'Millicent Awino', '/team/millicent-awino.jpeg', 4, 'top'),
            (working_group_id, 'Michelle Kabucho', '/team/michelle-kabucho.jpeg', 5, 'center'),
            (working_group_id, 'Terry Ochola', '/team/terry-ochola.jpeg', 6, 'center'),
            (working_group_id, 'Lydia Dola', '/team/lydia-dola.jpeg', 7, 'center'),
            (working_group_id, 'Regina Mutiru', '/team/regina-mutiru.jpeg', 8, 'center'),
            (working_group_id, 'Comfort Achieng', '/team/comfort-achieng.jpeg', 9, 'center');

        INSERT INTO team_groups (title, display_order, layout)
        VALUES ('Our Secretariat', 1, 'featured')
        RETURNING id INTO secretariat_group_id;

        INSERT INTO team_members (group_id, name, photo_url, display_order, image_object_position) VALUES
            (secretariat_group_id, 'Sophie Ogutu', '/team/sophie-ogutu.jpeg', 0, 'center'),
            (secretariat_group_id, 'Anne Wanjiku', '/team/anne-wanjiku.jpeg', 1, 'center'),
            (secretariat_group_id, 'Michelle Kabucho', '/team/michelle-kabucho.jpeg', 2, 'center');
    END IF;
END $$;
