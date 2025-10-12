"use client";

import { Section } from "@/components/section";
import { AnimateIn } from "@/components/animate-in";
import { PageHero } from "@/components/page-hero";
import * as Icons from "lucide-react";
import { Briefcase, LucideIcon } from "lucide-react";

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  icon_name?: string;
  features?: string[];
  gradient?: string;
  image_path?: string;
  visible: boolean;
  order_index: number;
}

interface ServicesPageContentProps {
  services: Service[];
}

// Helper to get icon component from string name
const getIcon = (iconName?: string): LucideIcon => {
  if (!iconName) return Briefcase;
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Briefcase;
};

export function ServicesPageContent({ services }: ServicesPageContentProps) {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        subtitle="Our Services"
        title="Comprehensive Solutions for Modern Web"
        description="From concept to deployment, we provide end-to-end web development services that combine cutting-edge technology with beautiful design."
        badge="What We Offer"
        icon={<Briefcase className="w-4 h-4 text-primary" />}
      />

      <div className="mx-auto w-full max-w-7xl px-5 py-20 flex flex-col gap-20">
        {/* Services Grid */}
        <Section title="Our Expertise" intro="Full-stack development services">
          <AnimateIn>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-12">
              Our expertise spans the entire development lifecycle, ensuring your project 
              is built with the latest technologies and best practices.
            </p>
          </AnimateIn>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => {
              const IconComponent = getIcon(service.icon_name);
              return (
                <AnimateIn key={service.id} delay={i * 0.08}>
                  <div className="group rounded-2xl border bg-card overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col">
                    {/* Image or Icon Header */}
                    <div className="relative h-48 overflow-hidden">
                      {service.image_path && (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${service.image_path})` }}
                        />
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient || 'from-blue-600/20 to-cyan-600/20'} ${service.image_path ? 'mix-blend-multiply' : ''}`} />
                      
                      {/* Icon overlay */}
                      <div className="absolute top-4 right-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background/90 backdrop-blur-sm text-primary z-10">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-semibold text-xl mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {service.short_description}
                      </p>
                      
                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <ul className="space-y-2 mt-auto">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Decorative gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </Section>

        {/* Process Section */}
        <Section title="Our Process" intro="How we bring your vision to life">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Discovery",
                desc: "We learn about your goals, audience, and requirements.",
              },
              {
                step: "02",
                title: "Design",
                desc: "Create wireframes and visual designs that align with your brand.",
              },
              {
                step: "03",
                title: "Development",
                desc: "Build your site with modern tech and best practices.",
              },
              {
                step: "04",
                title: "Launch",
                desc: "Deploy, test, and optimize for peak performance.",
              },
            ].map((phase, i) => (
              <AnimateIn key={phase.step} delay={i * 0.1}>
                <div className="relative rounded-xl border bg-card p-6 hover:shadow-lg transition-all">
                  <div className="text-5xl font-bold text-primary/10 mb-2">{phase.step}</div>
                  <h3 className="font-semibold text-lg mb-2">{phase.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{phase.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <AnimateIn>
          <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/5 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let's discuss your project and create something amazing together.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-primary-foreground font-medium hover:opacity-90 transition-all hover:scale-105"
            >
              Contact Us Today
            </a>
          </div>
        </AnimateIn>
      </div>
    </>
  );
}
