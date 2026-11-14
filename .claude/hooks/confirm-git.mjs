// PreToolUse hook (Bash): asks Val before any push or merge (rule 7 of
// CLAUDE.md). Updating the local main from origin with a fast-forward
// (git merge --ff-only origin/main) is not a merge decision and passes.
import fs from "node:fs";

let input = {};
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch { process.exit(0); }
const cmd = String(input.tool_input?.command || "");

const reasons = [];
if (/\bgit\s+push\b/.test(cmd)) reasons.push("git push");
if (/\bgh\s+pr\s+merge\b/.test(cmd)) reasons.push("gh pr merge");
for (const m of cmd.matchAll(/\bgit\s+merge\b[^;&|\n]*/g)) {
  if (!/--ff-only\s+origin\/main\b/.test(m[0])) reasons.push("git merge");
}
if (!reasons.length) process.exit(0);

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "ask",
    permissionDecisionReason: `${[...new Set(reasons)].join(" y ")}: en este proyecto no se hace push ni merge sin permiso de Val (regla 7 de CLAUDE.md).`,
  },
}));
process.exit(0);
