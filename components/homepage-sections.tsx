"use client";

import Link from "next/link";
import { AnimateIn } from "@/components/animate-in";
import { Sparkles, Zap, Shield, Rocket, Briefcase, ArrowRight, LucideIcon, MessageSquare } from "lucide-react";
import * as Icons from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  icon_name?: string;
  features?: string[];
  gradient?: string;
  image_path?: string;
  visible: boolean;
  order_index: number;
}

interface FeaturesData {
  section_title: string;
  section_heading: string;
  section_description: string;
  features: Feature[];
}

interface CtaData {
  title: string;
  description: string;
  button_text: string;
  button_link: string;
}

interface HomepageSectionsProps {
  features: FeaturesData | null;
  services: Service[] | null;
  cta: CtaData | null;
}

// Helper to get icon component from string name
const getIcon = (iconName: string): LucideIcon => {
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[iconName];
  return IconComponent || Sparkles;
};

// Gradient mapping for features
const featureGradients = [
  "from-yellow-500/10 to-orange-500/10",
  "from-purple-500/10 to-pink-500/10",
  "from-green-500/10 to-emerald-500/10",
  "from-blue-500/10 to-cyan-500/10",
];

// Gradient mapping for services
const serviceGradients = [
  "from-blue-600/20 to-cyan-600/20",
  "from-purple-600/20 to-pink-600/20",
  "from-green-600/20 to-emerald-600/20",
];

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar_url?: string;
  author: string;
  visible: boolean;
}

export function HomepageSections({ features, services, cta }: HomepageSectionsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    async function fetchTestimonials() {
      const supabase = createClient();
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("visible", true)
        .order("order_index", { ascending: true })
        .limit(3);

      if (data) {
        setTestimonials(data);
      }
    }

    fetchTestimonials();
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-20 flex flex-col gap-32">
      {/* Features Section */}
      {features && (
        <section className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <AnimateIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                {features.section_title}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {features.section_heading}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {features.section_description}
              </p>
            </div>
          </AnimateIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.features.map((feature, i) => {
              const IconComponent = getIcon(feature.icon);
              return (
                <AnimateIn key={feature.title} delay={i * 0.08}>
                  <div className="group relative rounded-2xl border bg-card p-8 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${featureGradients[i % featureGradients.length]} opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative">
                      <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>

                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </section>
      )}

      {/* Services Section */}
      {services && services.length > 0 && (
        <section className="relative">
          <AnimateIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4 text-primary" />
                Our Services
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Everything You Need to Build & Scale
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From design systems to data-driven web applications
              </p>
            </div>
          </AnimateIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => {
              const IconComponent = getIcon(service.icon_name || 'Briefcase');
              return (
                <AnimateIn key={service.id} delay={i * 0.08}>
                  <div className="group rounded-2xl border bg-card overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {service.image_path && (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${service.image_path})` }}
                        />
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient || serviceGradients[i % serviceGradients.length]} ${service.image_path ? 'mix-blend-multiply' : ''}`} />
                      
                      {/* Icon overlay */}
                      <div className="absolute top-4 right-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background/90 backdrop-blur-sm text-primary">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{service.short_description}</p>
                      
                      {/* Arrow indicator */}
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        Learn more
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>

          <AnimateIn delay={0.3}>
            <div className="mt-12 text-center">
              <Link 
                href="/services" 
                className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-6 py-3 font-medium hover:bg-primary/10 transition-all"
              >
                View All Services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateIn>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <AnimateIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium mb-6">
                <MessageSquare className="w-4 h-4 text-primary" />
                Testimonials
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Loved by{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Innovative Teams
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what our clients say about working with us
              </p>
            </div>
          </AnimateIn>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <AnimateIn key={testimonial.id} delay={i * 0.08}>
                <blockquote className="group relative rounded-2xl border bg-card p-8 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col">
                  {/* Quote icon */}
                  <div className="mb-4 text-primary/20 text-6xl font-serif leading-none">&ldquo;</div>
                  
                  {/* Rating stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  <p className="text-base leading-relaxed mb-6 flex-1">{testimonial.content}</p>
                  
                  <footer className="flex items-center gap-4 pt-4 border-t">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center font-bold text-primary">
                      {testimonial.author.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </footer>

                  {/* Decorative gradient */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </blockquote>
              </AnimateIn>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section - Elaborate Design */}
      {cta && (
        <AnimateIn>
          <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-12 md:p-16">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Gradient orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

            <div className="relative flex flex-col items-center text-center gap-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                <Rocket className="w-4 h-4 text-primary" />
                Ready to Start?
              </div>

              {/* Heading */}
              <div className="max-w-3xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  {cta.title}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {cta.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 flex-wrap justify-center">
                <Link
                  href={cta.button_link}
                  className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
                >
                  {cta.button_text}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 bg-background/50 backdrop-blur-sm px-8 py-4 font-semibold hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
                >
                  View Our Services
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Secure & Reliable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Premium Quality</span>
                </div>
              </div>
            </div>
          </section>
        </AnimateIn>
      )}
    </div>
  );
}
