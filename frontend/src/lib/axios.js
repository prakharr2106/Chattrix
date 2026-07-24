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
