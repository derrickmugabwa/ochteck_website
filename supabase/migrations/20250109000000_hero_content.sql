-- Hero content table for managing homepage hero section
CREATE TABLE hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  badge_text TEXT,
  background_image_url TEXT,
  background_overlay_opacity NUMERIC(3,2) DEFAULT 0.5 CHECK (background_overlay_opacity >= 0 AND background_overlay_opacity <= 1),
  primary_cta_text TEXT,
  primary_cta_link TEXT,
  secondary_cta_text TEXT,
  secondary_cta_link TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for active hero
CREATE INDEX idx_hero_content_active ON hero_content(is_active);

-- Enable RLS
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

-- Public can view active hero content
CREATE POLICY "Public can view active hero content" ON hero_content
  FOR SELECT USING (is_active = true);

-- Authenticated users can manage hero content
CREATE POLICY "Authenticated users can manage hero content" ON hero_content
  FOR ALL USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON hero_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit trigger
CREATE TRIGGER audit_hero_content AFTER INSERT OR UPDATE OR DELETE ON hero_content
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Function to ensure only one active hero at a time
CREATE OR REPLACE FUNCTION ensure_single_active_hero()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE hero_content SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce single active hero
CREATE TRIGGER enforce_single_active_hero BEFORE INSERT OR UPDATE ON hero_content
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_hero();

-- Insert default hero content
INSERT INTO hero_content (
  title,
  subtitle,
  description,
  badge_text,
  primary_cta_text,
  primary_cta_link,
  secondary_cta_text,
  secondary_cta_link,
  background_overlay_opacity,
  is_active
) VALUES (
  'Build Stunning Websites That Convert',
  NULL,
  'High-performance marketing sites with smooth animations and an intuitive admin dashboard. Built with Next.js, Supabase, and modern web technologies.',
  'Now available for new projects',
  'Get Started',
  '/contact',
  'View Services',
  '/services',
  0.5,
  true
);

-- Create storage bucket for hero images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for hero images
CREATE POLICY "Public can view hero images" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can upload hero images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'hero-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update hero images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'hero-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete hero images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'hero-images' AND 
    auth.role() = 'authenticated'
  );
