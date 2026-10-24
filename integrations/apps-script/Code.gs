/**
 * La Emperatriz — receptor de leads (Google Apps Script Web App).
 *
 * Recibe el POST de lib/leads.ts (body JSON enviado como text/plain para
 * evitar el preflight CORS), añade una fila a la hoja "Leads" y responde
 * { ok: true } / { ok: false, error }. El sitio solo considera éxito
 * cuando la respuesta trae ok === true.
 *
 * Instalación: ver integrations/apps-script/README.md.
 */

// ── Config ────────────────────────────────────────────────────────────────
const SHEET_NAME = "Leads";
// Correo que recibe un aviso por cada lead. Vacío = sin aviso.
const NOTIFY_EMAIL = "";
// ──────────────────────────────────────────────────────────────────────────

const COLUMNS = [
  "submittedAt",
  "name",
  "email",
  "phone",
  "country",
  "countryName",
  "projectType",
  "budget",
  "language",
  "consent",
  "consentAt",
  "pageUrl",
  "receivedAt",
];

// projectType llega como lista (selección múltiple), p. ej. ["escritura", "genero"].
const PROJECT_TYPES = [
  "escenicas", "danza", "musica", "visuales", "escritura", "editorial",
  "espiritualidad", "genero", "interdisciplinar", "otro",
];
const BUDGETS = ["lt100", "r100_150", "r150_250", "gt250", ""];
const MAX_FIELD_LENGTH = 500;
const MAX_PROJECT_TYPES = 10;

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "");
    const error = validate_(data);
    if (error) return json_({ ok: false, error: error });

    // Evita que dos envíos simultáneos escriban en la misma fila.
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet_();
      const receivedAt = new Date().toISOString();
      const row = COLUMNS.map(function (key) {
        return key === "receivedAt" ? receivedAt : sanitize_(data[key]);
      });
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    if (NOTIFY_EMAIL) notify_(data);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: "server_error" });
  }
}

// Permite comprobar en el navegador que el despliegue responde.
function doGet() {
  return json_({ ok: true, service: "la-emperatriz-leads" });
}

function validate_(d) {
  if (!d || typeof d !== "object") return "invalid_body";
  if (d.consent !== true) return "no_consent";
  if (!d.name || !d.email || !d.phone) return "missing_fields";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(d.email))) return "invalid_email";
  if (d.country && !/^[A-Z]{2}$/.test(String(d.country))) return "invalid_country";
  // projectType: lista de claves. Si cualquier elemento no es texto o no está
  // en PROJECT_TYPES, se rechaza todo el envío. Los duplicados se quitan
  // ANTES de aplicar el máximo, y lo que se guarda es la lista sin repetidos.
  if (!Array.isArray(d.projectType)) return "invalid_project_type";
  const invalidType = d.projectType.some(function (k) {
    return typeof k !== "string" || PROJECT_TYPES.indexOf(k) === -1;
  });
  if (invalidType) return "invalid_project_type";
  const uniqueTypes = Array.from(new Set(d.projectType));
  if (uniqueTypes.length > MAX_PROJECT_TYPES) return "too_many_project_types";
  d.projectType = uniqueTypes;
  if (BUDGETS.indexOf(d.budget) === -1) return "invalid_budget";
  if (d.language !== "es" && d.language !== "pt") return "invalid_language";
  return "";
}

// Las celdas que empiezan por = + - @ se interpretarían como fórmula
// (el teléfono "+34…" incluido): el apóstrofo las fuerza a texto.
function sanitize_(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value;
  // Listas (projectType) → una celda: "escritura, genero".
  const s = (Array.isArray(value) ? value.join(", ") : String(value)).slice(0, MAX_FIELD_LENGTH);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Texto que va a un encabezado de correo (p. ej. el asunto): saltos de línea
// y caracteres de control → espacio, para que un valor del formulario no
// pueda inyectar encabezados adicionales.
function headerSafe_(value) {
  return String(value === undefined || value === null ? "" : value).replace(
    /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g,
    " ",
  );
}

function notify_(d) {
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: headerSafe_("Nuevo lead La Emperatriz: " + d.name),
    body: COLUMNS.filter(function (k) { return k !== "receivedAt"; })
      .map(function (k) { return k + ": " + d[k]; })
      .join("\n"),
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
