"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type FormEvent,
} from "react";
import { MdCheck } from "react-icons/md";
import { CTAButton } from "@/components/CTAButton";
import {
  describedBy,
  EMAIL_RE,
  ErrorMessage,
  FOCUS_RING,
  HINT_CLASS,
  isValidPhone,
  LABEL_CLASS,
  PrivacyInfo,
  textInputClass,
} from "@/components/form/fields";
import { ChevronDown } from "@/components/icons/ChevronDown";
import { getCountryName, getCountryOptions, type CountryCode } from "@/lib/countries";
import { LEGAL } from "@/lib/legal";
import { BOOKING_LINK } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { submitLead, type BudgetKey, type ProjectTypeKey } from "@/lib/leads";

// ── Config ────────────────────────────────────────────────────────────────
const FIELD_REQUIRED = { name: true, email: true, phone: true, country: true, projectType: true, budget: true };
// ──────────────────────────────────────────────────────────────────────────

// Option order on screen. These keys are what gets submitted; labels are
// looked up in the dictionary (never send the translated label).
const PROJECT_TYPES: ProjectTypeKey[] = [
  "escenicas",
  "danza",
  "musica",
  "visuales",
  "escritura",
  "editorial",
  "espiritualidad",
  "genero",
  "interdisciplinar",
  "otro", // always last
];
const BUDGETS: BudgetKey[] = ["lt100", "r100_150", "r150_250", "gt250"];

type Field = keyof typeof FIELD_REQUIRED;
type ValidatedField = Field | "consent";
// Errors are stored as dictionary keys, not strings, so switching ES↔PT
// re-translates any message already on screen.
type ErrorKey = "required" | "email" | "phone" | "choose" | "chooseAtLeastOne" | "consent";
type Errors = Partial<Record<ValidatedField, ErrorKey>>;
type Status = "idle" | "sending" | "success" | "error";

type Values = {
  name: string;
  email: string;
  phone: string;
  country: CountryCode | "";
  /** Multi-select: any number of keys, kept in PROJECT_TYPES order. */
  projectType: ProjectTypeKey[];
  budget: BudgetKey | "";
  consent: boolean;
};

const INITIAL_VALUES: Values = {
  name: "",
  email: "",
  phone: "",
  country: "",
  projectType: [],
  budget: "",
  consent: false,
};

// DOM order — the first invalid one in this list receives focus on submit.
const FIELD_ORDER: ValidatedField[] = ["name", "email", "phone", "country", "projectType", "budget", "consent"];

function validate(field: ValidatedField, values: Values): ErrorKey | undefined {
  if (field === "consent") return values.consent ? undefined : "consent";

  if (field === "country" || field === "projectType" || field === "budget") {
    // Required = at least one selected (projectType is an array). The
    // multi-select gets its own wording ("al menos una"); country and
    // budget keep the single-choice message.
    if (!FIELD_REQUIRED[field] || values[field].length > 0) return undefined;
    return field === "projectType" ? "chooseAtLeastOne" : "choose";
  }

  const value = values[field].trim();
  if (!value) return FIELD_REQUIRED[field] ? "required" : undefined;

  if (field === "email" && !EMAIL_RE.test(value)) return "email";
  if (field === "phone" && !isValidPhone(value)) return "phone";
  return undefined;
}

function validateAll(values: Values): Errors {
  const errors: Errors = {};
  for (const field of FIELD_ORDER) {
    const error = validate(field, values);
    if (error) errors[field] = error;
  }
  return errors;
}

// Country names come from the runtime's Intl data, which can differ between
// Node (static export) and the visitor's browser — so the list is only
// rendered after hydration to avoid a server/client text mismatch.
const noopSubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** "semilla": opened from an "Agendar sesión semilla" link — same form, other texts, and the calendar comes after. */
export type ContactFormMode = "contacto" | "semilla";

// Whether the person has entered anything in a field. Leaving an untouched,
// empty field shows no error (e.g. tabbing past it or closing the modal);
// empty required fields are flagged on submit.
function hasInput(field: ValidatedField, values: Values) {
  if (field === "consent") return values.consent;
  return values[field].length > 0;
}

/**
 * Contact form body (no section, title or card of its own): it lives inside
 * ContactModal, which supplies the title, subtitle and surface. `onSuccess`
 * lets the modal reset it (remount) once it's closed after a sent lead.
 * `mode` only swaps texts (submit, success, error fallback); validation,
 * privacy notices and the submission are the same.
 */
