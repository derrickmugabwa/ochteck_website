import { Section } from "@/components/section";
import { AnimateIn } from "@/components/animate-in";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Contact | Ochteck Agency Limited",
  description: "Get in touch with our team.",
};

export default async function ContactPage() {
  const supabase = await createClient();

  // Fetch contact page content
  const [heroResult, contactInfoResult, faqsResult, servicesResult] = await Promise.all([
    supabase.from("contact_page_hero").select("*").eq("is_active", true).single(),
    supabase.from("contact_info").select("*").eq("is_active", true).single(),
    supabase.from("contact_faqs").select("*").eq("visible", true).order("order_index"),
    supabase.from("services").select("id, title").eq("visible", true).order("order_index"),
  ]);

  const hero = heroResult.data;
  const contactInfo = contactInfoResult.data;
  const faqs = faqsResult.data || [];
  const services = servicesResult.data || [];
  return (
    <div className="flex flex-col">
      {/* Modern Hero Section */}
      <PageHero
        subtitle={hero?.subtitle || "Contact Us"}
        title={hero?.title || "Let's Build Something Amazing Together"}
        description={hero?.description || "Have a project in mind? We'd love to hear about it. Fill out the form below or reach out directly, and we'll get back to you within 24 hours."}
        badge={hero?.badge || "Get In Touch"}
        icon={<MessageSquare className="w-4 h-4 text-primary" />}
      />

      <div className="mx-auto w-full max-w-7xl px-5 py-20 flex flex-col gap-20">
      <Section 
        title={hero?.contact_info_title || "Contact Information"} 
        intro={hero?.contact_info_intro || "Multiple ways to reach us"}
      >

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <AnimateIn delay={0.1}>
              <ContactForm services={services} />
            </AnimateIn>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo && (
              <>
                <AnimateIn delay={0.2}>
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      {contactInfo.email && (
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Email</div>
                            <a href={`mailto:${contactInfo.email}`} className="text-sm text-muted-foreground hover:text-primary transition">
                              {contactInfo.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {contactInfo.phone && (
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Phone</div>
                            <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-sm text-muted-foreground hover:text-primary transition">
                              {contactInfo.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {contactInfo.location && (
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Location</div>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {contactInfo.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {contactInfo.business_hours && (
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Business Hours</div>
                            <p className="text-sm text-muted-foreground">
                              {contactInfo.business_hours}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimateIn>

                {contactInfo.response_time_text && (
                  <AnimateIn delay={0.3}>
                    <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-purple-500/5 p-6">
                      <h3 className="font-semibold text-lg mb-2">Quick Response</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {contactInfo.response_time_text}
                      </p>
                    </div>
                  </AnimateIn>
                )}
              </>
            )}
          </div>
        </div>
      </Section>

      {/* FAQ Section - Modern Design */}
      {faqs.length > 0 && (
        <Section 
          title={hero?.faq_title || "Frequently Asked Questions"} 
          intro={hero?.faq_intro || "Quick answers to common questions"}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq, i) => (
              <AnimateIn key={faq.id} delay={i * 0.08}>
                <div className="group relative rounded-2xl border bg-gradient-to-br from-card to-card/50 p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                  {/* Icon */}
                  <div className="absolute -top-3 -left-3 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  {/* Content */}
                  <div className="mt-4">
                    <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>

                  {/* Decorative gradient bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </AnimateIn>
            ))}
          </div>
        </Section>
      )}
      </div>
    </div>
  );
}
