// Contact form (landing) branch of Code.gs — the 59 original mock tests.
// Expectations are unchanged from the version that ran outside the repo;
// only two tests were updated to the current codebase:
//   - parity reads EMAIL_RE / PHONE_CHARS_RE from components/form/fields.tsx
//   - "guardar fila → enviar aviso" checks behaviour, not the source text.
import { test } from "node:test";
import assert from "node:assert/strict";
import { CODE_GS, load, read, regexFrom } from "./harness.mjs";

const LEADS = "Leads";
const ok = { name: "Ana", email: "ana@example.com", phone: "+34 600 000 000", country: "CO", countryName: "Colombia", projectType: ["escritura", "genero"], budget: "lt100", language: "es", consent: true, consentAt: "2026-10-19T00:00:00Z", pageUrl: "https://x/", submittedAt: "2026-10-19T00:00:01Z" };

function expectOk(body, also) {
  const s = load();
  const r = s.post(body);
  assert.equal(r.ok, true, JSON.stringify(r));
  if (also) also(s);
  return s;
}
function expectErr(body, error) {
  const s = load();
  const r = s.post(body);
  assert.equal(r.ok, false, JSON.stringify(r));
  if (error) assert.equal(r.error, error);
  assert.equal(s.rowsOf(LEADS).length, 0, "no row is written");
}

// ── 1. REQUIRED ────────────────────────────────────────────────────────────
test("1 REQUIRED: REQUIRED = FIELD_REQUIRED del formulario (phone, country, budget, projectType)", () => {
  const form = read("components/sections/ContactForm.tsx");
  const fr = Function(`return ${form.match(/const FIELD_REQUIRED = (\{[^}]*\})/)[1]}`)();
  const rq = Function(`return ${CODE_GS.match(/const REQUIRED = (\{[^}]*\})/)[1]}`)();
  for (const k of ["phone", "country", "budget", "projectType"]) assert.equal(rq[k], fr[k], k);
  assert.equal(Object.keys(rq).length, 4);
});
test('1 REQUIRED: incluye el comentario "mantener sincronizado con FIELD_REQUIRED en ContactForm.tsx"', () => {
  assert.match(CODE_GS, /Mantener sincronizado con\s*(\/\/\s*)?FIELD_REQUIRED en ContactForm\.tsx/i);
});
const allOptional = () => load({ source: CODE_GS.replace(/const REQUIRED = \{[^}]*\};/, "const REQUIRED = { phone: false, country: false, budget: false, projectType: false };") });
test("1 REQUIRED: con REQUIRED en false, acepta teléfono/país/presupuesto/tipos vacíos", () => {
  const r = allOptional().post({ ...ok, phone: "", country: "", countryName: "", budget: "", projectType: [] });
  assert.equal(r.ok, true, JSON.stringify(r));
});
test("1 REQUIRED: opcional pero con valor inválido (teléfono '12') → rechaza", () => {
  const r = allOptional().post({ ...ok, phone: "12", country: "", budget: "" });
  assert.deepEqual(r, { ok: false, error: "invalid_phone" });
});

// ── 2. Nombre ──────────────────────────────────────────────────────────────
test("2 nombre: válido con espacios alrededor → se guarda recortado", () =>
  expectOk({ ...ok, name: "  María José Pérez  " }, (s) => assert.equal(s.cell(LEADS, "name"), "María José Pérez")));
test("2 nombre: solo espacios → rechaza", () => expectErr({ ...ok, name: "   " }, "invalid_name"));
test("2 nombre: número → rechaza", () => expectErr({ ...ok, name: 12345 }, "invalid_name"));
test("2 nombre: objeto → rechaza", () => expectErr({ ...ok, name: { a: 1 } }, "invalid_name"));
test("2 nombre: ausente → rechaza", () => expectErr({ ...ok, name: undefined }, "invalid_name"));

