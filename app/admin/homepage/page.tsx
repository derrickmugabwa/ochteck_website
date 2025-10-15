import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HomepageEditor } from "@/components/admin/homepage-editor";

export default async function HomepageManagementPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all homepage sections
  const [featuresResult, servicesResult, ctaResult, testimonialsResult] = await Promise.all([
    supabase.from("homepage_features").select("*").order("created_at", { ascending: false }),
    supabase.from("homepage_services").select("*").order("created_at", { ascending: false }),
    supabase.from("homepage_cta").select("*").order("created_at", { ascending: false }),
    supabase.from("homepage_testimonials_section").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Homepage Content</h1>
        <p className="text-muted-foreground mt-2">
          Manage all homepage sections in one place
        </p>
      </div>

      <HomepageEditor
        initialFeatures={featuresResult.data || []}
        initialServices={servicesResult.data || []}
        initialCta={ctaResult.data || []}
        initialTestimonials={testimonialsResult.data || []}
      />
    </div>
  );
}
