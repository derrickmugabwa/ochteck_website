import { Section } from "@/components/section";
import { AnimateIn } from "@/components/animate-in";
import { PageHero } from "@/components/page-hero";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact | Next.js Supabase Starter",
  description: "Get in touch with our team.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Modern Hero Section */}
      <PageHero
        subtitle="Contact Us"
        title="Let's Build Something Amazing Together"
        description="Have a project in mind? We'd love to hear about it. Fill out the form below or reach out directly, and we'll get back to you within 24 hours."
        badge="Get In Touch"
        icon={<MessageSquare className="w-4 h-4 text-primary" />}
      />

      <div className="mx-auto w-full max-w-7xl px-5 py-20 flex flex-col gap-20">
      <Section title="Contact Information" intro="Multiple ways to reach us">

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <AnimateIn delay={0.1}>
              <form className="rounded-xl border bg-card p-8 shadow-sm">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="name">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      className="w-full border rounded-lg px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="w-full border rounded-lg px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium" htmlFor="service">
                    Service Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full border rounded-lg px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
                  >
                    <option value="">Select a service</option>
                    <option value="web-dev">Web Development</option>
                    <option value="design">Design Systems</option>
                    <option value="animations">Animations</option>
                    <option value="cms">CMS & Authentication</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium" htmlFor="message">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project..."
                    required
                    rows={6}
                    className="w-full border rounded-lg px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90 transition-all hover:scale-[1.02]"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </AnimateIn>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <AnimateIn delay={0.2}>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Email</div>
                      <a href="mailto:contact@example.com" className="text-sm text-muted-foreground hover:text-primary transition">
                        contact@example.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Phone</div>
                      <a href="tel:+15551234567" className="text-sm text-muted-foreground hover:text-primary transition">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Location</div>
                      <p className="text-sm text-muted-foreground">
                        San Francisco, CA<br />United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Business Hours</div>
                      <p className="text-sm text-muted-foreground">
                        Mon - Fri: 9:00 AM - 6:00 PM PST
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.3}>
              <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-purple-500/5 p-6">
                <h3 className="font-semibold text-lg mb-2">Quick Response</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We typically respond within 24 hours during business days. 
                  For urgent inquiries, please call us directly.
                </p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </Section>

      {/* FAQ or Additional Info */}
      <Section title="Frequently Asked Questions">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              q: "What's your typical project timeline?",
              a: "Most projects take 4-8 weeks from kickoff to launch, depending on scope and complexity.",
            },
            {
              q: "Do you offer ongoing support?",
              a: "Yes! We provide maintenance packages and ongoing support for all our clients.",
            },
            {
              q: "What technologies do you work with?",
              a: "We specialize in Next.js, React, TypeScript, Tailwind CSS, and Supabase.",
            },
            {
              q: "Can you work with our existing codebase?",
              a: "Absolutely! We're experienced in both greenfield projects and enhancing existing applications.",
            },
          ].map((faq, i) => (
            <AnimateIn key={i} delay={i * 0.08}>
              <div className="rounded-xl border bg-card p-6 hover:shadow-lg transition-all">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </Section>
      </div>
    </div>
  );
}
