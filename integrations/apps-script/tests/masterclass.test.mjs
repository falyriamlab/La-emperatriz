// /masterclass branch of Code.gs ("form": "masterclass" → sheet "Masterclass").
import { test } from "node:test";
import assert from "node:assert/strict";
import { CODE_GS, load, read, regexFrom } from "./harness.mjs";

const MC = "Masterclass";
const LEADS = "Leads";
const mc = {
  form: "masterclass",
  name: "Ana Pérez",
  email: "ana@example.com",
  phone: "+34 600 000 000",
  country: "Colombia",
  gender: "femenino",
  sector: "Artes escénicas",
  project: "Un festival de teatro comunitario.",
  language: "es",
  consent: true,
  consentAt: "2026-10-30T10:00:00Z",
  pageUrl: "https://laemperatriz-somospuentecultural.com/masterclass",
  submittedAt: "2026-10-30T10:00:05Z",
};
const contact = { name: "Ana", email: "ana@example.com", phone: "+34 600 000 000", country: "CO", countryName: "Colombia", projectType: ["escritura"], budget: "lt100", language: "es", consent: true, consentAt: "2026-10-19T00:00:00Z", pageUrl: "https://x/", submittedAt: "2026-10-19T00:00:01Z" };

const masterclassColumns = Function(`return ${CODE_GS.match(/const MASTERCLASS_COLUMNS = (\[[\s\S]*?\]);/)[1]}`)();

function accepted(body) {
  const s = load();
  const r = s.post(body);
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(s.rowsOf(MC).length, 1, "one row in Masterclass");
  assert.equal(s.rowsOf(LEADS).length, 0, "nothing in Leads");
  return s;
}
function rejected(body, error) {
  const s = load();
  const r = s.post(body);
  assert.deepEqual(r, { ok: false, error });
  assert.equal(s.rowsOf(MC).length, 0, "no row written");
  assert.equal(s.rowsOf(LEADS).length, 0, "no row written");
}

// ── Enrutado y hoja ────────────────────────────────────────────────────────
test("válido → hoja Masterclass con sus columnas y en ese orden; Leads intacta", () => {
  const s = accepted(mc);
  // Arrays from Code.gs live in the vm context (other Array prototype):
  // compare contents, not identity of prototypes.
  assert.deepEqual([...s.headerOf(MC)], [...masterclassColumns]);
  assert.equal(s.cell(MC, "name"), "Ana Pérez");
  assert.equal(s.cell(MC, "gender"), "femenino");
  assert.equal(s.cell(MC, "consent"), true);
  assert.ok(s.cell(MC, "receivedAt"), "receivedAt lo pone el servidor");
});
test('sin "form" → formulario de contacto (hoja Leads), no Masterclass', () => {
  const s = load();
  assert.equal(s.post(contact).ok, true);
  assert.equal(s.rowsOf(LEADS).length, 1);
  assert.equal(s.rowsOf(MC).length, 0);
});
test('form: "contact" explícito → hoja Leads', () => {
  const s = load();
  assert.equal(s.post({ ...contact, form: "contact" }).ok, true);
  assert.equal(s.rowsOf(LEADS).length, 1);
  assert.equal(s.rowsOf(MC).length, 0);
});
test("form desconocido → invalid_form", () => rejected({ ...mc, form: "newsletter" }, "invalid_form"));
for (const bad of ["constructor", "__proto__", "toString", "hasOwnProperty", "Masterclass", "MASTERCLASS", ""]) {
  test(`form ${JSON.stringify(bad)} → rechazado (invalid_form)`, () => rejected({ ...mc, form: bad }, "invalid_form"));
}
for (const bad of [null, 1, true, ["masterclass"], { a: 1 }]) {
  // KNOWN GAP (Code.gs not changed here): hasOwnProperty.call(FORMS, value)
  // coerces ["masterclass"] to the string "masterclass", so a one-item array
  // is accepted and routed to the Masterclass sheet. The sheet name still
  // comes from the closed FORMS list, so it isn't an injection — just a
  // type the server shouldn't accept. Fix: require typeof form === "string".
  const todo = Array.isArray(bad) ? 'Code.gs acepta form: ["masterclass"] (el array se convierte en texto); falta exigir que form sea string' : undefined;
  test(`form no texto ${JSON.stringify(bad)} → rechazado`, { todo }, () => {
    const s = load();
    const r = s.post({ ...mc, form: bad });
    assert.equal(r.ok, false, JSON.stringify(r));
    assert.equal(s.rowsOf(MC).length + s.rowsOf(LEADS).length, 0);
  });
}
test("payload de contacto con form masterclass → rechazado por la validación de masterclass", () =>
  rejected({ ...contact, form: "masterclass" }, "invalid_gender"));

