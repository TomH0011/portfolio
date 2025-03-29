import { useEffect, useRef } from "react";

// Create a single shared observer instance for better performance
let globalObserver: IntersectionObserver | null = null;
const observedElements = new Set<Element>();

// More efficient debounced version of scroll animation setup
let setupAnimationsTimeout: ReturnType<typeof setTimeout> | null = null;
const ANIMATION_SETUP_DELAY = 100; // ms

// Limit the active animations to reduce CPU/GPU load
const MAX_CONCURRENT_ANIMATIONS = 4;
let currentlyAnimating = 0;

// Custom hook for scroll animations with improved performance
export function useScrollAnimation() {
  useEffect(() => {
    // Clear any existing timeout when component mounts
    if (setupAnimationsTimeout) {
      clearTimeout(setupAnimationsTimeout);
    }

    // Set up animations with debounce to prevent layout thrashing
    setupAnimationsTimeout = setTimeout(() => {
      if (!globalObserver) {
        const options = {
          root: null,
          rootMargin: "50px 0px", // Increased rootMargin to start loading earlier
          threshold: 0.05, // Lower threshold for earlier triggering
        };

        globalObserver = new IntersectionObserver((entries) => {
          // Process entries in batches to limit concurrent animations
          const visibleEntries = entries
            .filter(entry => entry.isIntersecting)
            .slice(0, MAX_CONCURRENT_ANIMATIONS - currentlyAnimating);
          
          if (visibleEntries.length === 0) return;
          
          currentlyAnimating += visibleEntries.length;
          
          visibleEntries.forEach((entry) => {
            // Add appear class to start animation
            entry.target.classList.add("appear");
            
            // Unobserve after animation to save resources
            globalObserver?.unobserve(entry.target);
            observedElements.delete(entry.target);
            
            // Decrement the animation counter after animation completes
            setTimeout(() => {
              currentlyAnimating = Math.max(0, currentlyAnimating - 1);
            }, 500); // Slightly longer than animation duration
          });
        }, options);
      }

      // Use requestIdleCallback where available, fallback to requestAnimationFrame
      const scheduleWork = window.requestIdleCallback || window.requestAnimationFrame;
      
      scheduleWork(() => {
        const fadeElements = document.querySelectorAll(".fade-in-up");
        fadeElements.forEach((el) => {
          if (!observedElements.has(el)) {
            globalObserver?.observe(el);
            observedElements.add(el);
          }
        });
      });
    }, ANIMATION_SETUP_DELAY);

    return () => {
      // Clear timeout on component unmount
      if (setupAnimationsTimeout) {
        clearTimeout(setupAnimationsTimeout);
      }
      
      // Only clean up when component unmounts, but keep the global observer
      if (globalObserver && observedElements.size === 0) {
        globalObserver.disconnect();
        globalObserver = null;
      }
    };
  }, []);

  return null;
}

// Simplified animation variants that are less taxing on the GPU
export const fadeInUp = {
  hidden: { opacity: 0, y: 10 }, // Reduced distance for better performance
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3, // Shorter duration
      ease: [0.25, 0.1, 0.25, 1.0] // Optimized cubic-bezier curve
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05 // Faster stagger
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.98 }, // Smaller scale change
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3, // Shorter duration
      ease: [0.25, 0.1, 0.25, 1.0] // Optimized cubic-bezier curve
    }
  }
};

// Utility function to add delay to animations
export const withDelay = (variant: any, delay: number) => {
  return {
    ...variant,
    visible: {
      ...variant.visible,
      transition: {
        ...variant.visible.transition,
        delay: delay * 0.7 // Reduce delay multiplier
      }
    }
  };
}; 