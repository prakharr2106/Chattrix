import { useEffect, useLayoutEffect, useState } from "react";
import { DEFAULT_THEME_PRESET_ID } from "../data/herouiThemePresets.js";
import {
  applyThemePresetToDocument,
  isValidThemePreset,
  ThemeContext,
} from "./theme.js";

// Returns the user's system theme preference
function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Reads the saved light/dark theme from local storage
function readStoredTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") return theme;

  return null;
}

// Applies the selected theme to the document
function applyDomTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
}

// Reads the saved theme preset from local storage
function readStoredThemePreset() {
  const themePreset = localStorage.getItem("theme-preset");
  if (themePreset && isValidThemePreset(themePreset)) return themePreset;

  return DEFAULT_THEME_PRESET_ID;
}

export function ThemeProvider({ children }) {
  // Store the current theme and theme preset
  const [theme, setThemeState] = useState(
    () => readStoredTheme() ?? getSystemTheme(),
  );
  const [themePreset, setThemePresetState] = useState(readStoredThemePreset);

  // Apply light/dark mode whenever the theme changes
  useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  // Apply the selected color preset
  useLayoutEffect(() => {
    applyThemePresetToDocument(themePreset);
  }, [themePreset]);

  // Save the current settings to local storage
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("theme-preset", themePreset);
  }, [theme, themePreset]);

  // Updates the theme
  const setTheme = (next) => setThemeState(next);

  // Switches between light and dark mode
  const toggleTheme = () => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  };

  // Updates the theme preset after validation
  const setThemePreset = (next) => {
    setThemePresetState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      return isValidThemePreset(resolved) ? resolved : DEFAULT_THEME_PRESET_ID;
    });
  };

  // Values shared with all components
  const value = { theme, setTheme, toggleTheme, themePreset, setThemePreset };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
