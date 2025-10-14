-- Brands Section Content

-- Brands section header table
CREATE TABLE brands_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT DEFAULT 'Trusted by Leading Brands',
  description TEXT DEFAULT 'Proud to work with amazing clients and partners',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE brands_section ENABLE ROW LEVEL SECURITY;

-- Public can view active brands section
CREATE POLICY "Public can view active brands section" ON brands_section
  FOR SELECT USING (is_active = true);

-- Authenticated users can manage brands section
CREATE POLICY "Authenticated users can manage brands section" ON brands_section
  FOR ALL USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_brands_section_updated_at BEFORE UPDATE ON brands_section
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit trigger
CREATE TRIGGER audit_brands_section AFTER INSERT OR UPDATE OR DELETE ON brands_section
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Ensure single active brands section
CREATE OR REPLACE FUNCTION ensure_single_active_brands_section()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE brands_section SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_brands_section_trigger
  BEFORE INSERT OR UPDATE ON brands_section
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_brands_section();

-- Insert default brands section
INSERT INTO brands_section (title, description, is_active) VALUES
  ('Trusted by Leading Brands', 'Proud to work with amazing clients and partners', true);
