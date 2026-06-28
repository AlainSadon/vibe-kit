#!/usr/bin/env node
// init-project.mjs — reset een vers-uit-de-template project naar een blanco intentie-laag.
//
// Een GitHub-template kopieert ALLES, inclusief de wiki/docs/changelog die over vibe-kit zélf gaan.
// Dit script strip die meta-inhoud zodat je de methode + het gereedschap erft, maar met een lege
// wiki om je eigen project in te beschrijven — en zonder verweesd dogfood-anker dat de drift-check
// meteen zou laten falen.
//
//     node scripts/init-project.mjs            # DRY-RUN: toon wat er zou gebeuren
//     node scripts/init-project.mjs --yes      # voer de reset echt uit
//
// Geen dependencies. Pure Node (>=16, ESM). Draai vanuit de project-root.

import { readFileSync, writeFileSync, rmSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const APPLY = process.argv.slice(2).includes("--yes");
const actions = [];

const log = (m) => actions.push(m);
const rel = (p) => p.replace(ROOT + "\\", "").replace(ROOT + "/", "");

// ── Helpers ──────────────────────────────────────────────────────────────────
function clearMdIn(dir) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return;
  for (const name of readdirSync(full)) {
    if (extname(name) !== ".md") continue;
    const file = join(full, name);
    log(`verwijder  ${rel(file)}`);
    if (APPLY) unlinkSync(file);
  }
}

function write(path, content) {
  const full = join(ROOT, path);
  log(`reset      ${path}`);
  if (APPLY) writeFileSync(full, content);
}

function remove(path) {
  const full = join(ROOT, path);
  if (!existsSync(full)) return;
  log(`verwijder  ${path}`);
  if (APPLY) rmSync(full, { recursive: true, force: true });
}

function stripDogfoodAnchor(path) {
  const full = join(ROOT, path);
  if (!existsSync(full)) return;
  const before = readFileSync(full, "utf8");
  // Verwijder de hele regel met het dogfood-anker (PW: cap-drift-detectie).
  const after = before.replace(/^.*PW:\s*cap-drift-detectie.*\r?\n/m, "");
  if (after !== before) {
    log(`schoon     ${path} (dogfood-anker verwijderd)`);
    if (APPLY) writeFileSync(full, after);
  }
}

// ── Blanco sjablonen ─────────────────────────────────────────────────────────
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
> het project simpel is. Onderbouwing: https://github.com/AlainSadon/vibe-kit/blob/main/docs/WAAROM.md (§4).

## Lessen

_Nog geen lessen vastgelegd._
`;

const CHANGELOG = `# Changelog

Formaat losjes gebaseerd op [Keep a Changelog](https://keepachangelog.com/);
versies volgen [SemVer](https://semver.org/).

## [Unreleased]

### Added
- Project gestart vanuit de [vibe-kit](https://github.com/AlainSadon/vibe-kit) template.
`;

const README = `# Project

_(Beschrijf hier kort wat dit project doet en voor wie.)_

Dit project gebruikt de intentie-gedreven werkwijze van **vibe-kit** — lees en volg
[\`AGENTS.md\`](AGENTS.md). De methode-onderbouwing staat op de
[vibe-kit-repo](https://github.com/AlainSadon/vibe-kit).
`;

// ── Reset ────────────────────────────────────────────────────────────────────
console.log(APPLY ? "\n  init-project — RESET UITVOEREN\n" : "\n  init-project — DRY-RUN (voeg --yes toe om uit te voeren)\n");

// 1. Wis vibe-kit's eigen wiki-units (structuur blijft staan).
clearMdIn("wiki/rules");
clearMdIn("wiki/capabilities");
clearMdIn("wiki/decisions");
clearMdIn("wiki/checks");

// 2. Reset de losse wiki-bestanden naar blanco sjablonen.
write("wiki/index.md", INDEX);
write("wiki/log.md", LOG);
write("wiki/non-goals.md", NON_GOALS);
write("wiki/glossary.md", GLOSSARY);

// 3. Reset playbook + boilerplate naar projectneutrale stubs.
write("playbook.md", PLAYBOOK);
write("CHANGELOG.md", CHANGELOG);
write("README.md", README);

// 4. Verwijder kit-specifieke meta-documentatie.
remove("docs");          // WAAROM.md gaat over vibe-kit's eigen ontwerp en linkt naar gewiste units
remove("CONTRIBUTING.md"); // gaat over bijdragen aan de kit, niet aan jouw project

// 5. Verwijder het dogfood-anker zodat de drift-check direct schoon is.
stripDogfoodAnchor("scripts/drift-check.mjs");

// ── Rapport ──────────────────────────────────────────────────────────────────
for (const a of actions) console.log("    " + a);
console.log(`\n  ${actions.length} actie(s).`);

if (!APPLY) {
  console.log("\n  Dit was een dry-run. Voer uit met:  node scripts/init-project.mjs --yes\n");
} else {
  console.log("\n  Klaar. Volgende stappen:");
  console.log("    1. Vul de [PROJECT: …]-placeholder bovenaan AGENTS.md in.");
  console.log("    2. Controleer: node scripts/drift-check.mjs   (hoort schoon te zijn).");
  console.log("    3. Verwijder dit script: scripts/init-project.mjs");
  // Probeer dit script zelf op te ruimen.
  try {
    const self = new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
    unlinkSync(self);
    console.log("    (init-project.mjs heeft zichzelf verwijderd.)\n");
  } catch {
    console.log("");
  }
}
