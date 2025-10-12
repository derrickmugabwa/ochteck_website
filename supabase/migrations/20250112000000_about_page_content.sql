-- About page content management

-- About hero section
CREATE TABLE about_hero (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge TEXT DEFAULT 'Our Story',
  subtitle TEXT DEFAULT 'About Us',
  title TEXT DEFAULT 'Building the Future of Web Experiences',
  description TEXT DEFAULT 'We''re a team of passionate developers and designers dedicated to creating fast, accessible, and visually stunning web experiences that drive real results.',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mission section (What We Do, Why We Do It)
CREATE TABLE about_mission (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_title TEXT DEFAULT 'Our Mission',
  mission_cards JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core values section
CREATE TABLE about_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_title TEXT DEFAULT 'Our Values',
  section_intro TEXT DEFAULT 'The principles that guide everything we do',
  values JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline/Journey section
CREATE TABLE about_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_title TEXT DEFAULT 'Our Journey',
  section_intro TEXT DEFAULT 'From concept to industry leader',
  milestones JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE about_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_mission ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_timeline ENABLE ROW LEVEL SECURITY;

-- Public can view active content
CREATE POLICY "Public can view active about hero" ON about_hero
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active mission" ON about_mission
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active values" ON about_values
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active timeline" ON about_timeline
  FOR SELECT USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can manage about hero" ON about_hero
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage mission" ON about_mission
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage values" ON about_values
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage timeline" ON about_timeline
  FOR ALL USING (auth.role() = 'authenticated');

-- Triggers for updated_at
CREATE TRIGGER update_about_hero_updated_at BEFORE UPDATE ON about_hero
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_mission_updated_at BEFORE UPDATE ON about_mission
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_values_updated_at BEFORE UPDATE ON about_values
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_timeline_updated_at BEFORE UPDATE ON about_timeline
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit triggers
CREATE TRIGGER audit_about_hero AFTER INSERT OR UPDATE OR DELETE ON about_hero
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_about_mission AFTER INSERT OR UPDATE OR DELETE ON about_mission
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_about_values AFTER INSERT OR UPDATE OR DELETE ON about_values
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_about_timeline AFTER INSERT OR UPDATE OR DELETE ON about_timeline
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Ensure single active record functions
CREATE OR REPLACE FUNCTION ensure_single_active_about_hero()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE about_hero SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ensure_single_active_about_mission()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE about_mission SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ensure_single_active_about_values()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE about_values SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ensure_single_active_about_timeline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE about_timeline SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to enforce single active
CREATE TRIGGER enforce_single_active_about_hero BEFORE INSERT OR UPDATE ON about_hero
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_about_hero();

CREATE TRIGGER enforce_single_active_about_mission BEFORE INSERT OR UPDATE ON about_mission
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_about_mission();

CREATE TRIGGER enforce_single_active_about_values BEFORE INSERT OR UPDATE ON about_values
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_about_values();

CREATE TRIGGER enforce_single_active_about_timeline BEFORE INSERT OR UPDATE ON about_timeline
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_about_timeline();

-- Insert default data
INSERT INTO about_hero (
  badge,
  subtitle,
  title,
  description,
  is_active
) VALUES (
  'Our Story',
  'About Us',
  'Building the Future of Web Experiences',
  'We''re a team of passionate developers and designers dedicated to creating fast, accessible, and visually stunning web experiences that drive real results.',
  true
);

INSERT INTO about_mission (
  section_title,
  mission_cards,
  is_active
) VALUES (
  'Our Mission',
  '[
    {
      "icon": "Target",
      "title": "What We Do",
      "description": "We craft high-performance websites and applications that combine beautiful design with cutting-edge technology. Every project is built with attention to detail, performance, and user experience."
    },
    {
      "icon": "Lightbulb",
      "title": "Why We Do It",
      "description": "We believe great technology should be accessible to everyone. Our goal is to democratize modern web development and help businesses of all sizes succeed online."
    }
  ]'::jsonb,
  true
);

INSERT INTO about_values (
  section_title,
  section_intro,
  values,
  is_active
) VALUES (
  'Our Values',
  'The principles that guide everything we do',
  '[
    {
      "icon": "Code",
      "title": "Craftsmanship",
      "description": "Quality code, thoughtful design, and maintainable systems that stand the test of time."
    },
    {
      "icon": "Palette",
      "title": "Design Excellence",
      "description": "Beautiful, intuitive interfaces that users love and that drive engagement."
    },
    {
      "icon": "Users",
      "title": "Accessibility",
      "description": "Inclusive experiences that work for everyone, regardless of ability or device."
    },
    {
      "icon": "Target",
      "title": "Performance",
      "description": "Lightning-fast experiences with smart defaults and industry best practices."
    },
    {
      "icon": "Heart",
      "title": "User-Centric",
      "description": "Every decision is made with the end user in mind, ensuring delightful experiences."
    },
    {
      "icon": "Lightbulb",
      "title": "Innovation",
      "description": "Staying ahead of the curve with the latest technologies and methodologies."
    }
  ]'::jsonb,
  true
);

INSERT INTO about_timeline (
  section_title,
  section_intro,
  milestones,
  is_active
) VALUES (
  'Our Journey',
  'From concept to industry leader',
  '[
    {
      "year": "2020",
      "title": "The Beginning",
      "description": "Started with a vision to make modern web development accessible to all businesses."
    },
    {
      "year": "2021",
      "title": "Growing Team",
      "description": "Expanded our team with talented developers and designers from around the world."
    },
    {
      "year": "2022",
      "title": "100+ Projects",
      "description": "Delivered over 100 successful projects for clients across various industries."
    },
    {
      "year": "2023",
      "title": "Innovation Focus",
      "description": "Pioneered new approaches to web performance and user experience optimization."
    },
    {
      "year": "2024",
      "title": "Industry Recognition",
      "description": "Recognized as a leader in modern web development and design systems."
    }
  ]'::jsonb,
  true
);
