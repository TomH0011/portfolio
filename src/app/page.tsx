import { Suspense, lazy } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";

// Lazy load components that are not needed for initial render
const AboutSection = lazy(() => import("@/components/AboutSection").then(mod => ({ default: mod.AboutSection })));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection").then(mod => ({ default: mod.ProjectsSection })));
const GameSection = lazy(() => import("@/components/GameSection").then(mod => ({ default: mod.GameSection })));
const ContactSection = lazy(() => import("@/components/ContactSection").then(mod => ({ default: mod.ContactSection })));
const Footer = lazy(() => import("@/components/Footer").then(mod => ({ default: mod.Footer })));

// Performance optimization with React 19
export const runtime = "edge";
export const preferredRegion = "auto";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        {/* Static placeholders before components load to reduce layout shift */}
        <Suspense fallback={<div className="min-h-[60vh] bg-background"></div>}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<div className="min-h-[90vh] bg-muted/30"></div>}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<div className="min-h-[60vh] bg-background"></div>}>
          <GameSection />
        </Suspense>
        <Suspense fallback={<div className="min-h-[60vh] bg-background/50"></div>}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-32 bg-muted/30"></div>}>
        <Footer />
      </Suspense>
    </>
  );
}