// ── 3. Teléfono ────────────────────────────────────────────────────────────
test('3 teléfono: "(300) 123-4567" → acepta', () => expectOk({ ...ok, phone: "(300) 123-4567" }));
test('3 teléfono: "hola" → rechaza', () => expectErr({ ...ok, phone: "hola" }, "invalid_phone"));
test('3 teléfono: "123456" (6 dígitos) → rechaza', () => expectErr({ ...ok, phone: "123456" }, "invalid_phone"));
test('3 teléfono: "+1234567890123456" (16 dígitos) → rechaza', () => expectErr({ ...ok, phone: "+1234567890123456" }, "invalid_phone"));
test("3 teléfono: ausente (obligatorio) → rechaza", () => expectErr({ ...ok, phone: undefined }, "invalid_phone"));

// ── 4. País ────────────────────────────────────────────────────────────────
test('4 país: "VE" → acepta; countryName recortado', () =>
  expectOk({ ...ok, country: "VE", countryName: "  Venezuela " }, (s) => {
    assert.equal(s.cell(LEADS, "country"), "VE");
    assert.equal(s.cell(LEADS, "countryName"), "Venezuela");
  }));
test('4 país: "ZZ" (no existe) → acepta (no se comprueba existencia)', () => expectOk({ ...ok, country: "ZZ" }));
test('4 país: "" (obligatorio) → rechaza', () => expectErr({ ...ok, country: "" }, "invalid_country"));
test('4 país: "co" → rechaza', () => expectErr({ ...ok, country: "co" }, "invalid_country"));
test("4 país: countryName número → rechaza", () => expectErr({ ...ok, countryName: 5 }, "invalid_country"));

// ── 5. Presupuesto ─────────────────────────────────────────────────────────
test('5 presupuesto: "gt250" → acepta', () => expectOk({ ...ok, budget: "gt250" }));
test('5 presupuesto: "" (obligatorio) → rechaza', () => expectErr({ ...ok, budget: "" }, "invalid_budget"));
test('5 presupuesto: "Menos de 100 €" → rechaza', () => expectErr({ ...ok, budget: "Menos de 100 €" }, "invalid_budget"));

// ── 6. Tipos de proyecto ───────────────────────────────────────────────────
test('6 tipos: ["danza","danza"] → 1 tras quitar duplicados, acepta', () =>
  expectOk({ ...ok, projectType: ["danza", "danza"] }, (s) => assert.equal(s.cell(LEADS, "projectType"), "danza")));
test("6 tipos: [] (obligatorio) → rechaza", () => expectErr({ ...ok, projectType: [] }, "invalid_project_type"));

// ── 7. Fórmulas ────────────────────────────────────────────────────────────
// countryName is trimmed by validation, so a leading \t / \r is removed and
// the remaining "=…" still gets the apostrophe.
for (const [v, want] of [["\t=1+1", "'=1+1"], ["\r=1+1", "'=1+1"], ["=1+1", "'=1+1"], ["@Ana", "'@Ana"]]) {
  test(`7 fórmulas: countryName ${JSON.stringify(v)} → ${JSON.stringify(want)}`, () =>
    expectOk({ ...ok, countryName: v }, (s) => assert.equal(s.cell(LEADS, "countryName"), want)));
}
test('7 fórmulas: texto normal "Colombia" → sin apóstrofo', () =>
  expectOk(ok, (s) => assert.equal(s.cell(LEADS, "countryName"), "Colombia")));
test("7 fórmulas: pageUrl con tabulador delante → apóstrofo", () => {
  const s = load(); s.post({ ...ok, pageUrl: "\t=HYPERLINK(1)" });
  assert.equal(s.cell(LEADS, "pageUrl"), "'\t=HYPERLINK(1)");
});
test("7 fórmulas: pageUrl con retorno de carro delante → apóstrofo", () => {
  const s = load(); s.post({ ...ok, pageUrl: "\r=1" });
  assert.equal(s.cell(LEADS, "pageUrl"), "'\r=1");
});

