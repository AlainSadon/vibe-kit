---
name: reconcile-wiki
description: Draai de drift-loops en stem code en wiki weer op elkaar af. Gebruik dit periodiek, in CI, of na een wijziging — herstel objectieve gaten (verweesd anker, ontbrekende check) automatisch en leg subjectieve gaten (architectuur-sprawl, onheldere intentie) voor aan de mens.
---

# reconcile-wiki

Bewaakt dat de wiki (intentie) en de code (implementatie) niet uiteenlopen.

## Stappen

1. **Draai de detector:** `node scripts/drift-check.mjs` (of `--strict` / `--json` voor CI/loop).
2. **Classificeer elke bevinding:**
   - *Objectief gat* → repareer direct:
     - **Verweesd anker** (`PW:` wijst naar niet-bestaande ID) → fix het anker of maak de unit.
     - **Verweesde check** (check linkt naar onbekende ID) → corrigeer de link.
     - **Ontbrekende check** → schrijf de check (skill `run-checks`).
   - *Subjectief gat* → stel een voorstel op, laat de mens beslissen:
     - **Herimplementatie-drift** — gekopieerde logica die het origineel had moeten aanroepen.
     - **Architectuur-drift** — module verzamelt ongerelateerde verantwoordelijkheden.
     - **Onheldere/verouderde intentie** — unit dekt de werkelijkheid niet meer.
3. **Werk `wiki/index.md` bij** (status van units) en log noemenswaardige reconciliaties in
   `wiki/log.md`.
4. **Leg geleerde lessen vast** in `playbook.md` als ze herbruikbaar zijn.

## Principe

Objectief mag je repareren; subjectief leg je voor. De drift-check is een poort, geen autopilot.
