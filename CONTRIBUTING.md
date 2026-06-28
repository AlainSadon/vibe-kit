# Bijdragen aan vibe-kit

Dank voor je interesse! vibe-kit is een **kit (sjabloon)**, geen applicatie. Houd dat onderscheid
scherp bij het bijdragen.

## Twee artefacten, strikt gescheiden

- **De kit zelf** (deze repo) = publiek, generiek, **secret-vrij**. Bevat distributie-boilerplate
  (`README`, `LICENSE`, `CONTRIBUTING`, `CHANGELOG`).
- **Projecten gemaakt mét de kit** = los, meestal privé, bevatten géén boilerplate.

Voeg nooit projectspecifieke of persoonlijke configuratie (usernames, paden, secrets) toe aan de
publieke kit.

## De kit gebruikt zijn eigen methode

vibe-kit dogfoodt: wijzigingen aan de kit volgen het contract in [`AGENTS.md`](AGENTS.md).

- **Triviaal** (typo, comment): gewoon een PR.
- **Substantieel** (nieuwe skill, gewijzigde werkwijze, nieuwe regel): begin met een **voorstel** in
  gewone taal (issue of PR-beschrijving) — *wat* verandert er aan de intentie en *waarom* — en werk
  de bijbehorende [`wiki/`](wiki/)-unit bij.

## Vóór je een PR opent

1. Draai de drift-check: `node scripts/drift-check.mjs --strict`. Hij moet schoon zijn.
2. Houd het altijd-aan contract (`AGENTS.md`) **kort**. Procedurele details horen in een skill.
3. Eén bron van waarheid: laat `wiki/` en code niet uiteenlopen.

## Stijl

- Nederlands voor de kit-inhoud (contract, skills, wiki).
- Markdown; korte units; stabiele, grep-bare ID's (`rule-`, `cap-`, `dec-`, `chk-`).
