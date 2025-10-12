-- Extend services table for services page display

-- Add new columns to services table
ALTER TABLE services
ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT 'Briefcase',
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS gradient TEXT DEFAULT 'from-blue-600/20 to-cyan-600/20';

-- Add comment for clarity
COMMENT ON COLUMN services.icon_name IS 'Lucide icon name (e.g., Code2, Palette, Sparkles)';
COMMENT ON COLUMN services.features IS 'Array of feature strings to display as bullet points';
COMMENT ON COLUMN services.gradient IS 'Tailwind gradient classes for card overlay';

-- Update existing services with default data if any exist
UPDATE services 
SET 
  icon_name = COALESCE(icon_name, 'Briefcase'),
  features = COALESCE(features, '[]'::jsonb),
  gradient = COALESCE(gradient, 'from-blue-600/20 to-cyan-600/20'),
  image_path = COALESCE(image_path, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop')
WHERE icon_name IS NULL OR features IS NULL OR gradient IS NULL OR image_path IS NULL OR image_path = '';
