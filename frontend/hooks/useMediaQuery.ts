// Hook para detectar breakpoints de pantalla
import { useState, useEffect } from 'react';

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Create listener
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener
    media.addEventListener('change', listener);

    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

// Convenience hook for desktop detection (>= tablet breakpoint)
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

// Convenience hook for tablet detection
export function useIsTablet(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
}
