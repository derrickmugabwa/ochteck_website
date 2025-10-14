"use client";

import { useEffect, useRef } from "react";
import { AnimateIn } from "@/components/animate-in";

interface Brand {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
}

interface BrandsSection {
  title: string;
  description: string;
}

interface BrandsSliderProps {
  brands: Brand[];
  sectionData?: BrandsSection | null;
}

export function BrandsSlider({ brands, sectionData }: BrandsSliderProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Duplicate items for seamless loop
    const scrollerInner = scroller.querySelector('[data-scroller-inner]');
    if (!scrollerInner) return;

    const scrollerContent = Array.from(scrollerInner.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerInner.appendChild(duplicatedItem);
    });
  }, [brands]);

  if (!brands || brands.length === 0) return null;

  return (
    <section className="relative py-20 overflow-hidden">
      <AnimateIn>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {sectionData?.title || "Trusted by Leading Brands"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {sectionData?.description || "Proud to work with amazing clients and partners"}
          </p>
        </div>
      </AnimateIn>

      {/* Slider */}
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div ref={scrollerRef} className="overflow-hidden">
          <div
            data-scroller-inner
            className="flex gap-12 animate-scroll"
            style={{
              width: 'max-content',
            }}
          >
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-center h-32 w-64 flex-shrink-0 hover:scale-110 transition-all duration-300"
              >
                {brand.website_url ? (
                  <a
                    href={brand.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center p-4"
                  >
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
