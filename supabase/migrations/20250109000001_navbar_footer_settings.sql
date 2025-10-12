-- Navbar settings table
CREATE TABLE navbar_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT,
  logo_text TEXT DEFAULT 'Brand',
  show_logo_text BOOLEAN DEFAULT true,
  navigation_links JSONB DEFAULT '[]'::jsonb,
  cta_button_text TEXT,
  cta_button_link TEXT,
  show_cta_button BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Footer settings table
CREATE TABLE footer_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT,
  logo_text TEXT DEFAULT 'Brand',
  show_logo_text BOOLEAN DEFAULT true,
  tagline TEXT,
  description TEXT,
  footer_links JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '[]'::jsonb,
  copyright_text TEXT,
  show_newsletter BOOLEAN DEFAULT false,
  newsletter_title TEXT,
  newsletter_description TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_navbar_settings_active ON navbar_settings(is_active);
CREATE INDEX idx_footer_settings_active ON footer_settings(is_active);

-- Enable RLS
ALTER TABLE navbar_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

-- Public can view active settings
CREATE POLICY "Public can view active navbar settings" ON navbar_settings
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active footer settings" ON footer_settings
  FOR SELECT USING (is_active = true);

-- Authenticated users can manage settings
CREATE POLICY "Authenticated users can manage navbar settings" ON navbar_settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage footer settings" ON footer_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Triggers for updated_at
CREATE TRIGGER update_navbar_settings_updated_at BEFORE UPDATE ON navbar_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_footer_settings_updated_at BEFORE UPDATE ON footer_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit triggers
CREATE TRIGGER audit_navbar_settings AFTER INSERT OR UPDATE OR DELETE ON navbar_settings
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_footer_settings AFTER INSERT OR UPDATE OR DELETE ON footer_settings
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Function to ensure only one active navbar at a time
CREATE OR REPLACE FUNCTION ensure_single_active_navbar()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE navbar_settings SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to ensure only one active footer at a time
CREATE OR REPLACE FUNCTION ensure_single_active_footer()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE footer_settings SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to enforce single active settings
CREATE TRIGGER enforce_single_active_navbar BEFORE INSERT OR UPDATE ON navbar_settings
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_navbar();

CREATE TRIGGER enforce_single_active_footer BEFORE INSERT OR UPDATE ON footer_settings
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_footer();

-- Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for logos
CREATE POLICY "Public can view logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'logos' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update logos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'logos' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete logos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'logos' AND 
    auth.role() = 'authenticated'
  );

-- Insert default navbar settings
INSERT INTO navbar_settings (
  logo_text,
  show_logo_text,
  navigation_links,
  cta_button_text,
  cta_button_link,
  show_cta_button,
  is_active
) VALUES (
  'Brand',
  false,
  '[
    {"label": "Home", "href": "/"},
    {"label": "About", "href": "/about"},
    {"label": "Services", "href": "/services"},
    {"label": "Contact", "href": "/contact"}
  ]'::jsonb,
  'Get Started',
  '/contact',
  false,
  true
);

-- Insert default footer settings
INSERT INTO footer_settings (
  logo_text,
  show_logo_text,
  tagline,
  description,
  footer_links,
  social_links,
  copyright_text,
  show_newsletter,
  newsletter_title,
  newsletter_description,
  is_active
) VALUES (
  'Brand',
  true,
  'Building the future of web',
  'We create fast, accessible, and visually stunning web experiences.',
  '[
    {
      "title": "Company",
      "links": [
        {"label": "About", "href": "/about"},
        {"label": "Services", "href": "/services"},
        {"label": "Contact", "href": "/contact"}
      ]
    },
    {
      "title": "Resources",
      "links": [
        {"label": "Blog", "href": "/blog"},
        {"label": "Documentation", "href": "/docs"}
      ]
    }
  ]'::jsonb,
  '[
    {"platform": "twitter", "url": "https://twitter.com", "icon": "twitter"},
    {"platform": "github", "url": "https://github.com", "icon": "github"},
    {"platform": "linkedin", "url": "https://linkedin.com", "icon": "linkedin"}
  ]'::jsonb,
  '© 2024 Brand. All rights reserved.',
  false,
  'Stay Updated',
  'Subscribe to our newsletter for the latest updates.',
  true
);
