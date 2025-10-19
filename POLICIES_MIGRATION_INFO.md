# Policies Page - Migration Information

## 📦 Two Separate Migrations

The Policies page feature uses **two separate migrations**:

### Migration 1: Core Tables (Already Applied ✅)
**File**: `20250118000001_create_policies_tables.sql`

Creates:
- ✅ `policies_hero` table - Hero section content
- ✅ `policies` table - Individual policy cards
- ✅ 6 default sample policies
- ✅ RLS policies and triggers

**Status**: You've already run this migration.

---

### Migration 2: Section Header (Pending ⏳)
**File**: `20250118000002_add_policies_section.sql`

Creates:
- ⏳ `policies_section` table - Section header content (title, intro, description)
- ⏳ Default section content
- ⏳ RLS policies and triggers

**Status**: Needs to be applied.

---

## 🚀 Next Step

Run the second migration to add section header management:

```bash
npx supabase db push
```

This will only apply the new migration (`20250118000002_add_policies_section.sql`) since the first one is already in your database.

---

## 🎯 What Each Table Does

### `policies_hero`
Controls the top hero section:
- Title: "Our Policies"
- Subtitle: "Transparency & Trust"
- Description: Brief intro text
- Optional background image

### `policies_section` (NEW)
Controls the section header above policy cards:
- Title: "Our Commitments"
- Intro: "Clear and transparent policies"
- Description: Paragraph text

### `policies`
Individual policy cards:
- Title (e.g., "Privacy Policy")
- Description
- SVG icon
- Order (for sorting)
- Active/inactive status

---

## ✅ After Migration

Once you run the second migration, you'll have access to:

1. **Hero Section Editor** - Edit page hero
2. **Section Header Editor** - Edit section title/intro/description (NEW)
3. **Policies Manager** - Add/edit/delete/reorder policies

All accessible at `/admin/policies`

---

## 🔄 Migration History

Your database will have:
```
✅ 20250118000001_create_policies_tables.sql (Applied)
⏳ 20250118000002_add_policies_section.sql (Pending)
```

After running `npx supabase db push`:
```
✅ 20250118000001_create_policies_tables.sql (Applied)
✅ 20250118000002_add_policies_section.sql (Applied)
```

---

## 🛠️ Troubleshooting

### If you get an error about existing tables
This means migration 1 is already applied (which is correct). The error would only occur if you try to run migration 1 again, which won't happen since Supabase tracks applied migrations.

### If the section header doesn't appear in admin
1. Check that migration 2 ran successfully
2. Verify the `policies_section` table exists in your database
3. Refresh the admin page

### If you need to start fresh
```sql
-- Only if you need to completely reset (not recommended)
DROP TABLE IF EXISTS policies CASCADE;
DROP TABLE IF EXISTS policies_hero CASCADE;
DROP TABLE IF EXISTS policies_section CASCADE;
```

Then run both migrations again.
