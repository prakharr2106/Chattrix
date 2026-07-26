import { useWallpaper } from "../context/wallpaper.js";
import { useChatStore } from "../store/useChatStore.js";
import { useSelectedConversation } from "../hooks/useSelectedConversation.js";
import { useEffect } from "react";
import ChatSidebar from "../components/chat/ChatSidebar.jsx";
import { ChatHeader } from "../components/chat/ChatHeader.jsx";
import { MessageList } from "../components/chat/MessageList.jsx";
import { ChatComposer } from "../components/chat/ChatComposer.jsx";

function ChatPage() {
  // Get the current wallpaper styling
  const { frameStyle } = useWallpaper();

  // Chat store actions
  const getConversations = useChatStore((state) => state.getConversations);
  const getMessages = useChatStore((state) => state.getMessages);
  const getUsers = useChatStore((state) => state.getUsers);
  const subscribeToMessages = useChatStore(
    (state) => state.subscribeToMessages,
  );
  const unsubscribeFromMessages = useChatStore(
    (state) => state.unsubscribeFromMessages,
  );

  // Currently selected conversation and screen size
  const { activeConversation, activeConversationId, isLargeScreen } =
    useSelectedConversation();

  // Load users and conversations when the page mounts
  useEffect(() => {
    getUsers();
    getConversations();
  }, [getConversations, getUsers]);

  useEffect(() => {
    // Do nothing if no conversation is selected
    if (!activeConversationId) return;

    // Load messages and start listening for new ones
    getMessages(activeConversationId);
    subscribeToMessages(activeConversationId);

    // Stop listening when the conversation changes or component unmounts
    return () => unsubscribeFromMessages();
  }, [
    getMessages,
    activeConversationId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  return (
    // Main chat page container
    <div
      className="flex h-dvh flex-col overflow-hidden p-2 sm:p-3 md:p-8"
      style={frameStyle}
    >
      {/* Chat layout */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden rounded-2xl border border-border bg-background text-foreground">
        <ChatSidebar />

        {/* Chat area */}
        <div
          className={`flex-1 flex-col overflow-hidden ${
            !isLargeScreen && !activeConversationId ? "hidden lg:flex" : "flex"
          }`}
        >
          <ChatHeader />
          <MessageList />

          {/* Show the message input only when a conversation is selected */}
          {activeConversation ? <ChatComposer /> : null}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
