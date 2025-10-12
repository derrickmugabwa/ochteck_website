"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Upload, Loader2, Save, Plus, Trash2, Eye, Image as ImageIcon, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarSettings {
  id: string;
  logo_url?: string;
  logo_text: string;
  show_logo_text: boolean;
  navigation_links: NavLink[];
  cta_button_text?: string;
  cta_button_link?: string;
  show_cta_button: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface NavbarEditorProps {
  initialSettings: NavbarSettings[];
}

export function NavbarEditor({ initialSettings }: NavbarEditorProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<NavbarSettings[]>(initialSettings);
  const [selectedSetting, setSelectedSetting] = useState<NavbarSettings | null>(
    initialSettings.find((s) => s.is_active) || initialSettings[0] || null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<NavbarSettings>>(
    selectedSetting || {
      logo_text: "Brand",
      show_logo_text: true,
      navigation_links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Contact", href: "/contact" },
      ],
      cta_button_text: "Get Started",
      cta_button_link: "/contact",
      show_cta_button: true,
      is_active: false,
    }
  );

  const handleInputChange = (field: keyof NavbarSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo size should be less than 2MB");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("logos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("logos").getPublicUrl(data.path);

      handleInputChange("logo_url", publicUrl);
      toast.success("Logo uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error(error.message || "Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!formData.logo_url) return;

    const supabase = createClient();

    try {
      const url = new URL(formData.logo_url);
      const pathParts = url.pathname.split("/");
      const filePath = pathParts[pathParts.length - 1];

      const { error } = await supabase.storage.from("logos").remove([filePath]);

      if (error) throw error;

      handleInputChange("logo_url", "");
      toast.success("Logo removed successfully");
    } catch (error: any) {
      console.error("Error removing logo:", error);
      toast.error(error.message || "Failed to remove logo");
    }
  };

  const handleAddNavLink = () => {
    const currentLinks = formData.navigation_links || [];
    handleInputChange("navigation_links", [
      ...currentLinks,
      { label: "New Link", href: "/" },
    ]);
  };

  const handleUpdateNavLink = (index: number, field: keyof NavLink, value: string) => {
    const currentLinks = [...(formData.navigation_links || [])];
    currentLinks[index] = { ...currentLinks[index], [field]: value };
    handleInputChange("navigation_links", currentLinks);
  };

  const handleRemoveNavLink = (index: number) => {
    const currentLinks = formData.navigation_links || [];
    handleInputChange(
      "navigation_links",
      currentLinks.filter((_, i) => i !== index)
    );
  };

  const handleSave = async () => {
    if (!formData.logo_text && !formData.logo_url) {
      toast.error("Please provide either logo text or upload a logo");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      if (selectedSetting) {
        const { error } = await supabase
          .from("navbar_settings")
          .update(formData)
          .eq("id", selectedSetting.id);

        if (error) throw error;

        setSettings((prev) =>
          prev.map((s) => (s.id === selectedSetting.id ? { ...s, ...formData } as NavbarSettings : s))
        );
        toast.success("Navbar settings updated successfully");
      } else {
        const { data, error } = await supabase
          .from("navbar_settings")
          .insert([formData])
          .select()
          .single();

        if (error) throw error;

        setSettings((prev) => [data, ...prev]);
        setSelectedSetting(data);
        setIsCreating(false);
        toast.success("Navbar settings created successfully");
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error saving navbar settings:", error);
      toast.error(error.message || "Failed to save navbar settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this navbar configuration?")) return;

    const supabase = createClient();

    try {
      const { error } = await supabase.from("navbar_settings").delete().eq("id", id);

      if (error) throw error;

      setSettings((prev) => prev.filter((s) => s.id !== id));
      if (selectedSetting?.id === id) {
        const remaining = settings.filter((s) => s.id !== id);
        setSelectedSetting(remaining[0] || null);
        setFormData(remaining[0] || {
          logo_text: "Brand",
          show_logo_text: true,
          navigation_links: [],
          show_cta_button: false,
          is_active: false,
        });
      }

      toast.success("Navbar configuration deleted successfully");
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting navbar settings:", error);
      toast.error(error.message || "Failed to delete navbar settings");
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedSetting(null);
    setFormData({
      logo_text: "Brand",
      show_logo_text: true,
      navigation_links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Contact", href: "/contact" },
      ],
      cta_button_text: "Get Started",
      cta_button_link: "/contact",
      show_cta_button: true,
      is_active: false,
    });
  };

  const handleSelectSetting = (setting: NavbarSettings) => {
    setSelectedSetting(setting);
    setFormData(setting);
    setIsCreating(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Settings List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Navbar Versions</CardTitle>
          <CardDescription>Manage different navbar configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={handleCreateNew} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create New Navbar
          </Button>

          <div className="space-y-2 mt-4">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedSetting?.id === setting.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleSelectSetting(setting)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{setting.logo_text}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(setting.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {setting.is_active && (
                      <div className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        <Eye className="w-3 h-3" />
                        Active
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(setting.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {isCreating ? "Create New Navbar" : selectedSetting ? "Edit Navbar" : "No Navbar Selected"}
          </CardTitle>
          <CardDescription>
            Configure logo, navigation links, and CTA button
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Logo</Label>
            {formData.logo_url ? (
              <div className="relative rounded-lg overflow-hidden border p-4">
                <img
                  src={formData.logo_url}
                  alt="Logo"
                  className="h-16 object-contain"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveLogo}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <Label
                  htmlFor="logo-upload"
                  className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </>
                  )}
                </Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, SVG up to 2MB
                </p>
              </div>
            )}
          </div>

          {/* Logo Text */}
          <div className="space-y-2">
            <Label htmlFor="logo_text">Logo Text</Label>
            <Input
              id="logo_text"
              value={formData.logo_text || ""}
              onChange={(e) => handleInputChange("logo_text", e.target.value)}
              placeholder="Brand"
            />
          </div>

          {/* Show Logo Text */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="show_logo_text">Show Logo Text</Label>
              <p className="text-xs text-muted-foreground">
                Display text alongside or instead of logo image
              </p>
            </div>
            <Switch
              id="show_logo_text"
              checked={formData.show_logo_text || false}
              onCheckedChange={(checked) => handleInputChange("show_logo_text", checked)}
            />
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Navigation Links</Label>
              <Button size="sm" variant="outline" onClick={handleAddNavLink}>
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.navigation_links || []).map((link, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => handleUpdateNavLink(index, "label", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="/path"
                    value={link.href}
                    onChange={(e) => handleUpdateNavLink(index, "href", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveNavLink(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="show_cta_button">Show CTA Button</Label>
              <p className="text-xs text-muted-foreground">
                Display a call-to-action button in the navbar
              </p>
            </div>
            <Switch
              id="show_cta_button"
              checked={formData.show_cta_button || false}
              onCheckedChange={(checked) => handleInputChange("show_cta_button", checked)}
            />
          </div>

          {formData.show_cta_button && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cta_button_text">CTA Button Text</Label>
                <Input
                  id="cta_button_text"
                  value={formData.cta_button_text || ""}
                  onChange={(e) => handleInputChange("cta_button_text", e.target.value)}
                  placeholder="Get Started"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_button_link">CTA Button Link</Label>
                <Input
                  id="cta_button_link"
                  value={formData.cta_button_link || ""}
                  onChange={(e) => handleInputChange("cta_button_link", e.target.value)}
                  placeholder="/contact"
                />
              </div>
            </div>
          )}

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Set as Active Navbar</Label>
              <p className="text-xs text-muted-foreground">
                Only one navbar can be active at a time
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active || false}
              onCheckedChange={(checked) => handleInputChange("is_active", checked)}
            />
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Navbar Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
