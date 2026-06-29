# Werkwijze — intentie-gedreven bouwen

`[PROJECT: korte één-regel beschrijving van wat dit project doet en voor wie.]`

> Dit is het altijd-aan contract voor elke agent in dit project. Het is bewust **kort**. De
> stap-voor-stap procedures staan in [`skills/`](skills/) en laden pas wanneer je ze nodig hebt.
> Methode afgeleid van Omar Ismail's *Making English a Programming Language* (MIT).

> **Eerste run (vers project):** staat hierboven nog de letterlijke `[PROJECT: …]`-placeholder, dan is
> dit project nog niet ingericht — volg dan eerst de skill
> [`start-project`](skills/start-project/SKILL.md) vóór ander werk. (Werk je aan vibe-kit zélf? Dan is
> de placeholder bewust leeg en is onboarding niet van toepassing.)

## Kernidee

Code legt vast *hóé* iets gebouwd is, niet *waaróm*. Bij snel AI-gestuurd bouwen gaat die bedoeling
verloren → duplicatie, vervagende modulariteit, brosse architectuur. De oplossing: maak de intentie
expliciet en duurzaam in een natuurlijke-taallaag (de [`wiki/`](wiki/)) en zet er lichte poorten
omheen.

Drie principes:

1. **Intentie is duurzaam; code is de afgeleide.** De `wiki/` is de bron van waarheid voor *wat* en
   *waarom*. Code implementeert die intentie — laat ze niet uiteenlopen.
2. **Beslis *wát* vóór *welke files*.** Bepaal eerst welke bedoeling verandert, pas daarna welke code
   je aanraakt.
3. **De mens keurt intentie goed vóór code.** Een niet-triviale wijziging wordt eerst een *voorstel
   in gewone taal* dat de mens goedkeurt. Geen code vóór akkoord.

> Doel is **praktisch determinisme**: niet het model deterministisch maken, maar *wat* het moet
> produceren zó vastpinnen dat er voor het *hoe* weinig ruimte tot improviseren overblijft.

## Ceremonie schaalt mee

Bepaal het niveau **vóór** je begint. Geen ceremonie om de ceremonie.

| Niveau | Voorbeeld | Wat je doet |
|--------|-----------|-------------|
| **Triviaal** | typo, comment, rename binnen 1 file | Gewoon doen. |
| **Klein** | bugfix, lokale tweak binnen 1 capability | Loop de drie poorten mentaal langs. Update de geraakte unit als de intentie verschuift. |
| **Substantieel** | nieuwe feature/regel/capability, breaking change, gedrag dat meerdere paden raakt | Volg de skill [`propose-change`](skills/propose-change/SKILL.md) → na akkoord [`compile-change`](skills/compile-change/SKILL.md). |

## De drie poorten

Vragen, geen formulieren. Loop ze langs bij elke kleine/substantiële wijziging.

1. **Reuse** — Hergebruikt de oplossing bestaande capabilities, of vindt ze onnodig een nieuw pad
   uit? **Verbod op herimplementatie:** roep bestaande logica aan, kopieer haar niet.
2. **Architectuur** — Kan de huidige structuur dit schoon absorberen, of moet refactoring eraan
   voorafgaan?
3. **Correctheid** — Verifiëren de checks *álle* acceptatiecriteria? Zo niet: schrijf eerst de check.
   Let op vertrouwensgrenzen, datamigraties, backward compatibility, observability.

## Traceerbaarheid — `PW:`-ankers

Plaats bij code die een specifieke regel/beslissing realiseert een grep-baar anker naar de wiki-ID:

```js
// PW: rule-bedrag-afronding  — afronden op halve centen, zie wiki/rules/bedrag-afronding.md
```

Zo is altijd zichtbaar welke code welke bedoeling dient. Dit is de basis voor de drift-detectie.

## De wiki

Map [`wiki/`](wiki/) met kleine, gelinkte Markdown-units. Houd het licht — alleen units die echt
intentie dragen. ID-conventie: `rule-`, `cap-`, `dec-`, `chk-` + kebab-case (stabiel, grep-baar).
Bestaat `wiki/` nog niet bij je eerste substantiële wijziging? Scaffold dan minimaal de geraakte
units; forceer geen volledige wiki vooraf. Zie [`wiki/index.md`](wiki/index.md).

## Onderhoud & geheugen

- **Drift-loops:** draai `node scripts/drift-check.mjs` (periodiek of in CI). Objectieve gaten
  (verweesd anker, ontbrekende check) repareer je; subjectieve (architectuur-sprawl) leg je voor.
  Zie de skill [`reconcile-wiki`](skills/reconcile-wiki/SKILL.md). De drift-check kan optioneel ook je
  test-, quality- en security-commando meedraaien (opt-in, default uit) — zie de skill
  [`run-checks`](skills/run-checks/SKILL.md).
- **Playbook:** noteer herbruikbare lessen in [`playbook.md`](playbook.md) (ACE-patroon) zodat
  toekomstige sessies ervan profiteren.

## Beschikbare skills

| Skill | Wanneer |
|-------|---------|
| [`start-project`](skills/start-project/SKILL.md) | eerste run — vers template-project inrichten (onboarding) |
| [`propose-change`](skills/propose-change/SKILL.md) | substantiële wijziging — schrijf het voorstel vóór code |
| [`compile-change`](skills/compile-change/SKILL.md) | na goedkeuring — compileer voorstel naar code + checks |
| [`reconcile-wiki`](skills/reconcile-wiki/SKILL.md) | drift-loops draaien en wiki bijwerken |
| [`run-checks`](skills/run-checks/SKILL.md) | acceptatiecriteria als uitvoerbare checks draaien |
| [`review-diff`](skills/review-diff/SKILL.md) | een diff toetsen aan de drie poorten |
| [`import-codebase`](skills/import-codebase/SKILL.md) | bestaande code reverse-importeren naar de wiki |
