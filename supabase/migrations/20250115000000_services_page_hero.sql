-- Create services page hero content table
CREATE TABLE IF NOT EXISTS services_page_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subtitle TEXT NOT NULL DEFAULT 'Our Services',
  title TEXT NOT NULL DEFAULT 'Comprehensive Solutions for Modern Web',
  description TEXT NOT NULL DEFAULT 'From concept to deployment, we provide end-to-end web development services that combine cutting-edge technology with beautiful design.',
  badge TEXT NOT NULL DEFAULT 'What We Offer',
  expertise_title TEXT NOT NULL DEFAULT 'Our Expertise',
  expertise_intro TEXT NOT NULL DEFAULT 'Full-stack development services',
  expertise_description TEXT NOT NULL DEFAULT 'Our expertise spans the entire development lifecycle, ensuring your project is built with the latest technologies and best practices.',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services_page_hero ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to services page hero"
  ON services_page_hero
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Allow authenticated users to manage services page hero"
  ON services_page_hero
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default hero content
INSERT INTO services_page_hero (subtitle, title, description, badge, expertise_title, expertise_intro, expertise_description, is_active)
VALUES (
  'Our Services',
  'Comprehensive Solutions for Modern Web',
  'From concept to deployment, we provide end-to-end web development services that combine cutting-edge technology with beautiful design.',
  'What We Offer',
  'Our Expertise',
  'Full-stack development services',
  'Our expertise spans the entire development lifecycle, ensuring your project is built with the latest technologies and best practices.',
  true
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_services_page_hero_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_page_hero_updated_at
  BEFORE UPDATE ON services_page_hero
  FOR EACH ROW
  EXECUTE FUNCTION update_services_page_hero_updated_at();
