"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const [settings, setSettings] = useState({
    site_title: "",
    site_description: "",
    contact_email: "",
    social_twitter: "",
    social_github: "",
    social_linkedin: "",
  });

  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (siteSettings) {
      const settingsMap: Record<string, any> = {};
      siteSettings.forEach((setting: any) => {
        settingsMap[setting.key] = setting.value;
      });

      setSettings({
        site_title: settingsMap.site_title || "",
        site_description: settingsMap.site_description || "",
        contact_email: settingsMap.contact_email || "",
        social_twitter: settingsMap.social_links?.twitter || "",
        social_github: settingsMap.social_links?.github || "",
        social_linkedin: settingsMap.social_links?.linkedin || "",
      });
    }
  }, [siteSettings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = [
        { key: "site_title", value: settings.site_title },
        { key: "site_description", value: settings.site_description },
        { key: "contact_email", value: settings.contact_email },
        {
          key: "social_links",
          value: {
            twitter: settings.social_twitter,
            github: settings.social_github,
            linkedin: settings.social_linkedin,
          },
        },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key: update.key, value: update.value }, { onConflict: "key" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      alert("Settings saved successfully!");
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your website settings and configuration
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-6 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Title</label>
                <input
                  type="text"
                  value={settings.site_title}
                  onChange={(e) =>
                    setSettings({ ...settings, site_title: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Site Description</label>
                <textarea
                  value={settings.site_description}
                  onChange={(e) =>
                    setSettings({ ...settings, site_description: e.target.value })
                  }
                  rows={3}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) =>
                    setSettings({ ...settings, contact_email: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Twitter URL</label>
                <input
                  type="url"
                  value={settings.social_twitter}
                  onChange={(e) =>
                    setSettings({ ...settings, social_twitter: e.target.value })
                  }
                  placeholder="https://twitter.com/yourusername"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub URL</label>
                <input
                  type="url"
                  value={settings.social_github}
                  onChange={(e) =>
                    setSettings({ ...settings, social_github: e.target.value })
                  }
                  placeholder="https://github.com/yourusername"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn URL</label>
                <input
                  type="url"
                  value={settings.social_linkedin}
                  onChange={(e) =>
                    setSettings({ ...settings, social_linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/yourusername"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      )}
    </div>
  );
}
