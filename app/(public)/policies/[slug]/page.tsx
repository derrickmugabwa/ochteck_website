import { getPolicyBySlug } from "@/app/actions/policies";
import { PolicyDetailContent } from "@/components/policy-detail-content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PolicyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = await getPolicyBySlug(slug);

  if (!policy) {
    return {
      title: "Policy Not Found",
    };
  }

  return {
    title: `${policy.title} | Ochteck`,
    description: policy.description,
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = await getPolicyBySlug(slug);

  if (!policy) {
    notFound();
  }

  return <PolicyDetailContent policy={policy} />;
}
