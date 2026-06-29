#!/usr/bin/env node
// add-to-project.mjs — voeg de vibe-kit-machinerie NON-DESTRUCTIEF toe aan een BESTAAND project.
//
// Anders dan init-project.mjs (dat een verse template-clone reset en bestanden overschrijft), raakt
// dit script nooit bestaande bestanden aan: het kopieert alleen wat nog ontbreekt en zet een lege
// wiki-structuur klaar. Je eigen README, CHANGELOG, code en regels blijven ongemoeid.
//
// Gebruik vanuit de root van je bestaande project:
//
//     npx degit AlainSadon/vibe-kit .vibe-kit-install
//     node .vibe-kit-install/scripts/add-to-project.mjs            # DRY-RUN: toon wat er gebeurt
//     node .vibe-kit-install/scripts/add-to-project.mjs --yes      # voer de installatie uit
//     (verwijder daarna .vibe-kit-install)
//
// Geen dependencies. Pure Node (>=18, ESM).

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from "node:fs";
import { join, dirname, resolve, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = resolve(SCRIPT_DIR, "..");   // de uitgecheckte kit (bv. .vibe-kit-install)
const TARGET = process.cwd();                  // jouw bestaande project
const APPLY = process.argv.slice(2).includes("--yes");
const actions = [];
const log = (m) => actions.push(m);

if (resolve(TARGET) === resolve(KIT_ROOT)) {
  console.error("\n  Draai dit vanuit je eigen project, niet vanuit de kit-map zelf.\n");
  process.exit(1);
}

// ── Helpers (non-destructief: bestaande bestanden worden nooit overschreven) ──
function ensureDir(absDir) {
  if (!existsSync(absDir) && APPLY) mkdirSync(absDir, { recursive: true });
}

function copyIfAbsent(rel) {
  const src = join(KIT_ROOT, rel);
  const dst = join(TARGET, rel);
  if (!existsSync(src)) return;
  if (existsSync(dst)) { log(`overslaan  ${rel} (bestaat al)`); return; }
  log(`kopieer    ${rel}`);
  if (APPLY) { ensureDir(dirname(dst)); copyFileSync(src, dst); }
}

function writeIfAbsent(rel, content) {
  const dst = join(TARGET, rel);
  if (existsSync(dst)) { log(`overslaan  ${rel} (bestaat al)`); return; }
  log(`maak       ${rel}`);
  if (APPLY) { ensureDir(dirname(dst)); writeFileSync(dst, content); }
}

function copyDirIfAbsent(rel) {
  const srcDir = join(KIT_ROOT, rel);
  if (!existsSync(srcDir)) return;
  for (const name of readdirSync(srcDir)) {
    const childRel = `${rel}/${name}`;
    if (statSync(join(srcDir, name)).isDirectory()) copyDirIfAbsent(childRel);
    else copyIfAbsent(childRel);
  }
}

// ── Blanco wiki-sjablonen (geen vibe-kit-eigen inhoud) ───────────────────────
const INDEX = `# Wiki — index

Catalogus van de intentie-units van dit project. Elke unit is een klein, gelinkt Markdown-bestand
met een stabiele, grep-bare ID (\`rule-\`, \`cap-\`, \`dec-\`, \`chk-\`).

## Rules
_(nog geen)_

## Capabilities
_(nog geen)_

## Decisions
_(nog geen)_

## Checks
_(nog geen)_

> Zie [\`log.md\`](log.md), [\`non-goals.md\`](non-goals.md) en [\`glossary.md\`](glossary.md).
`;
const LOG = `# Wiki — log (audit-trail)

Eén regel per goedgekeurd voorstel: datum, geraakte ID's, samenvatting.

| Datum | Units | Samenvatting |
|-------|-------|--------------|
`;
const NON_GOALS = `# Non-goals — wat dit project bewust niet is

_(Vul aan zodra scope-grenzen duidelijk zijn.)_
`;
const GLOSSARY = `# Glossary — gedeelde termen

_(Vul aan met de termen die in dit project een specifieke betekenis hebben.)_
`;
const PLAYBOOK = `# Playbook — gecureerde lessen

> **Wat is dit?** Een groeiend, lerend geheugen (ACE-patroon: Generator → Reflector → Curator). Na
> een wijziging die een herbruikbare les opleverde, voeg je hier één compacte, geteste richtlijn toe.
> Houd het **gecureerd**: voeg toe wat generaliseert, verwijder wat achterhaald is.

> **Selectief toepassen.** Een groeiend playbook loont vooral bij taken met veel domeinkennis en kan
> overbodig zijn bij taken die juist baat hebben bij beknopte instructies. Laat dit bestand leeg als
> het project simpel is. Onderbouwing: https://github.com/AlainSadon/vibe-kit/blob/main/docs/WHY.md (§4).

## Lessen

_Nog geen lessen vastgelegd._
`;

// ── Installatie ──────────────────────────────────────────────────────────────
console.log(APPLY ? "\n  add-to-project — INSTALLEREN\n" : "\n  add-to-project — DRY-RUN (voeg --yes toe om uit te voeren)\n");

// 1. Het contract (alleen als je er nog geen hebt; anders moet je de routing zelf samenvoegen).
copyIfAbsent("AGENTS.md");
copyIfAbsent("CLAUDE.md");

// 2. De skills (recepten voor de agent).
copyDirIfAbsent("skills");

// 3. De bewaker + zijn config + CI.
copyIfAbsent("scripts/drift-check.mjs");
copyIfAbsent("vibe-kit.config.mjs");
copyIfAbsent(".github/workflows/drift.yml");

// 4. Lege wiki-structuur + playbook.
writeIfAbsent("wiki/index.md", INDEX);
writeIfAbsent("wiki/log.md", LOG);
writeIfAbsent("wiki/non-goals.md", NON_GOALS);
writeIfAbsent("wiki/glossary.md", GLOSSARY);
for (const d of ["wiki/rules", "wiki/capabilities", "wiki/decisions", "wiki/checks"]) {
  const abs = join(TARGET, d);
  if (!existsSync(abs)) { log(`maak       ${d}/ (leeg)`); if (APPLY) mkdirSync(abs, { recursive: true }); }
}
writeIfAbsent("playbook.md", PLAYBOOK);

// 5. Repo-hygiëne (alleen als afwezig).
copyIfAbsent(".gitattributes");
copyIfAbsent(".gitignore");

// 6. Verwijder het dogfood-anker uit de zojuist gekopieerde drift-check (anders: verweesd anker).
const driftDst = join(TARGET, "scripts/drift-check.mjs");
if (APPLY && existsSync(driftDst)) {
  const before = readFileSync(driftDst, "utf8");
  const after = before.replace(/^.*PW:\s*cap-drift-detectie.*\r?\n/m, "");
  if (after !== before) writeFileSync(driftDst, after);
}

// ── Rapport + vervolgstappen ─────────────────────────────────────────────────
for (const a of actions) console.log("    " + a);
console.log(`\n  ${actions.length} actie(s).`);

const agentsSkipped = existsSync(join(TARGET, "AGENTS.md")) &&
  readFileSync(join(TARGET, "AGENTS.md"), "utf8").indexOf("intentie-gedreven") === -1;

if (!APPLY) {
  console.log("\n  Dit was een dry-run. Voer uit met:  node <pad>/add-to-project.mjs --yes\n");
} else {
  console.log("\n  Klaar. Volgende stappen:");
  if (agentsSkipped) {
    console.log("    ! Je had al een AGENTS.md — die is NIET aangeraakt. Voeg de vibe-kit-werkwijze");
    console.log("      handmatig toe (zie de AGENTS.md in deze kit als voorbeeld).");
  }
  console.log("    1. Open je AI-assistent in dit project — hij vraagt wat je bouwt en vult de");
  console.log("       [PROJECT: …]-regel in AGENTS.md zelf in (skill start-project).");
  console.log("    2. Laat de assistent met 'import-codebase' je bestaande code omzetten naar");
  console.log("       wiki-intentie (in behapbare batches, met jouw review).");
  console.log("    3. Verwijder de tijdelijke installatiemap (bv. .vibe-kit-install).");
  console.log("    4. Controleer: node scripts/drift-check.mjs   (hoort schoon te zijn).\n");
}