// ── 8. Aviso por correo ────────────────────────────────────────────────────
test("8 aviso: MailApp falla (cuota) → {ok:true}, fila guardada, error en Logger", () => {
  const s = load({ notifyEmail: "aviso@example.com", mailThrows: true });
  const r = s.post(ok);
  assert.equal(r.ok, true);
  assert.equal(s.rowsOf(LEADS).length, 1);
  assert.ok(s.logs.some((l) => l.includes("too many times")), JSON.stringify(s.logs));
});
test("8 aviso: MailApp funciona → {ok:true}, fila guardada y 1 correo", () => {
  const s = load({ notifyEmail: "aviso@example.com" });
  assert.equal(s.post(ok).ok, true);
  assert.equal(s.rowsOf(LEADS).length, 1);
  assert.equal(s.mails.length, 1);
});
// Was: the source text "sheet.appendRow(row)" appears before "notify_(data)".
// Now: observed behaviour — the row is written before the mail is sent, and
// a failing mail doesn't change the response.
test("8 aviso: guardar fila → enviar aviso (la fila se escribe antes del correo; un fallo del correo no cambia la respuesta)", () => {
  const ok1 = load({ notifyEmail: "aviso@example.com" });
  const r1 = ok1.post(ok);
  const rowAt = ok1.events.lastIndexOf(`row:${LEADS}`);
  const mailAt = ok1.events.indexOf("mail");
  assert.ok(rowAt >= 0 && mailAt > rowAt, `eventos: ${ok1.events.join(", ")}`);

  const failing = load({ notifyEmail: "aviso@example.com", mailThrows: true });
  const r2 = failing.post(ok);
  assert.deepEqual(r2, r1);
  assert.ok(failing.events.lastIndexOf(`row:${LEADS}`) < failing.events.indexOf("mail"), `eventos: ${failing.events.join(", ")}`);
  assert.equal(failing.rowsOf(LEADS).length, 1);
});
test("8 aviso: con el valor real de Code.gs, el aviso va a hola@somospuentecultural.com", () => {
  const s = load({ notifyEmail: null });
  assert.equal(s.post(ok).ok, true);
  assert.equal(s.mails.length, 1);
  assert.equal(s.mails[0].to, "hola@somospuentecultural.com");
});
test("8 aviso: NOTIFY_EMAIL vacío → no se envía correo", () => {
  const s = load({ notifyEmail: "" }); s.post(ok);
  assert.equal(s.mails.length, 0);
});

// ── 9. Límite de avisos ────────────────────────────────────────────────────
test("9 límite: 25 envíos en una hora → 25 filas, 20 correos", () => {
  const s = load({ notifyEmail: "aviso@example.com", now: 3600000 * 500 + 10 });
  for (let i = 0; i < 25; i++) s.post(ok);
  assert.equal(s.rowsOf(LEADS).length, 25);
  assert.equal(s.mails.length, 20);
});
test("9 límite: hora siguiente → vuelve a enviar", () => {
  const s = load({ notifyEmail: "aviso@example.com", now: 3600000 * 500 + 10 });
  for (let i = 0; i < 25; i++) s.post(ok);
  s.setNow(3600000 * 501 + 10); s.post(ok);
  assert.equal(s.mails.length, 21);
});
test("9 límite: exactamente 20 → 20 correos (el 20 sí se envía)", () => {
  const s = load({ notifyEmail: "aviso@example.com" });
  for (let i = 0; i < 20; i++) s.post(ok);
  assert.equal(s.mails.length, 20);
});

