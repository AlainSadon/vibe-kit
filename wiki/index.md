# Wiki — index

Catalogus van de intentie-units van **vibe-kit zelf** (dogfooding). Elke unit is een klein,
gelinkt Markdown-bestand. ID's zijn stabiel en grep-baar.

## Rules
| ID | Eén-regel | Status |
|----|-----------|--------|
| `rule-een-bron-van-waarheid` | Wiki is intentie, code is implementatie — niet dupliceren | active |
| `rule-lean-contract` | Het altijd-aan contract blijft kort; details in skills | active |
| `rule-secret-vrij` | De publieke kit bevat geen secrets of persoonlijke config | active |

## Capabilities
| ID | Eén-regel | Status |
|----|-----------|--------|
| `cap-drift-detectie` | Dependency-vrije detector kruist units met `PW:`-ankers | active |

## Decisions
| ID | Eén-regel | Status |
|----|-----------|--------|
| `dec-naam-vibe-kit` | Naam van de kit is "vibe-kit" | active |
| `dec-taal-nederlands` | Kit-inhoud in het Nederlands | active |
| `dec-agents-md-canoniek` | `AGENTS.md` canoniek; `CLAUDE.md` is pointer | active |
| `dec-github-template` | Distributie via GitHub template repository | active |
| `dec-projecten-private` | Projecten gemaakt mét de kit zijn standaard private | active |
| `dec-onboarding-via-agent` | Onboarding via agent-interview (skill), niet via flags | active |
| `dec-bestaand-project-installatie` | Bestaand project: non-destructieve installer `add-to-project.mjs` | active |
| `dec-quality-security-hooks` | Quality- en security-hooks: opt-in command-hooks, default `null`, agent stelt voor | active |
| `dec-positionering` | Niche: drift-handhaving + minimale overhead, tussen zware SDD-frameworks en passief geheugen | active |
| `dec-config-bestand` | Instellingen apart in `vibe-kit.config.mjs` (motor/inhoud-scheiding) voor upgradeerbaarheid | active |

## Checks
| ID | Verifieert | Status |
|----|-----------|--------|
| `chk-drift-check-schoon` | `cap-drift-detectie` draait schoon op deze repo | active |

> Zie [`log.md`](log.md) voor de audit-trail, [`non-goals.md`](non-goals.md) voor wat buiten scope
> valt, en [`glossary.md`](glossary.md) voor gedeelde termen.
