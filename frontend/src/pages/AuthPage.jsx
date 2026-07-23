import { AuthActionPanel } from "../components/auth/AuthActionPanel.jsx";
import AuthHeader from "../components/auth/AuthHeader.jsx";
import { AuthHeroPanel } from "../components/auth/AuthHeroPanel.jsx";
import { useWallpaper } from "../context/wallpaper.js";

function AuthPage() {
  // Get the current wallpaper frame style
  const { frameStyle } = useWallpaper();

  return (
    // Full-screen container with dynamic wallpaper styling
    <div
      className="box-border flex min-h-dvh flex-col p-3 sm:p-5 md:p-8"
      style={frameStyle}
    >
      {/* Main authentication card */}
      <div className="mx-auto flex w-full max-w-368 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-background text-foreground">
        {/* Top navigation/header */}
        <AuthHeader />

        {/* Authentication content */}
        <main className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
          {/* Left section (branding/illustration) */}
          <AuthHeroPanel />

          {/* Right section (Sign In / Sign Up) */}
          <AuthActionPanel />
        </main>
      </div>
    </div>
  );
}

export default AuthPage;
