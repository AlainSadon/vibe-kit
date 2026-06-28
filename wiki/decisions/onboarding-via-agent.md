---
id: dec-onboarding-via-agent
type: decision
status: active
links: [rule-lean-contract, dec-github-template]
---

De onboarding van een vers project (projectdoel invullen, reset draaien, checks-commando zetten)
gebeurt via een **kort interview door de agent** (skill `start-project`), niet via CLI-flags op
`init-project.mjs` of prompts in het script. Reden: dit houdt de juiste taakverdeling — de mens
beslist de intentie, de agent doet de mechaniek — en blijft **stack-agnostisch** (geen ingebakken
`npm`/`node --test`-defaults). Het gebruikt het mechanisme dat de kit toch al heeft (de agent leest
`AGENTS.md`), dus geen extra CLI-oppervlak. De trigger is de letterlijke `[PROJECT: …]`-placeholder:
zolang die er staat, is het project nog niet ingericht. Gevolg: de placeholder **reist bewust leeg
mee** in het sjabloon (vibe-kit vult zijn eigen placeholder niet in), anders zou de trigger bij
consumenten nooit afgaan. Uitzondering: in de vibe-kit-repo zelf is de lege placeholder geen
onboarding-signaal. Overwogen en afgewezen: optionele flags (`--project`/`--checks`) — overbodig naast
het interview. `init-project.mjs` blijft de mechanische reset-motor die de skill aanroept
(2026-06-28, met gebruiker).
