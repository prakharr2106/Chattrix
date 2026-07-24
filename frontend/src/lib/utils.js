// Format a date/time value into a readable time (e.g., 3:45 PM)
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}
