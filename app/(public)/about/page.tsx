import { createClient } from "@/lib/supabase/server";
import { AboutPageContent } from "@/components/about-page-content";

export const metadata = {
  title: "About | Next.js Supabase Starter",
  description: "Learn more about our mission, values, and team.",
};

export default async function AboutPage() {
  const supabase = await createClient();

  // Fetch all about page sections
  const [heroResult, missionResult, valuesResult, timelineResult] = await Promise.all([
    supabase.from("about_hero").select("*").eq("is_active", true).single(),
    supabase.from("about_mission").select("*").eq("is_active", true).single(),
    supabase.from("about_values").select("*").eq("is_active", true).single(),
    supabase.from("about_timeline").select("*").eq("is_active", true).single(),
  ]);

  return (
    <AboutPageContent
      hero={heroResult.data}
      mission={missionResult.data}
      values={valuesResult.data}
      timeline={timelineResult.data}
    />
  );
}
