"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Plus, Trash2, Upload, Loader2 } from "lucide-react";

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon_name?: string;
  features?: string[];
  gradient?: string;
  image_path?: string;
  visible: boolean;
  order_index: number;
}

interface ServiceFormProps {
  service: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ServiceForm({ service, onClose, onSuccess }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    title: service?.title || "",
    slug: service?.slug || "",
    short_description: service?.short_description || "",
    full_description: service?.full_description || "",
    icon_name: service?.icon_name || "Briefcase",
    features: service?.features || [],
    gradient: service?.gradient || "from-blue-600/20 to-cyan-600/20",
    image_path: service?.image_path || "",
    visible: service?.visible ?? true,
    order_index: service?.order_index || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (service) {
        // Update existing service
        const { error } = await supabase
          .from("services")
          .update(formData)
          .eq("id", service.id);
        if (error) throw error;
      } else {
        // Create new service
        const { error } = await supabase.from("services").insert([formData]);
        if (error) throw error;
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `services/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Update form data with the uploaded image URL
      setFormData({ ...formData, image_path: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {service ? "Edit Service" : "Add Service"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  title: e.target.value,
                  slug: generateSlug(e.target.value),
                });
              }}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Slug *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description *</label>
            <textarea
              required
              value={formData.short_description}
              onChange={(e) =>
                setFormData({ ...formData, short_description: e.target.value })
              }
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Full Description</label>
            <textarea
              value={formData.full_description}
              onChange={(e) =>
                setFormData({ ...formData, full_description: e.target.value })
              }
              rows={6}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Icon Name</label>
            <input
              type="text"
              value={formData.icon_name}
              onChange={(e) =>
                setFormData({ ...formData, icon_name: e.target.value })
              }
              placeholder="Code2, Palette, Sparkles, etc."
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Use any Lucide icon name (e.g., Code2, Palette, Database)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Service Image</label>
            
            {/* Image Preview */}
            {formData.image_path && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${formData.image_path})` }}
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_path: "" })}
                  className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <div className="w-full border-2 border-dashed rounded-lg px-4 py-3 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Image</span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Or URL Input */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">or paste URL</span>
              </div>
            </div>

            <input
              type="text"
              value={formData.image_path}
              onChange={(e) =>
                setFormData({ ...formData, image_path: e.target.value })
              }
              placeholder="https://images.unsplash.com/..."
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Upload an image or paste an external URL (max 5MB)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gradient Classes</label>
            <input
              type="text"
              value={formData.gradient}
              onChange={(e) =>
                setFormData({ ...formData, gradient: e.target.value })
              }
              placeholder="from-blue-600/20 to-cyan-600/20"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Tailwind gradient classes for card overlay
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Features</label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  setFormData({
                    ...formData,
                    features: [...formData.features, ""],
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Feature
              </Button>
            </div>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...formData.features];
                    newFeatures[index] = e.target.value;
                    setFormData({ ...formData, features: newFeatures });
                  }}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newFeatures = formData.features.filter(
                      (_, i) => i !== index
                    );
                    setFormData({ ...formData, features: newFeatures });
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Order Index</label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order_index: parseInt(e.target.value),
                })
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="visible"
              checked={formData.visible}
              onChange={(e) =>
                setFormData({ ...formData, visible: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="visible" className="text-sm font-medium">
              Visible on website
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : service ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
