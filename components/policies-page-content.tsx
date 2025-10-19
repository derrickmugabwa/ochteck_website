"use client";

import { Section } from "@/components/section";
import { AnimateIn } from "@/components/animate-in";
import { PageHero } from "@/components/page-hero";
import { PolicyCard } from "@/components/policy-card";
import { Shield } from "lucide-react";
import type { PoliciesHero, Policy, PoliciesSection } from "@/types/policies";

interface PoliciesPageContentProps {
  hero: PoliciesHero | null;
  policies: Policy[];
  section: PoliciesSection | null;
}

export function PoliciesPageContent({ hero, policies, section }: PoliciesPageContentProps) {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        subtitle={hero?.subtitle || "Transparency & Trust"}
        title={hero?.title || "Our Policies"}
        description={hero?.description || "Learn about our policies and commitments to you"}
        badge="Policies"
        icon={<Shield className="w-4 h-4 text-primary" />}
      />

      <div className="mx-auto w-full max-w-7xl px-5 py-20">
        {/* Policies Grid */}
        <Section 
          title={section?.title || "Our Commitments"} 
          intro={section?.intro || "Clear and transparent policies"}
        >
          <AnimateIn>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-12">
              {section?.description || "We believe in transparency and building trust with our clients. Our policies are designed to protect your interests and ensure a smooth, professional experience."}
            </p>
          </AnimateIn>

          {policies.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {policies.map((policy, i) => (
                <PolicyCard
                  key={policy.id}
                  title={policy.title}
                  slug={policy.slug}
                  description={policy.description}
                  iconSvg={policy.icon_svg}
                  delay={i * 0.08}
                />
              ))}
            </div>
          ) : (
            <AnimateIn>
              <div className="text-center py-12">
                <p className="text-muted-foreground">No policies available at the moment.</p>
              </div>
            </AnimateIn>
          )}
        </Section>
      </div>
    </>
  );
}