export function ContactForm({
  onSuccess,
  mode = "contacto",
}: {
  onSuccess?: () => void;
  mode?: ContactFormMode;
}) {
  const { t, language } = useLanguage();
  const c = t.contactForm;
  const seed = mode === "semilla";
  const uid = useId();
  const id = (part: string) => `${uid}-${part}`;

  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [consentAt, setConsentAt] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [showSummary, setShowSummary] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const isClient = useIsClient();
  // Re-translated on ES↔PT; the selection survives because it's the code.
  const countryOptions = isClient ? getCountryOptions(language) : [];

  // Synchronous guard against double submit: the disabled button only takes
  // effect after React re-renders, a ref blocks a second click immediately.
  const submittingRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const successTitleRef = useRef<HTMLHeadingElement>(null);
  const fieldRefs = useRef<Partial<Record<ValidatedField, HTMLElement | null>>>({});

  useEffect(() => {
    if (status !== "success") return;
    successTitleRef.current?.focus();
    onSuccess?.();
  }, [status, onSuccess]);

  const hasErrors = FIELD_ORDER.some((field) => errors[field]);

  function setFieldError(field: ValidatedField, nextValues: Values) {
    setErrors((prev) => ({ ...prev, [field]: validate(field, nextValues) }));
  }

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    // Only re-validate live once a field is already flagged, so the message
    // clears as soon as it's fixed — new errors wait for blur/submit.
    if (errors[field as ValidatedField]) setFieldError(field as ValidatedField, nextValues);
  }

  function handleBlur(field: ValidatedField) {
    // A field already flagged keeps being checked; an untouched one waits for submit.
    if (!errors[field] && !hasInput(field, values)) return;
    setFieldError(field, values);
  }

  function handleGroupBlur(field: ValidatedField) {
    return (event: FocusEvent<HTMLElement>) => {
      // Radios: only validate once focus actually leaves the whole group,
      // not while arrowing between options.
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
      handleBlur(field);
    };
  }

  function focusField(field: ValidatedField) {
    const el = fieldRefs.current[field];
    if (!el) return;
    // Default focus scrolling only brings the field to the edge of the
    // modal's scroll area, under its sticky top bar — center it instead.
    el.scrollIntoView({ block: "center" });
    const target =
      el instanceof HTMLFieldSetElement
        ? (el.querySelector<HTMLInputElement>("input:checked") ??
          el.querySelector<HTMLInputElement>("input"))
        : el;
    target?.focus({ preventScroll: true });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    // Honeypot filled → a bot. Pretend it worked, send nothing.
    if (honeypotRef.current?.value) {
      setStatus("success");
      return;
    }

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setShowSummary(true);
      focusField(firstInvalid);
      return;
    }
    setShowSummary(false);

    submittingRef.current = true;
    setStatus("sending");
    const now = new Date().toISOString();
    const result = await submitLead({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      country: values.country,
      countryName: values.country ? getCountryName(values.country, "es") : "",
      projectType: values.projectType,
      budget: values.budget,
      language,
      consent: true,
      consentAt: consentAt ?? now,
      pageUrl: window.location.href,
      submittedAt: now,
    });
    submittingRef.current = false;
    setStatus(result.ok ? "success" : "error");
  }

  function renderTextField(
    field: "name" | "email" | "phone",
    inputProps: {
      type: "text" | "email" | "tel";
      autoComplete: string;
      inputMode?: "email" | "tel";
    },
  ) {
    const copy = c.fields[field];
    const hint = "hint" in copy ? copy.hint : undefined;
    const error = errors[field];
    return (
      <div>
        <label htmlFor={id(field)} className={LABEL_CLASS}>
          {copy.label}
        </label>
        <input
          ref={(el) => {
            fieldRefs.current[field] = el;
          }}
          id={id(field)}
          name={field}
          {...inputProps}
          value={values[field]}
          placeholder={copy.placeholder}
          onChange={(e) => update(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          aria-required={FIELD_REQUIRED[field] || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(hint && id(`${field}-hint`), error && id(`${field}-error`))}
          className={`mt-2 ${textInputClass(Boolean(error))}`}
        />
        {hint && (
          <p id={id(`${field}-hint`)} className={HINT_CLASS}>
            {hint}
          </p>
        )}
        {error && <ErrorMessage id={id(`${field}-error`)}>{c.errors[error]}</ErrorMessage>}
      </div>
    );
  }

  function renderCountryField() {
    const copy = c.fields.country;
    const error = errors.country;
    return (
      <div>
        <label htmlFor={id("country")} className={LABEL_CLASS}>
          {copy.label}
        </label>
        <div className="relative mt-2">
          <select
            ref={(el) => {
              fieldRefs.current.country = el;
            }}
            id={id("country")}
            name="country"
            autoComplete="country"
            value={values.country}
            onChange={(e) => update("country", e.target.value as CountryCode)}
            onBlur={() => handleBlur("country")}
            aria-required={FIELD_REQUIRED.country || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? id("country-error") : undefined}
            // Same box as the text inputs; native arrow swapped for the
            // brand chevron, with right padding so long names don't run
            // under it. Empty state uses the placeholder color.
            className={`${textInputClass(Boolean(error), !values.country)} cursor-pointer appearance-none pr-12`}
          >
            <option value="" disabled>
              {copy.placeholder}
            </option>
            {countryOptions.map(({ code, name }) => (
              <option key={code} value={code} className="text-negro">
                {name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-morado-oscuro" />
        </div>
        {error && <ErrorMessage id={id("country-error")}>{c.errors[error]}</ErrorMessage>}
      </div>
    );
  }

  function renderPillGroup<K extends ProjectTypeKey | BudgetKey>(
    field: "projectType" | "budget",
    options: readonly K[],
    labels: Record<K, string>,
    hint?: string,
  ) {
    const error = errors[field];
    // projectType: checkboxes (several, each can be unticked). budget: radios
    // (exactly one). Same pill look either way.
    const multiple = field === "projectType";
    const isChecked = (option: K) =>
      multiple
        ? values.projectType.includes(option as ProjectTypeKey)
        : values.budget === option;
    const toggle = (option: K) => {
      if (!multiple) return update("budget", option as BudgetKey);
      const next = isChecked(option)
        ? values.projectType.filter((key) => key !== option)
        : [...values.projectType, option as ProjectTypeKey];
      // Stable order in the payload regardless of click order.
      update("projectType", PROJECT_TYPES.filter((key) => next.includes(key)));
    };
    const describedById = describedBy(hint && id(`${field}-hint`), error && id(`${field}-error`));
    return (
      <fieldset
        ref={(el) => {
          fieldRefs.current[field] = el;
        }}
        onBlur={handleGroupBlur(field)}
      >
        <legend className={LABEL_CLASS}>{c.fields[field].label}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option) => {
            const checked = isChecked(option);
            return (
              <label
                key={option}
                className={`relative inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-4 py-2 text-sm select-none has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-morado-oscuro motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out ${
                  checked
                    ? "border-morado-oscuro bg-morado-oscuro font-bold text-crema"
                    : `bg-white font-semibold text-morado-oscuro hover:bg-morado-oscuro/5 ${
                        error ? "border-error" : "border-lila"
                      }`
                }`}
              >
                <input
                  type={multiple ? "checkbox" : "radio"}
                  name={field}
                  value={option}
                  checked={checked}
                  onChange={() => toggle(option)}
                  // aria-invalid is valid on checkboxes but not on
                  // role=radio; aria-describedby announces the error for both.
                  aria-invalid={multiple && error ? true : undefined}
                  aria-describedby={describedById}
                  className="sr-only"
                />
                {/* Selected state isn't color-only: check icon + bold + border. */}
                {checked && <MdCheck aria-hidden="true" className="-ml-1 h-4 w-4 flex-none" />}
                {labels[option]}
              </label>
            );
          })}
        </div>
        {hint && (
          <p id={id(`${field}-hint`)} className={HINT_CLASS}>
            {hint}
          </p>
        )}
        {error && <ErrorMessage id={id(`${field}-error`)}>{c.errors[error]}</ErrorMessage>}
      </fieldset>
    );
  }

  const sending = status === "sending";
  const consentError = errors.consent;

  return (
    <div>
      {/* Live region exists before success so its content is announced. */}
      <div aria-live="polite">
        {status === "success" && (
          <div className="text-center">
            <h3
              ref={successTitleRef}
              tabIndex={-1}
              // Focus target for announcing success, not a control —
              // no ring needed on a non-interactive heading.
              className="font-display text-2xl focus:outline-none font-semibold italic text-morado-oscuro sm:text-3xl"
            >
              {seed ? c.semilla.successTitle : c.success.title}
            </h3>
            <p className="mt-4 text-base text-negro/75">
              {seed ? c.semilla.successBody : c.success.body}
            </p>
            {/* Seed mode: the calendar is the next step, but it only opens
                when the person asks for it — never automatically. */}
            {seed ? (
              <CTAButton
                href={BOOKING_LINK}
                target="_blank"
                rel="noopener noreferrer"
                surface="light"
                className="mt-8"
              >
                {c.semilla.successCta}
              </CTAButton>
            ) : (
              <a
                href={BOOKING_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 inline-flex min-h-11 items-center justify-center rounded-xl border-[1.5px] border-morado-oscuro px-6 py-3 text-base font-bold text-morado-oscuro hover:bg-morado-oscuro hover:text-crema motion-safe:transition-colors motion-safe:duration-200 ${FOCUS_RING}`}
              >
                {c.success.cta}
              </a>
            )}
          </div>
        )}
      </div>

      {status !== "success" && (
        <form noValidate onSubmit={handleSubmit} className="relative flex flex-col gap-6">
          {renderTextField("name", { type: "text", autoComplete: "name" })}
          {renderTextField("email", { type: "email", autoComplete: "email", inputMode: "email" })}
          {renderTextField("phone", { type: "tel", autoComplete: "tel", inputMode: "tel" })}
          {renderCountryField()}
          {renderPillGroup("projectType", PROJECT_TYPES, c.fields.projectType.options)}
          {renderPillGroup("budget", BUDGETS, c.fields.budget.options, c.fields.budget.hint)}

          <div>
            <label className="flex min-h-11 cursor-pointer items-start gap-3">
              <input
                ref={(el) => {
                  fieldRefs.current.consent = el;
                }}
                type="checkbox"
                name="consent"
                checked={values.consent}
                onChange={(e) => {
                  update("consent", e.target.checked);
                  setConsentAt(e.target.checked ? new Date().toISOString() : null);
                }}
                onBlur={() => handleBlur("consent")}
                aria-required="true"
                aria-invalid={consentError ? true : undefined}
                aria-describedby={describedBy(consentError && id("consent-error"), id("privacy-summary"))}
                className={`mt-0.5 h-5 w-5 flex-none cursor-pointer accent-morado-oscuro ${FOCUS_RING}`}
              />
              <span className="text-sm text-negro/80">
                {c.consent.text}
                {LEGAL.privacy && (
                  <>
                    {" "}
                    <a
                      href={LEGAL.privacy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-bold text-morado-oscuro underline underline-offset-2 hover:text-coral ${FOCUS_RING}`}
                    >
                      {c.consent.linkLabel}
                    </a>
                  </>
                )}
              </span>
            </label>
            {consentError && (
              <ErrorMessage id={id("consent-error")}>{c.errors[consentError]}</ErrorMessage>
            )}
            <PrivacyInfo
              summaryId={id("privacy-summary")}
              summary={c.privacySummary}
              more={c.privacyMore}
              notice={c.privacyNotice}
            />
          </div>

          {/* Honeypot: invisible to people and assistive tech, bots fill it. */}
          <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
            <input ref={honeypotRef} type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          <div>
            {/* Always mounted (so updates are announced); empty, it adds no gap. */}
            <div aria-live="polite" className="mb-4 empty:mb-0">
              {showSummary && hasErrors ? (
                <ErrorMessage id={id("summary")}>{c.errors.summary}</ErrorMessage>
              ) : status === "error" ? (
                <>
                  <ErrorMessage id={id("submit-error")}>{c.errors.submit}</ErrorMessage>
                  {/* Seed mode: the form failing must not block booking. */}
                  {seed && (
                    <a
                      href={BOOKING_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-1 inline-flex min-h-11 items-center text-sm font-bold text-morado-oscuro underline underline-offset-4 hover:text-coral ${FOCUS_RING}`}
                    >
                      {c.semilla.errorFallback}
                    </a>
                  )}
                </>
              ) : null}
            </div>

            <CTAButton type="submit" surface="light" disabled={sending} className="w-full">
              {sending ? c.sending : seed ? c.semilla.submit : c.submit}
            </CTAButton>
          </div>
        </form>
      )}
    </div>
  );
}
