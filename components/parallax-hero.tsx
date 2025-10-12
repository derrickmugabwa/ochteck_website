"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface HeroContent {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge_text?: string;
  background_image_url?: string;
  background_overlay_opacity: number;
  primary_cta_text?: string;
  primary_cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
}

export function ParallaxHero() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroContent() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .eq("is_active", true)
        .single();

      if (!error && data) {
        setHeroContent(data);
      }
      setLoading(false);
    }

    fetchHeroContent();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-[95vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <ParallaxHeroContent heroContent={heroContent} />;
}

function ParallaxHeroContent({ heroContent }: { heroContent: HeroContent | null }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div ref={ref} className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Background with image or gradient */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        {/* Background Image */}
        {heroContent?.background_image_url ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroContent.background_image_url})` }}
            />
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-background"
              style={{ opacity: heroContent.background_overlay_opacity }}
            />
          </>
        ) : (
          <>
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Gradient orbs */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </>
        )}
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }} />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-8"
        >
          {heroContent?.badge_text && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="relative flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                {heroContent.badge_text}
              </span>
            </motion.div>
          )}

          {heroContent?.subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm font-semibold text-white uppercase tracking-wider"
            >
              {heroContent.subtitle}
            </motion.div>
          )}

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl leading-[1.1] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            {heroContent?.title || "Build Stunning Websites That Convert"}
          </h1>

          {heroContent?.description && (
            <p className="text-lg md:text-xl text-black max-w-3xl leading-relaxed">
              {heroContent.description}
            </p>
          )}

          {(heroContent?.primary_cta_text || heroContent?.secondary_cta_text) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-4 flex-wrap justify-center mt-4"
            >
              {heroContent?.primary_cta_text && heroContent?.primary_cta_link && (
                <Link
                  href={heroContent.primary_cta_link}
                  className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-primary-foreground font-medium hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
                >
                  {heroContent.primary_cta_text}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {heroContent?.secondary_cta_text && heroContent?.secondary_cta_link && (
                <Link
                  href={heroContent.secondary_cta_link}
                  className="inline-flex items-center gap-2 rounded-lg border border-foreground/20 bg-background/50 backdrop-blur-sm px-8 py-4 font-medium hover:bg-accent transition-all"
                >
                  {heroContent.secondary_cta_text}
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
