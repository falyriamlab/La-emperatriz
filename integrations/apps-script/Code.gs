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
// Máximo de correos de aviso por hora; pasado el límite se siguen guardando
// las filas, pero sin aviso.
const MAX_NOTIFICATIONS_PER_HOUR = 20;
// Qué campos opcionales son obligatorios. Mantener sincronizado con
// FIELD_REQUIRED en ContactForm.tsx. (Nombre, correo y consentimiento
// siempre son obligatorios.) El servidor nunca debe ser más estricto que el
// formulario: si aquí algo es obligatorio y allí no, la persona vería un
// error genérico que no puede corregir.
const REQUIRED = { phone: true, country: true, budget: true, projectType: true };
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
const BUDGETS = ["lt100", "r100_150", "r150_250", "gt250"];
const MAX_FIELD_LENGTH = 500;
const MAX_PROJECT_TYPES = 10;

// Copiadas tal cual de ContactForm.tsx (EMAIL_RE, PHONE_CHARS_RE y la regla
// de 7–15 dígitos). Si cambian allí, cambiarlas aquí.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^[+\d\s\-()]+$/;
const PHONE_MIN_DIGITS = 7;
const PHONE_MAX_DIGITS = 15;
const COUNTRY_RE = /^[A-Z]{2}$/;

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "");
    const error = validate_(data);
    if (error) return json_({ ok: false, error: error });

    // Evita que dos envíos simultáneos escriban en la misma fila (y que el
    // contador de avisos se cuente dos veces).
    let shouldNotify = false;
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet_();
      const receivedAt = new Date().toISOString();
      const row = COLUMNS.map(function (key) {
        return key === "receivedAt" ? receivedAt : sanitize_(data[key]);
      });
      sheet.appendRow(row);
      shouldNotify = NOTIFY_EMAIL !== "" && takeNotificationSlot_();
    } finally {
      lock.releaseLock();
    }

    // La fila ya está guardada: un fallo del aviso (p. ej. cuota de MailApp
    // agotada) se registra, pero no convierte el envío en error.
    if (shouldNotify) {
      try {
        notify_(data);
      } catch (mailErr) {
        Logger.log("Aviso por correo no enviado: " + mailErr);
      }
    }
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

// Mismas reglas que el formulario (ContactForm.tsx), nunca más estrictas.
// Los textos válidos se guardan recortados (trim), como los envía el cliente.
// Valores "vacíos" en campos opcionales: "" para textos y listas vacías.
function validate_(d) {
  if (!d || typeof d !== "object") return "invalid_body";
  if (d.consent !== true) return "no_consent";

  // Nombre: siempre obligatorio, texto no vacío tras recortar.
  if (typeof d.name !== "string" || d.name.trim() === "") return "invalid_name";
  d.name = d.name.trim();

  // Correo: siempre obligatorio, mismo formato que el cliente.
  if (typeof d.email !== "string") return "invalid_email";
  d.email = d.email.trim();
  if (!EMAIL_RE.test(d.email)) return "invalid_email";

  // Teléfono: si es obligatorio o viene con valor, la regla del cliente.
  if (d.phone === undefined || d.phone === null) d.phone = "";
  if (typeof d.phone !== "string") return "invalid_phone";
  d.phone = d.phone.trim();
  if (REQUIRED.phone || d.phone !== "") {
    const digits = d.phone.replace(/\D/g, "").length;
    if (!PHONE_CHARS_RE.test(d.phone) || digits < PHONE_MIN_DIGITS || digits > PHONE_MAX_DIGITS) {
      return "invalid_phone";
    }
  }

  // País: obligatorio según REQUIRED; si viene, 2 letras mayúsculas (no se
  // comprueba que el código exista). countryName: texto, recortado.
  if (d.country === undefined || d.country === null) d.country = "";
  if (typeof d.country !== "string") return "invalid_country";
  if (d.country === "") {
    if (REQUIRED.country) return "invalid_country";
  } else if (!COUNTRY_RE.test(d.country)) {
    return "invalid_country";
  }
  if (d.countryName === undefined || d.countryName === null) d.countryName = "";
  if (typeof d.countryName !== "string") return "invalid_country";
  d.countryName = d.countryName.trim();

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
  if (REQUIRED.projectType && uniqueTypes.length === 0) return "invalid_project_type";
  d.projectType = uniqueTypes;

  // Presupuesto: obligatorio según REQUIRED; si viene, una clave permitida.
  if (d.budget === undefined || d.budget === null) d.budget = "";
  if (d.budget === "") {
    if (REQUIRED.budget) return "invalid_budget";
  } else if (BUDGETS.indexOf(d.budget) === -1) {
    return "invalid_budget";
  }

  if (d.language !== "es" && d.language !== "pt") return "invalid_language";
  return "";
}

// Las celdas que empiezan por = + - @, tabulador o retorno de carro se
// interpretarían como fórmula (el teléfono "+34…" incluido): el apóstrofo
// las fuerza a texto.
function sanitize_(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value;
  // Listas (projectType) → una celda: "escritura, genero".
  const s = (Array.isArray(value) ? value.join(", ") : String(value)).slice(0, MAX_FIELD_LENGTH);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

// Límite de avisos: ventana fija por hora de reloj, contada en CacheService.
// Se llama dentro del LockService, así que la lectura + escritura del
// contador no se pisa entre envíos simultáneos. Devuelve true si este envío
// puede mandar aviso (y lo descuenta).
function takeNotificationSlot_() {
  const cache = CacheService.getScriptCache();
  const key = "notify-count-" + Math.floor(Date.now() / 3600000);
  const sent = parseInt(cache.get(key) || "0", 10);
  if (sent >= MAX_NOTIFICATIONS_PER_HOUR) return false;
  cache.put(key, String(sent + 1), 3600);
  return true;
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
