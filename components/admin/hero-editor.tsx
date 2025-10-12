"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Upload, Loader2, Save, Plus, Trash2, Eye, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface HeroContent {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge_text?: string;
  background_image_url?: string;
  background_overlay_opacity: number;
  primary_cta_text?: string;
  primary_cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface HeroEditorProps {
  initialHeroEntries: HeroContent[];
}

export function HeroEditor({ initialHeroEntries }: HeroEditorProps) {
  const router = useRouter();
  const [heroEntries, setHeroEntries] = useState<HeroContent[]>(initialHeroEntries);
  const [selectedHero, setSelectedHero] = useState<HeroContent | null>(
    initialHeroEntries.find((h) => h.is_active) || initialHeroEntries[0] || null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<HeroContent>>(
    selectedHero || {
      title: "",
      subtitle: "",
      description: "",
      badge_text: "",
      background_image_url: "",
      background_overlay_opacity: 0.5,
      primary_cta_text: "",
      primary_cta_link: "",
      secondary_cta_text: "",
      secondary_cta_link: "",
      is_active: false,
    }
  );

  const handleInputChange = (field: keyof HeroContent, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("hero-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("hero-images").getPublicUrl(data.path);

      handleInputChange("background_image_url", publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!formData.background_image_url) return;

    const supabase = createClient();

    try {
      // Extract file path from URL
      const url = new URL(formData.background_image_url);
      const pathParts = url.pathname.split("/");
      const filePath = pathParts[pathParts.length - 1];

      // Delete from storage
      const { error } = await supabase.storage
        .from("hero-images")
        .remove([filePath]);

      if (error) throw error;

      handleInputChange("background_image_url", "");
      toast.success("Image removed successfully");
    } catch (error: any) {
      console.error("Error removing image:", error);
      toast.error(error.message || "Failed to remove image");
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      if (selectedHero) {
        // Update existing hero
        const { error } = await supabase
          .from("hero_content")
          .update(formData)
          .eq("id", selectedHero.id);

        if (error) throw error;

        setHeroEntries((prev) =>
          prev.map((h) => (h.id === selectedHero.id ? { ...h, ...formData } as HeroContent : h))
        );
        toast.success("Hero content updated successfully");
      } else {
        // Create new hero
        const { data, error } = await supabase
          .from("hero_content")
          .insert([formData])
          .select()
          .single();

        if (error) throw error;

        setHeroEntries((prev) => [data, ...prev]);
        setSelectedHero(data);
        setIsCreating(false);
        toast.success("Hero content created successfully");
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error saving hero content:", error);
      toast.error(error.message || "Failed to save hero content");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero content?")) return;

    const supabase = createClient();

    try {
      const { error } = await supabase.from("hero_content").delete().eq("id", id);

      if (error) throw error;

      setHeroEntries((prev) => prev.filter((h) => h.id !== id));
      if (selectedHero?.id === id) {
        const remaining = heroEntries.filter((h) => h.id !== id);
        setSelectedHero(remaining[0] || null);
        setFormData(remaining[0] || {
          title: "",
          subtitle: "",
          description: "",
          badge_text: "",
          background_image_url: "",
          background_overlay_opacity: 0.5,
          primary_cta_text: "",
          primary_cta_link: "",
          secondary_cta_text: "",
          secondary_cta_link: "",
          is_active: false,
        });
      }

      toast.success("Hero content deleted successfully");
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting hero content:", error);
      toast.error(error.message || "Failed to delete hero content");
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedHero(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      badge_text: "",
      background_image_url: "",
      background_overlay_opacity: 0.5,
      primary_cta_text: "",
      primary_cta_link: "",
      secondary_cta_text: "",
      secondary_cta_link: "",
      is_active: false,
    });
  };

  const handleSelectHero = (hero: HeroContent) => {
    setSelectedHero(hero);
    setFormData(hero);
    setIsCreating(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Hero List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Hero Versions</CardTitle>
          <CardDescription>Manage different hero content versions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={handleCreateNew} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create New Hero
          </Button>

          <div className="space-y-2 mt-4">
            {heroEntries.map((hero) => (
              <div
                key={hero.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedHero?.id === hero.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleSelectHero(hero)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{hero.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(hero.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hero.is_active && (
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
                        handleDelete(hero.id);
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

      {/* Hero Editor */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {isCreating ? "Create New Hero" : selectedHero ? "Edit Hero" : "No Hero Selected"}
          </CardTitle>
          <CardDescription>
            Configure the hero section content and appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Background Image */}
          <div className="space-y-2">
            <Label>Background Image</Label>
            {formData.background_image_url ? (
              <div className="relative rounded-lg overflow-hidden border">
                <img
                  src={formData.background_image_url}
                  alt="Hero background"
                  className="w-full h-48 object-cover"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <Label
                  htmlFor="image-upload"
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
                      Upload Background Image
                    </>
                  )}
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            )}
          </div>

          {/* Overlay Opacity */}
          {formData.background_image_url && (
            <div className="space-y-2">
              <Label>Background Overlay Opacity: {formData.background_overlay_opacity}</Label>
              <Slider
                value={[formData.background_overlay_opacity || 0.5]}
                onValueChange={(value) =>
                  handleInputChange("background_overlay_opacity", value[0])
                }
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Adjust the darkness of the overlay on the background image
              </p>
            </div>
          )}

          {/* Badge Text */}
          <div className="space-y-2">
            <Label htmlFor="badge_text">Badge Text (Optional)</Label>
            <Input
              id="badge_text"
              value={formData.badge_text || ""}
              onChange={(e) => handleInputChange("badge_text", e.target.value)}
              placeholder="e.g., Now available for new projects"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle (Optional)</Label>
            <Input
              id="subtitle"
              value={formData.subtitle || ""}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              placeholder="e.g., WELCOME TO OUR SITE"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Textarea
              id="title"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Build Stunning Websites That Convert"
              rows={2}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter hero description..."
              rows={3}
            />
          </div>

          {/* Primary CTA */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primary_cta_text">Primary CTA Text</Label>
              <Input
                id="primary_cta_text"
                value={formData.primary_cta_text || ""}
                onChange={(e) => handleInputChange("primary_cta_text", e.target.value)}
                placeholder="e.g., Get Started"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_cta_link">Primary CTA Link</Label>
              <Input
                id="primary_cta_link"
                value={formData.primary_cta_link || ""}
                onChange={(e) => handleInputChange("primary_cta_link", e.target.value)}
                placeholder="e.g., /contact"
              />
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="secondary_cta_text">Secondary CTA Text</Label>
              <Input
                id="secondary_cta_text"
                value={formData.secondary_cta_text || ""}
                onChange={(e) => handleInputChange("secondary_cta_text", e.target.value)}
                placeholder="e.g., View Services"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_cta_link">Secondary CTA Link</Label>
              <Input
                id="secondary_cta_link"
                value={formData.secondary_cta_link || ""}
                onChange={(e) => handleInputChange("secondary_cta_link", e.target.value)}
                placeholder="e.g., /services"
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Set as Active Hero</Label>
              <p className="text-xs text-muted-foreground">
                Only one hero can be active at a time
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
                Save Hero Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
