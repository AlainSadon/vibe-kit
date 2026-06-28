---
name: import-codebase
description: Reverse-importeer een bestaande codebase naar de wiki — leid capabilities/regels/beslissingen af uit de code en stel een wiki-voorstel op. Gebruik dit wanneer je de methode toepast op een project dat al code heeft.
---

# import-codebase

Draait de compiler omgekeerd: van bestaande code naar expliciete intentie.

## Stappen

1. **Lees de code in batches.** Importeer grote repos per **capability-batch** zodat voorstellen
   reviewbaar blijven — niet alles in één keer.
2. **Leid intentie af** per batch:
   - **Capabilities** — herbruikbare bouwstenen/features die de code biedt.
   - **Rules** — invarianten/policies die de code afdwingt.
   - **Decisions** — keuzes die zichtbaar zijn in de structuur (ADR-licht, met reden voor zover
     afleidbaar).
3. **Stel een wiki-voorstel op** (skill `propose-change`). Markeer expliciet wat je *niet* met
   zekerheid uit code kon afleiden — code kan reden en intentie niet volledig terugverwijzen, dus
   deze import is **bewust onvolledig**.
4. **Laat de mens reviewen.** Pas na akkoord: schrijf de units weg in `wiki/` en plaats `PW:`-ankers
   bij de bijbehorende code.
5. **Dek af met checks** waar mogelijk (skill `run-checks`), te beginnen bij de kritische regels.

## Principe

Reverse-import is een hulpmiddel om intentie te *reconstrueren*, geen volledige waarheid. Menselijke
review is verplicht.
