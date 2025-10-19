import { getPoliciesHero } from "@/app/actions/policies-hero";
import { getPolicies } from "@/app/actions/policies";
import { getPoliciesSection } from "@/app/actions/policies-section";
import { PoliciesPageContent } from "@/components/policies-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Policies | Ochteck",
  description: "Learn about our policies and commitments to transparency, privacy, and trust.",
};

export default async function PoliciesPage() {
  const [hero, policies, section] = await Promise.all([
    getPoliciesHero(),
    getPolicies(),
    getPoliciesSection(),
  ]);

  return <PoliciesPageContent hero={hero} policies={policies} section={section} />;
}
