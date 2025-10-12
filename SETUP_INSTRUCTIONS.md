# Hero Section Setup Instructions

## 🚀 Quick Setup

Follow these steps to complete the hero section implementation:

### Step 1: Install Required Dependencies

```bash
npm install sonner @radix-ui/react-slider @radix-ui/react-switch
```

### Step 2: Add Toaster to Root Layout

Open `app/layout.tsx` and add the Toaster component:

```tsx
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

### Step 3: Apply Database Migration

**Note**: As per your preference, you'll need to approve this migration.

The migration file is located at:
`supabase/migrations/20250109000000_hero_content.sql`

To apply it:

```bash
# Option 1: Using Supabase CLI
supabase db push

# Option 2: Via Supabase Dashboard
# 1. Go to your Supabase project
# 2. Navigate to SQL Editor
# 3. Copy and paste the contents of the migration file
# 4. Click "Run"
```

### Step 4: Verify Storage Bucket

After running the migration, verify in Supabase Dashboard:
1. Go to **Storage**
2. Confirm `hero-images` bucket exists
3. Check that it's set to **Public**

## ✅ What's Been Implemented

### Database Schema
- ✅ `hero_content` table with all fields
- ✅ Storage bucket `hero-images` for background images
- ✅ Row Level Security policies
- ✅ Automatic single active hero enforcement
- ✅ Audit logging

### Frontend Components
- ✅ `ParallaxHero` component with database integration
- ✅ Dynamic background image support
- ✅ Configurable overlay opacity
- ✅ All content fields (title, subtitle, description, badge, CTAs)
- ✅ Fixed hydration error with Framer Motion

### Admin Panel
- ✅ `/admin/hero` page for hero management
- ✅ `HeroEditor` component with full CRUD
- ✅ Image upload to Supabase Storage
- ✅ Image preview and removal
- ✅ Multiple hero versions
- ✅ Active/inactive toggle
- ✅ Form validation

### UI Components
- ✅ Slider component (for opacity control)
- ✅ Switch component (for active toggle)
- ✅ Textarea component (for text inputs)
- ✅ Sonner toaster (for notifications)

## 📋 Testing Checklist

After setup, test the following:

### Homepage
- [ ] Visit homepage - hero should display with default content
- [ ] Check that gradient background displays (no image yet)
- [ ] Verify all text content is visible
- [ ] Test CTA buttons navigate correctly
- [ ] Test parallax scroll effect

### Admin Panel
- [ ] Navigate to `/admin/hero`
- [ ] Verify you can see the default hero entry
- [ ] Click "Create New Hero"
- [ ] Upload a background image
- [ ] Adjust overlay opacity slider
- [ ] Fill in all content fields
- [ ] Toggle "Set as Active Hero"
- [ ] Click "Save Hero Content"
- [ ] Verify success toast appears

### Homepage After Changes
- [ ] Return to homepage
- [ ] Verify new hero content displays
- [ ] Check background image appears
- [ ] Test overlay opacity looks correct
- [ ] Verify all updated content shows

## 🎨 Usage Guide

### Creating a New Hero

1. Go to `/admin/hero`
2. Click **"Create New Hero"**
3. **Upload Background Image** (optional)
   - Click "Upload Background Image"
   - Select image (PNG, JPG, WEBP)
   - Max size: 5MB
   - Recommended: 1920x1080 or larger
4. **Adjust Overlay Opacity** (if image uploaded)
   - Use slider to control darkness
   - Range: 0 (transparent) to 1 (fully dark)
   - Recommended: 0.4 - 0.7 for readability
5. **Fill Content Fields**
   - **Badge Text**: Small label (e.g., "Now Available")
   - **Subtitle**: Optional uppercase text
   - **Title**: Main heading (required)
   - **Description**: Supporting text
   - **Primary CTA Text & Link**: Main button
   - **Secondary CTA Text & Link**: Secondary button
6. **Set as Active**: Toggle to make it live
7. Click **"Save Hero Content"**

### Managing Multiple Versions

- Create multiple hero versions for different campaigns
- Only one can be active at a time
- Switch between versions by toggling "Set as Active"
- Delete unused versions with trash icon

### Best Practices

- **Images**: Use high-quality, optimized images
- **Overlay**: Keep between 0.4-0.7 for text readability
- **Title**: Keep concise and impactful
- **CTAs**: Use action-oriented text ("Get Started", "Learn More")
- **Testing**: Always preview on mobile devices

## 🔧 Troubleshooting

### Issue: Hero not displaying
- Check database migration was applied
- Verify at least one hero has `is_active = true`
- Check browser console for errors

### Issue: Image not uploading
- Verify `hero-images` bucket exists in Supabase Storage
- Check bucket is set to public
- Ensure image is under 5MB
- Verify storage policies are applied

### Issue: Changes not reflecting
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Check correct hero is set as active
- Verify no console errors

### Issue: Toast notifications not showing
- Ensure `sonner` is installed
- Verify `<Toaster />` is in root layout
- Check browser console for errors

## 📁 File Structure

```
├── app/
│   ├── admin/
│   │   ├── hero/
│   │   │   └── page.tsx          # Hero admin page
│   │   └── page.tsx              # Updated dashboard
│   └── layout.tsx                # Add Toaster here
├── components/
│   ├── admin/
│   │   └── hero-editor.tsx       # Hero editor component
│   ├── ui/
│   │   ├── slider.tsx            # New
│   │   ├── switch.tsx            # New
│   │   ├── textarea.tsx          # New
│   │   └── sonner.tsx            # New
│   └── parallax-hero.tsx         # Updated hero component
└── supabase/
    └── migrations/
        └── 20250109000000_hero_content.sql  # New migration
```

## 🎯 Next Steps

1. Install dependencies
2. Add Toaster to layout
3. Apply database migration (with your approval)
4. Test the admin panel
5. Upload your first hero image
6. Customize content to match your brand

## 📚 Additional Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Sonner Toast Docs](https://sonner.emilkowal.ski/)

---

**Need Help?** Check the console for errors or refer to `HERO_REDESIGN_SUMMARY.md` for detailed implementation notes.
