import { WallpaperProvider } from "./context/WallpaperContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { useAuth } from "@clerk/react";
import PageLoader from "./components/PageLoader.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  // Clerk authentication state
  const { isSignedIn, isLoaded } = useAuth();

  // Zustand auth store actions and state
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    // Wait until Clerk finishes loading
    if (!isLoaded) return;

    // Sync app authentication state with Clerk
    if (isSignedIn) checkAuth();
    else clearAuth();
  }, [checkAuth, clearAuth, isLoaded, isSignedIn]);

  // Show loading screen while authentication is being verified
  if (!isLoaded || (isSignedIn && isCheckingAuth)) return <PageLoader />;

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          {/* Protected chat route */}
          <Route
            path="/"
            element={
              isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />
            }
          />

          {/* Authentication route */}
          <Route
            path="/auth"
            element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}
          />
        </Routes>

        {/* Toast notifications */}
        <Toaster />
      </WallpaperProvider>
    </ThemeProvider>
  );
}

export default App;
