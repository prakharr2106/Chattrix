import { createContext, useContext } from "react";

// Create a context to share wallpaper data
export const WallpaperContext = createContext(null);

export function useWallpaper() {
  // Get the wallpaper context
  const ctx = useContext(WallpaperContext);

  // Ensure the hook is used inside WallpaperProvider
  if (!ctx) {
    throw new Error("useWallpaper must be used within WallpaperProvider");
  }

  // Return the context value
  return ctx;
}
