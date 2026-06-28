# vibe-kit

> **Een starter-kit voor intentie-gedreven bouwen.** Drop hem in een nieuw project en elke
> coding-agent werkt automatisch volgens een gestructureerde werkwijze — zodat snel AI-gestuurd
> bouwen ("vibe coding") niet ontaardt in drift, duplicatie en brosse architectuur.

vibe-kit maakt **productintentie** een duurzaam, gedeeld artefact en zet er een paar lichte poorten
omheen: de mens keurt de bedoeling goed **vóór** de agent code schrijft. Het is een *contract +
poorten*, geen belofte dat Engels magisch naar code compileert.

De methode is afgeleid van Omar Ismail's [*Making English a Programming
Language*](https://github.com/omarismailb/product-wiki) (MIT) — afgeslankt voor technische bouwers
met een capabele agent.

---

## Wat zit erin

| Laag | Artefact | Rol |
|---|---|---|
| Altijd-aan contract | [`AGENTS.md`](AGENTS.md) | korte, leesbare werkwijze die elke agent automatisch leest |
| Tool-pointer | [`CLAUDE.md`](CLAUDE.md) | verwijst Claude Code naar `AGENTS.md` |
| Bron van waarheid | [`wiki/`](wiki/) | intentie-units (rules, capabilities, decisions, checks) |
| Workflows | [`skills/`](skills/) | stap-voor-stap procedures die on-demand laden |
| Lerend geheugen | [`playbook.md`](playbook.md) | gecureerde lessen (ACE-patroon) |
| Handhaving | [`scripts/drift-check.mjs`](scripts/drift-check.mjs) + [CI](.github/workflows/drift.yml) | poorten deterministisch afdwingen |
| Onderbouwing | [`docs/WAAROM.md`](docs/WAAROM.md) | wetenschappelijke basis achter de ontwerpkeuzes (met verificatiestatus) |

Het altijd-aan contract is **bewust kort** — onderzoek wijst uit dat context-bestanden alleen helpen
als ze mager, vers en specifiek zijn. De procedurele details staan in de skills en laden pas wanneer
ze nodig zijn.

---

## Snelstart (nieuw project mét de kit)

Eenmalig: [`gh` CLI](https://cli.github.com/) geïnstalleerd + `gh auth login`. Markeer deze repo op
GitHub als **template repository** (Settings → Template repository).

```sh
gh repo create <project> --template <jouw-username>/vibe-kit --private --clone
cd <project>
```

Daarna:
1. **Reset naar een blanco intentie-laag** (eenmalig). Het sjabloon erft de wiki/docs van vibe-kit
   zélf; dit script wist die meta-inhoud, zet blanco sjablonen terug, ruimt het dogfood-anker op en
   verwijdert zichzelf:
   ```sh
   node scripts/init-project.mjs          # dry-run: laat zien wat er gebeurt
   node scripts/init-project.mjs --yes    # voer de reset uit
   ```
2. Pas de `[PROJECT: …]`-placeholder bovenaan `AGENTS.md` aan.
3. Stel je eerste substantiële vraag aan de agent → die maakt `wiki/` aan en schrijft een
   **voorstel** in gewone taal.
4. Jij keurt het voorstel goed (of stuurt bij) → de agent compileert naar code met checks en
   `PW:`-ankers.
5. Periodiek: laat de agent de drift-loops draaien (`node scripts/drift-check.mjs`).

> Liever geen GitHub-template? `npx degit <username>/vibe-kit <project>` kopieert de bestanden ook,
> maar zonder automatische repo-koppeling.

---

## De methode in één minuut

1. **Intentie is duurzaam; code is de afgeleide.** De `wiki/` zegt *wat* en *waarom*; code is *hoe*.
2. **Beslis *wát* vóór *welke files*.** Eerst de bedoeling, dan pas de code.
3. **De mens keurt intentie goed vóór code.** Niet-triviale wijzigingen worden eerst een voorstel.

De ceremonie **schaalt mee**: triviale wijzigingen gaan gewoon door; alleen substantiële wijzigingen
doorlopen de volledige flow. Zie [`AGENTS.md`](AGENTS.md) voor het volledige contract.

Waarom deze keuzes (lean contract, drift-check, ceremonie-die-meeschaalt, playbook) onderbouwd zijn —
inclusief de cijfers en verificatiestatus van de bronnen — staat in [`docs/WAAROM.md`](docs/WAAROM.md).

---

## Dogfooding

Deze repo gebruikt zijn eigen methode: zie [`wiki/`](wiki/) voor de intentie-units van vibe-kit zelf.

## Credit & licentie

Methode afgeleid van [Omar Ismail — Product Wiki](https://github.com/omarismailb/product-wiki) (MIT).
Deze kit valt onder de [MIT-licentie](LICENSE).
