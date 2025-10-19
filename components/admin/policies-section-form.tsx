"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { updatePoliciesSection } from "@/app/actions/policies-section";
import type { PoliciesSection } from "@/types/policies";

interface PoliciesSectionFormProps {
  section: PoliciesSection;
  onClose: () => void;
  onSuccess: () => void;
}

export function PoliciesSectionForm({ section, onClose, onSuccess }: PoliciesSectionFormProps) {
  const [formData, setFormData] = useState({
    title: section.title,
    intro: section.intro,
    description: section.description,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updatePoliciesSection(section.id, formData);
      
      if (result.success) {
        onSuccess();
      } else {
        alert(result.message || "Failed to update section header");
      }
    } catch (error) {
      console.error("Error updating section:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Section Header</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Section Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Our Commitments"
            />
            <p className="text-xs text-muted-foreground">
              Main heading for the policies section
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Section Intro *</label>
            <input
              type="text"
              required
              value={formData.intro}
              onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Clear and transparent policies"
            />
            <p className="text-xs text-muted-foreground">
              Brief tagline below the section title
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Section Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
              placeholder="We believe in transparency and building trust with our clients..."
            />
            <p className="text-xs text-muted-foreground">
              Detailed description shown below the intro
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
