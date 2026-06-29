# Changelog

Alle noemenswaardige wijzigingen aan vibe-kit. Formaat losjes gebaseerd op
[Keep a Changelog](https://keepachangelog.com/); versies volgen [SemVer](https://semver.org/).

## [Unreleased]

### Added
- Opt-in **quality- en security-hooks** in de drift-check (`qualityCommand`, `securityCommand`), naast
  het bestaande `checksCommand`. Default `null`; de agent detecteert en stelt ze voor zoals het
  testcommando. De kit levert geen scanners zelf, het roept de tools van je project aan.
  `dec-quality-security-hooks`; onderbouwing in `docs/WHY.md` §5.
- `vibe-kit.config.mjs`: de instellingen van de drift-check (`wikiDir`, `ignoreDirs`, `codeExts`,
  `anchorableTypes` en de hooks) staan nu in een apart config-bestand i.p.v. in `scripts/drift-check.mjs`.
  Zo overschrijft een upgrade van het script je instellingen niet. Het script houdt interne defaults en
  merget de config eroverheen (ontbrekend bestand/sleutel valt terug op de default). `dec-config-bestand`.
- `add-to-project.mjs --upgrade`: werkt de kit van een bestaand project bij. Ververst alleen de motor
  (`scripts/drift-check.mjs` + `skills/`) en laat inhoud + instellingen met rust (`vibe-kit.config.mjs`,
  `wiki/`, `playbook.md`, `CLAUDE.md`, README, CHANGELOG). `AGENTS.md` en de CI-workflow worden alleen
  gemeld als ze afwijken (handmatig samenvoegen). Dry-run by default; `--upgrade --yes` om uit te voeren.
- Skill `upgrade-kit` + regel in de skills-tabel van `AGENTS.md`: maakt de upgrade-route
  agent-aanroepbaar, zodat je de assistent simpelweg kunt vragen de kit te upgraden.

### Changed
- `start-project` stelt de reset-vraag nu in mensentaal (geen interne unit-id's) — gevonden tijdens
  een dogfood-test. Eerste les vastgelegd in `playbook.md`.
- `drift-check` negeert nu `.vibe-kit-install` (de tijdelijke installatiemap), zodat de meegekopieerde
  kit-scripts geen vals "verweesd anker" geven; `add-to-project` zet de opruim-stap vóór de drift-check.
  Gevonden bij een dogfood-test op een bestaand project.
- `add-to-project` + README: next-steps verwoorden nu dat de agent de `[PROJECT: …]`-regel zelf invult
  via `start-project` (agent vraagt), i.p.v. de gebruiker handmatig laten editen.
- `checksCommand` wordt nu net als het projectdoel behandeld: `start-project` (en als fallback
  `run-checks`) **detecteert het testcommando uit de stack en stelt het ter bevestiging voor**. De
  drift-check meldt voortaan wanneer `checksCommand` op `null` staat (een waarschuwing zodra er al
  check-units zijn), zodat tests niet stilletjes ongedraaid blijven. `CONFIG`-comment uitgebreid met
  stack-voorbeelden.
- README herschreven voor een breder publiek: toegankelijke uitleg van probleem en aanpak, een
  "onder de motorkap"-sectie (notities, `PW:`-ankers, de bewaker) en een "vibe-kit of Product Wiki?"
  positioneringsblok. Technische installatie apart gezet.
- README: blok "Wat de assistent bij elke wijziging nagaat" toegevoegd — de drie poorten
  (hergebruik/structuur/bewijs) in gewone taal, met verwijzing naar `AGENTS.md`.
- README + `dec-taal-nederlands`: Nederlandstaligheid als geverifieerd onderscheid t.o.v. de
  Engels-only bronmethode (Product Wiki) vastgelegd.
- README: sectie "Vereisten & compatibiliteit" toegevoegd (essentieel/optioneel + welke agents).
  Geverifieerd dat OpenAI Codex `AGENTS.md` leest; vastgelegd in `dec-agents-md-canoniek`. Toelichting
  dat Node.js alleen voor de kit-tools is, niet voor je applicatie.
- `start-project` onboarding vereenvoudigd: een gesprek i.p.v. een multi-vraag-formulier, één
  hoofdvraag ("wat bouwen we?") plus één bevestiging (voorbeeld-inhoud opruimen); het test-commando
  wordt uitgesteld tot de eerste `run-checks`. Naar aanleiding van een vergelijking met Product Wiki.
- `scripts/add-to-project.mjs`: non-destructieve installer om de methode aan een **bestaand** project
  toe te voegen (kopieert alleen ontbrekende machinerie, raakt eigen bestanden niet aan). README-sectie
  "Toevoegen aan een bestaand project" + `dec-bestaand-project-installatie`; `start-project` wijst bij
  bestaande code naar `import-codebase`.

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
- `docs/WHY.md`: wetenschappelijke onderbouwing van de ontwerpkeuzes (met verificatiestatus);
  wiki-units en `playbook.md` verwijzen ernaar in plaats van de argumentatie te dupliceren.
- `scripts/init-project.mjs`: eenmalige reset voor een vers-uit-de-template project — wist vibe-kit's
  eigen wiki/docs, zet blanco sjablonen terug, verwijdert het dogfood-anker en ruimt zichzelf op.
- Skill `start-project` + eerste-run-trigger in `AGENTS.md`: de agent richt een vers project in via een
  kort onboarding-gesprek (projectdoel, reset, checks-commando) — geen handmatige edits meer nodig.
  Beslissing vastgelegd in `dec-onboarding-via-agent`.
