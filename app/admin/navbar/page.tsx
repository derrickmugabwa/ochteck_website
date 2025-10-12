import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NavbarEditor } from "@/components/admin/navbar-editor";

export default async function NavbarManagementPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch navbar settings
  const { data: navbarSettings, error } = await supabase
    .from("navbar_settings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching navbar settings:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Navbar Management</h1>
        <p className="text-muted-foreground mt-2">
          Customize your site navigation, logo, and menu items
        </p>
      </div>

      <NavbarEditor initialSettings={navbarSettings || []} />
    </div>
  );
}
