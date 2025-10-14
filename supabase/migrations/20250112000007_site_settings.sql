-- Site Settings Enhancement
-- Add favicon and logo support to existing site_settings table

-- Add new columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'site_settings' AND column_name = 'site_name') THEN
    ALTER TABLE site_settings ADD COLUMN site_name TEXT DEFAULT 'Ochteck Agency Limited';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'site_settings' AND column_name = 'favicon_url') THEN
    ALTER TABLE site_settings ADD COLUMN favicon_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'site_settings' AND column_name = 'logo_url') THEN
    ALTER TABLE site_settings ADD COLUMN logo_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'site_settings' AND column_name = 'is_active') THEN
    ALTER TABLE site_settings ADD COLUMN is_active BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Ensure single active site settings function
CREATE OR REPLACE FUNCTION ensure_single_active_site_settings()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE site_settings SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS ensure_single_active_site_settings_trigger ON site_settings;
CREATE TRIGGER ensure_single_active_site_settings_trigger
  BEFORE INSERT OR UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION ensure_single_active_site_settings();

-- Insert default site settings if none exist with is_active
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'site_identity') THEN
    INSERT INTO site_settings (key, value, site_name, is_active) VALUES
      ('site_identity', '{}', 'Ochteck Agency Limited', true);
  ELSE
    -- Update existing record to add is_active if needed
    UPDATE site_settings 
    SET is_active = true, site_name = COALESCE(site_name, 'Ochteck Agency Limited')
    WHERE key = 'site_identity' AND is_active IS NULL;
  END IF;
END $$;
