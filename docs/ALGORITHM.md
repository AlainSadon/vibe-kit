# Het vibe-kit-algoritme — hoe de kit vibe-coding beter maakt

> Dit document beschrijft het **complete, precieze proces** dat vibe-kit oplegt, in begrijpelijke taal.
> Het is een *uitleg*, geen contract — het altijd-aan contract zelf staat in [`AGENTS.md`](../AGENTS.md),
> de procedures in [`skills/`](../skills/), het *waarom* in [`docs/WHY.md`](WHY.md).

---

## 0. Het probleem dat het oplost

Bij snel, AI-gestuurd bouwen ("vibe-coding") schrijf je veel code in korte tijd. Code legt vast
*hóé* iets werkt, maar niet *waaróm*. Die bedoeling — de intentie — verdampt. Gevolg: dezelfde logica
wordt opnieuw uitgevonden (duplicatie), modules verzamelen losse taken (vervagende modulariteit), en
de architectuur wordt bros.

Vibe-kit lost dit op door de intentie **expliciet en duurzaam** te maken in een natuurlijke-taallaag
(de `wiki/`), en daar **lichte poorten** omheen te zetten. Het doel is *praktisch determinisme*: niet
het AI-model deterministisch maken, maar *wat* het moet produceren zó vastpinnen dat er voor het *hoe*
weinig ruimte tot improviseren overblijft.

**De drie dragende principes:**

1. **Intentie is duurzaam; code is de afgeleide.** De `wiki/` is de bron van waarheid voor *wat* en
   *waarom*. Code implementeert die intentie.
2. **Beslis *wát* vóór *welke files*.** Eerst bepalen welke bedoeling verandert, pas daarna welke code
   je aanraakt.
3. **De mens keurt intentie goed vóór code.** Een niet-triviale wijziging wordt eerst een voorstel in
   gewone taal dat de mens goedkeurt. Geen code vóór akkoord.

---

## 1. De onderdelen (de spelers in het algoritme)

| Onderdeel | Rol in het proces |
|-----------|-------------------|
| [`AGENTS.md`](../AGENTS.md) | Het **altijd-aan contract**. Kort, bewust lean. Elke agent leest dit eerst. Bevat principes, ceremonie-tabel, de drie poorten. |
| [`CLAUDE.md`](../CLAUDE.md) | Alleen een **pointer** naar `AGENTS.md` zodat Claude Code de methode automatisch oppakt. |
| [`wiki/`](../wiki/) | De **intentielaag**: kleine, gelinkte Markdown-units. Bron van waarheid voor wat/waarom. |
| `wiki/`-**units** | `rule-` (invariant/policy), `cap-` (herbruikbare capability), `dec-` (beslissing/ADR-licht), `chk-` (uitvoerbare check). ID = type + kebab-case, stabiel en grep-baar. |
| [`wiki/index.md`](../wiki/index.md) | Catalogus van alle units met status. |
| [`wiki/log.md`](../wiki/log.md) | Audit-trail: welke wijziging raakte welke units, wanneer. |
| **`PW:`-ankers** | Grep-bare verwijzingen *in de code* naar een wiki-ID. De brug tussen intentie en implementatie; basis voor drift-detectie. |
| [`skills/`](../skills/) | Stap-voor-stap procedures die **pas laden wanneer nodig**. Houden het contract kort. |
| [`scripts/drift-check.mjs`](../scripts/drift-check.mjs) | Dependency-vrije detector die units ↔ ankers ↔ checks kruist en gaten meldt. |
| [`vibe-kit.config.mjs`](../vibe-kit.config.mjs) | Gebruikers-instellingen voor de detector (wikiDir, ignoreDirs, codeExts, anchorableTypes, de hooks). Apart van de motor, zodat een upgrade het niet overschrijft. |
| [`.github/workflows/drift.yml`](../.github/workflows/drift.yml) | Draait de drift-check in **CI** (git-niveau poort). |
| **git** | Versiebeheer: diff = de eenheid van review (`review-diff`); commit/merge = de momenten waarop de poorten sluiten. |
| [`playbook.md`](../playbook.md) | Lerend geheugen (ACE-patroon): gecureerde, herbruikbare lessen voor toekomstige sessies. |
| [`scripts/init-project.mjs`](../scripts/init-project.mjs) / [`add-to-project.mjs`](../scripts/add-to-project.mjs) | Onboarding-mechaniek: vers project resetten, resp. de kit non-destructief aan bestaande code toevoegen. |