// ── Un caso válido y uno inválido por campo ────────────────────────────────
const fieldCases = [
  // [campo, válido, se guarda como, inválido, error]
  ["name", "  María José  ", "María José", "   ", "invalid_name"],
  ["email", "a.b+tag@sub.dominio.co", "a.b+tag@sub.dominio.co", "x@", "invalid_email"],
  ["phone", "(300) 123-4567", "(300) 123-4567", "123456", "invalid_phone"],
  ["country", "  Brasil ", "Brasil", "", "invalid_country"],
  ["gender", "no_binario", "no_binario", "Femenino", "invalid_gender"],
  ["sector", "Música", "Música", "  ", "invalid_sector"],
  ["project", "  Un libro de poesía.  ", "Un libro de poesía.", "", "invalid_project"],
  ["language", "pt", "pt", "en", "invalid_language"],
  ["consent", true, true, "true", "no_consent"],
];
for (const [field, good, stored, bad, error] of fieldCases) {
  test(`${field}: válido ${JSON.stringify(good)} → se acepta y se guarda ${JSON.stringify(stored)}`, () => {
    const s = accepted({ ...mc, [field]: good });
    assert.equal(s.cell(MC, field), stored);
  });
  test(`${field}: inválido ${JSON.stringify(bad)} → ${error}`, () => rejected({ ...mc, [field]: bad }, error));
}
for (const field of ["name", "email", "phone", "country", "gender", "sector", "project"]) {
  test(`${field}: ausente → rechazado (todos los campos son obligatorios)`, () => {
    const body = { ...mc }; delete body[field];
    const s = load(); const r = s.post(body);
    assert.equal(r.ok, false, JSON.stringify(r));
    assert.equal(s.rowsOf(MC).length, 0);
  });
  test(`${field}: no texto (número) → rechazado`, () => {
    const s = load(); const r = s.post({ ...mc, [field]: 12345 });
    assert.equal(r.ok, false, JSON.stringify(r));
  });
}
test("consent false / ausente → no_consent", () => {
  rejected({ ...mc, consent: false }, "no_consent");
  const body = { ...mc }; delete body.consent;
  rejected(body, "no_consent");
});

// ── Apóstrofo anti-fórmula en todas las columnas de texto ──────────────────
test("apóstrofo anti-fórmula en todas las columnas que admiten texto libre", () => {
  // Valid values that start with a formula trigger, one per column. gender
  // and language come from closed lists and consent is a boolean, so they
  // can't carry a formula.
  const body = {
    ...mc,
    name: "=HYPERLINK(1)",
    email: "=a@b.co",
    phone: "+34 600 000 000",
    country: "-Colombia",
    sector: "@Teatro",
    project: "=IMPORTXML(1)",
    consentAt: "=NOW()",
    pageUrl: "\t=HYPERLINK(1)",
    submittedAt: "\r=1",
  };
  const s = accepted(body);
  const expected = {
    name: "'=HYPERLINK(1)", email: "'=a@b.co", phone: "'+34 600 000 000", country: "'-Colombia",
    sector: "'@Teatro", project: "'=IMPORTXML(1)", consentAt: "'=NOW()", pageUrl: "'\t=HYPERLINK(1)", submittedAt: "'\r=1",
  };
  for (const [col, want] of Object.entries(expected)) assert.equal(s.cell(MC, col), want, col);
  assert.equal(s.cell(MC, "gender"), "femenino");
  assert.equal(s.cell(MC, "language"), "es");
  assert.equal(s.cell(MC, "consent"), true);
});
test("texto normal → sin apóstrofo", () => {
  const s = accepted(mc);
  for (const col of ["name", "email", "country", "sector", "project"]) assert.ok(!String(s.cell(MC, col)).startsWith("'"), col);
});

