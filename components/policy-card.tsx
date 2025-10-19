"use client";

import Link from "next/link";
import { AnimateIn } from "@/components/animate-in";
import { ArrowRight } from "lucide-react";

interface PolicyCardProps {
  title: string;
  slug: string;
  description: string;
  iconSvg: string;
  delay?: number;
}

export function PolicyCard({ title, slug, description, iconSvg, delay = 0 }: PolicyCardProps) {
  return (
    <AnimateIn delay={delay}>
      <Link href={`/policies/${slug}`}>
        <div className="group rounded-2xl border bg-card p-8 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col cursor-pointer">
          {/* Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <div 
              className="w-8 h-8"
              dangerouslySetInnerHTML={{ __html: iconSvg }}
            />
          </div>

          {/* Content */}
          <h3 className="font-semibold text-xl mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4 flex-1">
            {description}
          </p>

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
            Read Full Policy
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </AnimateIn>
  );
}