---

## 2. Het hoofdalgoritme

### FASE A — Inrichten (eenmalig per project)

```
A1. Lees AGENTS.md.
A2. Staat bovenaan nog de letterlijke [PROJECT: …]-placeholder?
      JA  → het project is nog niet ingericht → voer skill `start-project`:
              - Ruim (zo nodig) de voorbeeld-inhoud van vibe-kit zelf op
                (node scripts/init-project.mjs --yes).
              - Vraag de ENIGE menselijke vraag: "Wat bouwen we, en voor wie?"
                → vul de placeholder in AGENTS.md.
              - Bestaat er al code? → stel skill `import-codebase` voor
                (wiki bootstrappen uit bestaande code, in batches, met review).
              - Detecteer het testcommando (npm test / pytest / go test …)
                en stel voor het als checksCommand in vibe-kit.config.mjs te zetten.
              - Verifieer: node scripts/drift-check.mjs is schoon.
      NEE → project is al ingericht → ga naar FASE B.
      (Uitzondering: werk je aan vibe-kit ZÉLF, dan is de placeholder bewust
       leeg en sla je onboarding over.)
```

### FASE B — Een wijziging maken (de kernlus, per taak)

**Stap B0 — Bepaal het ceremonie-niveau VÓÓR je begint.** Ceremonie schaalt mee; geen ceremonie om
de ceremonie:

```
classificeer de wijziging:
  TRIVIAAL  (typo, comment, rename binnen 1 file)
        → gewoon doen. Klaar. (geen wiki, geen voorstel)

  KLEIN     (bugfix, lokale tweak binnen 1 capability)
        → loop de DRIE POORTEN mentaal langs (zie §3).
        → update de geraakte wiki-unit als de intentie verschuift.
        → ga naar B-checks (verifieer) en B-log.

  SUBSTANTIEEL (nieuwe feature/regel/capability, breaking change,
                gedrag dat meerdere paden raakt)
        → volg het volledige propose → compile-pad hieronder.
```

**Stap B1 — VOORSTEL (skill `propose-change`)** — *alleen bij substantieel.* De afstemmingspoort:
de mens keurt intentie goed vóór code.

```
B1.1  Bepaal de scope: welke bedoeling verandert? Begin bij het geheel,
      versmal stapsgewijs.
B1.2  Schrijf een KORT voorstel (in intake/<naam>.md of de chat):
        - WAT verandert aan de intentie, en WAAROM.
        - Welke wiki-units worden geraakt of nieuw aangemaakt.
        - ACCEPTATIECRITERIA: meetbaar wanneer dit "af en correct" is.
          (Vaag = nog niet af.)
        - Open beslispunten (beleidskeuzes) expliciet markeren.
        - NON-GOALS: wat valt buiten scope.
B1.3  Toets het voorstel vooraf aan de drie poorten; benoem risico's.
B1.4  WACHT OP GOEDKEURING van de mens.
        - Bijgestuurd? → pas voorstel aan, vraag opnieuw.
        - GEEN code vóór akkoord.
```

**Stap B2 — COMPILEREN (skill `compile-change`)** — *pas ná goedkeuring.* Vertaal het voorstel naar
code, in **vaste volgorde** (beslis *wát* vóór *welke files*):

```
B2.1  Bevestig de wiki-wijziging: maak/werk de geraakte wiki-units bij
      (status, links). Scaffold wiki/ als die nog niet bestaat.
B2.2  Vind het geraakte gebied: welke capabilities/regels/codepaden raakt
      dit? Zoek BREED vóór je typt.
B2.3  Hergebruik of refactor (poort 1 & 2):
        - Kan een bestaande capability dit absorberen? → roep haar AAN,
          kopieer NIET.
        - Stapelt een module ongerelateerde taken? → pauzeer, stel
          refactor voor.
B2.4  Definieer checks (poort 3, skill `run-checks`):
        - Vertaal ELK acceptatiecriterium naar een uitvoerbare check.
        - Leg een chk-unit in wiki/checks/ aan die naar de geverifieerde
          unit(s) linkt.
        - Hergebruik de bestaande test-infrastructuur (geen parallel systeem).
B2.5  Plan de edit: files, interfaces, dataflow, randgevallen — vóór code.
B2.6  Implementeer MINIMAAL:
        - Schrijf de kleinste codewijziging.
        - Plaats PW:-ankers bij code die een specifieke unit realiseert:
            // PW: <wiki-id>  — korte reden, zie wiki/<pad>.md
        - Draai de checks.
        - Stem de wiki terug af (skill `reconcile-wiki`).
B2.7  Log de afgeronde wijziging in wiki/log.md
      (datum, geraakte ID's, één-regel samenvatting).
```