// ── Recorte de longitud ────────────────────────────────────────────────────
test("recorte: campos de texto a 500 caracteres", () => {
  const long = "x".repeat(600);
  const s = accepted({ ...mc, name: long, country: long, sector: long });
  for (const col of ["name", "country", "sector"]) assert.equal(s.cell(MC, col).length, 500, col);
});
test("recorte: project a 2000 caracteres (no a 500)", () => {
  const s = accepted({ ...mc, project: "p".repeat(2500) });
  assert.equal(s.cell(MC, "project").length, 2000);
});
test("recorte: project de exactamente 2000 se guarda entero", () => {
  const s = accepted({ ...mc, project: "p".repeat(2000) });
  assert.equal(s.cell(MC, "project"), "p".repeat(2000));
});
test("recorte + apóstrofo: el apóstrofo se añade tras recortar (project = 2001 caracteres guardados)", () => {
  const s = accepted({ ...mc, project: "=" + "p".repeat(2500) });
  assert.equal(s.cell(MC, "project").length, 2001);
  assert.ok(s.cell(MC, "project").startsWith("'="));
});

// ── Avisos por correo ──────────────────────────────────────────────────────
test("aviso: asunto propio de la masterclass, sin saltos de línea", () => {
  const s = load({ notifyEmail: "aviso@example.com" });
  s.post({ ...mc, name: "Ana\r\nBcc: x@evil.com" });
  assert.equal(s.mails.length, 1);
  assert.match(s.mails[0].subject, /^Nueva inscripción a la masterclass: /);
  assert.doesNotMatch(s.mails[0].subject, /[\r\n]/);
});
test("aviso: la fila se escribe antes del correo, y un fallo del correo no cambia la respuesta", () => {
  const okRun = load({ notifyEmail: "aviso@example.com" });
  const r1 = okRun.post(mc);
  assert.ok(okRun.events.lastIndexOf(`row:${MC}`) < okRun.events.indexOf("mail"), okRun.events.join(", "));
  const failing = load({ notifyEmail: "aviso@example.com", mailThrows: true });
  const r2 = failing.post(mc);
  assert.deepEqual(r2, r1);
  assert.equal(failing.rowsOf(MC).length, 1);
  assert.ok(failing.logs.some((l) => l.includes("too many times")));
});
test("aviso: el contador de 20/hora es COMPARTIDO con la landing", () => {
  const s = load({ notifyEmail: "aviso@example.com", now: 3600000 * 700 + 5 });
  for (let i = 0; i < 15; i++) s.post(contact);
  for (let i = 0; i < 10; i++) s.post(mc);
  assert.equal(s.rowsOf(LEADS).length, 15);
  assert.equal(s.rowsOf(MC).length, 10);
  assert.equal(s.mails.length, 20, "15 de la landing + solo 5 de la masterclass");
  const mcMails = s.mails.filter((m) => m.subject.startsWith("Nueva inscripción a la masterclass"));
  assert.equal(mcMails.length, 5);
  s.setNow(3600000 * 701 + 5);
  s.post(mc);
  assert.equal(s.mails.length, 21, "la hora siguiente vuelve a enviar");
});

