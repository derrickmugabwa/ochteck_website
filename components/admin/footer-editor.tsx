"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Upload, Loader2, Save, Plus, Trash2, Eye, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterSettings {
  id: string;
  logo_url?: string;
  logo_text: string;
  show_logo_text: boolean;
  tagline?: string;
  description?: string;
  footer_links: FooterSection[];
  social_links: SocialLink[];
  copyright_text: string;
  show_newsletter: boolean;
  newsletter_title?: string;
  newsletter_description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FooterEditorProps {
  initialSettings: FooterSettings[];
}

export function FooterEditor({ initialSettings }: FooterEditorProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<FooterSettings[]>(initialSettings);
  const [selectedSetting, setSelectedSetting] = useState<FooterSettings | null>(
    initialSettings.find((s) => s.is_active) || initialSettings[0] || null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<FooterSettings>>(
    selectedSetting || {
      logo_text: "Brand",
      show_logo_text: false,
      tagline: "",
      description: "",
      footer_links: [
        {
          title: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Services", href: "/services" },
            { label: "Contact", href: "/contact" },
          ],
        },
      ],
      social_links: [
        { platform: "twitter", url: "https://twitter.com", icon: "twitter" },
        { platform: "github", url: "https://github.com", icon: "github" },
        { platform: "linkedin", url: "https://linkedin.com", icon: "linkedin" },
      ],
      copyright_text: `© ${new Date().getFullYear()} Brand. All rights reserved.`,
      show_newsletter: false,
      is_active: false,
    }
  );

  const handleInputChange = (field: keyof FooterSettings, value: any) => {
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
      const fileName = `footer-logo-${Date.now()}.${fileExt}`;

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

  const handleAddSocialLink = () => {
    const currentLinks = formData.social_links || [];
    handleInputChange("social_links", [
      ...currentLinks,
      { platform: "new", url: "https://", icon: "link" },
    ]);
  };

  const handleUpdateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const currentLinks = [...(formData.social_links || [])];
    currentLinks[index] = { ...currentLinks[index], [field]: value };
    handleInputChange("social_links", currentLinks);
  };

  const handleRemoveSocialLink = (index: number) => {
    const currentLinks = formData.social_links || [];
    handleInputChange(
      "social_links",
      currentLinks.filter((_, i) => i !== index)
    );
  };

  const handleSave = async () => {
    if (!formData.copyright_text) {
      toast.error("Copyright text is required");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      if (selectedSetting) {
        const { error } = await supabase
          .from("footer_settings")
          .update(formData)
          .eq("id", selectedSetting.id);

        if (error) throw error;

        setSettings((prev) =>
          prev.map((s) => (s.id === selectedSetting.id ? { ...s, ...formData } as FooterSettings : s))
        );
        toast.success("Footer settings updated successfully");
      } else {
        const { data, error } = await supabase
          .from("footer_settings")
          .insert([formData])
          .select()
          .single();

        if (error) throw error;

        setSettings((prev) => [data, ...prev]);
        setSelectedSetting(data);
        setIsCreating(false);
        toast.success("Footer settings created successfully");
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error saving footer settings:", error);
      toast.error(error.message || "Failed to save footer settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this footer configuration?")) return;

    const supabase = createClient();

    try {
      const { error } = await supabase.from("footer_settings").delete().eq("id", id);

      if (error) throw error;

      setSettings((prev) => prev.filter((s) => s.id !== id));
      if (selectedSetting?.id === id) {
        const remaining = settings.filter((s) => s.id !== id);
        setSelectedSetting(remaining[0] || null);
        setFormData(remaining[0] || {
          logo_text: "Brand",
          show_logo_text: false,
          footer_links: [],
          social_links: [],
          copyright_text: `© ${new Date().getFullYear()} Brand. All rights reserved.`,
          show_newsletter: false,
          is_active: false,
        });
      }

      toast.success("Footer configuration deleted successfully");
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting footer settings:", error);
      toast.error(error.message || "Failed to delete footer settings");
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedSetting(null);
    setFormData({
      logo_text: "Brand",
      show_logo_text: false,
      tagline: "",
      description: "",
      footer_links: [
        {
          title: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Services", href: "/services" },
            { label: "Contact", href: "/contact" },
          ],
        },
      ],
      social_links: [
        { platform: "twitter", url: "https://twitter.com", icon: "twitter" },
        { platform: "github", url: "https://github.com", icon: "github" },
        { platform: "linkedin", url: "https://linkedin.com", icon: "linkedin" },
      ],
      copyright_text: `© ${new Date().getFullYear()} Brand. All rights reserved.`,
      show_newsletter: false,
      is_active: false,
    });
  };

  const handleSelectSetting = (setting: FooterSettings) => {
    setSelectedSetting(setting);
    setFormData(setting);
    setIsCreating(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Settings List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Footer Versions</CardTitle>
          <CardDescription>Manage different footer configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={handleCreateNew} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create New Footer
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
            {isCreating ? "Create New Footer" : selectedSetting ? "Edit Footer" : "No Footer Selected"}
          </CardTitle>
          <CardDescription>
            Configure footer logo, links, and social media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Footer Logo</Label>
            {formData.logo_url ? (
              <div className="relative rounded-lg overflow-hidden border p-4">
                <img
                  src={formData.logo_url}
                  alt="Footer Logo"
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
                  htmlFor="footer-logo-upload"
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
                      Upload Footer Logo
                    </>
                  )}
                </Label>
                <Input
                  id="footer-logo-upload"
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

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline (Optional)</Label>
            <Input
              id="tagline"
              value={formData.tagline || ""}
              onChange={(e) => handleInputChange("tagline", e.target.value)}
              placeholder="Building the future of web"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description about your company..."
              rows={2}
            />
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Social Media Links</Label>
              <Button size="sm" variant="outline" onClick={handleAddSocialLink}>
                <Plus className="w-4 h-4 mr-2" />
                Add Social Link
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.social_links || []).map((social, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 p-3 border rounded-lg">
                  <Input
                    placeholder="Platform"
                    value={social.platform}
                    onChange={(e) => handleUpdateSocialLink(index, "platform", e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={social.url}
                    onChange={(e) => handleUpdateSocialLink(index, "url", e.target.value)}
                    className="col-span-2"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveSocialLink(index)}
                    className="col-span-3"
                  >
                    <Trash2 className="w-4 h-4 text-destructive mr-2" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright Text */}
          <div className="space-y-2">
            <Label htmlFor="copyright_text">Copyright Text *</Label>
            <Input
              id="copyright_text"
              value={formData.copyright_text || ""}
              onChange={(e) => handleInputChange("copyright_text", e.target.value)}
              placeholder={`© ${new Date().getFullYear()} Brand. All rights reserved.`}
              required
            />
          </div>

          {/* Newsletter Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="show_newsletter">Show Newsletter Signup</Label>
              <p className="text-xs text-muted-foreground">
                Display newsletter subscription form in footer
              </p>
            </div>
            <Switch
              id="show_newsletter"
              checked={formData.show_newsletter || false}
              onCheckedChange={(checked) => handleInputChange("show_newsletter", checked)}
            />
          </div>

          {formData.show_newsletter && (
            <>
              <div className="space-y-2">
                <Label htmlFor="newsletter_title">Newsletter Title</Label>
                <Input
                  id="newsletter_title"
                  value={formData.newsletter_title || ""}
                  onChange={(e) => handleInputChange("newsletter_title", e.target.value)}
                  placeholder="Stay Updated"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter_description">Newsletter Description</Label>
                <Input
                  id="newsletter_description"
                  value={formData.newsletter_description || ""}
                  onChange={(e) => handleInputChange("newsletter_description", e.target.value)}
                  placeholder="Subscribe to our newsletter..."
                />
              </div>
            </>
          )}

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Set as Active Footer</Label>
              <p className="text-xs text-muted-foreground">
                Only one footer can be active at a time
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
                Save Footer Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
