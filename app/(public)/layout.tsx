import { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-foreground/10">
        <div className="mx-auto w-full max-w-7xl px-5">
          <SiteNav />
        </div>
      </header>
      <main className="flex-1 pt-16">
        {children}
      </main>
      <footer className="border-t mt-20">
        <div className="mx-auto w-full max-w-7xl px-5">
          <SiteFooter />
        </div>
      </footer>
    </div>
  );
}
