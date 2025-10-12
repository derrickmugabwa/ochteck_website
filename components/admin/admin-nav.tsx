"use client";

import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AdminNav({ user }: { user: User }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-8">
      <div>
        <h1 className="text-lg font-semibold">Content Management</h1>
        <p className="text-xs text-muted-foreground">
          Manage your website content and settings
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted">
          <UserIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{user.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
