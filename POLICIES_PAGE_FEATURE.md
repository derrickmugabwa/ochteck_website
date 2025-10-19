# Policies Page Feature Plan

## Overview
Create a new "Policies" page with admin-managed content including hero section and policy cards with SVG icons.

## Feature Components

### 1. Database Schema
- **policies_hero table**
  - `id` (uuid, primary key)
  - `title` (text)
  - `subtitle` (text)
  - `description` (text)
  - `background_image_url` (text, optional)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- **policies table**
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `icon_svg` (text) - stores SVG markup
  - `order` (integer) - for sorting
  - `is_active` (boolean)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

### 2. Database Migration
- **File**: `supabase/migrations/[timestamp]_create_policies_tables.sql`
- Create both tables with RLS policies
- Enable storage for SVG uploads (optional alternative to storing SVG markup)
- Set up appropriate indexes

### 3. Storage Setup (Optional)
- Create `policy-icons` bucket for SVG uploads
- Configure RLS policies for public read, authenticated write
- Add MIME type restrictions for SVG files

### 4. Frontend Components

#### a. Policies Page
- **File**: `app/policies/page.tsx`
- Fetch hero and policies data from Supabase
- Render hero section
- Render policies grid/cards

#### b. Policies Page Content Component
- **File**: `components/policies-page-content.tsx`
- Hero section (reusable pattern from other pages)
- Policies section with card grid
- Responsive layout

#### c. Policy Card Component
- **File**: `components/policy-card.tsx`
- Display SVG icon
- Show title and description
- Consistent styling with other cards

### 5. Admin Panel Features

#### a. Policies Hero Management
- **File**: `components/admin/policies-hero-form.tsx`
- Form to edit hero section content
- Image upload for background
- Real-time preview

#### b. Policies Management
- **File**: `components/admin/policies-list.tsx`
- List all policies with edit/delete actions
- Drag-and-drop reordering
- Toggle active/inactive status

#### c. Policy Form
- **File**: `components/admin/policy-form.tsx`
- Add/edit policy form
- SVG upload/paste functionality
- SVG preview
- Validation for SVG format

### 6. Server Actions

#### a. Policies Hero Actions
- **File**: `app/actions/policies-hero.ts`
- `getPoliciesHero()` - fetch hero data
- `updatePoliciesHero()` - update hero content
- `uploadPoliciesHeroImage()` - handle image upload

#### b. Policies Actions
- **File**: `app/actions/policies.ts`
- `getPolicies()` - fetch all active policies
- `getAllPolicies()` - fetch all policies (admin)
- `createPolicy()` - create new policy
- `updatePolicy()` - update existing policy
- `deletePolicy()` - delete policy
- `reorderPolicies()` - update order
- `uploadPolicySvg()` - handle SVG upload (if using storage)

### 7. Type Definitions
- **File**: `types/policies.ts`
- `PoliciesHero` interface
- `Policy` interface
- Form validation schemas

### 8. Admin Navigation
- Update admin sidebar/navigation to include:
  - Policies Hero
  - Policies Management

## Implementation Steps

### Phase 1: Database Setup ✅ COMPLETED
1. ✅ Create migration file for policies tables
2. ✅ Define table schemas with RLS policies
3. ✅ Set up storage bucket (if using file uploads)
4. ⏭️ Test migration locally (requires user approval)

### Phase 2: Type Definitions ✅ COMPLETED
1. ✅ Create `types/policies.ts`
2. ✅ Define TypeScript interfaces
3. ✅ Create validation schemas

### Phase 3: Server Actions ✅ COMPLETED
1. ✅ Create `app/actions/policies-hero.ts`
2. ✅ Create `app/actions/policies.ts`
3. ✅ Implement CRUD operations
4. ✅ Add error handling

### Phase 4: Frontend Components ✅ COMPLETED
1. ✅ Create `components/policy-card.tsx`
2. ✅ Create `components/policies-page-content.tsx`
3. ✅ Create `app/policies/page.tsx`
4. ✅ Style components consistently

### Phase 5: Admin Components ✅ COMPLETED
1. ✅ Create `components/admin/policies-hero-form.tsx`
2. ✅ Create `components/admin/policy-form.tsx`
3. ✅ Create `components/admin/policies-list.tsx`
4. ✅ Add to admin navigation

### Phase 6: Testing & Polish 🔄 READY FOR TESTING
1. ⏳ Test all CRUD operations
2. ⏳ Test SVG upload/display
3. ⏳ Verify responsive design
4. ⏳ Check accessibility
5. ⏳ Test RLS policies

## Technical Considerations

### SVG Handling Options
**Option 1: Store SVG Markup in Database**
- Pros: Simple, no storage needed, easy to inline
- Cons: Limited size, potential XSS if not sanitized

**Option 2: Upload SVG Files to Storage**
- Pros: Better for larger files, easier management
- Cons: Additional storage setup, URL management

**Recommendation**: Use Option 1 (store markup) with proper sanitization

### SVG Security
- Sanitize SVG input to prevent XSS attacks
- Use `dangerouslySetInnerHTML` with caution
- Consider using a library like `dompurify` or `sanitize-html`
- Validate SVG structure before saving

### Reusable Patterns
- Hero section follows same pattern as Services, About pages
- Card layout similar to services cards
- Admin forms follow existing patterns
- Use existing UI components (Button, Input, Textarea, etc.)

### Responsive Design
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Consistent spacing and typography

## Files to Create/Modify

### New Files (15)
1. `POLICIES_PAGE_FEATURE.md` (this file)
2. `supabase/migrations/[timestamp]_create_policies_tables.sql`
3. `types/policies.ts`
4. `app/actions/policies-hero.ts`
5. `app/actions/policies.ts`
6. `app/policies/page.tsx`
7. `components/policies-page-content.tsx`
8. `components/policy-card.tsx`
9. `components/admin/policies-hero-form.tsx`
10. `components/admin/policy-form.tsx`
11. `components/admin/policies-list.tsx`

### Files to Modify (2-3)
1. Admin navigation/sidebar component
2. Main navigation (add Policies link)
3. Admin dashboard layout (if needed)

## Estimated Timeline
- Phase 1: 30 minutes
- Phase 2: 15 minutes
- Phase 3: 45 minutes
- Phase 4: 1 hour
- Phase 5: 1.5 hours
- Phase 6: 30 minutes

**Total**: ~4-5 hours

## Next Steps
1. Review and approve plan
2. Start with Phase 1 (Database Setup)
3. Proceed sequentially through phases
4. Test after each phase completion
