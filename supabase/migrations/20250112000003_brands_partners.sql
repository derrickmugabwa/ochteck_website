-- Brands/Partners/Clients table

CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Public can view visible brands
CREATE POLICY "Public can view visible brands" ON brands
  FOR SELECT USING (visible = true);

-- Authenticated users can manage brands
CREATE POLICY "Authenticated users can manage brands" ON brands
  FOR ALL USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit trigger
CREATE TRIGGER audit_brands AFTER INSERT OR UPDATE OR DELETE ON brands
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Insert some default brands (placeholder logos)
INSERT INTO brands (name, logo_url, website_url, order_index, visible) VALUES
  ('Acme Corp', 'https://via.placeholder.com/150x60/000000/FFFFFF?text=ACME', 'https://example.com', 1, true),
  ('TechStart', 'https://via.placeholder.com/150x60/000000/FFFFFF?text=TECHSTART', 'https://example.com', 2, true),
  ('InnovateCo', 'https://via.placeholder.com/150x60/000000/FFFFFF?text=INNOVATE', 'https://example.com', 3, true),
  ('BuildFast', 'https://via.placeholder.com/150x60/000000/FFFFFF?text=BUILDFAST', 'https://example.com', 4, true),
  ('CloudScale', 'https://via.placeholder.com/150x60/000000/FFFFFF?text=CLOUDSCALE', 'https://example.com', 5, true),
  ('DataFlow', 'https://via.placeholder.com/150x60/000000/FFFFFF?text=DATAFLOW', 'https://example.com', 6, true);
