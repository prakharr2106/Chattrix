import { useEffect, useState } from "react";
import { frameStyleFromUrl, getWallpaperById } from "../data/wallpapers.js";
import { WallpaperContext } from "./wallpaper.js";

const STORAGE_KEY = "chat-wallpaper-id";

// Get the saved wallpaper ID from localStorage
function readStoredWallpaperId() {
  const wallpaperId = localStorage.getItem(STORAGE_KEY);

  // Return saved wallpaper if available
  if (wallpaperId) return wallpaperId;

  // Use default wallpaper otherwise
  return "sonoma-horizon";
}

export function WallpaperProvider({ children }) {
  // Store the currently selected wallpaper ID
  const [wallpaperId, setWallpaperIdState] = useState(readStoredWallpaperId);

  // Save the selected wallpaper whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, wallpaperId);
  }, [wallpaperId]);

  // Get the complete wallpaper object
  const wallpaper = getWallpaperById(wallpaperId);

  // Update the selected wallpaper
  const setWallpaperId = (id) => {
    setWallpaperIdState(id);
  };

  // Generate background style for the selected wallpaper
  const frameStyle = frameStyleFromUrl(wallpaper.url);

  return (
    <WallpaperContext.Provider
      value={{ wallpaperId, setWallpaperId, wallpaper, frameStyle }}
    >
      {children}
    </WallpaperContext.Provider>
  );
}
