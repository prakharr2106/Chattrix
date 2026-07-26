// Displays an avatar with an online/offline status indicator.

export function AvatarWithOnlineIndicator({
  isOnline,
  children,
  dotClassName = "",
}) {
  return (
    // Avatar container
    <div className="relative inline-flex shrink-0">
      {children}

      {/* Presence indicator */}
      <span
        className={`pointer-events-none absolute bottom-0 right-0 z-10 size-[11px] rounded-full border-[2.5px] border-white shadow-sm dark:border-zinc-950 ${
          isOnline ? "bg-emerald-500" : "bg-[#C7C7CC] dark:bg-[#636366]"
        } ${dotClassName}`}
        aria-hidden
      />

      {/* Screen reader status */}
      <span className="sr-only">{isOnline ? "Online" : "Offline"}</span>
    </div>
  );
}
