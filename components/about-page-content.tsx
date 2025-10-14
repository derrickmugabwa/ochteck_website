"use client";

import { Section } from "@/components/section";
import { AnimateIn } from "@/components/animate-in";
import { PageHero } from "@/components/page-hero";
import * as Icons from "lucide-react";
import { Sparkles, LucideIcon } from "lucide-react";

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
  badge: string;
  subtitle: string;
  title: string;
  description: string;
}

interface MissionData {
  section_title: string;
  mission_cards: MissionCard[];
}

interface ValuesData {
  section_title: string;
  section_intro: string;
  values: Value[];
}

interface TimelineData {
  section_title: string;
  section_intro: string;
  milestones: Milestone[];
}

interface AboutPageContentProps {
  hero: HeroData | null;
  mission: MissionData | null;
  values: ValuesData | null;
  timeline: TimelineData | null;
}

// Helper to get icon component from string name
const getIcon = (iconName: string): LucideIcon => {
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[iconName];
  return IconComponent || Sparkles;
};

export function AboutPageContent({ hero, mission, values, timeline }: AboutPageContentProps) {
  return (
    <>
      {/* Hero Section */}
      {hero && (
        <PageHero
          subtitle={hero.subtitle}
          title={hero.title}
          description={hero.description}
          badge={hero.badge}
          icon={<Sparkles className="w-4 h-4 text-primary" />}
        />
      )}

      <div className="mx-auto w-full max-w-7xl px-5 py-20 flex flex-col gap-20">
        {/* Mission Section */}
        {mission && mission.mission_cards.length > 0 && (
          <Section title={mission.section_title}>
            <div className="grid gap-8 md:grid-cols-2">
              {mission.mission_cards.map((card, index) => {
                const IconComponent = getIcon(card.icon);
                return (
                  <AnimateIn key={index} delay={index * 0.1}>
                    <div className="rounded-xl border bg-card p-8 hover:shadow-lg transition-all">
                      <IconComponent className="w-10 h-10 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{card.description}</p>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </Section>
        )}

        {/* Values Section */}
        {values && values.values.length > 0 && (
          <Section title={values.section_title} intro={values.section_intro}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.values.map((value, i) => {
                const IconComponent = getIcon(value.icon);
                return (
                  <AnimateIn key={value.title} delay={i * 0.08}>
                    <div className="group rounded-xl border bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </Section>
        )}

        {/* Timeline Section */}
        {timeline && timeline.milestones.length > 0 && (
          <Section title={timeline.section_title} intro={timeline.section_intro}>
            <div className="space-y-8">
              {timeline.milestones.map((milestone, i) => (
                <AnimateIn key={milestone.year} delay={i * 0.1}>
                  <div className="flex gap-6 items-start group">
                    <div className="flex-shrink-0 w-20 text-right">
                      <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                    </div>
                    <div className="flex-shrink-0 mt-2">
                      <div className="w-4 h-4 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="flex-1 pb-8 border-l-2 border-foreground/10 pl-6 -ml-[9px]">
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </Section>
        )}
      </div>
    </>
  );
}
