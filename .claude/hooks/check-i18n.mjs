// Stop hook: lib/i18n/es.json and pt.json must have the same keys, types and
// array lengths. On a mismatch it blocks the end of the turn (exit 2) and
// tells Claude what differs, so it fixes it before handing over. If the
// turn was already continued by this hook (stop_hook_active), it only warns
// the user, to never loop.
import fs from "node:fs";
import path from "node:path";

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
let input = {};
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch {}

const read = (lang) => JSON.parse(fs.readFileSync(path.join(root, "lib", "i18n", `${lang}.json`), "utf8"));
let es, pt;
try { es = read("es"); pt = read("pt"); } catch (e) {
  process.stderr.write(`check-i18n: no se pudieron leer los diccionarios: ${e.message}\n`);
  process.exit(input.stop_hook_active ? 0 : 2);
}

const kind = (v) => (Array.isArray(v) ? "array" : v === null ? "null" : typeof v);
const diffs = [];
function walk(a, b, at) {
  const ka = kind(a), kb = kind(b);
  if (ka !== kb) return diffs.push(`${at || "(raíz)"}: ES es ${ka}, PT es ${kb}`);
  if (ka === "array") {
    if (a.length !== b.length) diffs.push(`${at}: ES tiene ${a.length} elementos, PT ${b.length}`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) walk(a[i], b[i], `${at}[${i}]`);
  } else if (ka === "object") {
    for (const k of Object.keys(a)) if (!(k in b)) diffs.push(`${at ? at + "." : ""}${k}: falta en pt.json`);
    for (const k of Object.keys(b)) if (!(k in a)) diffs.push(`${at ? at + "." : ""}${k}: falta en es.json`);
    for (const k of Object.keys(a)) if (k in b) walk(a[k], b[k], at ? `${at}.${k}` : k);
  }
}
walk(es, pt, "");

if (!diffs.length) process.exit(0);
const list = diffs.slice(0, 20).map((d) => `- ${d}`).join("\n") + (diffs.length > 20 ? `\n- … y ${diffs.length - 20} más` : "");
if (input.stop_hook_active) {
  process.stdout.write(JSON.stringify({ systemMessage: `Aviso: es.json y pt.json siguen sin coincidir (${diffs.length} diferencias).` }));
  process.exit(0);
}
process.stderr.write(`Los diccionarios no coinciden (regla 1 de CLAUDE.md: todo texto va en es.json y pt.json a la vez). Corrígelo antes de terminar:\n${list}\n`);
process.exit(2);
