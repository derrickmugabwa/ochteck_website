-- Services Page Content Management

-- Process Steps table
CREATE TABLE services_process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services Page CTA table
CREATE TABLE services_page_cta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT DEFAULT 'Ready to Get Started?',
  description TEXT DEFAULT 'Let''s discuss your project and create something amazing together.',
  button_text TEXT DEFAULT 'Contact Us Today',
  button_link TEXT DEFAULT '/contact',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services_process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_page_cta ENABLE ROW LEVEL SECURITY;

-- Public can view visible process steps
CREATE POLICY "Public can view visible process steps" ON services_process_steps
  FOR SELECT USING (visible = true);

-- Public can view active CTA
CREATE POLICY "Public can view active services CTA" ON services_page_cta
  FOR SELECT USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can manage process steps" ON services_process_steps
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage services CTA" ON services_page_cta
  FOR ALL USING (auth.role() = 'authenticated');

-- Triggers for updated_at
CREATE TRIGGER update_services_process_steps_updated_at BEFORE UPDATE ON services_process_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_page_cta_updated_at BEFORE UPDATE ON services_page_cta
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit triggers
CREATE TRIGGER audit_services_process_steps AFTER INSERT OR UPDATE OR DELETE ON services_process_steps
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_services_page_cta AFTER INSERT OR UPDATE OR DELETE ON services_page_cta
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Ensure single active CTA
CREATE OR REPLACE FUNCTION ensure_single_active_services_cta()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE services_page_cta SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_services_cta_trigger
  BEFORE INSERT OR UPDATE ON services_page_cta
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_services_cta();

-- Insert default process steps
INSERT INTO services_process_steps (step_number, title, description, order_index, visible) VALUES
  ('01', 'Discovery', 'We learn about your goals, audience, and requirements.', 1, true),
  ('02', 'Design', 'Create wireframes and visual designs that align with your brand.', 2, true),
  ('03', 'Development', 'Build your site with modern tech and best practices.', 3, true),
  ('04', 'Launch', 'Deploy, test, and optimize for peak performance.', 4, true);

-- Insert default CTA
INSERT INTO services_page_cta (title, description, button_text, button_link, is_active) VALUES
  ('Ready to Get Started?', 'Let''s discuss your project and create something amazing together.', 'Contact Us Today', '/contact', true);