// ── Paridad con MasterclassForm.tsx ────────────────────────────────────────
test("PARIDAD: lo que MasterclassForm.tsx acepta, el servidor lo acepta (sin recortar)", () => {
  const form = read("components/masterclass/MasterclassForm.tsx");
  const fields = read("components/form/fields.tsx");
  const EMAIL_RE = regexFrom(fields, "EMAIL_RE");
  const PHONE_CHARS_RE = regexFrom(fields, "PHONE_CHARS_RE");
  const clientPhoneOk = (v) => { const x = v.trim(); const d = x.replace(/\D/g, "").length; return PHONE_CHARS_RE.test(x) && d >= 7 && d <= 15; };
  const genders = form.match(/const GENDERS: GenderKey\[\] = \[([^\]]*)\]/)[1].match(/"(\w+)"/g).map((s) => s.slice(1, -1));
  const textMax = Number(form.match(/const TEXT_MAX_LENGTH = (\d+);/)[1]);
  const projectMax = Number(form.match(/const PROJECT_MAX_LENGTH = (\d+);/)[1]);
  const serverText = Number(CODE_GS.match(/const MAX_FIELD_LENGTH = (\d+);/)[1]);
  const serverProject = Number(CODE_GS.match(/const MAX_PROJECT_LENGTH = (\d+);/)[1]);
  assert.ok(textMax <= serverText, `límite de texto del formulario (${textMax}) ≤ servidor (${serverText})`);
  assert.ok(projectMax <= serverProject, `límite de project del formulario (${projectMax}) ≤ servidor (${serverProject})`);
  const serverGenders = Function(`return ${CODE_GS.match(/const GENDERS = (\[[^\]]*\]);/)[1]}`)();
  assert.deepEqual(serverGenders, genders, "mismas opciones de género");

  const phones = ["+34 600 000 000", "(300) 123-4567", "600-000-000", "+55 11 90000-0000", "1234567", "+123456789012345"];
  const names = ["María José", "João", "Ñandú Pérez", "Zoë Ångström", "D'Arcy O'Neill", "李小龙", "n".repeat(textMax)];
  const emails = ["ana@example.com", "a.b+tag@sub.dominio.co", "ñ@dominio.es"];
  const countries = ["Colombia", "Côte d'Ivoire", "México", "Brasil", "España", "c".repeat(textMax)];
  const sectors = ["Artes escénicas", "Música / Danza", "s".repeat(textMax)];
  const projects = ["Un proyecto.", "Línea 1\nLínea 2", "p".repeat(projectMax)];
  const bad = [];
  const check = (label, body, col) => {
    const s = load(); const r = s.post(body);
    if (!r.ok) return bad.push(`${label} → ${r.error}`);
    if (col && s.cell(MC, col) !== body[col].trim()) bad.push(`${label} → guardado distinto (recortado)`);
  };
  for (const p of phones) { if (!clientPhoneOk(p)) bad.push(`(el cliente rechaza ${p})`); check(`phone ${p}`, { ...mc, phone: p }); }
  for (const e of emails) { if (!EMAIL_RE.test(e)) bad.push(`(el cliente rechaza ${e})`); check(`email ${e}`, { ...mc, email: e }); }
  for (const n of names) check(`name ${n.slice(0, 20)}`, { ...mc, name: n }, "name");
  for (const c of countries) check(`country ${c.slice(0, 20)}`, { ...mc, country: c }, "country");
  for (const s of sectors) check(`sector ${s.slice(0, 20)}`, { ...mc, sector: s }, "sector");
  for (const p of projects) check(`project ${p.slice(0, 20)}`, { ...mc, project: p }, "project");
  for (const g of genders) check(`gender ${g}`, { ...mc, gender: g });
  for (const l of ["es", "pt"]) check(`language ${l}`, { ...mc, language: l });
  assert.deepEqual(bad, []);
});
