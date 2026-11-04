"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { MdClose } from "react-icons/md";
import { FOCUS_RING } from "@/components/form/fields";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ContactForm } from "@/components/sections/ContactForm";
import { FORMS_READY } from "@/lib/features";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const CONTACT_EMAIL = "hola@somospuentecultural.com";

const OpenContext = createContext<((trigger: HTMLElement) => void) | null>(null);

/**
 * The landing's contact form, in a native modal <dialog> opened from
 * ContactModalButton. Wraps the page so any section can place a button.
 * The form stays mounted while closed (what was typed survives reopening);
 * after a successful send it is remounted on close, fresh for next time.
 * Without FORMS_READY there's no dialog and the buttons render nothing.
 */
export function ContactModalProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const c = t.contactForm;
  const titleId = useId();
  const subtitleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  // Whether the press started on the backdrop: a text selection dragged out
  // of the window must not count as a click outside.
  const pressedOutsideRef = useRef(false);
  const [formKey, setFormKey] = useState(0);
  const sentRef = useRef(false);

  const open = useCallback((trigger: HTMLElement) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    triggerRef.current = trigger;
    dialog.showModal();
    // Page behind stays put while the modal scrolls on its own.
    document.documentElement.style.overflow = "hidden";
    dialog.scrollTop = 0;
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
        // < 640 px: the whole screen. From sm: centered, up to 640 px wide
        // and 90vh tall; the dialog itself is the scroll area.
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-white p-0 text-negro backdrop:bg-negro/60 open:motion-safe:animate-[fade-in_200ms_ease-out] sm:m-auto sm:h-auto sm:max-h-[90vh] sm:w-[calc(100%-2rem)] sm:max-w-[640px] sm:rounded-3xl sm:shadow-xl"
      >
        <div className="flex min-h-full flex-col">
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
              {c.title}
            </h2>
            <p id={subtitleId} className="mt-3 text-lg text-negro/80">
              {c.subtitle}
            </p>
            <div className="mt-8">
              <ContactForm key={formKey} onSuccess={markSent} />
            </div>
          </div>
        </div>
      </dialog>
    </OpenContext.Provider>
  );
}

const LINK_CLASS: Record<"light" | "dark", string> = {
  light:
    "text-morado-oscuro decoration-morado-oscuro/40 hover:text-coral hover:decoration-coral focus-visible:outline-morado-oscuro",
  dark: "text-crema decoration-crema/50 hover:text-amarillo hover:decoration-amarillo focus-visible:outline-amarillo",
};

/**
 * Secondary text-link-style action that opens the contact modal — below the
 * payment buttons in the hierarchy, never competing with them.
 * Without JavaScript (or if the page never hydrates: no-hydrate) the js:
 * variant swaps it for a mailto: link with the same text.
 */
export function ContactModalButton({
  surface = "light",
  className = "",
}: {
  /** Background it sits on: crema/white ("light") or morado ("dark"). */
  surface?: "light" | "dark";
  className?: string;
}) {
  const open = useContext(OpenContext);
  const { t } = useLanguage();
  if (!FORMS_READY) return null;

  const label = t.contactForm.openButton;
  const base = `min-h-11 items-center justify-center text-center text-base font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 ${LINK_CLASS[surface]} ${className}`;

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={(event) => open?.(event.currentTarget)}
        className={`hidden cursor-pointer js:inline-flex ${base}`}
      >
        {label}
      </button>
      <a href={`mailto:${CONTACT_EMAIL}`} className={`inline-flex js:hidden ${base}`}>
        {label}
      </a>
    </>
  );
}
