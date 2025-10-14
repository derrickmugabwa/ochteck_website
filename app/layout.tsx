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

  return {
    metadataBase: new URL(defaultUrl),
    title: settings?.site_name || "Ochteck Agency Limited",
    description: "Professional web development and digital solutions",
    icons: settings?.favicon_url ? {
      icon: settings.favicon_url,
      shortcut: settings.favicon_url,
      apple: settings.favicon_url,
    } : undefined,
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
