-- Create policies page tables

-- Policies Hero Section Table
CREATE TABLE IF NOT EXISTS policies_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Our Policies',
  subtitle TEXT NOT NULL DEFAULT 'Transparency & Trust',
  description TEXT NOT NULL DEFAULT 'Learn about our policies and commitments to you',
  background_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for policies_hero
ALTER TABLE policies_hero ENABLE ROW LEVEL SECURITY;

-- Public read access for active hero
CREATE POLICY "Allow public read access to policies hero"
  ON policies_hero
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Allow authenticated users to manage policies hero"
  ON policies_hero
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies Table
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_svg TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for policies
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- Public read access for active policies
CREATE POLICY "Allow public read access to policies"
  ON policies
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Allow authenticated users to manage policies"
  ON policies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_policies_order ON policies("order");
CREATE INDEX IF NOT EXISTS idx_policies_active ON policies(is_active);

-- Create updated_at trigger for policies_hero
CREATE OR REPLACE FUNCTION update_policies_hero_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER policies_hero_updated_at
  BEFORE UPDATE ON policies_hero
  FOR EACH ROW
  EXECUTE FUNCTION update_policies_hero_updated_at();

-- Create updated_at trigger for policies
CREATE OR REPLACE FUNCTION update_policies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER policies_updated_at
  BEFORE UPDATE ON policies
  FOR EACH ROW
  EXECUTE FUNCTION update_policies_updated_at();

-- Ensure only one active hero record
CREATE OR REPLACE FUNCTION ensure_single_active_policies_hero()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE policies_hero SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_active_policies_hero
  BEFORE INSERT OR UPDATE ON policies_hero
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_active_policies_hero();

-- Insert default hero content
INSERT INTO policies_hero (title, subtitle, description, is_active)
VALUES (
  'Our Policies',
  'Transparency & Trust',
  'Learn about our policies and commitments to you',
  true
);

-- Insert default policies
INSERT INTO policies (title, description, icon_svg, "order", is_active)
VALUES 
(
  'Privacy Policy',
  'We protect your personal information and respect your privacy. Learn how we collect, use, and safeguard your data.',
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  1,
  true
),
(
  'Terms of Service',
  'Our terms and conditions outline the rules and regulations for using our services. Please read them carefully.',
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
  2,
  true
),
(
  'Cookie Policy',
  'We use cookies to enhance your browsing experience. Learn about the types of cookies we use and how to manage them.',
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 1 0 10 10"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="12" cy="16" r="1"/></svg>',
  3,
  true
),
(
  'Refund Policy',
  'Our refund policy ensures fair treatment for all customers. Learn about our refund process and eligibility criteria.',
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>',
  4,
  true
),
(
  'Data Security',
  'We implement industry-standard security measures to protect your data. Learn about our security practices and protocols.',
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  5,
  true
),
(
  'Accessibility',
  'We are committed to making our services accessible to everyone. Learn about our accessibility standards and initiatives.',
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="3"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>',
  6,
  true
);

-- Add comments for documentation
COMMENT ON TABLE policies_hero IS 'Stores hero section content for the policies page';
COMMENT ON TABLE policies IS 'Stores individual policy cards with SVG icons';
COMMENT ON COLUMN policies.icon_svg IS 'SVG markup for the policy icon (sanitized before storage)';
COMMENT ON COLUMN policies."order" IS 'Display order of policies (lower numbers appear first)';
