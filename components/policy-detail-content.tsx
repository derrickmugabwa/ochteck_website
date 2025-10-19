"use client";

import { AnimateIn } from "@/components/animate-in";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import type { Policy } from "@/types/policies";

interface PolicyDetailContentProps {
  policy: Policy;
}

export function PolicyDetailContent({ policy }: PolicyDetailContentProps) {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        subtitle="Policy Details"
        title={policy.title}
        description={policy.description}
        badge="Legal"
        icon={<FileText className="w-4 h-4 text-primary" />}
      />

      <div className="mx-auto w-full max-w-4xl px-5 py-20">
        {/* Back Button */}
        <AnimateIn>
          <Link href="/policies">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Policies
            </Button>
          </Link>
        </AnimateIn>

        {/* Policy Icon */}
        <AnimateIn delay={0.1}>
          <div className="mb-12 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary">
            <div 
              className="w-10 h-10"
              dangerouslySetInnerHTML={{ __html: policy.icon_svg }}
            />
          </div>
        </AnimateIn>

        {/* Policy Sections */}
        <div className="space-y-12">
          {/* Purpose Section */}
          {policy.purpose && (
            <AnimateIn delay={0.2}>
              <section className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                    1
                  </span>
                  Purpose
                </h2>
                <div className="pl-13">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {policy.purpose}
                  </p>
                </div>
              </section>
            </AnimateIn>
          )}

          {/* Scope Section */}
          {policy.scope && (
            <AnimateIn delay={0.3}>
              <section className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                    2
                  </span>
                  Scope
                </h2>
                <div className="pl-13">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {policy.scope}
                  </p>
                </div>
              </section>
            </AnimateIn>
          )}

          {/* Responsibility Section */}
          {policy.responsibility && (
            <AnimateIn delay={0.4}>
              <section className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                    3
                  </span>
                  Responsibility
                </h2>
                <div className="pl-13">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {policy.responsibility}
                  </p>
                </div>
              </section>
            </AnimateIn>
          )}
        </div>

        {/* Last Updated */}
        <AnimateIn delay={0.5}>
          <div className="mt-16 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(policy.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </AnimateIn>

        {/* Contact CTA */}
        <AnimateIn delay={0.6}>
          <div className="mt-12 rounded-2xl border bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/5 p-8 text-center">
            <h3 className="text-xl font-bold mb-3">Have Questions?</h3>
            <p className="text-muted-foreground mb-6">
              If you have any questions about this policy, please don&apos;t hesitate to contact us.
            </p>
            <Link href="/contact">
              <Button size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </AnimateIn>
      </div>
    </>
  );
}
