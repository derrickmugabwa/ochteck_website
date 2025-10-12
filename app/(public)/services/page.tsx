import { createClient } from "@/lib/supabase/server";
import { ServicesPageContent } from "@/components/services-page-content";

export const metadata = {
  title: "Services | Next.js Supabase Starter",
  description: "Explore our services and offerings.",
};

export default async function ServicesPage() {
  const supabase = await createClient();

  // Fetch visible services from database
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("visible", true)
    .order("order_index");

  return <ServicesPageContent services={services || []} />;
}
