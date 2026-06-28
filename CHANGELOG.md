# Changelog

Alle noemenswaardige wijzigingen aan vibe-kit. Formaat losjes gebaseerd op
[Keep a Changelog](https://keepachangelog.com/); versies volgen [SemVer](https://semver.org/).

## [Unreleased]

### Changed
- `start-project` stelt de reset-vraag nu in mensentaal (geen interne unit-id's) — gevonden tijdens
  een dogfood-test. Eerste les vastgelegd in `playbook.md`.
- README herschreven voor een breder publiek: toegankelijke uitleg van probleem en aanpak, een
  "onder de motorkap"-sectie (notities, `PW:`-ankers, de bewaker) en een "vibe-kit of Product Wiki?"
  positioneringsblok. Technische installatie apart gezet.

### Added
- Eerste opzet van de kit.
- Altijd-aan contract `AGENTS.md` (intentie-gedreven werkwijze, ceremonie die meeschaalt, drie
  poorten, `PW:`-ankers) + `CLAUDE.md`-pointer.
- Workflow-skills: `propose-change`, `compile-change`, `reconcile-wiki`, `run-checks`,
  `review-diff`, `import-codebase`.
- `wiki/`-structuur met de intentie-units van de kit zelf (dogfooding).
- `playbook.md` (gecureerd lerend geheugen, ACE-patroon).
- `scripts/drift-check.mjs` (dependency-vrije drift-detectie) + CI-stub
  `.github/workflows/drift.yml`.
- Distributie-boilerplate: `README`, `LICENSE` (MIT + credit Omar Ismail), `CONTRIBUTING`.
- `docs/WAAROM.md`: wetenschappelijke onderbouwing van de ontwerpkeuzes (met verificatiestatus);
  wiki-units en `playbook.md` verwijzen ernaar in plaats van de argumentatie te dupliceren.
- `scripts/init-project.mjs`: eenmalige reset voor een vers-uit-de-template project — wist vibe-kit's
  eigen wiki/docs, zet blanco sjablonen terug, verwijdert het dogfood-anker en ruimt zichzelf op.
- Skill `start-project` + eerste-run-trigger in `AGENTS.md`: de agent richt een vers project in via een
  kort onboarding-gesprek (projectdoel, reset, checks-commando) — geen handmatige edits meer nodig.
  Beslissing vastgelegd in `dec-onboarding-via-agent`.
