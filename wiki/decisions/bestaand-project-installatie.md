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
