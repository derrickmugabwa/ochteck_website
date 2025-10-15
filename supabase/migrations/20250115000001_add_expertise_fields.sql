-- Add expertise section fields to services_page_hero table
ALTER TABLE services_page_hero
ADD COLUMN IF NOT EXISTS expertise_title TEXT NOT NULL DEFAULT 'Our Expertise',
ADD COLUMN IF NOT EXISTS expertise_intro TEXT NOT NULL DEFAULT 'Full-stack development services',
ADD COLUMN IF NOT EXISTS expertise_description TEXT NOT NULL DEFAULT 'Our expertise spans the entire development lifecycle, ensuring your project is built with the latest technologies and best practices.';

-- Update existing row with default values (if any exists)
UPDATE services_page_hero
SET 
  expertise_title = 'Our Expertise',
  expertise_intro = 'Full-stack development services',
  expertise_description = 'Our expertise spans the entire development lifecycle, ensuring your project is built with the latest technologies and best practices.'
WHERE expertise_title IS NULL OR expertise_title = '';
