-- Create contact page hero content table
CREATE TABLE IF NOT EXISTS contact_page_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subtitle TEXT NOT NULL DEFAULT 'Contact Us',
  title TEXT NOT NULL DEFAULT 'Let''s Build Something Amazing Together',
  description TEXT NOT NULL DEFAULT 'Have a project in mind? We''d love to hear about it. Fill out the form below or reach out directly, and we''ll get back to you within 24 hours.',
  badge TEXT NOT NULL DEFAULT 'Get In Touch',
  contact_info_title TEXT NOT NULL DEFAULT 'Contact Information',
  contact_info_intro TEXT NOT NULL DEFAULT 'Multiple ways to reach us',
  faq_title TEXT NOT NULL DEFAULT 'Frequently Asked Questions',
  faq_intro TEXT NOT NULL DEFAULT 'Quick answers to common questions',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_page_hero ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to contact page hero"
  ON contact_page_hero
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Allow authenticated users to manage contact page hero"
  ON contact_page_hero
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default hero content
INSERT INTO contact_page_hero (subtitle, title, description, badge, contact_info_title, contact_info_intro, faq_title, faq_intro, is_active)
VALUES (
  'Contact Us',
  'Let''s Build Something Amazing Together',
  'Have a project in mind? We''d love to hear about it. Fill out the form below or reach out directly, and we''ll get back to you within 24 hours.',
  'Get In Touch',
  'Contact Information',
  'Multiple ways to reach us',
  'Frequently Asked Questions',
  'Quick answers to common questions',
  true
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_page_hero_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contact_page_hero_updated_at
  BEFORE UPDATE ON contact_page_hero
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_page_hero_updated_at();
