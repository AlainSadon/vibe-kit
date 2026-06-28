#!/usr/bin/env node
// drift-check.mjs — project-agnostische drift-detectie voor de intentie-gedreven werkwijze.
//
// Hoort bij AGENTS.md (Onderhoud & geheugen). Optioneel: kopieer naar je project
// (bv. scripts/drift-check.mjs) en draai via CI of een agent-loop:
//
//     node scripts/drift-check.mjs            # rapporteer; exit 1 bij fouten
//     node scripts/drift-check.mjs --strict   # waarschuwingen tellen ook als fouten
//     node scripts/drift-check.mjs --json      # machine-leesbare output
//
// Geen dependencies. Pure Node (>=16, ESM). Werkt op elke stack — het kijkt alleen naar
// `wiki/`-units en grep-bare `PW:`-ankers in de broncode.
//
// Wat het controleert:
//   1. Verweesd anker     — `PW: <id>` in code wijst naar een niet-bestaande wiki-ID   -> FOUT
//   2. Regel zonder anker  — actieve rule/capability die nergens in code verankerd is    -> waarschuwing
//   3. Regel zonder check  — actieve rule/capability waar geen check-unit naar linkt      -> waarschuwing
//   4. Verweesde check     — check-unit die naar een niet-bestaande ID linkt              -> FOUT
//   5. Checks-commando      — optioneel: draait je test-/eval-commando (CONFIG.checksCommand)

// PW: cap-drift-detectie — dit script realiseert de drift-detectie, zie wiki/capabilities/drift-detectie.md
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep, extname } from "node:path";
import { execSync } from "node:child_process";

// ── Configuratie (pas aan per project) ──────────────────────────────────────
const CONFIG = {
  wikiDir: "wiki",                 // waar de intentie-units staan
  // Mappen die nooit gescand worden op ankers:
  ignoreDirs: ["node_modules", ".git", "dist", "build", "out", "coverage", "wiki", ".next", "vendor", ".vibe-kit-install"],
  // Bestandsextensies die als "code" gelden voor de anker-scan:
  codeExts: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".go", ".rs", ".java", ".rb", ".php", ".cs", ".kt", ".swift", ".css", ".scss", ".vue", ".svelte", ".sql", ".sh"],
  // Unit-types die in code verankerd én getest horen te zijn:
  anchorableTypes: ["rule", "capability"],
  // Optioneel test-/eval-commando dat alle acceptatiecriteria verifieert (null = overslaan):
  checksCommand: null,             // bv. "npm test --silent"
};

const ROOT = process.cwd();
const ARGS = new Set(process.argv.slice(2));
const STRICT = ARGS.has("--strict");
const JSON_OUT = ARGS.has("--json");

const ANCHOR_RE = /PW:\s*([a-z][a-z0-9]*-[a-z0-9-]+)/g;     // matcht bv. "PW:" gevolgd door rule-<naam>

// ── Helpers ─────────────────────────────────────────────────────────────────
function walk(dir, onFile) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    const full = join(dir, name);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      if (CONFIG.ignoreDirs.includes(name)) continue;
      walk(full, onFile);
    } else {
      onFile(full);
    }
  }
}

function frontmatter(text) {
  // Parseert een minimale YAML-frontmatter (id/type/status/links).
  const m = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = { id: null, type: null, status: "active", links: [] };
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, k, vRaw] = kv;
    const v = vRaw.trim();
    if (k === "links") {
      // ondersteunt [a, b] of inline lege lijst
      fm.links = v.replace(/[\[\]]/g, "").split(",").map(s => s.trim()).filter(Boolean);
    } else if (k in fm) {
      fm[k] = v;
    }
  }
  return fm.id ? fm : null;
}

// ── 1. Lees alle wiki-units ──────────────────────────────────────────────────
const units = new Map();          // id -> { id, type, status, links, file }
const wikiPath = join(ROOT, CONFIG.wikiDir);
walk(wikiPath, (file) => {
  if (extname(file) !== ".md") return;
  const fm = frontmatter(readFileSync(file, "utf8"));
  if (fm) units.set(fm.id, { ...fm, file: relative(ROOT, file) });
});

