---
id: dec-quality-security-hooks
type: decision
status: active
links: [cap-drift-detectie, dec-onboarding-via-agent, rule-lean-contract]
---

Naast het bestaande `checksCommand` kent de drift-check twee extra **command-hooks**:
`qualityCommand` (lint/complexiteit/duplicatie) en `securityCommand` (kwetsbaarheden, secrets,
kwetsbare dependencies). Alle drie staan **default op `null`** (uit): een gebruiker die niets instelt
merkt niets en houdt exact het huidige gedrag — de last is, net als de waarde, **opt-in**.

**Waarom.** Empirisch onderzoek naar AI-gegenereerde code wijst security en sluipende
kwaliteits-/onderhoudsschuld aan als de grootste risico's (gerapporteerd: ~40–45% van AI-code bevat
kwetsbaarheden; "de codebase groeit sneller dan de testsuite"). De correctheids- en hergebruik-poorten
uit het contract waren tot nu toe puur mentaal; deze hooks maken ze afdwingbaar. Onderbouwing en
bronnen: [`docs/WHY.md` §5](../../docs/WHY.md).

**Hoe — hergebruik van het bestaande patroon.** De kit bouwt géén scanners in; elke hook draait een
commando van het project zelf. Daarmee blijft de kit dependency-vrij en stack-agnostisch
([`cap-drift-detectie`](../capabilities/drift-detectie.md)) en blijft het contract lean
([`rule-lean-contract`](../rules/lean-contract.md)). De agent **detecteert en stelt voor**, net als bij
het projectdoel en het testcommando ([`dec-onboarding-via-agent`](onboarding-via-agent.md)): één
bevestiging, geen open technische vraag (skills `start-project` en `run-checks`). Voorkeur voor tooling
die al in de toolchain zit (`npm audit`, `govulncheck`, `dotnet list package --vulnerable`) boven losse
installs — dan is de hook nul extra installatie.

**Bewust uit scope.** Een derde kandidaat — een *architectuur-/grenscontrole* — is hier **niet**
opgenomen: dat tooling-landschap is per taal te lappendeken om een kit-brede belofte te dragen. Het kan
later hooguit als losse, optionele check bij een specifiek project, niet als standaard-hook.

Security + quality zijn realiseerbaar in elke taal die de README belooft (elk via de eigen tool); de
hooks zelf zijn agent-onafhankelijk omdat het gewone shell-commando's zijn die het Node-script aanroept
(2026-06-29, met gebruiker).
