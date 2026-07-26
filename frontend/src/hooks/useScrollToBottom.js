import { useEffect, useRef } from "react";

/**
 * Automatically scrolls a container to the bottom whenever
 * the active conversation or latest message changes.
 */
function useScrollToBottom(threadKey, lastItemId) {
  // Reference to the scrollable container
  const scrollRef = useRef(null);

  useEffect(() => {
    // Do nothing if no conversation is selected
    if (threadKey == null || threadKey === "") return;

    const el = scrollRef.current;
    if (!el) return;

    // Scroll the container to the bottom
    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight;
    };

    // Scroll immediately
    scrollToBottom();

    // Scroll again after the next render to handle delayed content
    requestAnimationFrame(scrollToBottom);
  }, [threadKey, lastItemId]);

  return scrollRef;
}

export default useScrollToBottom;
