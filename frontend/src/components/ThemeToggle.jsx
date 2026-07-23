import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme.js";

export function ThemeToggle() {
  // Get the current theme and function to update it
  const { theme, setTheme } = useTheme();

  return (
    // Theme switch container
    <div className="flex items-center gap-1 rounded-full border border-default bg-surface p-1 shadow-sm">
      {/* Light mode button */}
      <Button
        size="sm"
        variant={theme === "light" ? "primary" : "ghost"}
        isIconOnly
        onPress={() => setTheme("light")}
      >
        <Sun className="size-4" />
      </Button>

      {/* Dark mode button */}
      <Button
        size="sm"
        variant={theme === "dark" ? "primary" : "ghost"}
        isIconOnly
        onPress={() => setTheme("dark")}
      >
        <Moon className="size-4" />
      </Button>
    </div>
  );
}
