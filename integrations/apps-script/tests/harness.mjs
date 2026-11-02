// Runs integrations/apps-script/Code.gs in Node with mocked Apps Script
// services, so its behaviour can be tested without Google. Each call to
// load() gives a fresh script instance with its own sheets, mail outbox,
// logs, cache and clock.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
export const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
export const CODE_GS = read("integrations/apps-script/Code.gs");

/**
 * @param {object}  [opts]
 * @param {string}  [opts.notifyEmail=""]  value for NOTIFY_EMAIL
 * @param {boolean} [opts.mailThrows=false] MailApp.sendEmail throws (e.g. quota)
 * @param {number}  [opts.now]             fixed clock (ms) for Date.now()
 * @param {string}  [opts.source]          Code.gs source to run (defaults to the real file)
 */
export function load({ notifyEmail = "", mailThrows = false, now = 1_800_000_000_000, source = CODE_GS } = {}) {
  const sheets = new Map(); // name → array of rows (row 0 = header once written)
  const mails = [];
  const logs = [];
  const events = []; // ordered: "row:<sheet>", "mail"
  const cache = new Map();
  let clock = now;

  const sheetApi = (name) => {
    const rows = sheets.get(name);
    return {
      getLastRow: () => rows.length,
      appendRow: (r) => { rows.push(r); events.push(`row:${name}`); },
      setFrozenRows() {},
    };
  };
  const ctx = {
    console: { error() {} },
    Array, Set, JSON, String, Object, parseInt, Math,
    Date: class extends Date { static now() { return clock; } },
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({
        getSheetByName: (name) => (sheets.has(name) ? sheetApi(name) : null),
        insertSheet: (name) => { sheets.set(name, []); return sheetApi(name); },
      }),
    },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    CacheService: { getScriptCache: () => ({ get: (k) => (cache.has(k) ? cache.get(k) : null), put: (k, v) => cache.set(k, v) }) },
    MailApp: {
      sendEmail: (m) => {
        events.push("mail");
        if (mailThrows) throw new Error("Service invoked too many times for one day: email.");
        mails.push(m);
      },
    },
    Logger: { log: (m) => logs.push(String(m)) },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (s) => ({ setMimeType: () => s }) },
  };
  vm.createContext(ctx);
  vm.runInContext(source.replace('const NOTIFY_EMAIL = "";', `const NOTIFY_EMAIL = ${JSON.stringify(notifyEmail)};`), ctx);

  const post = (body) => JSON.parse(ctx.doPost({ postData: { contents: typeof body === "string" ? body : JSON.stringify(body) } }));
  /** Data rows (header excluded) of a sheet. */
  const rowsOf = (name) => (sheets.get(name) ?? []).slice(1);
  /** Header row of a sheet. */
  const headerOf = (name) => (sheets.get(name) ?? [])[0];
  /** Cell of the last data row of `sheet`, by column name. */
  const cell = (sheet, column) => {
    const header = headerOf(sheet);
    const last = rowsOf(sheet).at(-1);
    return header && last ? last[header.indexOf(column)] : undefined;
  };
  return { post, rowsOf, headerOf, cell, mails, logs, events, setNow: (n) => { clock = n; } };
}

/** Value of a `const NAME = /…/;` regex literal in a source file. */
export function regexFrom(source, name) {
  const m = source.match(new RegExp(`const ${name} = \\/(.*)\\/;`));
  if (!m) throw new Error(`${name} not found`);
  return new RegExp(m[1]);
}
