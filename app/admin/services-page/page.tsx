"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";

interface ProcessStep {
  id: string;
  step_number: string;
  title: string;
  description: string;
  order_index: number;
  visible: boolean;
}

interface ServicesCTA {
  id: string;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  is_active: boolean;
}

export default function ServicesPageAdmin() {
  const [newStep, setNewStep] = useState<Partial<ProcessStep>>({
    step_number: "",
    title: "",
    description: "",
    order_index: 0,
    visible: true,
  });
  const [ctaData, setCtaData] = useState<Partial<ServicesCTA>>({});
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch process steps
  const { data: processSteps } = useQuery({
    queryKey: ["services-process-steps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services_process_steps")
        .select("*")
        .order("order_index");
      if (error) throw error;
      return data as ProcessStep[];
    },
  });

  // Fetch CTA
  const { data: cta } = useQuery({
    queryKey: ["services-page-cta"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services_page_cta")
        .select("*")
        .eq("is_active", true)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) setCtaData(data);
      return data as ServicesCTA | null;
    },
  });

  // Save CTA mutation
  const saveCtaMutation = useMutation({
    mutationFn: async () => {
      if (cta?.id) {
        const { error } = await supabase
          .from("services_page_cta")
          .update(ctaData)
          .eq("id", cta.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("services_page_cta")
          .insert([{ ...ctaData, is_active: true }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-page-cta"] });
      alert("CTA saved successfully!");
    },
  });

  // Add/Update step mutation
  const saveStepMutation = useMutation({
    mutationFn: async (step: Partial<ProcessStep>) => {
      if (step.id) {
        const { error } = await supabase
          .from("services_process_steps")
          .update(step)
          .eq("id", step.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("services_process_steps")
          .insert([step]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-process-steps"] });
      setNewStep({
        step_number: "",
        title: "",
        description: "",
        order_index: 0,
        visible: true,
      });
    },
  });

  // Delete step mutation
  const deleteStepMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("services_process_steps")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-process-steps"] });
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, visible }: { id: string; visible: boolean }) => {
      const { error } = await supabase
        .from("services_process_steps")
        .update({ visible: !visible })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-process-steps"] });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Services Page Content</h1>
        <p className="text-muted-foreground mt-2">
          Manage process steps and call-to-action section
        </p>
      </div>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call-to-Action Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={ctaData.title || ""}
              onChange={(e) => setCtaData({ ...ctaData, title: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Ready to Get Started?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={ctaData.description || ""}
              onChange={(e) => setCtaData({ ...ctaData, description: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              rows={3}
              placeholder="Let's discuss your project..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Text</label>
              <input
                type="text"
                value={ctaData.button_text || ""}
                onChange={(e) => setCtaData({ ...ctaData, button_text: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Contact Us Today"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Button Link</label>
              <input
                type="text"
                value={ctaData.button_link || ""}
                onChange={(e) => setCtaData({ ...ctaData, button_link: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="/contact"
              />
            </div>
          </div>

          <Button onClick={() => saveCtaMutation.mutate()}>
            <Save className="w-4 h-4 mr-2" />
            Save CTA
          </Button>
        </CardContent>
      </Card>

      {/* Process Steps Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Process Steps</h2>
        </div>

        {/* Add New Step Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Step</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Step Number</label>
                <input
                  type="text"
                  value={newStep.step_number || ""}
                  onChange={(e) => setNewStep({ ...newStep, step_number: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="01"
                />
              </div>

              <div className="space-y-2 col-span-3">
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={newStep.title || ""}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Discovery"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={newStep.description || ""}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                rows={2}
                placeholder="We learn about your goals..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Order Index</label>
              <input
                type="number"
                value={newStep.order_index || 0}
                onChange={(e) => setNewStep({ ...newStep, order_index: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <Button onClick={() => saveStepMutation.mutate(newStep)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </CardContent>
        </Card>

        {/* Existing Steps */}
        <div className="grid gap-4 md:grid-cols-2">
          {processSteps?.map((step) => (
            <Card key={step.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="text-lg">
                    {step.step_number}. {step.title}
                  </span>
                  {step.visible ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{step.description}</p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toggleVisibilityMutation.mutate({
                        id: step.id,
                        visible: step.visible,
                      })
                    }
                  >
                    {step.visible ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this step?")) {
                        deleteStepMutation.mutate(step.id);
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
      </div>
    </div>
  );
}
