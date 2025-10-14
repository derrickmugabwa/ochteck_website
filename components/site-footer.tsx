'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface FooterSettings {
  logo_url?: string;
  logo_text: string;
  show_logo_text: boolean;
  copyright_text: string;
  social_links: Array<{ platform: string; url: string; icon: string }>;
}

// Cache footer settings in memory
let cachedFooterSettings: FooterSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function SiteFooter() {
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(cachedFooterSettings);

  useEffect(() => {
    async function fetchFooterSettings() {
      // Check if cache is still valid
      const now = Date.now();
      if (cachedFooterSettings && (now - cacheTimestamp) < CACHE_DURATION) {
        setFooterSettings(cachedFooterSettings);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("footer_settings")
        .select("*")
        .eq("is_active", true)
        .single();

      if (data) {
        cachedFooterSettings = data;
        cacheTimestamp = Date.now();
        setFooterSettings(data);
      }
    }

    fetchFooterSettings();
  }, []);

  const copyrightText = footerSettings?.copyright_text || `© ${new Date().getFullYear()} Your Brand. All rights reserved.`;
  const socialLinks = footerSettings?.social_links || [];

  return (
    <div className="flex h-16 items-center justify-between text-xs text-muted-foreground">
      <p>{copyrightText}</p>
      <div className="flex items-center gap-4">
        {socialLinks.map((social) => (
          <a
            key={social.platform}
            className="hover:underline capitalize transition-colors hover:text-foreground"
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
          >
            {social.platform}
          </a>
        ))}
      </div>
    </div>
  );
}
