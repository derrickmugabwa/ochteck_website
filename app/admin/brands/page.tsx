"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";
import { BrandForm } from "@/components/admin/brand-form";

interface Brand {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  visible: boolean;
  order_index: number;
}

interface BrandsSection {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
}

export default function BrandsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [sectionData, setSectionData] = useState<Partial<BrandsSection>>({});
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: brands, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("order_index");
      if (error) throw error;
      return data as Brand[];
    },
  });

  // Fetch brands section
  const { data: brandsSection } = useQuery({
    queryKey: ["brands-section"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands_section")
        .select("*")
        .eq("is_active", true)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) setSectionData(data);
      return data as BrandsSection | null;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("brands").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });

  // Save section mutation
  const saveSectionMutation = useMutation({
    mutationFn: async () => {
      if (brandsSection?.id) {
        const { error } = await supabase
          .from("brands_section")
          .update(sectionData)
          .eq("id", brandsSection.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("brands_section")
          .insert([{ ...sectionData, is_active: true }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands-section"] });
      alert("Section content saved!");
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, visible }: { id: string; visible: boolean }) => {
      const { error } = await supabase
        .from("brands")
        .update({ visible: !visible })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingBrand(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBrand(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands & Partners</h1>
          <p className="text-muted-foreground mt-2">
            Manage client logos and partner brands
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {/* Section Content */}
      <Card>
        <CardHeader>
          <CardTitle>Section Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Section Title</label>
            <input
              type="text"
              value={sectionData.title || ""}
              onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Trusted by Leading Brands"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Section Description</label>
            <textarea
              value={sectionData.description || ""}
              onChange={(e) => setSectionData({ ...sectionData, description: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              rows={2}
              placeholder="Proud to work with amazing clients and partners"
            />
          </div>

          <Button onClick={() => saveSectionMutation.mutate()}>
            <Save className="w-4 h-4 mr-2" />
            Save Section Content
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brands?.map((brand) => (
            <Card key={brand.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="text-lg">{brand.name}</span>
                  {brand.visible ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo Preview */}
                <div className="w-full h-24 border rounded-lg flex items-center justify-center bg-muted/30 p-4">
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(brand)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toggleVisibilityMutation.mutate({
                        id: brand.id,
                        visible: brand.visible,
                      })
                    }
                  >
                    {brand.visible ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this brand?")) {
                        deleteMutation.mutate(brand.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <BrandForm
          brand={editingBrand}
          onClose={handleCloseForm}
          onSuccess={() => {
            handleCloseForm();
            queryClient.invalidateQueries({ queryKey: ["brands"] });
          }}
        />
      )}
    </div>
  );
}
