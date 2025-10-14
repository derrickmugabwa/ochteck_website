"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload, Loader2, X } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const [settings, setSettings] = useState({
    site_name: "",
    favicon_url: "",
    logo_url: "",
  });
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("is_active", true)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setSettings({
          site_name: data.site_name || "",
          favicon_url: data.favicon_url || "",
          logo_url: data.logo_url || "",
        });
      }
      return data;
    },
  });

  const handleImageUpload = async (file: File, type: 'favicon' | 'logo') => {
    try {
      if (type === 'favicon') setIsUploadingFavicon(true);
      else setIsUploadingLogo(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      if (type === 'favicon') {
        setSettings({ ...settings, favicon_url: publicUrl });
      } else {
        setSettings({ ...settings, logo_url: publicUrl });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      if (type === 'favicon') setIsUploadingFavicon(false);
      else setIsUploadingLogo(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (siteSettings?.id) {
        const { error } = await supabase
          .from("site_settings")
          .update(settings)
          .eq("id", siteSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([{ ...settings, is_active: true }]);
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
              <CardTitle>Site Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Name</label>
                <input
                  type="text"
                  value={settings.site_name}
                  onChange={(e) =>
                    setSettings({ ...settings, site_name: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ochteck Agency Limited"
                />
              </div>

              {/* Favicon Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Favicon</label>
                {settings.favicon_url && (
                  <div className="relative w-16 h-16 border rounded-lg p-2 bg-muted/30">
                    <img
                      src={settings.favicon_url}
                      alt="Favicon"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => setSettings({ ...settings, favicon_url: "" })}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'favicon');
                    }}
                    disabled={isUploadingFavicon}
                    className="hidden"
                  />
                  <div className="w-full border-2 border-dashed rounded-lg px-4 py-3 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                    {isUploadingFavicon ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">Upload Favicon (16x16 or 32x32)</span>
                      </div>
                    )}
                  </div>
                </label>
                <p className="text-xs text-muted-foreground">Recommended: .ico, .png (16x16 or 32x32 pixels)</p>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Logo</label>
                {settings.logo_url && (
                  <div className="relative w-32 h-32 border rounded-lg p-4 bg-muted/30">
                    <img
                      src={settings.logo_url}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => setSettings({ ...settings, logo_url: "" })}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'logo');
                    }}
                    disabled={isUploadingLogo}
                    className="hidden"
                  />
                  <div className="w-full border-2 border-dashed rounded-lg px-4 py-3 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                    {isUploadingLogo ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">Upload Logo</span>
                      </div>
                    )}
                  </div>
                </label>
                <p className="text-xs text-muted-foreground">Recommended: .png or .svg with transparent background</p>
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
