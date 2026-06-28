---
name: review-diff
description: Toets een diff (van jezelf of een PR) aan de drie poorten reuse/architectuur/correctheid en aan de wiki-intentie. Gebruik dit vóór commit/merge om drift, duplicatie en niet-gedekte criteria te vangen.
---

# review-diff

Een lichte review-poort: dekt de diff de intentie, en respecteert hij de drie poorten?

## Stappen

1. **Bekijk de diff** (`git diff` of de PR). Identificeer welke `wiki/`-units geraakt worden.
2. **Poort 1 — Reuse.** Wordt bestaande logica aangeroepen of gekopieerd? Markeer herimplementatie.
3. **Poort 2 — Architectuur.** Past de wijziging schoon in de structuur, of stapelt een module
   ongerelateerde verantwoordelijkheden op? Stel zo nodig refactor voor.
4. **Poort 3 — Correctheid.** Is elk geraakt acceptatiecriterium door een check gedekt? Let op
   vertrouwensgrenzen, datamigraties, backward compatibility, observability.
5. **PW:-ankers.** Heeft nieuwe code die een unit realiseert een `PW:`-anker? Draai
   `node scripts/drift-check.mjs` om verweesde ankers/checks te vangen.
6. **Wiki-afstemming.** Loopt de code uit de pas met de wiki? Geef bevindingen als voorstellen terug;
   objectieve gaten mag je repareren.

## Output

Een korte lijst bevindingen per poort, met per item: blokkerend / suggestie, en de voorgestelde fix.
