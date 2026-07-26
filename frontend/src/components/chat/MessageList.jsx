import useScrollToBottom from "../../hooks/useScrollToBottom.js";
import { MessageBubble } from "./MessageBubble.jsx";
import { NoConversationPlaceholder } from "./NoConversationPlaceholder.jsx";
import { useSelectedConversation } from "../../hooks/useSelectedConversation.js";

export function MessageList() {
  // Get the currently selected conversation
  const { activeConversation, activeConversationId } =
    useSelectedConversation();

  // Get the ID of the latest message
  const lastMessageId = activeConversation?.messages.at(-1)?.id;

  // Automatically scroll to the latest message
  const messagesScrollRef = useScrollToBottom(
    activeConversationId,
    lastMessageId,
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {activeConversation ? (
        <div
          ref={messagesScrollRef}
          className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-3 sm:py-4"
        >
          {/* Date separator */}
          <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-wide text-muted">
            Today
          </p>

          {/* Render all messages in the conversation */}
          {activeConversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      ) : (
        // Show placeholder when no conversation is selected
        <NoConversationPlaceholder />
      )}
    </div>
  );
}
