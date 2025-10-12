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

interface MissionCard {
  icon: string;
  title: string;
  description: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface HeroData {
  id: string;
  badge: string;
  subtitle: string;
  title: string;
  description: string;
  is_active: boolean;
}

interface MissionData {
  id: string;
  section_title: string;
  mission_cards: MissionCard[];
  is_active: boolean;
}

interface ValuesData {
  id: string;
  section_title: string;
  section_intro: string;
  values: Value[];
  is_active: boolean;
}

interface TimelineData {
  id: string;
  section_title: string;
  section_intro: string;
  milestones: Milestone[];
  is_active: boolean;
}

interface AboutEditorProps {
  initialHero: HeroData[];
  initialMission: MissionData[];
  initialValues: ValuesData[];
  initialTimeline: TimelineData[];
}

export function AboutEditor({ initialHero, initialMission, initialValues, initialTimeline }: AboutEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Hero state
  const [heroData, setHeroData] = useState<HeroData>(
    initialHero.find((h) => h.is_active) || initialHero[0] || {
      id: "",
      badge: "Our Story",
      subtitle: "About Us",
      title: "Building the Future of Web Experiences",
      description: "",
      is_active: false,
    }
  );

  // Mission state
  const [missionData, setMissionData] = useState<MissionData>(
    initialMission.find((m) => m.is_active) || initialMission[0] || {
      id: "",
      section_title: "Our Mission",
      mission_cards: [],
      is_active: false,
    }
  );

  // Values state
  const [valuesData, setValuesData] = useState<ValuesData>(
    initialValues.find((v) => v.is_active) || initialValues[0] || {
      id: "",
      section_title: "Our Values",
      section_intro: "The principles that guide everything we do",
      values: [],
      is_active: false,
    }
  );

  // Timeline state
  const [timelineData, setTimelineData] = useState<TimelineData>(
    initialTimeline.find((t) => t.is_active) || initialTimeline[0] || {
      id: "",
      section_title: "Our Journey",
      section_intro: "From concept to industry leader",
      milestones: [],
      is_active: false,
    }
  );

  const handleSaveHero = async () => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      if (heroData.id) {
        const { error } = await supabase
          .from("about_hero")
          .update({
            badge: heroData.badge,
            subtitle: heroData.subtitle,
            title: heroData.title,
            description: heroData.description,
            is_active: heroData.is_active,
          })
          .eq("id", heroData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("about_hero").insert([heroData]);
        if (error) throw error;
      }

      toast.success("Hero section updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save hero");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMission = async () => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      if (missionData.id) {
        const { error } = await supabase
          .from("about_mission")
          .update({
            section_title: missionData.section_title,
            mission_cards: missionData.mission_cards,
            is_active: missionData.is_active,
          })
          .eq("id", missionData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("about_mission").insert([missionData]);
        if (error) throw error;
      }

      toast.success("Mission section updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save mission");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveValues = async () => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      if (valuesData.id) {
        const { error } = await supabase
          .from("about_values")
          .update({
            section_title: valuesData.section_title,
            section_intro: valuesData.section_intro,
            values: valuesData.values,
            is_active: valuesData.is_active,
          })
          .eq("id", valuesData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("about_values").insert([valuesData]);
        if (error) throw error;
      }

      toast.success("Values section updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save values");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTimeline = async () => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      if (timelineData.id) {
        const { error } = await supabase
          .from("about_timeline")
          .update({
            section_title: timelineData.section_title,
            section_intro: timelineData.section_intro,
            milestones: timelineData.milestones,
            is_active: timelineData.is_active,
          })
          .eq("id", timelineData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("about_timeline").insert([timelineData]);
        if (error) throw error;
      }

      toast.success("Timeline section updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save timeline");
    } finally {
      setIsSaving(false);
    }
  };

  // Mission card helpers
  const addMissionCard = () => {
    setMissionData({
      ...missionData,
      mission_cards: [...missionData.mission_cards, { icon: "Target", title: "", description: "" }],
    });
  };

  const removeMissionCard = (index: number) => {
    setMissionData({
      ...missionData,
      mission_cards: missionData.mission_cards.filter((_, i) => i !== index),
    });
  };

  const updateMissionCard = (index: number, field: keyof MissionCard, value: string) => {
    const newCards = [...missionData.mission_cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setMissionData({ ...missionData, mission_cards: newCards });
  };

  // Value helpers
  const addValue = () => {
    setValuesData({
      ...valuesData,
      values: [...valuesData.values, { icon: "Sparkles", title: "", description: "" }],
    });
  };

  const removeValue = (index: number) => {
    setValuesData({
      ...valuesData,
      values: valuesData.values.filter((_, i) => i !== index),
    });
  };

  const updateValue = (index: number, field: keyof Value, value: string) => {
    const newValues = [...valuesData.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setValuesData({ ...valuesData, values: newValues });
  };

  // Milestone helpers
  const addMilestone = () => {
    setTimelineData({
      ...timelineData,
      milestones: [...timelineData.milestones, { year: "", title: "", description: "" }],
    });
  };

  const removeMilestone = (index: number) => {
    setTimelineData({
      ...timelineData,
      milestones: timelineData.milestones.filter((_, i) => i !== index),
    });
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const newMilestones = [...timelineData.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setTimelineData({ ...timelineData, milestones: newMilestones });
  };

  return (
    <Tabs defaultValue="hero" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="hero">Hero</TabsTrigger>
        <TabsTrigger value="mission">Mission</TabsTrigger>
        <TabsTrigger value="values">Values</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>

      {/* Hero Tab */}
      <TabsContent value="hero">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Manage the about page hero content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hero-badge">Badge</Label>
              <Input
                id="hero-badge"
                value={heroData.badge}
                onChange={(e) => setHeroData({ ...heroData, badge: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
                value={heroData.description}
                onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label>Set as Active</Label>
                <p className="text-xs text-muted-foreground">Display this version on about page</p>
              </div>
              <Switch
                checked={heroData.is_active}
                onCheckedChange={(checked) => setHeroData({ ...heroData, is_active: checked })}
              />
            </div>

            <Button onClick={handleSaveHero} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Hero Section
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Mission Tab */}
      <TabsContent value="mission">
        <Card>
          <CardHeader>
            <CardTitle>Mission Section</CardTitle>
            <CardDescription>Manage mission cards (What We Do, Why We Do It)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mission-title">Section Title</Label>
              <Input
                id="mission-title"
                value={missionData.section_title}
                onChange={(e) => setMissionData({ ...missionData, section_title: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Mission Cards</Label>
                <Button size="sm" onClick={addMissionCard} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </Button>
              </div>

              {missionData.mission_cards.map((card, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Card {index + 1}</Label>
                      <Button size="sm" variant="ghost" onClick={() => removeMissionCard(index)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={card.title}
                          onChange={(e) => updateMissionCard(index, "title", e.target.value)}
                          placeholder="What We Do"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon Name</Label>
                        <Input
                          value={card.icon}
                          onChange={(e) => updateMissionCard(index, "icon", e.target.value)}
                          placeholder="Target"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={card.description}
                        onChange={(e) => updateMissionCard(index, "description", e.target.value)}
                        placeholder="We craft high-performance websites..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label>Set as Active</Label>
                <p className="text-xs text-muted-foreground">Display this version on about page</p>
              </div>
              <Switch
                checked={missionData.is_active}
                onCheckedChange={(checked) => setMissionData({ ...missionData, is_active: checked })}
              />
            </div>

            <Button onClick={handleSaveMission} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Mission Section
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Values Tab */}
      <TabsContent value="values">
        <Card>
          <CardHeader>
            <CardTitle>Values Section</CardTitle>
            <CardDescription>Manage core values</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="values-title">Section Title</Label>
              <Input
                id="values-title"
                value={valuesData.section_title}
                onChange={(e) => setValuesData({ ...valuesData, section_title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="values-intro">Section Intro</Label>
              <Input
                id="values-intro"
                value={valuesData.section_intro}
                onChange={(e) => setValuesData({ ...valuesData, section_intro: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Values</Label>
                <Button size="sm" onClick={addValue} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Value
                </Button>
              </div>

              {valuesData.values.map((value, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Value {index + 1}</Label>
                      <Button size="sm" variant="ghost" onClick={() => removeValue(index)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={value.title}
                          onChange={(e) => updateValue(index, "title", e.target.value)}
                          placeholder="Craftsmanship"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon Name</Label>
                        <Input
                          value={value.icon}
                          onChange={(e) => updateValue(index, "icon", e.target.value)}
                          placeholder="Code"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={value.description}
                        onChange={(e) => updateValue(index, "description", e.target.value)}
                        placeholder="Quality code, thoughtful design..."
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
                <p className="text-xs text-muted-foreground">Display this version on about page</p>
              </div>
              <Switch
                checked={valuesData.is_active}
                onCheckedChange={(checked) => setValuesData({ ...valuesData, is_active: checked })}
              />
            </div>

            <Button onClick={handleSaveValues} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Values Section
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Timeline Tab */}
      <TabsContent value="timeline">
        <Card>
          <CardHeader>
            <CardTitle>Timeline Section</CardTitle>
            <CardDescription>Manage company journey milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="timeline-title">Section Title</Label>
              <Input
                id="timeline-title"
                value={timelineData.section_title}
                onChange={(e) => setTimelineData({ ...timelineData, section_title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline-intro">Section Intro</Label>
              <Input
                id="timeline-intro"
                value={timelineData.section_intro}
                onChange={(e) => setTimelineData({ ...timelineData, section_intro: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Milestones</Label>
                <Button size="sm" onClick={addMilestone} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              </div>

              {timelineData.milestones.map((milestone, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Milestone {index + 1}</Label>
                      <Button size="sm" variant="ghost" onClick={() => removeMilestone(index)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          value={milestone.year}
                          onChange={(e) => updateMilestone(index, "year", e.target.value)}
                          placeholder="2024"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, "title", e.target.value)}
                          placeholder="The Beginning"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={milestone.description}
                        onChange={(e) => updateMilestone(index, "description", e.target.value)}
                        placeholder="Started with a vision..."
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
                <p className="text-xs text-muted-foreground">Display this version on about page</p>
              </div>
              <Switch
                checked={timelineData.is_active}
                onCheckedChange={(checked) => setTimelineData({ ...timelineData, is_active: checked })}
              />
            </div>

            <Button onClick={handleSaveTimeline} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Timeline Section
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
