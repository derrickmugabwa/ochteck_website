import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HeroEditor } from "@/components/admin/hero-editor";

export default async function HeroManagementPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all hero content entries
  const { data: heroEntries, error } = await supabase
    .from("hero_content")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching hero content:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hero Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your homepage hero section content and background image
        </p>
      </div>

      <HeroEditor initialHeroEntries={heroEntries || []} />
    </div>
  );
}