**Stap B3 — KLAAR-CONDITIE.** De wijziging is af wanneer:

```
  node scripts/drift-check.mjs is SCHOON   EN   alle checks SLAGEN.
```

### FASE C — Reviewen vóór commit/merge (skill `review-diff`)

Een lichte git-poort over de diff:

```
C1. git diff (of de PR) → identificeer geraakte wiki-units.
C2. Poort 1 (Reuse):       wordt logica aangeroepen of gekopieerd?
C3. Poort 2 (Architectuur): past het schoon in de structuur?
C4. Poort 3 (Correctheid):  is elk geraakt criterium door een check gedekt?
C5. PW:-ankers:            heeft nieuwe realiserende code een anker?
                            draai drift-check om verweesde ankers te vangen.
C6. Wiki-afstemming:        loopt code uit de pas met de wiki?
        → objectieve gaten mag je repareren;
        → subjectieve gaten geef je terug als voorstel.
Output: korte lijst bevindingen per poort (blokkerend / suggestie + fix).
```

### FASE D — Onderhoud & geheugen (periodiek / in CI)

Dit is de lus die op de lange termijn voorkomt dat intentie en code uiteenlopen.

```
D1. Draai de detector: node scripts/drift-check.mjs
    (--strict en --json voor CI/loops). Ook automatisch via drift.yml in CI.

D2. Classificeer ELKE bevinding (skill `reconcile-wiki`):
      OBJECTIEF gat → repareer DIRECT:
        - Verweesd anker  (PW: wijst naar niet-bestaande ID) → fix anker / maak unit.
        - Verweesde check (check linkt naar onbekende ID)     → corrigeer de link.
        - Ontbrekende check                                   → schrijf de check.
      SUBJECTIEF gat → stel een VOORSTEL op, laat de mens beslissen:
        - Herimplementatie-drift (gekopieerde i.p.v. aangeroepen logica).
        - Architectuur-drift     (module verzamelt losse taken).
        - Onheldere/verouderde intentie (unit dekt werkelijkheid niet meer).

D3. Werk wiki/index.md bij (status van units) en log reconciliaties in wiki/log.md.

D4. Herbruikbare les geleerd? → voeg één gecureerde richtlijn toe aan playbook.md.
```

> **Principe:** objectief mag je repareren; subjectief leg je voor. De drift-check is een **poort,
> geen autopilot**.

---

## 3. De drie poorten (het hart van elke wijziging)

Dit zijn **vragen, geen formulieren**. Bij elke kleine en substantiële wijziging loop je ze langs.

1. **Reuse** — Hergebruikt de oplossing bestaande capabilities, of vindt ze onnodig een nieuw pad uit?
   *Verbod op herimplementatie:* roep bestaande logica aan, kopieer haar niet.
2. **Architectuur** — Kan de huidige structuur dit schoon absorberen, of moet refactoring eraan
   voorafgaan?
3. **Correctheid** — Verifiëren de checks *álle* acceptatiecriteria? Zo niet: schrijf eerst de check.
   Let op vertrouwensgrenzen, datamigraties, backward compatibility, observability.

---

## 4. Hoe de drift-check werkt (de motor onder FASE C & D)

[`scripts/drift-check.mjs`](../scripts/drift-check.mjs) is dependency-vrij en stack-agnostisch. Het:

1. **Leest alle wiki-units** in (parseert de frontmatter: `id`, `type`, `status`, `links`).
2. **Scant de broncode** op `PW:`-ankers (regex `PW:\s*<id>`), met uitsluiting van mappen als
   `node_modules`, `dist`, `.git` en `.vibe-kit-install`.
3. **Kruist beide** en meldt:

