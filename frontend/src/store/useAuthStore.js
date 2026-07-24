import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { io } from "socket.io-client";

// Backend URL (localhost in development, relative path in production)
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  // Authentication and socket state
  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Verify whether the user is authenticated
  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      // Fetch authenticated user details
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      // Connect to Socket.IO after successful authentication
      get().connectSocket(res.data);
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Clear authentication state and disconnect socket
  clearAuth: () => {
    set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
    get().disconnectSocket();
  },

  // Establish a Socket.IO connection
  connectSocket: (user) => {
    // Do nothing if no user exists or socket is already connected
    if (!user || get().socket?.connected) return;

    // Create a new socket connection
    const socket = io(BASE_URL, { query: { userId: user._id } });

    set({ socket });

    // Listen for updates to the list of online users
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // Disconnect the Socket.IO connection
  disconnectSocket: () => {
    const socket = get().socket;

    if (socket?.connected) socket.disconnect();

    set({ socket: null });
  },
}));
