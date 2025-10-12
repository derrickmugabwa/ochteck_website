-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Site settings table
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pages table for flexible content management
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  icon_url TEXT,
  image_path TEXT,
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets table for media management
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  metadata JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  row_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('insert', 'update', 'delete')),
  user_id UUID REFERENCES auth.users(id),
  old_data JSONB,
  new_data JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_services_visible ON services(visible);
CREATE INDEX idx_services_order ON services(order_index);
CREATE INDEX idx_testimonials_visible ON testimonials(visible);
CREATE INDEX idx_testimonials_order ON testimonials(order_index);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name, row_id);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Site settings policies
CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage site settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Pages policies
CREATE POLICY "Public can view published pages" ON pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can manage pages" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

-- Services policies
CREATE POLICY "Public can view visible services" ON services
  FOR SELECT USING (visible = true);

CREATE POLICY "Authenticated users can manage services" ON services
  FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials policies
CREATE POLICY "Public can view visible testimonials" ON testimonials
  FOR SELECT USING (visible = true);

CREATE POLICY "Authenticated users can manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- Assets policies
CREATE POLICY "Public can view assets" ON assets
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage assets" ON assets
  FOR ALL USING (auth.role() = 'authenticated');

-- Audit logs policies
CREATE POLICY "Only authenticated users can view audit logs" ON audit_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_logs (table_name, row_id, action, user_id, old_data)
    VALUES (TG_TABLE_NAME, OLD.id, 'delete', auth.uid(), row_to_json(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_logs (table_name, row_id, action, user_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'update', auth.uid(), row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_logs (table_name, row_id, action, user_id, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'insert', auth.uid(), row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit triggers
CREATE TRIGGER audit_services AFTER INSERT OR UPDATE OR DELETE ON services
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_testimonials AFTER INSERT OR UPDATE OR DELETE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_pages AFTER INSERT OR UPDATE OR DELETE ON pages
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('site_title', '"Your Brand"'::jsonb),
  ('site_description', '"Build visually stunning, high-performance websites"'::jsonb),
  ('contact_email', '"contact@example.com"'::jsonb),
  ('social_links', '{"twitter": "#", "github": "#", "linkedin": "#"}'::jsonb);

-- Insert sample services
INSERT INTO services (title, slug, short_description, full_description, order_index, visible) VALUES
  ('Web Development', 'web-development', 'Modern, performant websites with Next.js and TypeScript.', 'We build fast, scalable web applications using the latest technologies including Next.js, React, and TypeScript. Our focus is on performance, accessibility, and maintainability.', 1, true),
  ('Design Systems', 'design-systems', 'Reusable components and tokens with shadcn/ui and Tailwind.', 'Create consistent, beautiful user interfaces with our design system expertise. We use shadcn/ui, Tailwind CSS, and modern component libraries to build scalable design systems.', 2, true),
  ('Animations', 'animations', 'Framer Motion micro-interactions and scroll reveals.', 'Bring your website to life with smooth, performant animations. We specialize in Framer Motion, scroll-triggered animations, and micro-interactions that enhance user experience.', 3, true),
  ('CMS & Auth', 'cms-auth', 'Supabase-backed content, auth, and storage integration.', 'Implement powerful backend features with Supabase. We provide complete CMS solutions, authentication systems, and cloud storage integration for your applications.', 4, true);

-- Insert sample testimonials
INSERT INTO testimonials (author, role, content, visible, order_index) VALUES
  ('Sarah Johnson', 'CEO, TechStart', 'They delivered a blazing fast website with beautiful interactions. Our engagement improved significantly and the admin dashboard makes content updates a breeze.', true, 1),
  ('Michael Chen', 'Product Manager, InnovateCo', 'Outstanding work! The attention to detail and performance optimization exceeded our expectations. The smooth animations really set our site apart.', true, 2),
  ('Emily Rodriguez', 'Marketing Director, GrowthLabs', 'Professional, responsive, and highly skilled. They transformed our vision into a stunning reality. The CMS integration has saved us countless hours.', true, 3);
