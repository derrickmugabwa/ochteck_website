import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FooterEditor } from "@/components/admin/footer-editor";

export default async function FooterManagementPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch footer settings
  const { data: footerSettings, error } = await supabase
    .from("footer_settings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching footer settings:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Footer Management</h1>
        <p className="text-muted-foreground mt-2">
          Customize your site footer, links, and social media
        </p>
      </div>

      <FooterEditor initialSettings={footerSettings || []} />
    </div>
  );
}
