"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { createPolicy, updatePolicy } from "@/app/actions/policies";
import type { Policy } from "@/types/policies";

interface PolicyFormProps {
  policy: Policy | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Default SVG icons for quick selection
const DEFAULT_ICONS = [
  {
    name: "Shield Check",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  },
  {
    name: "File Text",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
  },
  {
    name: "Cookie",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 1 0 10 10"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="12" cy="16" r="1"/></svg>',
  },
  {
    name: "Lock",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  },
  {
    name: "Package",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>',
  },
  {
    name: "User Circle",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="3"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>',
  },
];

export function PolicyForm({ policy, onClose, onSuccess }: PolicyFormProps) {
  const [formData, setFormData] = useState({
    title: policy?.title || "",
    slug: policy?.slug || "",
    description: policy?.description || "",
    icon_svg: policy?.icon_svg || DEFAULT_ICONS[0].svg,
    purpose: policy?.purpose || "",
    scope: policy?.scope || "",
    responsibility: policy?.responsibility || "",
    order: policy?.order || 0,
    is_active: policy?.is_active ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSvgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('svg')) {
      setUploadError('Please upload an SVG file');
      return;
    }

    // Validate file size (max 100KB)
    if (file.size > 100 * 1024) {
      setUploadError('SVG file is too large (max 100KB)');
      return;
    }

    try {
      const text = await file.text();
      
      // Basic validation that it's SVG
      if (!text.trim().startsWith('<svg')) {
        setUploadError('Invalid SVG file');
        return;
      }

      setFormData({ ...formData, icon_svg: text });
      setUploadError(null);
    } catch (error) {
      console.error('Error reading SVG file:', error);
      setUploadError('Failed to read SVG file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = policy
        ? await updatePolicy(policy.id, formData)
        : await createPolicy(formData);

      if (result.success) {
        onSuccess();
      } else {
        alert(result.message || "Failed to save policy");
      }
    } catch (error) {
      console.error("Error saving policy:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {policy ? "Edit Policy" : "Add Policy"}
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Privacy Policy"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="privacy-policy (auto-generated from title if empty)"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly identifier. Leave empty to auto-generate from title.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
              placeholder="Brief description shown on the card..."
            />
            <p className="text-xs text-muted-foreground">
              This appears on the policy card (keep it concise)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Purpose</label>
            <textarea
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
              placeholder="Detailed explanation of the policy purpose..."
            />
            <p className="text-xs text-muted-foreground">
              Detailed purpose shown on the policy detail page
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Scope</label>
            <textarea
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
              placeholder="Scope and applicability of the policy..."
            />
            <p className="text-xs text-muted-foreground">
              Who and what this policy applies to
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Responsibility</label>
            <textarea
              value={formData.responsibility}
              onChange={(e) => setFormData({ ...formData, responsibility: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
              placeholder="Responsibilities and compliance requirements..."
            />
            <p className="text-xs text-muted-foreground">
              Responsibilities for both parties
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Icon SVG *</label>
            
            {/* Quick icon selection */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              {DEFAULT_ICONS.map((icon, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, icon_svg: icon.svg });
                    setUploadError(null);
                  }}
                  className={`p-3 border rounded-lg hover:bg-muted transition-colors ${
                    formData.icon_svg === icon.svg ? 'bg-primary/10 border-primary' : ''
                  }`}
                  title={icon.name}
                >
                  <div dangerouslySetInnerHTML={{ __html: icon.svg }} />
                </button>
              ))}
            </div>

            {/* SVG Upload Button */}
            <div className="mb-3">
              <label className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span className="text-sm font-medium">Upload SVG File</span>
                </div>
                <input
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleSvgUpload}
                  className="hidden"
                />
              </label>
              {uploadError && (
                <p className="text-xs text-red-500 mt-1">{uploadError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Or choose from presets above, or paste SVG code below
              </p>
            </div>

            {/* Custom SVG input */}
            <textarea
              required
              value={formData.icon_svg}
              onChange={(e) => {
                setFormData({ ...formData, icon_svg: e.target.value });
                setUploadError(null);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm min-h-[100px]"
              placeholder="<svg>...</svg>"
            />
            
            {/* SVG Preview */}
            <div className="mt-2 p-4 border rounded-lg bg-muted/30 flex items-center justify-center">
              <div className="w-12 h-12 text-primary">
                <div dangerouslySetInnerHTML={{ __html: formData.icon_svg }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={formData.is_active ? "active" : "inactive"}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "active" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
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
                policy ? "Update Policy" : "Create Policy"
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
