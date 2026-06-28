---
name: start-project
description: Richt een vers project in dat met de vibe-kit template is gemaakt. Gebruik dit eenmalig bij de eerste run, herkenbaar doordat de [PROJECT: …]-placeholder bovenaan AGENTS.md nog letterlijk aanwezig is. Voert een kort onboarding-gesprek en doet daarna de mechaniek.
---

# start-project

Eenmalige onboarding voor een vers-uit-de-template project. De **mens beslist** (beantwoordt de
vragen), de **agent doet de mechaniek** (vult bestanden, draait de reset). Geen ingebakken
stack-aannames.

## Wanneer

Bij de eerste run, te herkennen aan de letterlijke `[PROJECT: …]`-placeholder bovenaan `AGENTS.md`.
Is die al ingevuld, dan is het project al ingericht — sla deze skill over. Werk je aan **vibe-kit
zélf** (de kit-repo)? Dan is de placeholder bewust leeg en is onboarding niet van toepassing.

## Stappen

1. **Vraag het projectdoel.** "Wat doet dit project, en voor wie?" → vul het antwoord in de
   `[PROJECT: …]`-placeholder bovenaan `AGENTS.md`. Dit is de intentie waar de hele methode om draait;
   verzin het niet zelf.
2. **Vraag of dit een verse template-clone is.** Zo ja én de wiki bevat nog vibe-kit's eigen units
   (bv. `dec-naam-vibe-kit` bestaat): draai de reset naar een blanco intentie-laag —
   ```
   node scripts/init-project.mjs --yes
   ```
   Dit wist de meta-inhoud, zet blanco sjablonen terug, verwijdert het dogfood-anker en ruimt zichzelf
   op. Bevestig kort wat er gebeurt vóór je het draait.
3. **Vraag het test-/checks-commando.** "Welk commando draait je tests/acceptatiecriteria (bv.
   `node --test`, `pytest`, `go test ./...`)?" → zet `CONFIG.checksCommand` in
   `scripts/drift-check.mjs`. Weet de gebruiker het nog niet? Laat het op `null` en stel het in bij de
   eerste `run-checks`.
4. **Verifieer de schone start.** Draai `node scripts/drift-check.mjs` — hoort schoon te zijn (0 units,
   0 ankers in een vers project).

## Klaar wanneer

De `[PROJECT: …]`-placeholder is vervangen door een echte beschrijving, de reset is (zo nodig)
gedraaid, en de drift-check is schoon. Daarna kan de eerste substantiële vraag via `propose-change`.

## Niet doen

- Niet het projectdoel zelf invullen zonder het te vragen — dat is de menselijke beslissing.
- De reset niet draaien als de gebruiker al eigen werk in de wiki heeft staan.
