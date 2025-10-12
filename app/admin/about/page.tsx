import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AboutEditor } from "@/components/admin/about-editor";

export default async function AboutManagementPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all about page sections
  const [heroResult, missionResult, valuesResult, timelineResult] = await Promise.all([
    supabase.from("about_hero").select("*").order("created_at", { ascending: false }),
    supabase.from("about_mission").select("*").order("created_at", { ascending: false }),
    supabase.from("about_values").select("*").order("created_at", { ascending: false }),
    supabase.from("about_timeline").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About Page Content</h1>
        <p className="text-muted-foreground mt-2">
          Manage all about page sections in one place
        </p>
      </div>

      <AboutEditor
        initialHero={heroResult.data || []}
        initialMission={missionResult.data || []}
        initialValues={valuesResult.data || []}
        initialTimeline={timelineResult.data || []}
      />
    </div>
  );
}
