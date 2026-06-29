---
name: start-project
description: Richt een vers project in dat met de vibe-kit template is gemaakt. Gebruik dit eenmalig bij de eerste run, herkenbaar doordat de [PROJECT: …]-placeholder bovenaan AGENTS.md nog letterlijk aanwezig is. Voer een kort, menselijk gesprekje en doe daarna de mechaniek.
---

# start-project

Eenmalige onboarding voor een vers-uit-de-template project. De **mens beslist** (wat bouwen we), de
**agent doet de mechaniek** (opruimen, bestanden invullen). Geen ingebakken stack-aannames.

## Wanneer

Bij de eerste run, te herkennen aan de letterlijke `[PROJECT: …]`-placeholder bovenaan `AGENTS.md`.
Is die al ingevuld, dan is het project al ingericht — sla deze skill over. Werk je aan **vibe-kit
zélf** (de kit-repo)? Dan is de placeholder bewust leeg en is onboarding niet van toepassing.

## Hoe je dit voert

Houd het **een gesprek, geen formulier.** Stel niet meerdere vragen tegelijk in een keuzemenu; vraag
één ding per keer, in gewone taal, en leg kort uit wat er gebeurt. Mik op **één betekenisvolle vraag
plus één simpele bevestiging** — niet meer.

## Stappen

1. **Zet de verwachting (één zin).** Bijvoorbeeld: *"Ik richt je project even in — dat is zo gebeurd."*

2. **Ruim de voorbeeld-inhoud op (als dat nodig is).** Detecteer zelf of dit een verse template-clone
   is: bestaat de wiki nog uit vibe-kit's eigen units (bv. `wiki/decisions/naam-vibe-kit.md`)? Zo ja,
   vraag in **mensentaal** om bevestiging — zonder unit-id's of kit-jargon:
   > "Deze map bevat nog de voorbeeld-inhoud van vibe-kit zelf. Zal ik die opruimen zodat je met een
   > schone lei aan je eigen project begint?"

   Niet: *"De wiki bevat nog vibe-kit's eigen decisions zoals naam-vibe-kit — reset draaien?"*

   Bij akkoord, draai:
   ```
   node scripts/init-project.mjs --yes
   ```
   Dit wist de meta-inhoud, zet blanco sjablonen terug, verwijdert het dogfood-anker en ruimt zichzelf
   op.

3. **Vraag de enige echt menselijke vraag:** *"Wat gaan we bouwen, en voor wie?"* → vul het antwoord in
   de `[PROJECT: …]`-placeholder bovenaan `AGENTS.md`. Dit is de intentie waar de hele methode om
   draait; verzin het niet zelf.

   *Bestaat er al code* (de kit is via `add-to-project.mjs` aan een bestaand project toegevoegd, dus de
   wiki is leeg maar er staat al broncode)? Stel dan voor om met de skill
   [`import-codebase`](../import-codebase/SKILL.md) de wiki te bootstrappen uit die bestaande code, in
   behapbare batches en met menselijke review.

4. **Stel het testcommando voor — als het detecteerbaar is.** Net als het projectdoel is dit een
   eenmalige projectwaarde: laat de agent het werk doen, de mens bevestigt. Kijk of de stack een
   testcommando verraadt:
   - `package.json` met een `"test"`-script → `npm test`
   - `pyproject.toml` / `pytest.ini` → `pytest`
   - `go.mod` → `go test ./...`
   - enz.

   Vind je er een, **stel het ter bevestiging voor** — geen open technische vraag:
   > "Ik zie dat je `npm test` gebruikt — zal ik dat als checks-commando instellen, zodat de
   > drift-check je tests meedraait?"

   Zet bij akkoord `checksCommand` in `vibe-kit.config.mjs` (de project-root). Vind je niets (kaal nieuw
   project zonder tests), **sla het over**; het wordt later gezet bij de eerste
   [`run-checks`](../run-checks/SKILL.md), en de drift-check herinnert eraan zolang het op `null` staat.

   De drift-check kent op dezelfde manier twee optionele hooks die je hier mág voorstellen, maar **maak
   er geen formulier van**: een `qualityCommand` (lint, bv. `ruff check .`) en een `securityCommand`
   (kwetsbaarheden, geef voorkeur aan toolchain-eigen tools als `npm audit` of `pip-audit`). Beide staan
   default `null` en zijn bewust opt-in. Houd onboarding licht: stel hooguit één hook extra voor als de
   tool duidelijk al aanwezig is, en laat de rest over aan [`run-checks`](../run-checks/SKILL.md). Zie
   [`dec-quality-security-hooks`](../../wiki/decisions/quality-security-hooks.md).

5. **Verifieer de schone start.** Draai `node scripts/drift-check.mjs` — hoort schoon te zijn (0 units,
   0 ankers in een vers project).

## Klaar wanneer

De `[PROJECT: …]`-placeholder is vervangen door een echte beschrijving, de voorbeeld-inhoud is (zo
nodig) opgeruimd, en de drift-check is schoon. Daarna kan de eerste substantiële vraag via
`propose-change`.

## Niet doen

- Geen keuzemenu met meerdere vragen tegelijk — voer een gesprek, één ding per keer.
- Het projectdoel niet zelf invullen zonder het te vragen — dat is de menselijke beslissing.
- De reset niet draaien als de gebruiker al eigen werk in de wiki heeft staan.
