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
  let settings = null;
  
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("site_name, favicon_url")
      .eq("is_active", true)
      .single();
    
    if (!error && data) {
      settings = data;
      console.log('Favicon URL from DB:', data.favicon_url); // Debug log
    } else {
      console.error('Error fetching site settings:', error);
    }
  } catch (error) {
    console.error('Exception fetching site settings for metadata:', error);
  }

  return {
    metadataBase: new URL(defaultUrl),
    title: settings?.site_name || "Ochteck Agency Limited",
    description: "Professional web development and digital solutions",
    // Icons are handled by app/icon.tsx which dynamically serves the custom favicon
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
