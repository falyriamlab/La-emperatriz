"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MdCheck } from "react-icons/md";
import { CTAButton } from "@/components/CTAButton";
import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import {
  describedBy,
  EMAIL_RE,
  ErrorMessage,
  FOCUS_RING,
  HINT_CLASS,
  isValidPhone,
  LABEL_CLASS,
  textInputClass,
} from "@/components/form/fields";
import { ChevronDown } from "@/components/icons/ChevronDown";
import { LEGAL } from "@/lib/legal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { submitMasterclass, type GenderKey } from "@/lib/leads";

const WHATSAPP_COMMUNITY_LINK =
  "https://chat.whatsapp.com/IeIknGwPnWvIMaRxUNDhLz?s=cl&p=a&iam=2";

// Option order on screen. Keys are what gets submitted (and what Code.gs
// accepts in GENDERS); labels come from the dictionary.
const GENDERS: GenderKey[] = ["masculino", "femenino", "no_binario", "prefiero_no_decirlo"];

// Mirrors MAX_PROJECT_LENGTH in Code.gs, so nothing typed gets cut in the sheet.
const PROJECT_MAX_LENGTH = 2000;
const TEXT_MAX_LENGTH = 200;

type Values = {
  name: string;
  email: string;
  phone: string;
  country: string;
  gender: GenderKey | "";
  sector: string;
  project: string;
  consent: boolean;
};

type Field = keyof Values;
type TextField = "name" | "email" | "phone" | "country" | "sector";
// Stored as dictionary keys so switching ES↔PT re-translates messages on screen.
type ErrorKey = "required" | "email" | "phone" | "choose" | "consent";
type Errors = Partial<Record<Field, ErrorKey>>;
type Status = "idle" | "sending" | "error";

const INITIAL_VALUES: Values = {
  name: "",
  email: "",
  phone: "",
  country: "",
  gender: "",
  sector: "",
  project: "",
  consent: false,
};

// DOM order — the first invalid one in this list receives focus on submit.
const FIELD_ORDER: Field[] = ["name", "email", "phone", "country", "gender", "sector", "project", "consent"];

