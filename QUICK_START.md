# Quick Start Guide 🚀

## What You Have

A **stunning, production-ready marketing website** with:
- 🎨 Beautiful animated homepage with parallax effects
- 📄 About, Services, and Contact pages
- 🔐 Full-featured admin dashboard
- 💾 Supabase backend with authentication
- ⚡ Smooth animations and transitions
- 📱 Fully responsive design

## Get Started in 3 Steps

### Step 1: Setup Supabase Database ⚠️ CRITICAL

**You MUST run the database migration first!**

1. Go to https://supabase.com and open your project
2. Click **SQL Editor** in the left sidebar
3. Open the file: `supabase/migrations/20250101000000_initial_schema.sql`
4. Copy ALL the SQL code
5. Paste it into the SQL Editor
6. Click **Run** button

This creates all the tables, security policies, and sample data.

### Step 2: Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter email and password (remember these!)
4. Click **Create user**

### Step 3: Run the App

```bash
npm run dev
```

Visit:
- **Public Site**: http://localhost:3000
- **Admin Login**: http://localhost:3000/sign-in
- **Admin Dashboard**: http://localhost:3000/admin

## What's Included

### Public Pages
- **/** - Stunning homepage with hero, features, services, testimonials
- **/about** - Company story, values, and timeline
- **/services** - Service offerings with detailed cards
- **/contact** - Contact form and information

### Admin Dashboard (`/admin`)
- **Dashboard** - Overview and quick actions
- **Services** - Add/edit/delete services
- **Testimonials** - Manage client testimonials
- **Pages** - Content management
- **Media** - Upload and manage images
- **Settings** - Site configuration

## Key Features

✅ **Parallax Hero** - Eye-catching animated hero section
✅ **Scroll Animations** - Smooth reveal animations with Framer Motion
✅ **Lenis Smooth Scroll** - Buttery smooth scrolling experience
✅ **Fixed Navigation** - Backdrop blur header that stays on top
✅ **Admin CRUD** - Full create, read, update, delete for all content
✅ **Authentication** - Secure admin access with Supabase Auth
✅ **Row Level Security** - Database security policies
✅ **React Query** - Optimized data fetching and caching
✅ **TypeScript** - Full type safety
✅ **Responsive** - Works perfectly on all devices

## Sample Data Included

The migration includes:
- 4 sample services (Web Dev, Design Systems, Animations, CMS)
- 3 sample testimonials
- Site settings (title, description, social links)

You can edit or delete these through the admin dashboard!

## Customization

### Change Primary Color
Edit `app/globals.css`:
```css
--primary: 219 100% 52%; /* Change this HSL value */
```

### Update Site Info
1. Login to admin at `/admin`
2. Go to **Settings**
3. Update site title, description, contact email, social links

### Add Your Content
1. Go to **Services** - Add your actual services
2. Go to **Testimonials** - Add real client testimonials
3. Update the homepage content as needed

## Troubleshooting

### "Cannot connect to database"
- Check `.env.local` has correct Supabase URL and key
- Verify Supabase project is active

### "No services showing"
- Make sure you ran the migration SQL
- Check services are marked as "visible" in admin

### "Cannot login to admin"
- Verify you created a user in Supabase Auth
- Check email/password are correct
- Try clearing browser cookies

### Build errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## Next Steps

1. ✅ Run the migration (if you haven't)
2. ✅ Create admin user
3. ✅ Login and explore the admin dashboard
4. 📝 Customize content through admin
5. 🎨 Update colors and branding
6. 📸 Add real images
7. 🚀 Deploy to Vercel

## Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## Tech Stack

- **Next.js 15** - React framework
- **Supabase** - Backend & Auth
- **React Query** - Data management
- **Framer Motion** - Animations
- **Lenis** - Smooth scroll
- **Tailwind CSS** - Styling
- **shadcn/ui** - Components
- **TypeScript** - Type safety

## File Structure

```
app/
├── (public)/        # Public pages
├── admin/           # Admin dashboard
├── page.tsx         # Homepage
components/
├── admin/           # Admin components
├── ui/              # UI components
├── parallax-hero.tsx
supabase/
└── migrations/      # Database schema
```

## Support

- Full documentation: `IMPLEMENTATION.md`
- PRD with requirements: `next.md`
- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs

---

**Remember**: Run the migration first, then create an admin user, then start building! 🎉
