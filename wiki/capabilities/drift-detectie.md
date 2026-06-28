---
id: cap-drift-detectie
type: capability
status: active
links: [rule-een-bron-van-waarheid]
---

Een dependency-vrije Node-checker (`scripts/drift-check.mjs`) die de wiki-units kruist met de
`PW:`-ankers in de code en optioneel een checks-commando draait. Hij meldt: verweesd anker (fout),
regel zonder anker (waarschuwing), regel zonder check (waarschuwing), verweesde check (fout). Hij
exit-codet non-zero bij fouten, zodat hij direct als CI-poort of in een agent-loop werkt. Dit is het
deterministische handhavingsmechanisme achter de drift-loops uit het contract.
