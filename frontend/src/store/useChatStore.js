import { create } from "zustand";
import { persist } from "zustand/middleware";

import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
import toast from "react-hot-toast";

export const useChatStore = create(
  persist(
    (set, get) => ({
      // Store state
      users: [],
      conversations: [],
      messages: [],
      selectedUser: null,

      // Loading states
      isConversationsLoading: false,
      isUsersLoading: false,
      isMessagesLoading: false,

      // UI state
      activeConversationId: null,
      searchQuery: "",
      sidebarTab: "chats",
      composerText: "",
      isSoundEnabled: true,
      isSendingMedia: false,

      // Fetch all users
      getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");

          // Update users and preserve selected user if it still exists
          set((state) => ({
            users: res.data,
            selectedUser:
              state.selectedUser &&
              res.data.some((user) => user._id === state.selectedUser._id)
                ? state.selectedUser
                : null,
          }));
        } catch (error) {
          console.log("Error in get Users", error.message);
        } finally {
          set({ isUsersLoading: false });
        }
      },

      // Fetch all conversations
      getConversations: async () => {
        set({ isConversationsLoading: true });
        try {
          const res = await axiosInstance.get("/messages/conversations");
          set({ conversations: res.data });
        } catch (error) {
          console.log("Error in getConversations", error.message);
        } finally {
          set({ isConversationsLoading: false });
        }
      },

      // Fetch messages for the selected user
      getMessages: async (userId) => {
        if (!userId) return;

        set({ isMessagesLoading: true });

        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({ messages: res.data });
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to load messages",
          );
        } finally {
          set({ isMessagesLoading: false });
        }
      },

      // Send a message to the selected user
      sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        if (!selectedUser) return false;

        try {
          const res = await axiosInstance.post(
            `/messages/send/${selectedUser._id}`,
            messageData,
          );

          // Append the new message and clear the input
          set({
            messages: [...messages, res.data],
            composerText: "",
          });

          // Refresh conversation list
          get().getConversations();

          return true;
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to send message",
          );
          return false;
        }
      },

      // Listen for incoming messages
      subscribeToMessages: (userId) => {
        if (!userId) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        // Prevent duplicate event listeners
        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
          // Ignore messages from other users
          if (String(newMessage.senderId) !== String(userId)) return;

          // Add the received message
          set({ messages: [...get().messages, newMessage] });

          // Refresh conversations
          get().getConversations();
        });
      },

      // Stop listening for new messages
      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
      },

      // Select a user to chat with
      setSelectedUser: (selectedUser) => set({ selectedUser }),

      // Set the active conversation
      setActiveConversationId: (activeConversationId) => {
        set((state) => ({
          activeConversationId,

          // Find the corresponding user
          selectedUser:
            state.users.find((user) => user._id === activeConversationId) ||
            state.conversations.find(
              (user) => user._id === activeConversationId,
            ) ||
            null,

          // Clear messages if no conversation is selected
          messages: activeConversationId ? state.messages : [],
        }));
      },

      // UI state setters
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSidebarTab: (sidebarTab) => set({ sidebarTab }),
      setComposerText: (composerText) => set({ composerText }),
      setSoundEnabled: (isSoundEnabled) => set({ isSoundEnabled }),

      // Send a text message
      sendTextMessage: async (conversationId) => {
        const messageText = get().composerText.trim();

        if (!conversationId || !messageText) return false;

        return get().sendMessage({ text: messageText });
      },

      // Send an image/video message
      sendMediaMessage: async ({ conversationId, file }) => {
        if (!conversationId || !file) return false;

        const formData = new FormData();
        formData.append("media", file);

        set({ isSendingMedia: true });

        try {
          return await get().sendMessage(formData);
        } finally {
          set({ isSendingMedia: false });
        }
      },
    }),
    {
      // Persist selected settings across page reloads
      name: "chattrix-storage",

      // Only save the sound preference
      partialize: (state) => ({
        isSoundEnabled: state.isSoundEnabled,
      }),
    },
  ),
);
