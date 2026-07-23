import { Button, Modal, useOverlayState } from "@heroui/react";
import { Check, ImageIcon } from "lucide-react";
import { useTransition } from "react";
import { useWallpaper } from "../context/wallpaper.js";
import { WALLPAPER_SECTIONS, WALLPAPERS } from "../data/wallpapers.js";

// Renders a single wallpaper thumbnail
function WallpaperThumb({ wallpaper, selected, onSelect }) {
  return (
    <button
      type="button"
      // Select this wallpaper when clicked
      onClick={() => onSelect(wallpaper.id)}
      className={[
        "relative aspect-4/3 w-full overflow-hidden rounded-xl bg-zinc-900 contain-[layout]",

        // Highlight the selected wallpaper
        selected
          ? "outline-2 outline-offset-2 outline-white"
          : "outline-1 outline-transparent hover:outline-white/45",

        // Accessibility focus styles
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2a2c]",
      ].join(" ")}
      aria-pressed={selected}
    >
      {/* Wallpaper preview */}
      <img
        src={wallpaper.url}
        alt=""
        width={320}
        height={240}
        className="pointer-events-none h-full w-full object-cover select-none"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
        referrerPolicy="no-referrer"
        draggable={false}
      />

      {/* Wallpaper name */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-black/55 px-2 py-1.5 text-left text-[11px] font-medium leading-tight text-white/95">
        {wallpaper.label}
      </span>

      {/* Selected indicator */}
      {selected ? (
        <span className="absolute right-1.5 top-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-white text-[#1a1a1c] shadow-md">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      ) : null}
    </button>
  );
}

export function WallpaperPicker() {
  // Controls modal open/close state
  const modal = useOverlayState();

  // Current wallpaper and updater
  const { wallpaperId, setWallpaperId } = useWallpaper();

  // Marks wallpaper update as a non-urgent UI update
  const [, startTransition] = useTransition();

  // Handle wallpaper selection
  const handleSelect = (id) => {
    // Close the modal
    modal.close();

    // Update the selected wallpaper
    startTransition(() => {
      setWallpaperId(id);
    });
  };

  return (
    <Modal.Root state={modal}>
      {/* Button to open wallpaper picker */}
      <Modal.Trigger>
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="text-foreground"
        >
          <ImageIcon className="size-5" />
        </Button>
      </Modal.Trigger>

      <Modal.Backdrop variant="opaque">
        <Modal.Container size="lg" scroll="inside" placement="center">
          <Modal.Dialog className="max-h-[85dvh] border border-white/10 bg-[#2a2a2c] text-foreground shadow-2xl">
            {/* Modal header */}
            <Modal.Header className="flex flex-row items-center justify-between gap-3 border-b border-white/10 pb-3">
              <Modal.Heading className="text-lg font-semibold tracking-tight text-white">
                Backdrop
              </Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="isolate space-y-8 pt-4">
              {/* Render wallpapers grouped by category */}
              {WALLPAPER_SECTIONS.map((section) => (
                <section key={section.id} className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-400">
                    {section.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {/* Render wallpapers for the current category */}
                    {WALLPAPERS.filter((w) => w.category === section.id).map(
                      (w) => (
                        <WallpaperThumb
                          key={w.id}
                          wallpaper={w}
                          selected={wallpaperId === w.id}
                          onSelect={handleSelect}
                        />
                      ),
                    )}
                  </div>
                </section>
              ))}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}
