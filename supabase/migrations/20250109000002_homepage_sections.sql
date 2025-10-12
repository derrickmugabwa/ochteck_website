-- Homepage sections content management

-- Features section (Why Choose Us)
CREATE TABLE homepage_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_title TEXT DEFAULT 'Why Choose Us',
  section_heading TEXT DEFAULT 'Built for Performance, Designed for Delight',
  section_description TEXT DEFAULT 'Everything you need to create stunning, high-performance websites',
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services section
CREATE TABLE homepage_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_title TEXT DEFAULT 'Our Services',
  section_heading TEXT DEFAULT 'Everything You Need to Build & Scale',
  section_description TEXT DEFAULT 'From design systems to data-driven web applications',
  services JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CTA section
CREATE TABLE homepage_cta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT DEFAULT 'Ready to Get Started?',
  description TEXT DEFAULT 'Let''s build something amazing together',
  button_text TEXT DEFAULT 'Get Started',
  button_link TEXT DEFAULT '/contact',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE homepage_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_cta ENABLE ROW LEVEL SECURITY;

-- Public can view active content
CREATE POLICY "Public can view active features" ON homepage_features
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active services" ON homepage_services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active cta" ON homepage_cta
  FOR SELECT USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can manage features" ON homepage_features
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage services" ON homepage_services
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage cta" ON homepage_cta
  FOR ALL USING (auth.role() = 'authenticated');

-- Triggers for updated_at
CREATE TRIGGER update_homepage_features_updated_at BEFORE UPDATE ON homepage_features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_services_updated_at BEFORE UPDATE ON homepage_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_cta_updated_at BEFORE UPDATE ON homepage_cta
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit triggers
CREATE TRIGGER audit_homepage_features AFTER INSERT OR UPDATE OR DELETE ON homepage_features
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_homepage_services AFTER INSERT OR UPDATE OR DELETE ON homepage_services
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_homepage_cta AFTER INSERT OR UPDATE OR DELETE ON homepage_cta
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Ensure single active record functions
CREATE OR REPLACE FUNCTION ensure_single_active_features()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE homepage_features SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ensure_single_active_services()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE homepage_services SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ensure_single_active_cta()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE homepage_cta SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to enforce single active
CREATE TRIGGER enforce_single_active_features BEFORE INSERT OR UPDATE ON homepage_features
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_features();

CREATE TRIGGER enforce_single_active_services BEFORE INSERT OR UPDATE ON homepage_services
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_services();

CREATE TRIGGER enforce_single_active_cta BEFORE INSERT OR UPDATE ON homepage_cta
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_cta();

-- Insert default data
INSERT INTO homepage_features (
  section_title,
  section_heading,
  section_description,
  features,
  is_active
) VALUES (
  'Why Choose Us',
  'Built for Performance, Designed for Delight',
  'Everything you need to create stunning, high-performance websites',
  '[
    {
      "title": "Lightning Fast",
      "description": "Server Components and smart caching deliver blazing speed.",
      "icon": "Zap"
    },
    {
      "title": "Beautiful Animations",
      "description": "Framer Motion micro-interactions that captivate users.",
      "icon": "Sparkles"
    },
    {
      "title": "Secure & Scalable",
      "description": "Supabase-backed with enterprise-grade security.",
      "icon": "Shield"
    },
    {
      "title": "Easy Management",
      "description": "Intuitive admin dashboard for effortless updates.",
      "icon": "Rocket"
    }
  ]'::jsonb,
  true
);

INSERT INTO homepage_services (
  section_title,
  section_heading,
  section_description,
  services,
  is_active
) VALUES (
  'Our Services',
  'Everything You Need to Build & Scale',
  'From design systems to data-driven web applications',
  '[
    {
      "title": "Web Development",
      "description": "Next.js, React, and TypeScript for modern web experiences.",
      "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
    },
    {
      "title": "Design Systems",
      "description": "Consistent, scalable UI with shadcn/ui and Tailwind CSS.",
      "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"
    },
    {
      "title": "CMS & Authentication",
      "description": "Powerful Supabase integration for content and auth.",
      "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop"
    }
  ]'::jsonb,
  true
);

INSERT INTO homepage_cta (
  title,
  description,
  button_text,
  button_link,
  is_active
) VALUES (
  'Ready to Get Started?',
  'Let''s build something amazing together',
  'Get Started',
  '/contact',
  true
);
