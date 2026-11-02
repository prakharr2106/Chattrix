import { Button, TextArea } from "@heroui/react";
import { ImageIcon, LoaderIcon, SendHorizontalIcon } from "lucide-react";
import { useRef } from "react";
import useKeyboardSound from "../../hooks/useKeyboardSound.js";
import { useChatStore } from "../../store/useChatStore.js";
import { useSelectedConversation } from "../../hooks/useSelectedConversation.js";

export function ChatComposer() {
  // Chat state and actions
  const composerText = useChatStore((state) => state.composerText);
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const sendMediaMessage = useChatStore((state) => state.sendMediaMessage);
  const isSendingMedia = useChatStore((state) => state.isSendingMedia);
  const sendTextMessage = useChatStore((state) => state.sendTextMessage);
  const setComposerText = useChatStore((state) => state.setComposerText);

  // Currently selected conversation
  const { activeConversationId } = useSelectedConversation();

  // Keyboard sound effect
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  // Reference to the hidden file input
  const mediaInputRef = useRef(null);

  // Play typing sound if sound effects are enabled
  const playSoundIfEnabled = () => {
    if (isSoundEnabled) playRandomKeyStrokeSound();
  };

  // Send a text message
  const handleSend = async () => {
    const didSendMessage = await sendTextMessage(activeConversationId);

    if (didSendMessage) playSoundIfEnabled();
  };

  // Update the message input as the user types
  const handleComposerTextChange = (event) => {
    setComposerText(event.target.value);
    playSoundIfEnabled();
  };

  // Upload and send the selected media file
  const handleMediaPick = async (event) => {
    const file = event.target.files?.[0];

    // Reset input so the same file can be selected again
    event.target.value = "";

    if (!file) return;

    const didSendMessage = await sendMediaMessage({
      conversationId: activeConversationId,
      file,
    });

    if (didSendMessage) playSoundIfEnabled();
  };

  return (
    <footer className="shrink-0 border-t border-border px-1.5 pb-2 pt-2 sm:px-2">
      {/* Show upload progress while media is being sent */}
      {isSendingMedia ? (
        <div className="mx-auto mb-2 flex max-w-full items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">
          <LoaderIcon
            className="size-4 shrink-0 animate-spin text-accent"
            strokeWidth={2}
            aria-hidden
          />
          <span className="truncate">Uploading media...</span>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-full items-end gap-1.5 px-0.5 sm:gap-2 sm:px-1">
        {/* Hidden file input for image/video uploads */}
        <input
          ref={mediaInputRef}
          type="file"
          accept="image/*,video/*"
          className="sr-only"
          disabled={isSendingMedia}
          tabIndex={-1}
          aria-hidden
          onChange={handleMediaPick}
        />

        {/* Button to open the file picker */}
        <Button
          variant="ghost"
          isIconOnly
          isDisabled={isSendingMedia}
          className="size-9 shrink-0 touch-manipulation self-end text-accent"
          onPress={() => mediaInputRef.current?.click()}
        >
          <ImageIcon className="size-5 sm:size-6" strokeWidth={2} />
        </Button>

        {/* Text input for composing messages */}
        <TextArea
          fullWidth
          variant="secondary"
          placeholder="Chattrix"
          rows={1}
          value={composerText}
          onChange={handleComposerTextChange}
          onKeyDown={(event) => {
            // Press Enter to send (Shift + Enter inserts a new line)
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 rounded-full"
        />

        {/* Send button */}
        <Button
          variant="primary"
          isIconOnly
          isDisabled={!composerText.trim()}
          onPress={handleSend}
        >
          <SendHorizontalIcon className="size-5" />
        </Button>
      </div>
    </footer>
  );
}
