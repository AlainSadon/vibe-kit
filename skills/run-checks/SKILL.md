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
4. **Koppel de command-hooks aan de drift-check** (als dat nog niet is gebeurd bij de onboarding).
   De drift-check kent drie optionele hooks in `scripts/drift-check.mjs`, alle **default `null`**:
   - `checksCommand` — je tests. Detecteer uit de stack — `package.json` → `npm test`,
     `pyproject`/`pytest` → `pytest`, `go.mod` → `go test ./...`. Zolang dit op `null` staat draait de
     drift-check je tests niet en herinnert hij daaraan.
   - `qualityCommand` — lint/complexiteit. Bijv. `npm run lint`, `ruff check .`, `golangci-lint run`.
   - `securityCommand` — kwetsbaarheden/secrets. Geef voorkeur aan toolchain-eigen tools (geen extra
     install): `npm audit --audit-level=high`, `pip-audit`, `govulncheck ./...`,
     `dotnet list package --vulnerable`.

   **Stel elke detecteerbare hook ter bevestiging voor** (een bevestiging, geen open technische vraag),
   en zet 'm bij akkoord in de bijbehorende `CONFIG.*`. Vind je geen passende tool, laat de hook dan op
   `null` — de hooks zijn bewust opt-in. Zie [`dec-quality-security-hooks`](../../wiki/decisions/quality-security-hooks.md).
5. **Draai en bevestig** dat álle criteria slagen.

## Principe

Elke actieve rule/capability hoort door minstens één check gedekt te zijn — dat is precies wat de
drift-check als waarschuwing meldt.
