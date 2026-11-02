import axios from "axios";

export const axiosInstance = axios.create({
  // Use the local backend in development, otherwise use the deployed API
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api",

  // Include cookies (e.g., authentication) with every request
  withCredentials: true,
});

// Attach Clerk session token as Bearer auth for cross-origin backend API calls
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== "undefined" && window.Clerk) {
        // Ensure Clerk has finished loading before requesting the session token
        if (!window.Clerk.loaded && typeof window.Clerk.load === "function") {
          await window.Clerk.load();
        }

        const token = await window.Clerk.session?.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Failed to attach Clerk token to request:", error);
    }

    return config;
  },
  (error) => Promise.reject(error),
);
