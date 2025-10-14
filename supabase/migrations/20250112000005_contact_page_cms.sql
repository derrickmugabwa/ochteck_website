-- Contact Page CMS

-- Contact Information table
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  business_hours TEXT,
  response_time_text TEXT DEFAULT 'We typically respond within 24 hours during business days. For urgent inquiries, please call us directly.',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact FAQs table
CREATE TABLE contact_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Form Submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public can view active contact info
CREATE POLICY "Public can view active contact info" ON contact_info
  FOR SELECT USING (is_active = true);

-- Public can view visible FAQs
CREATE POLICY "Public can view visible contact FAQs" ON contact_faqs
  FOR SELECT USING (visible = true);

-- Public can insert contact submissions
CREATE POLICY "Public can submit contact forms" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Authenticated users can manage all
CREATE POLICY "Authenticated users can manage contact info" ON contact_info
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage contact FAQs" ON contact_faqs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage contact submissions" ON contact_submissions
  FOR ALL USING (auth.role() = 'authenticated');

-- Triggers for updated_at
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_faqs_updated_at BEFORE UPDATE ON contact_faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit triggers
CREATE TRIGGER audit_contact_info AFTER INSERT OR UPDATE OR DELETE ON contact_info
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_contact_faqs AFTER INSERT OR UPDATE OR DELETE ON contact_faqs
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_contact_submissions AFTER INSERT OR UPDATE OR DELETE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Ensure single active contact info
CREATE OR REPLACE FUNCTION ensure_single_active_contact_info()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE contact_info SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_contact_info_trigger
  BEFORE INSERT OR UPDATE ON contact_info
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_contact_info();

-- Insert default contact info
INSERT INTO contact_info (email, phone, location, business_hours, is_active) VALUES
  ('contact@example.com', '+1 (555) 123-4567', 'San Francisco, CA\nUnited States', 'Mon - Fri: 9:00 AM - 6:00 PM PST', true);

-- Insert default FAQs
INSERT INTO contact_faqs (question, answer, order_index, visible) VALUES
  ('What''s your typical project timeline?', 'Most projects take 4-8 weeks from kickoff to launch, depending on scope and complexity.', 1, true),
  ('Do you offer ongoing support?', 'Yes! We provide maintenance packages and ongoing support for all our clients.', 2, true),
  ('What technologies do you work with?', 'We specialize in Next.js, React, TypeScript, Tailwind CSS, and Supabase.', 3, true),
  ('Can you work with our existing codebase?', 'Absolutely! We''re experienced in both greenfield projects and enhancing existing applications.', 4, true);

-- Create index for faster queries
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_faqs_order ON contact_faqs(order_index);
