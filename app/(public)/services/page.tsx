import { createClient } from "@/lib/supabase/server";
import { ServicesPageContent } from "@/components/services-page-content";

export const metadata = {
  title: "Services | Ochteck Agency Limited",
  description: "Explore our services and offerings.",
};

export default async function ServicesPage() {
  const supabase = await createClient();

  // Fetch all services page content
  const [servicesResult, processStepsResult, ctaResult, heroResult] = await Promise.all([
    supabase.from("services").select("*").eq("visible", true).order("order_index"),
    supabase.from("services_process_steps").select("*").eq("visible", true).order("order_index"),
    supabase.from("services_page_cta").select("*").eq("is_active", true).single(),
    supabase.from("services_page_hero").select("*").eq("is_active", true).single(),
  ]);

  return (
    <ServicesPageContent
      services={servicesResult.data || []}
      processSteps={processStepsResult.data || []}
      cta={ctaResult.data}
      hero={heroResult.data}
    />
  );
}
