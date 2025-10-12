# Homepage Sections Content Management - TODO

## Current Homepage Sections

Based on the homepage, we have these sections that need database management:

### 1. **Features Section** ("Why Choose Us")
- Section heading
- Section description
- 4 feature cards with:
  - Icon
  - Title
  - Description
  - Gradient colors

### 2. **Services Section**
- Section heading
- Section description
- 3 service cards with:
  - Image
  - Icon
  - Title
  - Description
  - Gradient overlay

### 3. **CTA Section** (Call to Action)
- Background styling
- Heading
- Description
- Button text and link

## Implementation Plan

### Step 1: Create Database Migration
Create `supabase/migrations/20250109000002_homepage_sections.sql` with:

```sql
-- Features section
CREATE TABLE features_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_title TEXT,
  section_subtitle TEXT,
  section_description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services section  
CREATE TABLE services_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_title TEXT,
  section_subtitle TEXT,
  section_description TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CTA section
CREATE TABLE cta_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  description TEXT,
  button_text TEXT,
  button_link TEXT,
  background_gradient TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 2: Create Admin Pages
- `/admin/homepage/features` - Manage features section
- `/admin/homepage/services` - Manage services section
- `/admin/homepage/cta` - Manage CTA section

Or single page: `/admin/homepage` with tabs for each section

### Step 3: Update Homepage Component
Modify `app/page.tsx` to:
- Fetch features from `features_section` table
- Fetch services from `services_section` table
- Fetch CTA from `cta_section` table
- Add caching like navbar/footer

### Step 4: Create Editor Components
- `components/admin/features-editor.tsx`
- `components/admin/services-editor.tsx`
- `components/admin/cta-editor.tsx`

## Features to Include

### Features Editor
- Add/remove/reorder feature cards
- Icon selection (from lucide-react)
- Title and description editing
- Gradient color picker
- Preview

### Services Editor
- Add/remove/reorder service cards
- Image upload to Supabase Storage
- Icon selection
- Title and description editing
- Gradient overlay color
- Preview

### CTA Editor
- Title and description
- Button text and link
- Background gradient customization
- Preview

## Database Structure

### features_section.features (JSONB)
```json
[
  {
    "icon": "Zap",
    "title": "Lightning Fast",
    "description": "Server Components and smart caching...",
    "gradient": "from-yellow-500/10 to-orange-500/10"
  }
]
```

### services_section.services (JSONB)
```json
[
  {
    "title": "Web Development",
    "description": "Next.js, React, and TypeScript...",
    "icon": "Code2",
    "image": "https://...",
    "gradient": "from-blue-600/20 to-cyan-600/20"
  }
]
```

## Next Steps

1. Create the database migration
2. Apply migration (with user approval)
3. Create admin page structure
4. Build editor components
5. Update homepage to fetch from database
6. Add caching for performance
7. Test and refine

## Benefits

- ✅ No code changes needed to update content
- ✅ Non-technical users can manage homepage
- ✅ Multiple versions for A/B testing
- ✅ Preview before publishing
- ✅ Audit trail of changes
- ✅ Easy rollback to previous versions
