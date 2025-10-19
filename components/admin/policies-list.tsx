"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { PolicyForm } from "./policy-form";
import { PoliciesHeroForm } from "./policies-hero-form";
import { PoliciesSectionForm } from "./policies-section-form";
import { getAllPolicies, deletePolicy, reorderPolicies, togglePolicyStatus } from "@/app/actions/policies";
import { getPoliciesHero } from "@/app/actions/policies-hero";
import { getPoliciesSection } from "@/app/actions/policies-section";
import type { Policy, PoliciesHero, PoliciesSection } from "@/types/policies";

export function PoliciesList() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [hero, setHero] = useState<PoliciesHero | null>(null);
  const [section, setSection] = useState<PoliciesSection | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<Policy | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const [policiesData, heroData, sectionData] = await Promise.all([
      getAllPolicies(),
      getPoliciesHero(),
      getPoliciesSection(),
    ]);
    setPolicies(policiesData);
    setHero(heroData);
    setSection(sectionData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this policy?")) return;

    const result = await deletePolicy(id);
    if (result.success) {
      loadData();
    } else {
      alert(result.message || "Failed to delete policy");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await togglePolicyStatus(id, !currentStatus);
    if (result.success) {
      loadData();
    } else {
      alert(result.message || "Failed to update status");
    }
  };

  const handleDragStart = (policy: Policy) => {
    setDraggedItem(policy);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetPolicy: Policy) => {
    if (!draggedItem || draggedItem.id === targetPolicy.id) return;

    const reorderedPolicies = [...policies];
    const draggedIndex = reorderedPolicies.findIndex(p => p.id === draggedItem.id);
    const targetIndex = reorderedPolicies.findIndex(p => p.id === targetPolicy.id);

    // Remove dragged item and insert at target position
    reorderedPolicies.splice(draggedIndex, 1);
    reorderedPolicies.splice(targetIndex, 0, draggedItem);

    // Update order values
    const updates = reorderedPolicies.map((policy, index) => ({
      id: policy.id,
      order: index + 1,
    }));

    // Optimistically update UI
    setPolicies(reorderedPolicies);

    // Save to database
    const result = await reorderPolicies(updates);
    if (!result.success) {
      alert(result.message || "Failed to reorder policies");
      loadData(); // Reload on error
    }

    setDraggedItem(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section Management */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Hero Section</h2>
            <p className="text-sm text-muted-foreground">Manage the policies page hero section</p>
          </div>
          <Button onClick={() => setShowHeroForm(true)} disabled={!hero}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Hero
          </Button>
        </div>

        {hero && (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Title:</span> {hero.title}
            </div>
            <div>
              <span className="font-medium">Subtitle:</span> {hero.subtitle}
            </div>
            <div>
              <span className="font-medium">Description:</span> {hero.description}
            </div>
          </div>
        )}
      </div>

      {/* Section Header Management */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Section Header</h2>
            <p className="text-sm text-muted-foreground">Manage the policies section header content</p>
          </div>
          <Button onClick={() => setShowSectionForm(true)} disabled={!section}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Section
          </Button>
        </div>

        {section && (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Title:</span> {section.title}
            </div>
            <div>
              <span className="font-medium">Intro:</span> {section.intro}
            </div>
            <div>
              <span className="font-medium">Description:</span> {section.description}
            </div>
          </div>
        )}
      </div>

      {/* Policies List */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Policies</h2>
            <p className="text-sm text-muted-foreground">Manage policy cards (drag to reorder)</p>
          </div>
          <Button
            onClick={() => {
              setSelectedPolicy(null);
              setShowPolicyForm(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Policy
          </Button>
        </div>

        {policies.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No policies yet. Click &quot;Add Policy&quot; to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {policies.map((policy) => (
              <div
                key={policy.id}
                draggable
                onDragStart={() => handleDragStart(policy)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(policy)}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-move"
              >
                <GripVertical className="w-5 h-5 text-muted-foreground" />
                
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
                  <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: policy.icon_svg }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{policy.title}</h3>
                    {!policy.is_active && (
                      <span className="px-2 py-0.5 text-xs bg-muted rounded">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{policy.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(policy.id, policy.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      policy.is_active ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"
                    }`}
                    title={policy.is_active ? "Click to hide" : "Click to show"}
                    aria-label={policy.is_active ? "Hide policy" : "Show policy"}
                  >
                    {policy.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPolicy(policy);
                      setShowPolicyForm(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(policy.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forms */}
      {showPolicyForm && (
        <PolicyForm
          policy={selectedPolicy}
          onClose={() => {
            setShowPolicyForm(false);
            setSelectedPolicy(null);
          }}
          onSuccess={() => {
            setShowPolicyForm(false);
            setSelectedPolicy(null);
            loadData();
          }}
        />
      )}

      {showHeroForm && hero && (
        <PoliciesHeroForm
          hero={hero}
          onClose={() => setShowHeroForm(false)}
          onSuccess={() => {
            setShowHeroForm(false);
            loadData();
          }}
        />
      )}

      {showSectionForm && section && (
        <PoliciesSectionForm
          section={section}
          onClose={() => setShowSectionForm(false)}
          onSuccess={() => {
            setShowSectionForm(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
