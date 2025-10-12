# Product Requirements Document (PRD)

**Project:** Visually-stunning marketing website with scroll animations + Admin Dashboard

**Tech stack:** Next.js (App Router) + React Query + Server Components where appropriate, Tailwind CSS + shadcn/ui, Framer Motion (animations) + smooth-scrolling (optional library), Supabase (Auth + Postgres + Storage), Vercel (hosting) or chosen cloud provider.

**Theme colour:** Blue (primary). Accent and neutral palette provided in the Design section.

---

## Executive summary

Build a fast, accessible, and visually engaging marketing website with four public pages: **Homepage**, **About**, **Services**, and **Contact**. The site uses scroll-driven animations and subtle micro-interactions for a premium feel. Content for these pages is editable via an **Admin Dashboard** backed by Supabase. The frontend is built with Next.js using Server Components for static and high-performance content, and React Query for client-side data fetching and mutations (admin interactions, dynamic content). The dashboard allows authorized editors to update copy, images, and service listings without developer deployments.

### Goals
- Deliver an elegant, high-performing website with smooth scroll animations and strong UX.
- Provide non-technical admins a safe interface to update page content via Supabase.
- Ensure SEO, accessibility, performance budgets, and observability are met.

### Success metrics
- Lighthouse Performance >= 90 on desktop, >= 70 on mobile.
- Core Web Vitals within recommended thresholds (CLS < 0.1, LCP < 2.5s, TTFB low).
- Admin can update homepage hero, services list, about copy, contact details, and images without code changes.
- < 1.5s interactive load for primary pages on mid-tier mobile.

---

## Users & personas

1. **Visitor (Prospective client)** — Browses pages, reads services, submits contact forms, expects fast, aesthetic, accessible experience.
2. **Content Editor / Admin** — Logs into dashboard to update pages and assets. Needs simple forms, preview, and versioning basics.
3. **Developer / Maintainer** — Implements features, maintains infra, manages deployments and database.

---

## Requirements

### Functional

1. **Public pages**
   - **Homepage:** Hero with animated headline and CTA, feature/work sections with card animations, testimonial carousel, services preview, footer.
   - **About:** Team section, mission statement, timeline or values with timeline scroll reveal animations.
   - **Services:** List of services (title, short description, icon/image, price or starting price optional), filter or categories, each service has a detail modal or subpage.
   - **Contact:** Contact form (name, email, message, optional dropdown for service interest), map embed (optional), social links.

2. **Admin Dashboard**
   - Authentication (Supabase Auth) with role-based access (admin/editor).
   - CRUD for: Homepage sections (hero, features), About content, Services (create/edit/delete/reorder), Testimonials, Assets (images), Contact settings (recipient email), Site settings (site title, logo, meta tags).
   - Image upload to Supabase Storage with automatic responsive image generation (client: generate multiple sizes or use Cloudflare Images if available).
   - Preview mode for content before publish (draft vs published state).
   - Basic audit trail (who changed what and when).

3. **Content Delivery**
   - Public pages should use Server Components for SSR/SSG where possible for performance and SEO.
   - React Query hooks on the client for admin interactions and any client-needed dynamic content.

4. **Animations & Interactions**
   - Scroll-triggered reveals (staggered fades + translateY) for sections.
   - Parallax hero background or layered elements.
   - Micro-interactions using Framer Motion for hover and CTA animations.
   - Respect reduced motion preference (prefers-reduced-motion).

### Non-functional

- Accessibility (WCAG AA) compliance: semantic HTML, keyboard navigation, alt text, color contrast.
- Internationalization-ready (content stored so that locales can be added later).
- Secure: Supabase Row Level Security for content; authenticated dashboard with secure endpoints.
- Scalable: Efficient database schema, CDN usage for assets.
- Maintainable: Clean architecture with well-documented code and components.

---

## UX & Design