// Every field is required (Code.gs validates the same).
function validate(field: Field, values: Values): ErrorKey | undefined {
  if (field === "consent") return values.consent ? undefined : "consent";
  if (field === "gender") return values.gender ? undefined : "choose";

  const value = values[field].trim();
  if (!value) return "required";
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

export function MasterclassForm() {
  const { t, language } = useLanguage();
  const m = t.masterclass;
  const errorCopy = t.contactForm.errors;
  const uid = useId();
  const id = (part: string) => `${uid}-${part}`;

  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [consentAt, setConsentAt] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [showSummary, setShowSummary] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  // Step 2 (WhatsApp community) is only reached once the sign-up is saved.
  const [registered, setRegistered] = useState(false);

  // Synchronous guard against double submit (the disabled button only takes
  // effect after a re-render).
  const submittingRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const communityTitleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  useEffect(() => {
    if (!registered) return;
    // The new step replaces the form: bring its top into view and move focus
    // to its title so screen readers announce it.
    cardRef.current?.scrollIntoView({ block: "start" });
    communityTitleRef.current?.focus({ preventScroll: true });
  }, [registered]);

  const hasErrors = FIELD_ORDER.some((field) => errors[field]);

  function setFieldError(field: Field, nextValues: Values) {
    setErrors((prev) => ({ ...prev, [field]: validate(field, nextValues) }));
  }

  function update<K extends Field>(field: K, value: Values[K]) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    // Re-validate live only once a field is flagged, so the message clears
    // as soon as it's fixed — new errors wait for blur/submit.
    if (errors[field]) setFieldError(field, nextValues);
  }

  function focusField(field: Field) {
    const el = fieldRefs.current[field];
    if (!el) return;
    // Centered so the sticky header doesn't cover it.
    el.scrollIntoView({ block: "center" });
    el.focus({ preventScroll: true });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    // Honeypot filled → a bot. Pretend it worked, send nothing.
    if (honeypotRef.current?.value) {
      setRegistered(true);
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
    const result = await submitMasterclass({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      country: values.country.trim(),
      gender: values.gender as GenderKey,
      sector: values.sector.trim(),
      project: values.project.trim(),
      language,
      consent: true,
      consentAt: consentAt ?? now,
      pageUrl: window.location.href,
      submittedAt: now,
    });
    submittingRef.current = false;
    if (result.ok) {
      setStatus("idle");
      setRegistered(true);
    } else {
      setStatus("error");
    }
  }

  function fieldProps(field: Field, hintId?: string) {
    const error = errors[field];
    return {
      id: id(field),
      name: field,
      onBlur: () => setFieldError(field, values),
      "aria-required": true as const,
      "aria-invalid": error ? (true as const) : undefined,
      "aria-describedby": describedBy(hintId, error && id(`${field}-error`)),
    };
  }

  function renderError(field: Field) {
    const error = errors[field];
    return error && <ErrorMessage id={id(`${field}-error`)}>{errorCopy[error]}</ErrorMessage>;
  }

  function renderTextField(
    field: TextField,
    inputProps: { type: "text" | "email" | "tel"; autoComplete: string; inputMode?: "email" | "tel" },
  ) {
    const copy = m.fields[field];
    const hint = "hint" in copy ? copy.hint : undefined;
    const hintId = hint ? id(`${field}-hint`) : undefined;
    return (
      <div>
        <label htmlFor={id(field)} className={LABEL_CLASS}>
          {copy.label}
        </label>
        <input
          ref={(el) => {
            fieldRefs.current[field] = el;
          }}
          {...fieldProps(field, hintId)}
          {...inputProps}
          maxLength={TEXT_MAX_LENGTH}
          value={values[field]}
          placeholder={copy.placeholder}
          onChange={(e) => update(field, e.target.value)}
          className={`mt-2 ${textInputClass(Boolean(errors[field]))}`}
        />
        {hint && (
          <p id={hintId} className={HINT_CLASS}>
            {hint}
          </p>
        )}
        {renderError(field)}
      </div>
    );
  }

  function renderGenderField() {
    const copy = m.fields.gender;
    return (
      <div>
        <label htmlFor={id("gender")} className={LABEL_CLASS}>
          {copy.label}
        </label>
        <div className="relative mt-2">
          <select
            ref={(el) => {
              fieldRefs.current.gender = el;
            }}
            {...fieldProps("gender")}
            value={values.gender}
            onChange={(e) => update("gender", e.target.value as GenderKey)}
            // Same box as the text inputs, with the brand chevron instead of
            // the native arrow (same pattern as ContactForm's country select).
            className={`${textInputClass(Boolean(errors.gender), !values.gender)} cursor-pointer appearance-none pr-12`}
          >
            <option value="" disabled>
              {copy.placeholder}
            </option>
            {GENDERS.map((key) => (
              <option key={key} value={key} className="text-negro">
                {copy.options[key]}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-morado-oscuro" />
        </div>
        {renderError("gender")}
      </div>
    );
  }

  function renderProjectField() {
    const copy = m.fields.project;
    const hintId = id("project-hint");
    return (
      <div className="sm:col-span-2">
        <label htmlFor={id("project")} className={LABEL_CLASS}>
          {copy.label}
        </label>
        <textarea
          ref={(el) => {
            fieldRefs.current.project = el;
          }}
          {...fieldProps("project", hintId)}
          rows={5}
          maxLength={PROJECT_MAX_LENGTH}
          value={values.project}
          placeholder={copy.placeholder}
          onChange={(e) => update("project", e.target.value)}
          className={`mt-2 resize-y ${textInputClass(Boolean(errors.project))}`}
        />
        <p id={hintId} className={`${HINT_CLASS} flex justify-between gap-4`}>
          <span>{copy.hint}</span>
          <span aria-hidden="true" className="flex-none tabular-nums">
            {values.project.length}/{PROJECT_MAX_LENGTH}
          </span>
        </p>
        {renderError("project")}
      </div>
    );
  }

  const steps = [m.steps.data, m.steps.community];
  const currentStep = registered ? 1 : 0;
  const sending = status === "sending";
  const firstName = values.name.trim().split(/\s+/)[0] ?? "";

  return (
    <>
      <section className="relative overflow-hidden bg-morado-oscuro px-6 pt-16 pb-44 sm:pt-24 sm:pb-52">
        <DecorativeSvg
          src="/elements/stamp.svg"
          width={447}
          height={447}
          className="absolute -top-40 -right-40 hidden opacity-[0.15] sm:block lg:-top-52 lg:-right-52"
          imgClassName="h-[22rem] w-auto lg:h-[28rem]"
        />
        <DecorativeSvg
          src="/elements/star-ellipse.svg"
          width={500}
          height={587}
          className="absolute -bottom-24 -left-24 hidden opacity-[0.12] md:block"
          imgClassName="h-[20rem] w-auto"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="motion-safe:[animation:hero-rise_0.5s_ease-out_both] inline-flex items-center rounded-full border border-crema/25 bg-crema/10 px-4 py-2 text-sm font-semibold tracking-[0.2em] text-crema uppercase backdrop-blur-sm">
            {m.badge}
          </p>
          <h1 className="motion-safe:[animation:hero-rise_0.5s_ease-out_0.1s_both] mt-6 text-5xl leading-[0.95] font-bold tracking-tight text-crema max-[359px]:text-4xl sm:text-6xl md:text-7xl">
            <span className="block font-display font-semibold italic">{m.title[0]}</span>
            <span className="block">{m.title[1]}</span>
          </h1>
          <p className="motion-safe:[animation:hero-rise_0.5s_ease-out_0.2s_both] mt-6 max-w-xl text-lg text-crema/85 italic sm:text-xl">
            {m.subtitle}
          </p>
        </div>
      </section>

      <section className="relative px-6 pb-20 sm:pb-28">
        <div
          ref={cardRef}
          // Pulled up over the purple band; scroll-mt clears the sticky header
          // when step 2 scrolls the card into view.
          className="motion-safe:[animation:hero-rise_0.5s_ease-out_0.3s_both] relative mx-auto -mt-32 max-w-2xl scroll-mt-24 rounded-3xl bg-white p-6 shadow-[0_24px_60px_-24px_rgba(107,57,140,0.35)] sm:-mt-40 sm:p-10"
        >
          <ol aria-label={m.steps.label} className="flex items-center gap-3">
            {steps.map((label, index) => {
              const done = index < currentStep;
              const current = index === currentStep;
              return (
                <li
                  key={label}
                  aria-current={current ? "step" : undefined}
                  className="flex flex-1 items-center gap-3 last:flex-none"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold motion-safe:transition-colors motion-safe:duration-300 ${
                      done || current
                        ? "bg-morado-oscuro text-crema"
                        : "border-[1.5px] border-lila text-lila"
                    }`}
                  >
                    {done ? <MdCheck className="h-5 w-5" /> : index + 1}
                  </span>
                  <span
                    className={`text-sm font-bold whitespace-nowrap ${current ? "text-morado-oscuro" : done ? "text-morado-oscuro/70" : "text-negro/60"}`}
                  >
                    {label}
                    {done && <span className="sr-only"> ({m.steps.done})</span>}
                  </span>
                  {index < steps.length - 1 && (
                    <span aria-hidden="true" className="h-0.5 flex-1 overflow-hidden rounded-full bg-lila/25">
                      <span
                        className={`block h-full origin-left bg-morado-oscuro motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out ${
                          done ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          {registered ? (
            <div className="mt-10 text-center">
              <span
                aria-hidden="true"
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amarillo text-morado-oscuro"
              >
                <FaWhatsapp className="h-10 w-10" />
              </span>
              <h2
                ref={communityTitleRef}
                tabIndex={-1}
                // Focus target for the announcement, not a control: no ring.
                className="font-display mt-6 text-3xl font-semibold text-morado-oscuro italic focus:outline-none sm:text-4xl"
              >
                {m.community.title}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-lg text-negro/80">
                {m.community.body.replace("{name}", firstName)}
              </p>
              <CTAButton
                href={WHATSAPP_COMMUNITY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                surface="light"
                className="mt-8 w-full sm:w-auto"
              >
                {m.community.cta}
                <span className="sr-only"> ({m.community.newTab})</span>
              </CTAButton>
              <p className="mt-4 text-sm text-negro/70">{m.community.note}</p>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="relative mt-10">
              <h2 className="font-display text-3xl font-semibold text-morado-oscuro italic sm:text-4xl">
                {m.formTitle}
              </h2>
              <p className="mt-2 text-base text-negro/75">{m.formSubtitle}</p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {renderTextField("name", { type: "text", autoComplete: "name" })}
                {renderTextField("email", { type: "email", autoComplete: "email", inputMode: "email" })}
                {renderTextField("phone", { type: "tel", autoComplete: "tel", inputMode: "tel" })}
                {renderTextField("country", { type: "text", autoComplete: "country-name" })}
                {renderGenderField()}
                {renderTextField("sector", { type: "text", autoComplete: "off" })}
                {renderProjectField()}

                <div className="sm:col-span-2">
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
                      onBlur={() => setFieldError("consent", values)}
                      aria-required="true"
                      aria-invalid={errors.consent ? true : undefined}
                      aria-describedby={errors.consent ? id("consent-error") : undefined}
                      className={`mt-0.5 h-5 w-5 flex-none cursor-pointer accent-morado-oscuro ${FOCUS_RING}`}
                    />
                    <span className="text-sm text-negro/80">
                      {m.consent}
                      {LEGAL.privacy && (
                        <>
                          {" "}
                          <a
                            href={LEGAL.privacy}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-bold text-morado-oscuro underline underline-offset-2 hover:text-coral ${FOCUS_RING}`}
                          >
                            {t.contactForm.consent.linkLabel}
                          </a>
                        </>
                      )}
                    </span>
                  </label>
                  {renderError("consent")}
                </div>
              </div>

              {/* Honeypot: invisible to people and assistive tech, bots fill it. */}
              <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                <input ref={honeypotRef} type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>

              <div className="mt-8">
                {/* Always mounted (so updates are announced); empty, it adds no gap. */}
                <div aria-live="polite" className="mb-4 empty:mb-0">
                  {showSummary && hasErrors ? (
                    <ErrorMessage id={id("summary")}>{errorCopy.summary}</ErrorMessage>
                  ) : status === "error" ? (
                    <ErrorMessage id={id("submit-error")}>{errorCopy.submit}</ErrorMessage>
                  ) : null}
                </div>

                <CTAButton type="submit" surface="light" disabled={sending} className="w-full">
                  {sending ? m.sending : m.submit}
                </CTAButton>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
