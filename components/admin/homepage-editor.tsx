"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Service {
  title: string;
  description: string;
  image: string;
}

interface FeaturesData {
  id: string;
  section_title: string;
  section_heading: string;
  section_description: string;
  features: Feature[];
  is_active: boolean;
}

interface ServicesData {
  id: string;
  section_title: string;
  section_heading: string;
  section_description: string;
  services: Service[];
  is_active: boolean;
}

interface CtaData {
  id: string;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  is_active: boolean;
}

interface TestimonialsData {
  id: string;
  badge_text: string;
  section_heading: string;
  section_description: string;
  is_active: boolean;
}

interface HomepageEditorProps {
  initialFeatures: FeaturesData[];
  initialServices: ServicesData[];
  initialCta: CtaData[];
  initialTestimonials: TestimonialsData[];
}

export function HomepageEditor({ initialFeatures, initialServices, initialCta, initialTestimonials }: HomepageEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Features state
  const [featuresData, setFeaturesData] = useState<FeaturesData>(
    initialFeatures.find((f) => f.is_active) || initialFeatures[0] || {
      id: "",
      section_title: "Why Choose Us",
      section_heading: "Built for Performance, Designed for Delight",
      section_description: "Everything you need to create stunning, high-performance websites",
      features: [],
      is_active: false,
    }
  );

  // Services state
  const [servicesData, setServicesData] = useState<ServicesData>(
    initialServices.find((s) => s.is_active) || initialServices[0] || {
      id: "",
      section_title: "Our Services",
      section_heading: "Everything You Need to Build & Scale",
      section_description: "From design systems to data-driven web applications",
      services: [],
      is_active: false,
    }
  );

  // CTA state
  const [ctaData, setCtaData] = useState<CtaData>(
    initialCta.find((c) => c.is_active) || initialCta[0] || {
      id: "",
      title: "Ready to Get Started?",
      description: "Let's build something amazing together",
      button_text: "Get Started",
      button_link: "/contact",
      is_active: false,
    }
  );

  // Testimonials state
  const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(
    initialTestimonials.find((t) => t.is_active) || initialTestimonials[0] || {
      id: "",
      badge_text: "Testimonials",
      section_heading: "Loved by Innovative Teams",
      section_description: "See what our clients say about working with us",
      is_active: false,
    }
  );

  const handleSaveFeatures = async () => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      if (featuresData.id) {
        const { error } = await supabase
          .from("homepage_features")
          .update({
            section_title: featuresData.section_title,
            section_heading: featuresData.section_heading,
            section_description: featuresData.section_description,
            features: featuresData.features,
            is_active: featuresData.is_active,
          })
          .eq("id", featuresData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("homepage_features").insert([featuresData]);
        if (error) throw error;
      }

      toast.success("Features section updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save features");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveServices = async () => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      if (servicesData.id) {
        const { error } = await supabase
          .from("homepage_services")
          .update({
            section_title: servicesData.section_title,
            section_heading: servicesData.section_heading,
            section_description: servicesData.section_description,
            services: servicesData.services,
            is_active: servicesData.is_active,
          })
          .eq("id", servicesData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("homepage_services").insert([servicesData]);
        if (error) throw error;
      }

      toast.success("Services section updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save services");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCta = async () => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      if (ctaData.id) {
        const { error } = await supabase
          .from("homepage_cta")
          .update({
            title: ctaData.title,
            description: ctaData.description,
            button_text: ctaData.button_text,
            button_link: ctaData.button_link,
            is_active: ctaData.is_active,
          })
          .eq("id", ctaData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("homepage_cta").insert([ctaData]);
        if (error) throw error;
      }

      toast.success("CTA section updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save CTA");
    } finally {
      setIsSaving(false);
    }
  };

  const addFeature = () => {
    setFeaturesData({
      ...featuresData,
      features: [...featuresData.features, { title: "", description: "", icon: "Sparkles" }],
    });
  };

  const removeFeature = (index: number) => {
    setFeaturesData({
      ...featuresData,
      features: featuresData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...featuresData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeaturesData({ ...featuresData, features: newFeatures });
  };

  const addService = () => {
    setServicesData({
      ...servicesData,
      services: [...servicesData.services, { title: "", description: "", image: "" }],
    });
  };

  const removeService = (index: number) => {
    setServicesData({
      ...servicesData,
      services: servicesData.services.filter((_, i) => i !== index),
    });
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const newServices = [...servicesData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setServicesData({ ...servicesData, services: newServices });
  };

  const handleSaveTestimonials = async () => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      if (testimonialsData.id) {
        const { error } = await supabase
          .from("homepage_testimonials_section")
          .update({
            badge_text: testimonialsData.badge_text,
            section_heading: testimonialsData.section_heading,
            section_description: testimonialsData.section_description,
            is_active: testimonialsData.is_active,
          })
          .eq("id", testimonialsData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("homepage_testimonials_section")
          .insert([{
            badge_text: testimonialsData.badge_text,
            section_heading: testimonialsData.section_heading,
            section_description: testimonialsData.section_description,
            is_active: true,
          }]);

        if (error) throw error;
      }

      toast.success("Testimonials section saved successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error saving testimonials section:", error);
      toast.error("Failed to save testimonials section");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Tabs defaultValue="features" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        <TabsTrigger value="cta">CTA</TabsTrigger>
      </TabsList>

      {/* Features Tab */}
      <TabsContent value="features">
        <Card>
          <CardHeader>
            <CardTitle>Features Section</CardTitle>
            <CardDescription>Manage the &ldquo;Why Choose Us&rdquo; section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="features-title">Section Title</Label>
              <Input
                id="features-title"
                value={featuresData.section_title}
                onChange={(e) => setFeaturesData({ ...featuresData, section_title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features-heading">Section Heading</Label>
              <Input
                id="features-heading"
                value={featuresData.section_heading}
                onChange={(e) => setFeaturesData({ ...featuresData, section_heading: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features-description">Section Description</Label>
              <Textarea
                id="features-description"
                value={featuresData.section_description}
                onChange={(e) => setFeaturesData({ ...featuresData, section_description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Feature Cards</Label>
                <Button size="sm" onClick={addFeature} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              {featuresData.features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Feature {index + 1}</Label>
                      <Button size="sm" variant="ghost" onClick={() => removeFeature(index)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => updateFeature(index, "title", e.target.value)}
                          placeholder="Lightning Fast"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon Name</Label>
                        <Input
                          value={feature.icon}
                          onChange={(e) => updateFeature(index, "icon", e.target.value)}
                          placeholder="Zap"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(index, "description", e.target.value)}
                        placeholder="Server Components and smart caching..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label>Set as Active</Label>
                <p className="text-xs text-muted-foreground">Display this version on homepage</p>
              </div>
              <Switch
                checked={featuresData.is_active}
                onCheckedChange={(checked) => setFeaturesData({ ...featuresData, is_active: checked })}
              />
            </div>

            <Button onClick={handleSaveFeatures} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Features Section
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Services Tab */}
      <TabsContent value="services">
        <Card>
          <CardHeader>
            <CardTitle>Services Section</CardTitle>
            <CardDescription>Manage the services showcase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="services-title">Section Title</Label>
              <Input
                id="services-title"
                value={servicesData.section_title}
                onChange={(e) => setServicesData({ ...servicesData, section_title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="services-heading">Section Heading</Label>
              <Input
                id="services-heading"
                value={servicesData.section_heading}
                onChange={(e) => setServicesData({ ...servicesData, section_heading: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="services-description">Section Description</Label>
              <Textarea
                id="services-description"
                value={servicesData.section_description}
                onChange={(e) => setServicesData({ ...servicesData, section_description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Service Cards</Label>
                <Button size="sm" onClick={addService} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>

              {servicesData.services.map((service, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Service {index + 1}</Label>
                      <Button size="sm" variant="ghost" onClick={() => removeService(index)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(index, "title", e.target.value)}
                        placeholder="Web Development"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={service.description}
                        onChange={(e) => updateService(index, "description", e.target.value)}
                        placeholder="Next.js, React, and TypeScript..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={service.image}
                        onChange={(e) => updateService(index, "image", e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label>Set as Active</Label>
                <p className="text-xs text-muted-foreground">Display this version on homepage</p>
              </div>
              <Switch
                checked={servicesData.is_active}
                onCheckedChange={(checked) => setServicesData({ ...servicesData, is_active: checked })}
              />
            </div>

            <Button onClick={handleSaveServices} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Services Section
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Testimonials Tab */}
      <TabsContent value="testimonials">
        <Card>
          <CardHeader>
            <CardTitle>Testimonials Section</CardTitle>
            <CardDescription>Manage the testimonials section header</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="testimonials-badge">Badge Text</Label>
              <Input
                id="testimonials-badge"
                value={testimonialsData.badge_text}
                onChange={(e) => setTestimonialsData({ ...testimonialsData, badge_text: e.target.value })}
                placeholder="Testimonials"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonials-heading">Section Heading</Label>
              <Input
                id="testimonials-heading"
                value={testimonialsData.section_heading}
                onChange={(e) => setTestimonialsData({ ...testimonialsData, section_heading: e.target.value })}
                placeholder="Loved by Innovative Teams"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonials-description">Section Description</Label>
              <Textarea
                id="testimonials-description"
                value={testimonialsData.section_description}
                onChange={(e) => setTestimonialsData({ ...testimonialsData, section_description: e.target.value })}
                placeholder="See what our clients say about working with us"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label>Set as Active</Label>
                <p className="text-xs text-muted-foreground">Display this version on homepage</p>
              </div>
              <Switch
                checked={testimonialsData.is_active}
                onCheckedChange={(checked) => setTestimonialsData({ ...testimonialsData, is_active: checked })}
              />
            </div>

            <Button onClick={handleSaveTestimonials} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Testimonials Section
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* CTA Tab */}
      <TabsContent value="cta">
        <Card>
          <CardHeader>
            <CardTitle>Call-to-Action Section</CardTitle>
            <CardDescription>Manage the bottom CTA section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cta-title">Title</Label>
              <Input
                id="cta-title"
                value={ctaData.title}
                onChange={(e) => setCtaData({ ...ctaData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta-description">Description</Label>
              <Textarea
                id="cta-description"
                value={ctaData.description}
                onChange={(e) => setCtaData({ ...ctaData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cta-button-text">Button Text</Label>
                <Input
                  id="cta-button-text"
                  value={ctaData.button_text}
                  onChange={(e) => setCtaData({ ...ctaData, button_text: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-button-link">Button Link</Label>
                <Input
                  id="cta-button-link"
                  value={ctaData.button_link}
                  onChange={(e) => setCtaData({ ...ctaData, button_link: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label>Set as Active</Label>
                <p className="text-xs text-muted-foreground">Display this version on homepage</p>
              </div>
              <Switch
                checked={ctaData.is_active}
                onCheckedChange={(checked) => setCtaData({ ...ctaData, is_active: checked })}
              />
            </div>

            <Button onClick={handleSaveCta} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save CTA Section
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
