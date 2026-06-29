---
id: dec-bestaand-project-installatie
type: decision
status: active
links: [dec-github-template, dec-onboarding-via-agent]
---

Adoptie in een **bestaand** project loopt via een aparte, **non-destructieve** installer
`scripts/add-to-project.mjs`, niet via de template-route (die maakt een nieuw repo) en niet via
`init-project.mjs` (die overschrijft bestanden en is alleen voor verse template-clones). De installer
kopieert alleen wat ontbreekt (contract, skills, drift-check, CI, lege wiki) en raakt bestaande
bestanden — README, CHANGELOG, code, eigen `.gitignore`/`AGENTS.md` — nooit aan. Werkwijze: gebruiker
draait `npx degit AlainSadon/vibe-kit .vibe-kit-install` en daarna de installer vanuit de project-root
(dry-run by default, `--yes` om uit te voeren); het dogfood-anker wordt uit de gekopieerde drift-check
gestript zodat die direct schoon is. De *intentie* van bestaande code wordt daarna gereconstrueerd met
de skill `import-codebase`.

Reden voor een tweede installer: dit dicht het hiaat dat onze distributie new-project-first is. Een
vergelijking met Product Wiki (waarvan `npx … init` juist ontworpen is om non-destructief in een
bestaand repo te draaien) bevestigde dat een veilige "toevoegen aan bestaand project"-route ontbrak
(2026-06-28, met gebruiker).

Dezelfde installer kent een **`--upgrade`-modus** die de kit van een bestaand project bijwerkt naar een
nieuwere versie. Dit leunt op de motor/inhoud-scheiding ([`dec-config-bestand`](config-bestand.md)):
upgrade **ververst alleen de motor** (`scripts/drift-check.mjs`, met opnieuw gestript dogfood-anker, en
`skills/`) en **laat inhoud + instellingen met rust** (`vibe-kit.config.mjs`, `wiki/`, `playbook.md`,
`CLAUDE.md`, `README`, `CHANGELOG`). `AGENTS.md` en de CI-workflow worden alleen *gemeld* als ze
afwijken, niet overschreven, omdat de gebruiker die doorgaans zelf aanpast (handmatig samenvoegen).
Zonder die scheiding zou een upgrade de hooks en eigen instellingen wissen. Dry-run by default,
`--upgrade --yes` om uit te voeren (2026-06-29, met gebruiker).
