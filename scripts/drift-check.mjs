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
//   5. Command-hooks        — optioneel: draait je test-, quality- en security-commando
//                            (checksCommand / qualityCommand / securityCommand in vibe-kit.config.mjs)

// PW: cap-drift-detectie — dit script realiseert de drift-detectie, zie wiki/capabilities/drift-detectie.md
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep, extname } from "node:path";
import { pathToFileURL } from "node:url";
import { execSync } from "node:child_process";

// ── Configuratie ─────────────────────────────────────────────────────────────
// De instelbare waarden staan in `vibe-kit.config.mjs` in de project-root, NIET hier — zo
// overschrijft een upgrade van dit script je instellingen niet. De waarden hieronder zijn alleen
// de fallback-defaults: ze gelden wanneer dat bestand (of een sleutel erin) ontbreekt.
const DEFAULTS = {
  wikiDir: "wiki",                 // waar de intentie-units staan
  ignoreDirs: ["node_modules", ".git", "dist", "build", "out", "coverage", "wiki", ".next", "vendor", ".vibe-kit-install"],
  codeExts: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".go", ".rs", ".java", ".rb", ".php", ".cs", ".kt", ".swift", ".css", ".scss", ".vue", ".svelte", ".sql", ".sh"],
  anchorableTypes: ["rule", "capability"],   // typen die verankerd én getest horen te zijn
  checksCommand: null,             // tests; null = uit (zie vibe-kit.config.mjs voor voorbeelden)
  qualityCommand: null,            // lint/complexiteit; null = uit
  securityCommand: null,           // kwetsbaarheden/secrets; null = uit
};

const ROOT = process.cwd();

// Laad de gebruikersconfig en leg die over de defaults heen. Ontbreekt het bestand of is het
// ongeldig, dan gelden de defaults (de drift-check blijft dus altijd werken).
let userConfig = {};
try {
  userConfig = (await import(pathToFileURL(join(ROOT, "vibe-kit.config.mjs")).href)).default ?? {};
} catch { /* geen/ongeldig vibe-kit.config.mjs → defaults gelden */ }
const CONFIG = { ...DEFAULTS, ...userConfig };

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

// ── 4. Optioneel: draai de command-hooks (checks / quality / security) ───────
// Alle drie draaien het commando van jóúw project; null = uit. Elke faler is een fout.
const HOOKS = [
  { label: "checks",   command: CONFIG.checksCommand },
  { label: "quality",  command: CONFIG.qualityCommand },
  { label: "security", command: CONFIG.securityCommand },
];
const hookResults = {};                      // label -> "pass" | "fail"
for (const { label, command } of HOOKS) {
  if (!command) continue;
  try {
    execSync(command, { cwd: ROOT, stdio: JSON_OUT ? "pipe" : "inherit" });
    hookResults[label] = "pass";
  } catch {
    hookResults[label] = "fail";
    errors.push(`${label}-commando faalde: \`${command}\``);
  }
}
const checksResult = hookResults.checks ?? null;

// ── 4b. Geen testcommando ingesteld? Maak dat zichtbaar ──────────────────────
// Anders draaien de inhoudelijke checks stilletjes niet en lijkt alles groen. De
// quality/security-hooks zijn bewust opt-in (default uit) — daar nag de check niet over,
// hij noemt ze alleen als er nog geen enkele hook draait.
const hasCheckUnits = [...units.values()].some(u => u.type === "check");
let checksNotice = null;
if (!CONFIG.checksCommand) {
  if (hasCheckUnits) {
    warnings.push(`Tests niet gedraaid: er zijn check-units, maar checksCommand staat op null. ` +
      `Zet je testcommando (bv. "node --test") in vibe-kit.config.mjs zodat de checks meedraaien.`);
  } else {
    checksNotice = `geen command-hooks ingesteld: alleen structurele controle, er zijn geen tests/` +
      `quality/security-checks gedraaid. Zet checksCommand / qualityCommand / securityCommand in ` +
      `vibe-kit.config.mjs (bv. "pytest", "ruff check .", "pip-audit") of vraag je agent (skill run-checks).`;
  }
}

// ── 5. Rapport ───────────────────────────────────────────────────────────────
const summary = {
  units: units.size,
  ankers: anchors.size,
  checksCommand: checksResult,            // backward-compat
  hooks: hookResults,                     // { checks?, quality?, security? }
  checksNotice,
  errors,
  warnings: STRICT ? [] : warnings,
  ...(STRICT ? { strictErrors: warnings } : {}),
};

if (JSON_OUT) {
  console.log(JSON.stringify({ ok: errors.length === 0 && (!STRICT || warnings.length === 0), ...summary }, null, 2));
} else {
  const hookLine = Object.entries(hookResults).map(([k, v]) => `${k}: ${v}`).join(", ");
  console.log(`\n  drift-check — ${units.size} units, ${anchors.size} ankers` +
    (hookLine ? `, ${hookLine}` : ""));
  if (checksNotice) console.log(`\n  ℹ ${checksNotice}`);
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
