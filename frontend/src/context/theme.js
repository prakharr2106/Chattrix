import { createContext, useContext } from "react";
import {
  DEFAULT_THEME_PRESET_ID,
  HERO_UI_THEME_PRESETS,
} from "../data/herouiThemePresets.js";

// Create a context to store theme data
export const ThemeContext = createContext(null);

// Store all valid theme preset IDs for quick lookup
const PRESET_IDS = new Set(HERO_UI_THEME_PRESETS.map((p) => p.id));

// Check if the given theme preset ID is valid
export function isValidThemePreset(presetId) {
  return PRESET_IDS.has(presetId);
}

// Apply the selected theme preset to the HTML document
export function applyThemePresetToDocument(presetId) {
  // Use the default preset if the provided ID is invalid
  const id = isValidThemePreset(presetId) ? presetId : DEFAULT_THEME_PRESET_ID;

  document.documentElement.setAttribute("data-theme-preset", id);
}

// Custom hook to access the ThemeContext
export function useTheme() {
  const ctx = useContext(ThemeContext);

  // Ensure the hook is used inside ThemeProvider
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return ctx;
}
