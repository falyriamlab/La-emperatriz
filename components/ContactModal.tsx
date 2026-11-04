"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";
import { MdClose } from "react-icons/md";
import { FOCUS_RING } from "@/components/form/fields";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ContactForm, type ContactFormMode } from "@/components/sections/ContactForm";
import { FORMS_READY } from "@/lib/features";
import { BOOKING_LINK } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type OpenModal = (trigger: HTMLElement, mode: ContactFormMode) => void;
const OpenContext = createContext<OpenModal | null>(null);

const noopSubscribe = () => () => {};

/**
 * The landing's contact form, in a native modal <dialog>. Wraps the page so
 * any section can open it — today, the "Agendar sesión semilla" links
 * (useBookingLink), in "semilla" mode.
 * The form stays mounted while closed (what was typed survives reopening);
 * after a successful send it is remounted on close, fresh for next time.
 * Without FORMS_READY there's no dialog and the links go straight to the
 * calendar.
 */
export function ContactModalProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const c = t.contactForm;
  const titleId = useId();
  const subtitleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  // Whether the press started on the backdrop: a text selection dragged out
  // of the window must not count as a click outside.
  const pressedOutsideRef = useRef(false);
  const [formKey, setFormKey] = useState(0);
  const [mode, setMode] = useState<ContactFormMode>("semilla");
  const sentRef = useRef(false);

  const open = useCallback<OpenModal>((trigger, nextMode) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    triggerRef.current = trigger;
    setMode(nextMode);
    dialog.showModal();
    // Page behind stays put while the modal scrolls on its own.
    document.documentElement.style.overflow = "hidden";
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    dialog.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  }, []);

  const markSent = useCallback(() => {
    sentRef.current = true;
  }, []);

  // Runs for every way of closing: the X, Esc (native cancel) and the backdrop.
  function handleClose() {
    document.documentElement.style.overflow = "";
    if (sentRef.current) {
      sentRef.current = false;
      setFormKey((key) => key + 1);
    }
    triggerRef.current?.focus();
  }

  function isBackdrop(event: MouseEvent<HTMLDialogElement>) {
    // The dialog's content fills the whole box, so only the ::backdrop
    // area hits the <dialog> element itself.
    return event.target === event.currentTarget;
  }

  if (!FORMS_READY) return <>{children}</>;

  const seed = mode === "semilla";

  return (
    <OpenContext.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
        onClose={handleClose}
        onPointerDown={(event) => {
          pressedOutsideRef.current = isBackdrop(event);
        }}
        onClick={(event) => {
          if (pressedOutsideRef.current && isBackdrop(event)) dialogRef.current?.close();
        }}
        // < 640 px: the whole screen, no radius. From sm: centered, up to
        // 640 px wide and 90vh tall, four rounded corners — the dialog
        // clips (overflow-hidden) and the inner layer scrolls, so the
        // scrollbar never squares off the corners. sm:h-fit, not h-auto: a
        // modal dialog is pinned with inset 0, so "auto" would stretch it
        // to the max height even when the content (e.g. success) is short.
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-white p-0 text-negro backdrop:bg-negro/60 open:motion-safe:animate-[fade-in_200ms_ease-out] sm:m-auto sm:h-fit sm:max-h-[90vh] sm:w-[calc(100%-2rem)] sm:max-w-[640px] sm:rounded-3xl sm:shadow-xl"
      >
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto overscroll-contain sm:h-auto sm:max-h-[90vh]"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-morado-oscuro/10 bg-white/95 px-4 py-2 backdrop-blur sm:px-6">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={c.close}
              className={`flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-full text-morado-oscuro hover:bg-morado-oscuro/10 ${FOCUS_RING}`}
            >
              <MdClose aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 pt-6 pb-10 sm:px-10">
            <h2
              id={titleId}
              className="font-display text-3xl font-semibold italic text-morado-oscuro sm:text-4xl"
            >
              {seed ? c.semilla.title : c.title}
            </h2>
            <p id={subtitleId} className="mt-3 text-lg text-negro/80">
              {seed ? c.semilla.subtitle : c.subtitle}
            </p>
            <div className="mt-8">
              <ContactForm key={formKey} mode={mode} onSuccess={markSent} />
            </div>
          </div>
        </div>
      </dialog>
    </OpenContext.Provider>
  );
}

/**
 * Props for every "Agendar sesión semilla" link. Progressive enhancement:
 * it is always a real link to the calendar (BOOKING_LINK, new tab); with
 * JavaScript and FORMS_READY the click is intercepted and the form opens
 * first, in "semilla" mode. Without JS, with no-hydrate, without
 * FORMS_READY, or on ctrl/cmd/shift/middle click, it goes to the calendar.
 */
export function useBookingLink() {
  const open = useContext(OpenContext);
  // false on the server and during hydration, so the markup matches.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const enabled = FORMS_READY && open !== null && hydrated;

  return {
    href: BOOKING_LINK,
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-haspopup": enabled ? ("dialog" as const) : undefined,
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      if (!enabled || !open) return;
      if (document.documentElement.classList.contains("no-hydrate")) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(event.currentTarget, "semilla");
    },
  };
}