const knownIds = new Set(units.keys());

// ── 2. Scan code op PW:-ankers ───────────────────────────────────────────────
const anchors = new Map();        // id -> [ "pad:regel", ... ]
walk(ROOT, (file) => {
  if (!CONFIG.codeExts.includes(extname(file))) return;
  let text;
  try { text = readFileSync(file, "utf8"); } catch { return; }
  if (!text.includes("PW:")) return;
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    let m;
    ANCHOR_RE.lastIndex = 0;
    while ((m = ANCHOR_RE.exec(line))) {
      const id = m[1];
      if (!anchors.has(id)) anchors.set(id, []);
      anchors.get(id).push(`${relative(ROOT, file).split(sep).join("/")}:${i + 1}`);
    }
  });
});

// ── 3. Kruistabel + bevindingen ──────────────────────────────────────────────
const errors = [];
const warnings = [];

// 1. Verweesde ankers
for (const [id, locs] of anchors) {
  if (!knownIds.has(id)) {
    errors.push(`Verweesd anker: PW: ${id} bestaat niet in ${CONFIG.wikiDir}/ (${locs.join(", ")})`);
  }
}

// 2. Regels zonder anker
const anchoredIds = new Set(anchors.keys());
for (const u of units.values()) {
  if (u.status !== "active") continue;
  if (!CONFIG.anchorableTypes.includes(u.type)) continue;
  if (!anchoredIds.has(u.id)) {
    warnings.push(`Regel zonder anker: ${u.id} (${u.file}) heeft geen PW:-anker in de code`);
  }
}

// 3 & 4. Check-dekking
const checkedIds = new Set();
for (const u of units.values()) {
  if (u.type !== "check") continue;
  for (const link of u.links) {
    checkedIds.add(link);
    if (!knownIds.has(link)) {
      errors.push(`Verweesde check: ${u.id} (${u.file}) linkt naar onbekende ID '${link}'`);
    }
  }
}
for (const u of units.values()) {
  if (u.status !== "active") continue;
  if (!CONFIG.anchorableTypes.includes(u.type)) continue;
  if (!checkedIds.has(u.id)) {
    warnings.push(`Regel zonder check: ${u.id} (${u.file}) wordt door geen enkele check geverifieerd`);
  }
}

// ── 4. Optioneel: draai het acceptatie-checks-commando ───────────────────────
let checksResult = null;
if (CONFIG.checksCommand) {
  try {
    execSync(CONFIG.checksCommand, { cwd: ROOT, stdio: JSON_OUT ? "pipe" : "inherit" });
    checksResult = "pass";
  } catch {
    checksResult = "fail";
    errors.push(`Checks-commando faalde: \`${CONFIG.checksCommand}\``);
  }
}

// ── 5. Rapport ───────────────────────────────────────────────────────────────
const summary = {
  units: units.size,
  ankers: anchors.size,
  checksCommand: checksResult,
  errors,
  warnings: STRICT ? [] : warnings,
  ...(STRICT ? { strictErrors: warnings } : {}),
};

if (JSON_OUT) {
  console.log(JSON.stringify({ ok: errors.length === 0 && (!STRICT || warnings.length === 0), ...summary }, null, 2));
} else {
  console.log(`\n  drift-check — ${units.size} units, ${anchors.size} ankers` +
    (checksResult ? `, checks: ${checksResult}` : ""));
  if (errors.length) {
    console.log(`\n  ✗ ${errors.length} fout(en):`);
    for (const e of errors) console.log(`    - ${e}`);
  }
  if (warnings.length) {
    console.log(`\n  ${STRICT ? "✗" : "⚠"} ${warnings.length} waarschuwing(en)${STRICT ? " (strict → fout)" : ""}:`);
    for (const w of warnings) console.log(`    - ${w}`);
  }
  if (!errors.length && !warnings.length) console.log("\n  ✓ geen drift gevonden\n");
  else console.log("");
}

const failed = errors.length > 0 || (STRICT && warnings.length > 0);
process.exit(failed ? 1 : 0);
