"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import IconButton from "./IconButton";

/**
 * Slide-over panel used for the Firewise rail below 1536px and for the mobile navigation
 * drawer. Mounts/unmounts with the panel so focus never lingers on a hidden control.
 */
export default function Drawer({ open, onClose, title, description, side = "right", width = "w-[min(400px,92vw)]", children, headerAccessory }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const position = side === "left" ? "left-0 border-r" : "right-0 border-l";

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close panel"
        className="absolute inset-0 h-full w-full cursor-default bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fx-glass absolute inset-y-0 ${position} ${width} flex flex-col border-line shadow-2xl animate-fade-in`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3.5">
          <div className="min-w-0">
            <h2 className="text-xs font-semibold text-ink">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{description}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {headerAccessory}
            <IconButton icon={X} label="Close panel" onClick={onClose} size="sm" />
          </div>
        </div>
        <div className="fx-scrollbar flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
