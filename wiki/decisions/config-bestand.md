---
id: dec-config-bestand
type: decision
status: active
links: [cap-drift-detectie, rule-lean-contract, dec-quality-security-hooks, dec-bestaand-project-installatie]
---

De instelbare waarden van de drift-check staan in een apart bestand `vibe-kit.config.mjs` in de
project-root, niet langer als `CONFIG`-blok in `scripts/drift-check.mjs` zelf. Alle waarden zijn
verhuisd: `wikiDir`, `ignoreDirs`, `codeExts`, `anchorableTypes` en de drie hooks (`checksCommand`,
`qualityCommand`, `securityCommand`).

**Waarom: upgradeerbaarheid.** De kit wordt verspreid als template/`degit`-kopie, dus een momentopname
zonder koppeling terug naar de bron. Updates komen alleen bij gebruikers als ze de motor-bestanden
verversen. Zolang motor (logica) en gebruikersinstellingen in één bestand zaten, zou een upgrade van
`drift-check.mjs` de ingestelde hooks en `ignoreDirs` van de gebruiker wissen. Door de instellingen
eruit te lichten wordt `drift-check.mjs` 100% motor (vrij te overschrijven bij een upgrade) en blijft
`vibe-kit.config.mjs` van de gebruiker (nooit overschreven). Dit is de motor/inhoud-scheiding die een
latere upgrade-route haalbaar maakt; vgl. [`dec-bestaand-project-installatie`](bestaand-project-installatie.md).

**Hoe.** Het script houdt interne `DEFAULTS` en doet `CONFIG = { ...DEFAULTS, ...userConfig }`. Gevolg:
ontbreekt het config-bestand of een sleutel (bv. een sleutel die een latere kit-versie toevoegt), dan
geldt de default en blijft de drift-check werken — backward-compatibel. Waarden uit de config vervangen
de default (arrays worden niet samengevoegd). Het bestand is een `.mjs` dat een object exporteert, zodat
de toelichtende commentaren en voorbeelden behouden blijven (een `.json` zou die verliezen) en de kit
dependency-vrij blijft. `add-to-project.mjs` kopieert het mee (non-destructief), `init-project.mjs` laat
het met rust (de defaults zijn projectneutraal).

Overwogen: alles puur in het config-bestand zonder defaults in de motor (afgewezen: dan breekt een
ontbrekend/oud config-bestand de check en kunnen verbeterde defaults gebruikers nooit meer bereiken).
(2026-06-29, met gebruiker.)
