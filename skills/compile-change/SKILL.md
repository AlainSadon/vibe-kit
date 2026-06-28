---
name: compile-change
description: Compileer een goedgekeurd voorstel naar code, in vaste volgorde — bevestig de wiki-wijziging, vind het geraakte gebied, hergebruik/refactor, definieer checks, plan de edit, implementeer minimaal met PW:-ankers en draai de checks. Gebruik dit pas ná goedkeuring (zie propose-change).
---

# compile-change

Vertaalt een goedgekeurd voorstel naar code. **Beslis *wát* vóór *welke files*** — werk daarom in
deze volgorde, niet andersom.

## Stappen

1. **Bevestig de wiki-wijziging.** Maak/werk de geraakte `wiki/`-units bij (status, links). Intentie
   helder vóór file-selectie. Scaffold `wiki/` als die nog niet bestaat.
2. **Vind het geraakte gebied.** Welke capabilities/regels/codepaden raakt dit? Zoek breed voordat je
   typt.
3. **Hergebruik of refactor** (poort 1 & 2). Kan een bestaande capability dit absorberen → roep haar
   aan, kopieer niet. Stapelt een module ongerelateerde verantwoordelijkheden → pauzeer en stel
   refactor voor.
4. **Definieer checks** (poort 3). Zet elk acceptatiecriterium om in een uitvoerbare check in
   `wiki/checks/` (zie skill `run-checks`). Hergebruik de bestaande test-infrastructuur.
5. **Plan de edit.** Files, interfaces, dataflow, randgevallen — voordat je code schrijft.
6. **Implementeer minimaal + verifieer.** Schrijf de kleinste codewijziging, plaats `PW:`-ankers bij
   code die een specifieke unit realiseert, draai de checks, en stem de wiki terug af (skill
   `reconcile-wiki`).
7. **Log** de afgeronde wijziging in `wiki/log.md` (datum, geraakte ID's, één-regel samenvatting).

## PW:-anker

```js
// PW: <wiki-id>  — korte reden, zie wiki/<pad>.md
```

## Klaar wanneer

`node scripts/drift-check.mjs` is schoon én alle checks slagen.
