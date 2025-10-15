import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ParallaxHero } from "@/components/parallax-hero";
import { HomepageSections } from "@/components/homepage-sections";
import { BrandsSlider } from "@/components/brands-slider";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Ochteck Agency Limited | Professional Web Development",
  description: "Professional web development and digital solutions",
};

export default async function Home() {
  const supabase = await createClient();

  // Fetch homepage sections
  const [featuresResult, servicesResult, ctaResult, brandsResult, brandsSectionResult, testimonialsResult] = await Promise.all([
    supabase.from("homepage_features").select("*").eq("is_active", true).single(),
    supabase.from("services").select("*").eq("visible", true).order("order_index").limit(8),
    supabase.from("homepage_cta").select("*").eq("is_active", true).single(),
    supabase.from("brands").select("*").eq("visible", true).order("order_index"),
    supabase.from("brands_section").select("*").eq("is_active", true).single(),
    supabase.from("homepage_testimonials_section").select("*").eq("is_active", true).single(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-foreground/10">
        <div className="mx-auto w-full max-w-7xl px-5">
          <SiteNav />
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section with Parallax */}
        <ParallaxHero />

        {/* Homepage Sections from Database */}
        <HomepageSections
          features={featuresResult.data}
          services={servicesResult.data}
          cta={ctaResult.data}
          testimonialsSection={testimonialsResult.data}
        />

        {/* Brands Slider */}
        <div className="mx-auto w-full max-w-7xl px-5">
          <BrandsSlider 
            brands={brandsResult.data || []} 
            sectionData={brandsSectionResult.data}
          />
        </div>
      </main>

      <footer className="border-t mt-20">
        <div className="mx-auto w-full max-w-7xl px-5">
          <SiteFooter />
        </div>
      </footer>
    </div>
  );
}
