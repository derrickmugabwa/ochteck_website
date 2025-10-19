import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/lib/providers/query-provider";
import { SmoothScrollProvider } from "@/lib/providers/smooth-scroll-provider";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("site_name, favicon_url")
    .eq("is_active", true)
    .single();

  // Build icons object - use absolute URLs for external favicons
  const faviconUrl = settings?.favicon_url;
  const isExternalUrl = faviconUrl?.startsWith('http');
  
  const icons: Metadata['icons'] = faviconUrl && isExternalUrl
    ? {
        icon: [
          { url: faviconUrl, type: 'image/x-icon' },
          { url: faviconUrl, sizes: '32x32', type: 'image/png' },
          { url: faviconUrl, sizes: '16x16', type: 'image/png' },
        ],
        shortcut: faviconUrl,
        apple: faviconUrl,
      }
    : {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
      };

  return {
    metadataBase: new URL(defaultUrl),
    title: settings?.site_name || "Ochteck Agency Limited",
    description: "Professional web development and digital solutions",
    icons,
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="site-theme"
            forcedTheme="light"
            disableTransitionOnChange
          >
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
