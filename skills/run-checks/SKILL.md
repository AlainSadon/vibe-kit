---
name: run-checks
description: Zet acceptatiecriteria om in uitvoerbare checks en draai ze. Gebruik dit bij het definiëren van correctheid voor een wijziging (poort 3) en om te verifiëren dat álle criteria gedekt zijn vóór je een wijziging als af beschouwt.
---

# run-checks

Acceptatiecriteria zijn pas echt afdwingbaar als ze uitvoerbaar zijn.

## Stappen

1. **Vertaal elk acceptatiecriterium** uit het voorstel naar een uitvoerbare assertion/test. Een
   criterium dat je niet kunt checken, is te vaag — scherp het aan tot het meetbaar is.
2. **Maak een check-unit** in `wiki/checks/` die naar de geverifieerde unit(s) linkt:
   ```markdown
   ---
   id: chk-<kebab-case>
   type: check
   status: active
   links: [rule-…, cap-…]
   ---
   <Wat deze check verifieert, en welke testcommando('s) dat doen.>
   ```
3. **Hergebruik de bestaande test-/eval-infrastructuur** van het project. Introduceer geen parallel
   scoringssysteem.
4. **Koppel het testcommando** zo nodig aan de drift-check: zet `CONFIG.checksCommand` in
   `scripts/drift-check.mjs` (bv. `"npm test --silent"`), zodat `node scripts/drift-check.mjs` de
   checks meedraait.
5. **Draai en bevestig** dat álle criteria slagen.

## Principe

Elke actieve rule/capability hoort door minstens één check gedekt te zijn — dat is precies wat de
drift-check als waarschuwing meldt.
