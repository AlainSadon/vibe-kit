---
id: dec-positionering
type: decision
status: active
links: [rule-lean-contract, cap-drift-detectie, dec-naam-vibe-kit]
---

vibe-kit positioneert zich bewust in een **druk en snelbewegend veld** van intentie-/spec-lagen boven
AI-coding. De populaire spelers vallen grofweg in twee groepen: **spec-driven development (SDD)** —
GitHub Spec Kit (officieel, Spec → Plan → Tasks → Implement), BMAD-METHOD (40k+ sterren, rolgebaseerde
agents en tientallen workflows), Amazon Kiro (een hele AI-IDE) — en **persistent-geheugen frameworks**
zoals Cline Memory Bank (vaste Markdown-bestanden die het project "onthouden"). Product Wiki en vibe-kit
delen de SDD-geest, maar leaner.

**De gekozen niche: drift-handhaving + minimale overhead.** Twee dingen samen onderscheiden vibe-kit van
het meeste alternatief. (1) Het grep-bare `PW:`-anker dat een coderegel terugkoppelt aan een
intentie-ID, plus de dependency-vrije [`cap-drift-detectie`](../capabilities/drift-detectie.md) die
afdwingt dat ze gekoppeld blijven — SDD-tools genereren code úít een spec maar handhaven die koppeling
zelden lichtgewicht; memory banks bewáren context maar bewaken geen alignment. (2) Bewuste leanheid
([`rule-lean-contract`](../rules/lean-contract.md)): in minuten te begrijpen, elke taal/agent, tegenover
zware frameworks (BMAD, Kiro).

Gevolg voor het ontwerp: niet concurreren op ceremonie of breedte, maar op de **combinatie van expliciete
drift-handhaving en lage overhead** — het gat tussen zware SDD-frameworks en passief Markdown-geheugen.
Dat het concept "intentielaag boven code" níét uniek is, is geen reden tot zorg maar een reden om die
niche scherp te houden. (Landschap-snapshot 2026-06-29 op basis van secundaire bronnen/zoek-snippets; het
veld beweegt snel, dus dit is een momentopname. Met gebruiker.)