| # | Bevinding | Ernst |
|---|-----------|-------|
| 1 | **Verweesd anker** — `PW: <id>` wijst naar niet-bestaande wiki-ID | **FOUT** (exit 1) |
| 2 | **Regel zonder anker** — actieve `rule`/`capability` nergens in code verankerd | waarschuwing |
| 3 | **Regel zonder check** — actieve `rule`/`capability` door geen check gedekt | waarschuwing |
| 4 | **Verweesde check** — check linkt naar onbekende ID | **FOUT** (exit 1) |
| 5 | **Command-hooks** — draait optioneel `checksCommand` / `qualityCommand` / `securityCommand` | FOUT bij falen |

De drie command-hooks staan **default op `null`** (uit) en draaien telkens het commando van het project
zelf; de kit levert geen scanners en blijft zo dependency-vrij en stack-agnostisch. Ze staan, net als de
overige instellingen, in `vibe-kit.config.mjs` (de project-root) en niet in het script zelf, zodat een
upgrade ze niet overschrijft. De agent detecteert ze en stelt ze ter bevestiging voor, net als het
testcommando (skills `start-project` / `run-checks`, zie [`docs/WHY.md`](WHY.md) §5). Staat `checksCommand` op `null`, dan draait alleen de structurele
controle en **herinnert** het script eraan dat er geen tests meedraaien (zodat groen niet vals groen is);
over de bewust opt-in quality/security-hooks nag het niet. `--strict` promoveert waarschuwingen tot
fouten (voor CI); `--json` geeft machine-leesbare output (voor agent-loops).

---

## 5. Waarom dit vibe-coding *verbetert* (de feedbacklus samengevat)

```
        ┌─────────────────────────────────────────────────────────┐
        │  INTENTIE (wiki/)  ── bron van waarheid: wat + waarom    │
        └───────────────┬─────────────────────────────────────────┘
                        │  propose-change  (mens keurt goed)
                        ▼
        ┌─────────────────────────────────────────────────────────┐
        │  COMPILATIE (compile-change)                            │
        │  reuse → architectuur → checks → plan → minimale code   │
        │  + PW:-ankers koppelen code aan intentie                │
        └───────────────┬─────────────────────────────────────────┘
                        │  run-checks  (criteria = uitvoerbaar)
                        ▼
        ┌─────────────────────────────────────────────────────────┐
        │  VERIFICATIE: drift-check + checks schoon               │
        │  review-diff vóór commit/merge · CI via drift.yml       │
        └───────────────┬─────────────────────────────────────────┘
                        │  reconcile-wiki  (objectief fix / subjectief voorleg)
                        ▼
        ┌─────────────────────────────────────────────────────────┐
        │  GEHEUGEN: wiki/log.md (audit) + playbook.md (lessen)   │
        └───────────────┬─────────────────────────────────────────┘
                        │  lessen + actuele intentie voeden de volgende ronde
                        └────────────────► terug naar INTENTIE
```

Elke laag pakt één faalmodus van vibe-coding aan:

- **Duplicatie** → poort 1 (reuse) + drift-detectie van herimplementatie.
- **Vervagende modulariteit** → poort 2 (architectuur) + subjectieve drift-melding.
- **Brosse correctheid** → poort 3: acceptatiecriteria worden uitvoerbare checks.
- **Verdampende bedoeling** → de wiki + `PW:`-ankers maken intentie duurzaam en grep-baar.
- **Verouderende context** → de drift-check bewaakt actief dat wiki en code niet uiteenlopen
  (te lange/verouderde context schaadt aantoonbaar — zie [`docs/WHY.md`](WHY.md) §2).
- **Verloren lessen** → het playbook cureert wat generaliseert voor volgende sessies (ACE-patroon).

De onderbouwing van deze keuzes (lean contract, executable spec, ceremonie-die-meeschaalt, ACE) staat
met bron en verificatiestatus in [`docs/WHY.md`](WHY.md).

---

## 6. Beslisboom in één oogopslag

```
Nieuwe taak
   │
   ├─ Project nog niet ingericht? ───────► skill start-project (FASE A)
   │
   ├─ Triviaal? ─────────────────────────► gewoon doen
   │
   ├─ Klein? ────────────────────────────► 3 poorten mentaal → wiki bijwerken
   │                                         → checks → log
   │
   └─ Substantieel? ─────────────────────► propose-change  (voorstel + akkoord)
                                              → compile-change (vaste volgorde)
                                              → run-checks
                                              → review-diff (vóór commit)
                                              → drift-check schoon? → commit/merge
                                              → reconcile-wiki + log + playbook
```
