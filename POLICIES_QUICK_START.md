# Policies Page - Quick Start Guide

## 🚀 Getting Started

### Step 1: Run the Second Migration
If you already ran the first migration (`20250118000001_create_policies_tables.sql`), you only need to run the second one.

**Note**: Per your user rules, you need to approve this migration.

```bash
npx supabase db push
```

This will create:
- `policies_section` table for section header management
- RLS policies for security
- Default section content
- Necessary triggers and functions

**If you haven't run any migrations yet**, both migrations will be applied automatically.

---

## 📋 Using the Admin Panel

### Access the Policies Admin
Navigate to: **`/admin/policies`**

### Managing the Hero Section
1. Click **"Edit Hero"** button
2. Update the following fields:
   - **Title**: Main heading (e.g., "Our Policies")
   - **Subtitle**: Subheading (e.g., "Transparency & Trust")
   - **Description**: Brief description
   - **Background Image**: Optional hero background
3. Click **"Save Changes"**

### Managing the Section Header
1. Click **"Edit Section"** button
2. Update the following fields:
   - **Section Title**: Main section heading (e.g., "Our Commitments")
   - **Section Intro**: Brief tagline (e.g., "Clear and transparent policies")
   - **Section Description**: Detailed description paragraph
3. Click **"Save Changes"**

### Managing Policies

#### Add a New Policy
1. Click **"Add Policy"** button
2. Fill in the form:
   - **Title**: Policy name (e.g., "Privacy Policy")
   - **Description**: Brief explanation
   - **Icon SVG**: Choose from 6 pre-built icons or paste custom SVG
   - **Order**: Display order (optional, auto-assigned)
   - **Status**: Active or Inactive
3. Click **"Create Policy"**

#### Edit a Policy
1. Click the **Edit** icon (pencil) on any policy
2. Modify the fields
3. Click **"Update Policy"**

#### Reorder Policies
1. **Drag and drop** policies to reorder them
2. Changes are saved automatically

#### Toggle Policy Status
1. Click the **Eye/Eye-Off** icon to activate/deactivate
2. Inactive policies are hidden from public view

#### Delete a Policy
1. Click the **Trash** icon
2. Confirm deletion

---

## 🎨 Customizing SVG Icons

### Option 1: Use Pre-built Icons
The form includes 6 ready-to-use icons:
- Shield Check (Privacy/Security)
- File Text (Documents/Terms)
- Cookie (Cookie Policy)
- Lock (Security/Data Protection)
- Package (Refunds/Returns)
- User Circle (Accessibility/Users)

Just click on any icon to select it.

### Option 2: Custom SVG
Paste any SVG code into the textarea. Example:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"/>
  <path d="M12 6v6l4 2"/>
</svg>
```

**Tips:**
- Keep SVGs simple and clean
- Use `stroke="currentColor"` for theme compatibility
- Recommended size: 24x24 viewBox
- Preview updates in real-time

---

## 🌐 Adding to Navigation

### Method 1: Through Admin Panel (Recommended)
1. Go to **`/admin/navbar`**
2. Add a new navigation link:
   - **Label**: "Policies"
   - **URL**: "/policies"
3. Save changes

### Method 2: Database Direct
If you prefer to add it directly to the database:

```sql
UPDATE navbar_settings 
SET navigation_links = navigation_links || '[{"label": "Policies", "href": "/policies"}]'::jsonb
WHERE is_active = true;
```

---

## 👀 Viewing the Public Page

Visit: **`/policies`**

The page displays:
- Hero section with title, subtitle, and description
- Grid of active policy cards (3 columns on desktop)
- Each card shows icon, title, and description
- Smooth animations on scroll

---

## 🎯 Default Policies Included

After migration, you'll have 6 sample policies:

1. **Privacy Policy** - Data protection and privacy practices
2. **Terms of Service** - Terms and conditions for using services
3. **Cookie Policy** - Cookie usage and management
4. **Refund Policy** - Refund process and eligibility
5. **Data Security** - Security measures and protocols
6. **Accessibility** - Accessibility standards and initiatives

Feel free to edit or delete these and add your own!

---

## 🔧 Troubleshooting

### Migration Issues
**Problem**: Migration fails
**Solution**: Check that you're connected to your Supabase project
```bash
npx supabase status
```

### Policies Not Showing
**Problem**: Policies don't appear on public page
**Solution**: Check that policies are marked as "Active" in admin panel

### SVG Not Displaying
**Problem**: SVG icon doesn't render
**Solution**: 
- Ensure SVG is valid XML
- Check that SVG includes proper xmlns attribute
- Verify viewBox is set correctly

### Admin Page Not Accessible
**Problem**: Can't access `/admin/policies`
**Solution**: Ensure you're logged in as an authenticated user

---

## 📱 Responsive Design

The page automatically adapts:
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns

---

## ⚡ Performance Tips

1. **Optimize Images**: Compress hero background images before upload
2. **Keep SVGs Simple**: Complex SVGs can slow down rendering
3. **Limit Policies**: 6-12 policies is optimal for UX
4. **Cache**: The page uses Next.js caching for fast loads

---

## 🔐 Security Notes

- Only authenticated users can access admin panel
- Public users can only view active policies
- RLS policies protect data at database level
- SVG sanitization recommended for production (see implementation summary)

---

## 📞 Need Help?

- Check `POLICIES_PAGE_IMPLEMENTATION_SUMMARY.md` for technical details
- Review `POLICIES_PAGE_FEATURE.md` for complete feature plan
- Inspect existing code in `/app/policies` and `/components/admin`

---

## ✅ Checklist

After setup, verify:
- [ ] Migration applied successfully
- [ ] Can access `/admin/policies`
- [ ] Can edit hero section
- [ ] Can create/edit/delete policies
- [ ] Can reorder policies via drag-drop
- [ ] Public page displays at `/policies`
- [ ] Policies link added to navigation
- [ ] Responsive design works on mobile
- [ ] All animations are smooth

---

**You're all set! 🎉**

The Policies page is ready to use. Start by customizing the hero section and adding your own policies through the admin panel.
