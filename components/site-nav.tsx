'use client';
 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarSettings {
  id: string;
  logo_url?: string;
  logo_text: string;
  show_logo_text: boolean;
  navigation_links: NavLink[];
  cta_button_text?: string;
  cta_button_link?: string;
  show_cta_button: boolean;
}

function NavLinkItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={
        "px-3 py-2 rounded-md text-sm font-medium hover:underline transition-colors " +
        (active ? "font-semibold" : "text-muted-foreground")
      }
    >
      {label}
    </Link>
  );
}

interface SiteNavProps {
  initialSettings?: NavbarSettings | null;
}

export function SiteNav({ initialSettings }: SiteNavProps) {
  const [navbarSettings, setNavbarSettings] = useState<NavbarSettings | null>(initialSettings || null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If we have initial settings from server, use them
    if (initialSettings) {
      setNavbarSettings(initialSettings);
      return;
    }

    // Otherwise fetch on client (fallback)
    async function fetchNavbarSettings() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("navbar_settings")
        .select("*")
        .eq("is_active", true)
        .single();

      if (!error && data) {
        setNavbarSettings(data);
      }
    }

    fetchNavbarSettings();
  }, [initialSettings]);

  // Fallback to default while loading or if no settings
  const logoText = navbarSettings?.logo_text || "Brand";
  const showLogoText = navbarSettings?.show_logo_text ?? false;
  const logoUrl = navbarSettings?.logo_url;
  const navLinks = navbarSettings?.navigation_links || [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];
  const showCta = navbarSettings?.show_cta_button ?? false;
  const ctaText = navbarSettings?.cta_button_text || "Get Started";
  const ctaLink = navbarSettings?.cta_button_link || "/contact";

  return (
    <nav className="flex h-16 items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        {logoUrl && (
          <div className="relative w-28 h-28">
            <Image
              src={logoUrl}
              alt={logoText}
              fill
              className="object-contain"
              priority
              sizes="112px"
              quality={90}
            />
          </div>
        )}
        {showLogoText && (
          <span className="font-semibold text-lg">{logoText}</span>
        )}
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-2">
        {navLinks.map((link) => (
          <NavLinkItem key={link.href} href={link.href} label={link.label} />
        ))}
        
        {/* CTA Button */}
        {showCta && ctaText && ctaLink && (
          <Link
            href={ctaLink}
            className="ml-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {ctaText}
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg md:hidden z-50">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile CTA Button */}
            {showCta && ctaText && ctaLink && (
              <Link
                href={ctaLink}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
