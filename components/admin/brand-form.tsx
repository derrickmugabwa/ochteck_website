"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2 } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  visible: boolean;
  order_index: number;
}

interface BrandFormProps {
  brand: Brand | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BrandForm({ brand, onClose, onSuccess }: BrandFormProps) {
  const [formData, setFormData] = useState({
    name: brand?.name || "",
    logo_url: brand?.logo_url || "",
    website_url: brand?.website_url || "",
    visible: brand?.visible ?? true,
    order_index: brand?.order_index || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (brand) {
        // Update existing brand
        const { error } = await supabase
          .from("brands")
          .update(formData)
          .eq("id", brand.id);
        if (error) throw error;
      } else {
        // Create new brand
        const { error } = await supabase.from("brands").insert([formData]);
        if (error) throw error;
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving brand:", error);
      alert("Failed to save brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB for logos)
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo size should be less than 2MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `brands/${fileName}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
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

      // Update form data with the uploaded logo URL
      setFormData({ ...formData, logo_url: publicUrl });
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {brand ? "Edit Brand" : "Add Brand"}
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
            <label className="text-sm font-medium">Brand Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Acme Corp"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Logo</label>
            
            {/* Logo Preview */}
            {formData.logo_url && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border bg-muted/30 flex items-center justify-center p-4">
                <img
                  src={formData.logo_url}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logo_url: "" })}
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
                      <span className="text-sm">Upload Logo</span>
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
              value={formData.logo_url}
              onChange={(e) =>
                setFormData({ ...formData, logo_url: e.target.value })
              }
              placeholder="https://example.com/logo.png"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Upload a logo or paste an external URL (max 2MB, transparent PNG recommended)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Website URL</label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) =>
                setFormData({ ...formData, website_url: e.target.value })
              }
              placeholder="https://example.com"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
              {isSubmitting ? "Saving..." : brand ? "Update" : "Create"}
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
