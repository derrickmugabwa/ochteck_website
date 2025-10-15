-- Add testimonials section to homepage content management
CREATE TABLE IF NOT EXISTS homepage_testimonials_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_text TEXT NOT NULL DEFAULT 'Testimonials',
  section_heading TEXT NOT NULL DEFAULT 'Loved by Innovative Teams',
  section_description TEXT NOT NULL DEFAULT 'See what our clients say about working with us',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE homepage_testimonials_section ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to testimonials section"
  ON homepage_testimonials_section
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Allow authenticated users to manage testimonials section"
  ON homepage_testimonials_section
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default content
INSERT INTO homepage_testimonials_section (badge_text, section_heading, section_description, is_active)
VALUES (
  'Testimonials',
  'Loved by Innovative Teams',
  'See what our clients say about working with us',
  true
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_homepage_testimonials_section_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER homepage_testimonials_section_updated_at
  BEFORE UPDATE ON homepage_testimonials_section
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_testimonials_section_updated_at();

-- Ensure only one active record
CREATE OR REPLACE FUNCTION ensure_single_active_testimonials_section()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE homepage_testimonials_section SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_active_testimonials_section
  BEFORE INSERT OR UPDATE ON homepage_testimonials_section
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_active_testimonials_section();
