-- Add policies section header table

-- Policies Section Header Table
CREATE TABLE IF NOT EXISTS policies_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Our Commitments',
  intro TEXT NOT NULL DEFAULT 'Clear and transparent policies',
  description TEXT NOT NULL DEFAULT 'We believe in transparency and building trust with our clients. Our policies are designed to protect your interests and ensure a smooth, professional experience.',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for policies_section
ALTER TABLE policies_section ENABLE ROW LEVEL SECURITY;

-- Public read access for active section
CREATE POLICY "Allow public read access to policies section"
  ON policies_section
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Allow authenticated users to manage policies section"
  ON policies_section
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger for policies_section
CREATE OR REPLACE FUNCTION update_policies_section_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER policies_section_updated_at
  BEFORE UPDATE ON policies_section
  FOR EACH ROW
  EXECUTE FUNCTION update_policies_section_updated_at();

-- Ensure only one active section record
CREATE OR REPLACE FUNCTION ensure_single_active_policies_section()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE policies_section SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_active_policies_section
  BEFORE INSERT OR UPDATE ON policies_section
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_active_policies_section();

-- Insert default section content
INSERT INTO policies_section (title, intro, description, is_active)
VALUES (
  'Our Commitments',
  'Clear and transparent policies',
  'We believe in transparency and building trust with our clients. Our policies are designed to protect your interests and ensure a smooth, professional experience.',
  true
);

-- Add comment for documentation
COMMENT ON TABLE policies_section IS 'Stores section header content for the policies grid';
