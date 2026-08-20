"use client";

import { useEffect, useRef, useState } from "react";

type CopyableEmailProps = {
  email: string;
  copyLabel: string;
  copiedLabel: string;
  ariaLabel: string;
};

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 flex-none"
      aria-hidden="true"
    >
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M13 7V4.5A1.5 1.5 0 0 0 11.5 3h-8A1.5 1.5 0 0 0 2 4.5v8A1.5 1.5 0 0 0 3.5 14H6" />
    </svg>
  );
}

/**
 * Giant, click-to-copy email — the footer's typographic centerpiece. The
 * pill tooltip follows the mouse on hover-capable devices; on touch/
 * keyboard (no cursor to track) it centers itself above the button instead.
 */
export function CopyableEmail({
  email,
  copyLabel,
  copiedLabel,
  ariaLabel,
}: CopyableEmailProps) {
  const [hovering, setHovering] = useState(false);
  const [tracksCursor, setTracksCursor] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const copiedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchHideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
      if (touchHideTimeout.current) clearTimeout(touchHideTimeout.current);
    };
  }, []);

  function showAtCursor(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTracksCursor(true);
    setHovering(true);
  }

  function showCentered() {
    setTracksCursor(false);
    setHovering(true);
  }

  function hide() {
    setHovering(false);
  }

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    // Touch devices fire click without a real hover/mousemove — show the
    // centered tooltip briefly so the "¡Copiado!" confirmation is visible.
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (!canHover) {
      showCentered();
      if (touchHideTimeout.current) clearTimeout(touchHideTimeout.current);
      touchHideTimeout.current = setTimeout(hide, 2000);
    }

    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setAnnouncement(copiedLabel);
      if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
      copiedTimeout.current = setTimeout(() => {
        setCopied(false);
        setAnnouncement("");
      }, 2000);
    } catch {
      // Clipboard API unsupported or permission denied — fail silently,
      // the button stays usable, we just skip the "copied" confirmation.
    }
  }

  const label = copied ? copiedLabel : copyLabel;

  return (
    // min-w-0: flex items default to min-width:auto, which refuses to
    // shrink below the email's un-wrapped intrinsic width and blows out
    // the viewport on mobile — this is what actually lets `break-words`
    // on the button kick in once the available width is genuinely tight.
    <div className="relative inline-block min-w-0 max-w-full">
      <button
        type="button"
        aria-label={ariaLabel}
        onMouseEnter={showAtCursor}
        onMouseMove={showAtCursor}
        onMouseLeave={hide}
        onFocus={showCentered}
        onBlur={hide}
        onClick={handleClick}
        className="block w-full font-sans text-3xl font-extrabold tracking-tight text-coral break-words sm:text-4xl md:text-5xl lg:text-6xl"
      >
        {email}
      </button>

      {/* Positioned BELOW the cursor/button, never above: this sits inside
          the email's own z-0 stacking context (see Footer.tsx), which is
          capped under the cards' z-20 — an "above" tooltip would render
          faded, underneath the cards, wherever it geometrically overlaps
          them. Below, it's always over plain footer background instead. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute z-10 inline-flex items-center gap-1.5 rounded-full bg-morado-oscuro px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-crema motion-safe:transition-opacity motion-safe:duration-150 motion-safe:ease-out ${
          hovering ? "opacity-100" : "opacity-0"
        } ${
          tracksCursor
            ? "top-0 left-0"
            : "bottom-0 left-1/2 -translate-x-1/2 translate-y-[140%]"
        }`}
        style={
          tracksCursor
            ? { transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, 16px)` }
            : undefined
        }
      >
        <CopyIcon />
        {label}
      </span>

      {/* The button's aria-label already covers "what this does"; this
          only needs to announce the dynamic "copied" confirmation, which
          the visual tooltip doesn't communicate to screen readers on its own. */}
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
