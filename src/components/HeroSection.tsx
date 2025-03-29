"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useScrollAnimation, fadeInUp, scaleIn, withDelay } from "@/lib/animation";
import { useTheme } from "next-themes";

export function HeroSection() {
  // Use shared animation hook for performance
  useScrollAnimation();
  const { theme } = useTheme();
  const ref = useRef(null);
  
  // Reduced number of stars and pre-compute them
  const stars = useMemo(() => {
    const result = [];
    // Reduced from 40 to 30 stars for better performance
    for (let i = 0; i < 30; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.2,
        animDelay: Math.random() * 3
      });
    }
    return result;
  }, []);
  
  // Use window scroll position directly instead of Framer Motion's useScroll
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    // Throttled scroll handler with requestAnimationFrame for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Calculate values based on scroll - separate from render using a more efficient approach
  const moonStyles = useMemo(() => {
    // Scale values to the viewport height for consistent behavior
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const translateY = Math.min(-100, -(scrollY / vh) * 150); // Reduced movement range
    const opacity = Math.max(0, 1 - (scrollY / vh) * 1.0); // Less sensitive opacity change
    
    return {
      transform: `translateY(${translateY}px)`,
      opacity
    };
  }, [scrollY]);
  
  // Only calculate these values once per render cycle with more gentle opacity changes
  const starsOpacity = Math.max(0, 1 - (scrollY / 700)); // More gradual fade out
  const cloudOpacity = Math.max(0, 1 - (scrollY / 500)); // More gradual fade out

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden py-20">
      {/* Dynamic Background - simplified */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Stars - rendered statically with will-change optimizations */}
        <div 
          className="absolute inset-0 will-change-opacity" 
          style={{ opacity: starsOpacity }}
        >
          {stars.map((star, index) => (
            <div 
              key={index}
              className="absolute rounded-full bg-white transform-gpu"
              style={{ 
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDelay: `${star.animDelay}s`,
                // Add containment hint for browser optimization
                contain: 'layout paint'
              }}
            ></div>
          ))}
        </div>

        {/* Moon - simplified with GPU acceleration hints */}
        <div 
          className="absolute left-1/2 top-1/4 -translate-x-1/2 z-10 will-change-transform"
          style={moonStyles}
        >
          <div className="relative w-40 h-40 md:w-60 md:h-60 transform-gpu">
            <div className="absolute inset-0 rounded-full bg-yellow-100 dark:bg-yellow-200 shadow-lg"></div>
            <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-yellow-50 to-yellow-200 dark:from-yellow-100 dark:to-yellow-300"></div>
            {/* Moon craters - simplified */}
            <div className="absolute w-8 h-8 rounded-full bg-yellow-200/30 dark:bg-yellow-300/30 top-1/4 left-1/4"></div>
            <div className="absolute w-6 h-6 rounded-full bg-yellow-200/30 dark:bg-yellow-300/30 bottom-1/3 right-1/4"></div>
            <div className="absolute w-4 h-4 rounded-full bg-yellow-200/30 dark:bg-yellow-300/30 top-1/3 right-1/3"></div>
          </div>
        </div>

        {/* Clouds - simplified, reduced blur */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-48 z-20 will-change-opacity"
          style={{ opacity: cloudOpacity }}
        >
          <div className="absolute bottom-0 left-[-10%] w-[120%] h-32 bg-gradient-to-t from-background to-transparent transform-gpu"></div>
          {/* Reduced number of clouds and removed blur filter */}
          <div className="cloud-shape absolute bottom-10 left-[10%] w-40 h-20 bg-white/20 dark:bg-white/10 rounded-full transform-gpu"></div>
          <div className="cloud-shape absolute bottom-16 left-[60%] w-60 h-24 bg-white/30 dark:bg-white/15 rounded-full transform-gpu"></div>
        </div>

        {/* Simpler Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 dark:from-blue-900/10 dark:to-purple-900/10"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 max-w-6xl relative">
        {/* Static content without animations for better performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground dark:text-foreground"
            >
              Hi, I'm <span className="text-primary">Tom Howard</span>
            </motion.h2>
            
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={withDelay(fadeInUp, 0.1)}
              className="text-xl mb-8 text-foreground/80 max-w-lg font-mono font-medium"
              style={{ fontFamily: "var(--font-space-mono), var(--font-geist-mono), monospace" }}
            >
              <span className="text-primary dark:text-primary-foreground">$ </span>
              A recent graduate of Mathematics with a passion for backend engineering in Java and Python and much more.
            </motion.p>
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={withDelay(fadeInUp, 0.2)}
              className="flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="font-mono tracking-tight" style={{ fontFamily: "var(--font-space-mono), var(--font-geist-mono), monospace" }}>
                <Link href="/#projects">View Projects_</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-mono tracking-tight" style={{ fontFamily: "var(--font-space-mono), var(--font-geist-mono), monospace" }}>
                <Link href="/#contact">Contact Me_</Link>
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={withDelay(scaleIn, 0.3)}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="terminal absolute inset-0 bg-black/80 dark:bg-black/90 rounded-lg p-4 overflow-hidden border border-primary/40 shadow-lg dark:shadow-md transform-gpu">
                <div className="terminal-header flex items-center gap-1.5 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-xs text-white/70 font-mono">thomashoward@portfolio ~ </div>
                </div>
                <div className="terminal-content text-primary-foreground dark:text-primary font-mono text-sm leading-relaxed" style={{ fontFamily: "var(--font-space-mono), var(--font-geist-mono), monospace" }}>
                  <p><span className="text-green-400">$</span> whoami</p>
                  <p className="pl-2 text-primary">Backend Engineer</p>
                  <p><span className="text-green-400">$</span> skills</p>
                  <p className="pl-2 text-primary">JavaScript, Java, React.js, Node.js, Python, R</p>
                  <p><span className="text-green-400">$</span> education</p>
                  <p className="pl-2 text-primary">BSc Mathematics</p>
                  <p><span className="text-green-400">$</span> interests</p>
                  <p className="pl-2 text-primary">WebDev, AI, Open Source</p>
                  <p><span className="text-green-400">$</span> status</p>
                  <p className="pl-2 text-primary">Available for hire</p>
                  <p className="mt-2"><span className="text-green-400">$</span> <span className="cursor-blink">_</span></p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Simplified CSS */}
      <style jsx>{`
        .cloud-shape {
          transform: translateZ(0);
        }
        .terminal {
          transform: translateZ(0);
        }
        .cursor-blink {
          display: inline-block;
          width: 0.6em;
          height: 1em;
          background-color: currentColor;
          margin-left: 2px;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
} 