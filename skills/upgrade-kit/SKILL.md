---
name: upgrade-kit
description: Werk de vibe-kit-machinerie van dit project bij naar een nieuwere versie. Gebruik dit wanneer de gebruiker vraagt de kit te updaten of te upgraden. Ververst alleen de motor (drift-check + skills) en laat inhoud en instellingen (vibe-kit.config.mjs, wiki, playbook, CLAUDE.md) met rust.
---

# upgrade-kit

Werkt de "motor" van vibe-kit bij zonder je intentie of instellingen te raken. Dit kan veilig dankzij
de motor/inhoud-scheiding (zie [`dec-config-bestand`](../../wiki/decisions/config-bestand.md)).

## Stappen

1. **Haal de nieuwste kit op** in een tijdelijke map:
   ```
   npx degit AlainSadon/vibe-kit .vibe-kit-install
   ```
2. **Draai eerst een dry-run** en laat de gebruiker zien wat er verandert:
   ```
   node .vibe-kit-install/scripts/add-to-project.mjs --upgrade
   ```
3. **Voer de upgrade uit** na akkoord:
   ```
   node .vibe-kit-install/scripts/add-to-project.mjs --upgrade --yes
   ```
   Dit ververst `scripts/drift-check.mjs` en `skills/`. Het laat `vibe-kit.config.mjs`, `wiki/`,
   `playbook.md`, `CLAUDE.md`, `README` en `CHANGELOG` met rust. `AGENTS.md` en de CI-workflow worden
   alleen *gemeld* als ze afwijken; voeg veranderingen daar zelf samen.
4. **Ruim de tijdelijke map op:** verwijder `.vibe-kit-install`.
5. **Verifieer:** bekijk de wijzigingen met `git diff` en draai `node scripts/drift-check.mjs` (hoort
   schoon te zijn). Lees de `CHANGELOG` van de kit voor wat je mogelijk handmatig in `AGENTS.md` of de
   CI-workflow moet overnemen.

## Niet doen

- Gebruik **geen** `init-project.mjs` (dat is voor verse template-clones en overschrijft inhoud).
- Zet `vibe-kit.config.mjs` en de `wiki/` niet "terug" naar de kit-versie; die zijn van jou.