### Visual language
- Primary: Blue (#0B5FFF or a chosen brand blue). Use 1–2 accent blues and neutral grays.
- Typography: Modern, geometric sans (e.g., Inter or Poppins) with distinct headings.
- Layout: Generous whitespace, large hero, card grid for services.

### Motion system
- Use Framer Motion for component-level animations.
- For scroll-driven animations consider using **Framer Motion + `useInView`** or **Locomotive Scroll** / **Lenis** for smoother scroll, then trigger Framer Motion animations. Prefer Lenis for modern friction-based smooth-scrolling.
- Animation rules:
  - Entrance animations: duration 0.45s–0.7s, ease-out, stagger 0.05–0.12s.
  - Hover micro interactions: scale 1.03, subtle shadow.
  - Disable or simplify motion when `prefers-reduced-motion`.

### Wireframes (high-level)
- Homepage: Hero (left text, right layered image), 3 feature cards in a staggered row, services strip with horizontal scrolling cards, testimonials, CTA band, footer.
- About: Intro, timeline, team grid with hover cards.
- Services: Filter top, grid of service cards; each card opens a detail panel.
- Contact: Short intro, contact form, contact info panel, embedded map.

---

## Data model (Supabase Postgres)

Simplified schema (tables):

1. `site_settings`
   - id (uuid)
   - key (text)
   - value (jsonb)
   - updated_at

2. `pages` (optional; flexible page-driven CMS)
   - id
   - slug (text)
   - title
   - content (jsonb) — structured blocks for hero, sections
   - status (draft/published)
   - updated_at

3. `services`
   - id
   - title
   - slug
   - short_description
   - full_description
   - icon_url / image_path
   - order_index
   - visible (boolean)
   - created_by
   - updated_at

4. `testimonials`
   - id
   - author
   - role
   - content
   - avatar_url
   - visible

5. `assets` (optional)
   - id
   - file_path
   - metadata jsonb (width, height, sizes)

6. `audit_logs`
   - id
   - table_name
   - row_id
   - action
   - user_id
   - timestamp

**RLS & Policies**
- Enable Row Level Security and policies that allow only authenticated admins to insert/update/delete content. Public `select` on `pages`, `services`, `testimonials` only returns `published` content.

---

## API & Data fetching patterns

- Use Next.js Server Components for page-level data fetching via `getStaticProps` equivalents in App Router (`fetch` from server). Cache using ISR (revalidate). For dynamic content admin-managed, use ISR revalidate on content updates (trigger via webhook or Supabase function).
- For admin UI (client-side): use React Query for data fetching and mutations. Use optimistic updates for snappy UI.
- Real-time: optionally use Supabase Realtime for live content preview or collaborative editing.

Example hooks:
- `useServices()` — React Query to GET `/api/services` (or directly query Supabase from client using service key + RLS).
- `useUpdateService()` — mutation hook for admin.

Security note: server-side requests to Supabase should use service_role key only on server functions (not sent to client). For client-side admin interactions use Supabase auth JWT and RLS.

---

## Admin Dashboard (UI/Features)

**Pages in Dashboard**
- Login
- Content (Pages / Hero / About / Services / Testimonials)
- Media Library (upload, crop, generate sizes)
- Site Settings (meta, contact email, social links)
- Users & Roles (list admins/editors)
- Audit / Activity log

**Key UX points**
- Live preview panel for page edits (desktop and mobile view).
- Reordering via drag-and-drop for service order.
- Simple WYSIWYG or block editor for flexible content (use TipTap or simple rich text for now).
- Image uploader with progress and automatic responsive URL generation.

---

## Implementation plan & milestones

**Phase 0 — Project setup (1 week)**
- Initialize Next.js app (App Router), Tailwind, ESLint, Prettier, Husky.
- Setup Supabase project: Auth, Database, Storage.
- Basic CI pipeline and Vercel deploy preview.

**Phase 1 — Public site skeleton + styling (1.5–2 weeks)**
- Implement page routes and layout, theme tokens (blue), global styles.
- Build components: Hero, Section, Card, Footer, Nav.
- Implement responsive design and typography.

**Phase 2 — Animations & polish (1 week)**
- Integrate Framer Motion and Lenis for smooth scrolling.
- Implement scroll reveal utilities and component wrappers.
- Implement reduced-motion handling.

**Phase 3 — Supabase & Admin dashboard (2–3 weeks)**
- Create Supabase schema and RLS policies.
- Implement public data fetching via Server Components and ISR.
- Build Admin dashboard with React Query, authentication, CRUD flows, Media Library.

**Phase 4 — Testing, SEO, Performance & Launch (1 week)**
- Accessibility audit, Lighthouse tuning, meta tags, sitemap, robots.
- Set up monitoring (Sentry), analytics, backups.

**Phase 5 — Post-launch improvements (ongoing)**
- Add multilingual support, A/B testing, performance tuning.

---

## Technical decisions & trade-offs

- **Server Components:** Use for public pages and content-heavy components — reduces JS sent to client and improves SEO. Admin dashboard will be client components due to interactivity.
- **React Query vs SWR:** React Query chosen for richer mutation and cache capabilities.
- **Animation engine:** Framer Motion + Lenis preferred — good ergonomics and performance. Locomotive is heavier and may conflict with React rendering.
- **Image handling:** Prefer Supabase Storage + on-the-fly transforms (if available) or generate responsive sizes at upload.

---

## Accessibility, SEO, Security

- All images must have `alt` and decorative images marked accordingly.
- Use semantic elements and landmarks; ensure keyboard navigation and focus outlines are preserved.
- Meta tags per page, Open Graph images, Twitter card.
- Rate-limit contact form with reCAPTCHA or Honeypot.
- Enforce HTTPS, CSP headers, and content-type headers. Store secrets in environment variables.

---

## Monitoring & analytics

- Integrate analytics (Plausible, Google Analytics, or Fathom) respecting privacy regulations.
- Error monitoring: Sentry.
- Performance monitoring: Vercel analytics / Lighthouse CI.

---

## Tests

- Unit tests for key components (Jest + React Testing Library).
- Integration tests for forms and admin flows (Playwright / Cypress).
- E2E smoke test to ensure content updates reflect live site.

---

## Deliverables

1. Production-ready Next.js website with Homepage, About, Services, Contact pages and animation system.
2. Admin Dashboard connected to Supabase to manage site content and assets.
3. Documentation: README, deployment steps, and admin user guide.
4. Automated CI pipeline and staging environment.

---

## Open questions / decisions for the owner

- Preferred brand blue hex (if you have a specific hex or logo assets, provide them).
- Do you want service *subpages* per service or modal details on the Services page?
- Do you require multilingual content at launch?
- Preferred hosting (Vercel recommended) and monitoring preferences.

---

## Appendix — Code & architecture notes

- Use `app/layout.tsx` for global layout and `app/(public)/page.tsx` etc. keep marketing pages in a public group.
- Example animation utility: `components/AnimateIn.tsx` — wrapper using `useInView` + Framer Motion for staggered children.
- Use `react-query` with `QueryClient` and `Hydrate` on client where needed (admin dashboard). For Server Components, fetch data on server via direct Supabase SDK or REST and render.
- Revalidate on content publish: create an API route `/api/revalidate` that validates a secret and calls Next.js revalidate for a given path — trigger this from a Supabase function or via admin POST after publishing.

---

*Prepared by: Senior Frontend Engineer — Implementation-ready PRD with design, data model, roadmap, and testing strategy.*

