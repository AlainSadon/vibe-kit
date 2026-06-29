---
id: cap-drift-detectie
type: capability
status: active
links: [rule-een-bron-van-waarheid]
---

Een dependency-vrije Node-checker (`scripts/drift-check.mjs`) die de wiki-units kruist met de
`PW:`-ankers in de code en optioneel drie command-hooks draait. Hij meldt: verweesd anker (fout),
regel zonder anker (waarschuwing), regel zonder check (waarschuwing), verweesde check (fout). Hij
exit-codet non-zero bij fouten, zodat hij direct als CI-poort of in een agent-loop werkt. Dit is het
deterministische handhavingsmechanisme achter de drift-loops uit het contract.

De command-hooks (`checksCommand`, `qualityCommand`, `securityCommand`) staan **default op `null`** en
draaien het commando van het project zelf — de kit levert geen scanners en blijft zo dependency-vrij en
stack-agnostisch. Faalt een hook, dan is dat een fout. Zie [`dec-quality-security-hooks`](../decisions/quality-security-hooks.md).

Waarom drift bewaken loont (verouderde context schaadt): zie [`docs/WHY.md` §2](../../docs/WHY.md).