// ── Paridad con ContactForm.tsx ────────────────────────────────────────────
test("PARIDAD: todo lo que el formulario de la landing acepta, el servidor lo acepta", () => {
  const form = read("components/sections/ContactForm.tsx");
  const fields = read("components/form/fields.tsx"); // EMAIL_RE / PHONE_CHARS_RE live here now
  const EMAIL_RE = regexFrom(fields, "EMAIL_RE");
  const PHONE_CHARS_RE = regexFrom(fields, "PHONE_CHARS_RE");
  const clientPhoneOk = (v) => { const x = v.trim(); const d = x.replace(/\D/g, "").length; return PHONE_CHARS_RE.test(x) && d >= 7 && d <= 15; };
  const types = form.match(/const PROJECT_TYPES: ProjectTypeKey\[\] = \[([\s\S]*?)\];/)[1].match(/"(\w+)"/g).map((s) => s.slice(1, -1));
  const budgets = form.match(/const BUDGETS: BudgetKey\[\] = \[([^\]]*)\]/)[1].match(/"(\w+)"/g).map((s) => s.slice(1, -1));
  const countries = read("lib/countries.ts").match(/"[A-Z]{2}"/g).map((s) => s.slice(1, -1));
  const phones = ["+34 600 000 000", "(300) 123-4567", "600-000-000", "+55 11 90000-0000", "+57 300 000 0000", "1234567", "+123456789012345", "  +34 600 000 000  "];
  const names = ["María José", "João", "Ñandú Pérez", "Zoë Ångström", "Anaïs-Béatrice", "D'Arcy O'Neill", "李小龙"];
  const emails = ["ana@example.com", "a.b+tag@sub.dominio.co", "ñ@dominio.es"];
  const bad = [];
  const check = (label, body) => { const r = load().post(body); if (!r.ok) bad.push(`${label} → ${r.error}`); };
  for (const p of phones) { if (!clientPhoneOk(p)) bad.push(`(el cliente rechaza ${p})`); check(`phone ${JSON.stringify(p)}`, { ...ok, phone: p.trim() }); }
  for (const nm of names) check(`name ${nm}`, { ...ok, name: nm });
  for (const e of emails) { if (!EMAIL_RE.test(e)) bad.push(`(el cliente rechaza ${e})`); check(`email ${e}`, { ...ok, email: e }); }
  for (const ty of types) check(`projectType [${ty}]`, { ...ok, projectType: [ty] });
  check("projectType todos", { ...ok, projectType: types });
  for (const b of budgets) check(`budget ${b}`, { ...ok, budget: b });
  for (const c of countries) check(`country ${c}`, { ...ok, country: c, countryName: c });
  for (const lang of ["es", "pt"]) check(`language ${lang}`, { ...ok, language: lang });
  assert.deepEqual(bad, []);
});

// ── 20 pruebas anteriores (mismas entradas) ────────────────────────────────
const prev = [
  ["válido", ok, true],
  ["sin consentimiento", { ...ok, consent: false }, "no_consent"],
  ["budget = etiqueta", { ...ok, budget: "Menos de 100 €" }, "invalid_budget"],
  ["email malo", { ...ok, email: "x@" }, "invalid_email"],
  ["país inválido", { ...ok, country: "Colombia" }, "invalid_country"],
  ["un solo tipo", { ...ok, projectType: ["escritura"] }, true],
  ["sin tipos (lista vacía)", { ...ok, projectType: [] }, "invalid_project_type"], // REQUIRED.projectType = true
  ["tipo como texto (formato viejo)", { ...ok, projectType: "escritura" }, "invalid_project_type"],
  ["tipo desconocido en la lista", { ...ok, projectType: ["escritura", "Danza"] }, "invalid_project_type"],
  ["JSON inválido", "<<<", "server_error"],
  ["nombre con fórmula", { ...ok, name: "=HYPERLINK(\"x\")" }, true],
  ["duplicados se quitan", { ...ok, projectType: ["genero", "escritura", "genero", "genero"] }, true],
  ["5000 repetidos válidos", { ...ok, projectType: Array(5000).fill("danza") }, true],
  ["las 10 permitidas", { ...ok, projectType: ["escenicas", "danza", "musica", "visuales", "escritura", "editorial", "espiritualidad", "genero", "interdisciplinar", "otro"] }, true],
  ["elemento no string", { ...ok, projectType: ["escritura", 5] }, "invalid_project_type"],
  ["elemento objeto", { ...ok, projectType: ["escritura", { a: 1 }] }, "invalid_project_type"],
  ["elemento fuera de la lista", { ...ok, projectType: ["escritura", "Danza"] }, "invalid_project_type"],
  ["'toString'", { ...ok, projectType: ["toString"] }, "invalid_project_type"],
  ["texto en vez de lista", { ...ok, projectType: "escritura" }, "invalid_project_type"],
];
for (const [name, body, want] of prev) {
  test(`ANTERIORES: ${name}`, () => {
    const r = load().post(body);
    if (want === true) assert.equal(r.ok, true, JSON.stringify(r));
    else assert.deepEqual(r, { ok: false, error: want });
  });
}
test("ANTERIORES: asunto sin saltos de línea ni controles", () => {
  const s = load({ notifyEmail: "aviso@example.com" });
  s.post({ ...ok, name: "Ana\r\nBcc: x@evil.com\u0000\u2028fin" });
  assert.equal(s.mails.length, 1);
  assert.doesNotMatch(s.mails[0].subject, /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/);
});
