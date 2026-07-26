import { useSyncExternalStore } from "react";

/**
 * Custom hook to track whether a media query matches.
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    // Subscribe to media query changes
    (onChange) => {
      const mq = window.matchMedia(query);

      mq.addEventListener("change", onChange);

      // Clean up the event listener when unsubscribing
      return () => mq.removeEventListener("change", onChange);
    },

    // Return the current match state
    () => window.matchMedia(query).matches,

    // Return false during server-side rendering
    () => false,
  );
}
