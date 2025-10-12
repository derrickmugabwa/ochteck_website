"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  avatar_url: string | null;
  visible: boolean;
  order_index: number;
}

interface TestimonialFormProps {
  testimonial: Testimonial | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TestimonialForm({
  testimonial,
  onClose,
  onSuccess,
}: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    author: testimonial?.author || "",
    role: testimonial?.role || "",
    content: testimonial?.content || "",
    avatar_url: testimonial?.avatar_url || "",
    visible: testimonial?.visible ?? true,
    order_index: testimonial?.order_index || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (testimonial) {
        // Update existing testimonial
        const { error } = await supabase
          .from("testimonials")
          .update(formData)
          .eq("id", testimonial.id);
        if (error) throw error;
      } else {
        // Create new testimonial
        const { error } = await supabase.from("testimonials").insert([formData]);
        if (error) throw error;
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Failed to save testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {testimonial ? "Edit Testimonial" : "Add Testimonial"}
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
            <label className="text-sm font-medium">Author Name *</label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Role/Title *</label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Testimonial Content *</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={6}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Avatar URL (optional)</label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={(e) =>
                setFormData({ ...formData, avatar_url: e.target.value })
              }
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
              {isSubmitting ? "Saving..." : testimonial ? "Update" : "Create"}
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
