# Services Unified - Single Source of Truth ✅

## What Changed

Both the **homepage** and **services page** now use the same `services` table from the database.

### Before
- **Homepage**: Used `homepage_services` table (JSONB with hardcoded data)
- **Services Page**: Used `services` table
- **Problem**: Two separate sources, data duplication, inconsistency

### After
- **Homepage**: Uses `services` table (first 6 visible services)
- **Services Page**: Uses `services` table (all visible services)
- **Solution**: Single source of truth, managed from `/admin/services`

## Files Updated

### 1. Homepage Data Fetching (`app/page.tsx`)
```typescript
// OLD
supabase.from("homepage_services").select("*").eq("is_active", true).single()

// NEW
supabase.from("services").select("*").eq("visible", true).order("order_index").limit(6)
```

### 2. Homepage Sections Component (`components/homepage-sections.tsx`)
**Updated interfaces:**
- Changed `services` prop from `ServicesData | null` to `Service[] | null`
- Service interface now matches the database structure

**Updated rendering:**
- Uses `service.image_path` instead of `service.image`
- Uses `service.short_description` instead of `service.description`
- Uses `service.icon_name` for dynamic icons
- Uses `service.gradient` for card gradients
- Shows icon overlay on cards

### 3. Services Page (`app/(public)/services/page.tsx`)
- Already using `services` table ✅
- No changes needed

### 4. Services Page Content (`components/services-page-content.tsx`)
- Already using correct structure ✅
- Uses inline styles for images (same as homepage)

## Database Structure

### `services` Table
```sql
- id (UUID)
- title (TEXT)
- slug (TEXT)
- short_description (TEXT)
- full_description (TEXT)
- icon_name (TEXT) - Lucide icon name
- features (JSONB) - Array of feature strings
- gradient (TEXT) - Tailwind gradient classes
- image_path (TEXT) - Image URL
- order_index (INTEGER)
- visible (BOOLEAN)
- created_at, updated_at
```

## How It Works

### Homepage (`/`)
1. Fetches first 6 visible services ordered by `order_index`
2. Displays in 3-column grid
3. Shows "View All Services" link
4. Each card shows:
   - Image (if available) with gradient overlay
   - Icon in top-right corner
   - Title
   - Short description
   - "Learn more" link

### Services Page (`/services`)
1. Fetches ALL visible services ordered by `order_index`
2. Displays in 3-column grid
3. Each card shows:
   - Image (if available) with gradient overlay
   - Icon in top-right corner
   - Title
   - Short description
   - Features (bullet points)
4. Includes Process section
5. Includes CTA section

## Admin Management

**Single Admin Panel**: `/admin/services`

**Features:**
- Add/Edit/Delete services
- Toggle visibility
- Set order (order_index)
- Upload images
- Choose icons
- Add features
- Set gradients

**Changes affect both:**
- Homepage services section
- Services page

## Benefits

✅ **Single source of truth** - One place to manage all services
✅ **Consistency** - Same data everywhere
✅ **Easier maintenance** - Update once, reflects everywhere
✅ **Better UX** - Homepage shows preview, services page shows full catalog
✅ **Scalability** - Add unlimited services, homepage shows top 6

## Migration Notes

The old `homepage_services` table still exists but is no longer used for services. You can:
1. Keep it for backward compatibility
2. Remove it in a future migration
3. Repurpose it for other homepage content

## Next Steps

1. ✅ Apply the services table extension migration
2. ✅ Add services via `/admin/services`
3. ✅ Set images, icons, gradients, features
4. ✅ Adjust order_index to control display order
5. ✅ Toggle visibility to show/hide services

Both pages will automatically update! 🎉
