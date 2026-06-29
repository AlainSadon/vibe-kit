# vibe-kit

*Intentie-gericht vibe coden.*

> **AI laat je razendsnel software bouwen, maar vergeet onderweg waaróm je keuzes maakte.**
> Daardoor worden projecten al snel rommelig: dubbel werk, wankele structuur, dingen die elkaar
> breken. vibe-kit lost dat op door de bedoeling achter je project op te schrijven én je AI-assistent
> te laten overleggen vóórdat hij begint te bouwen.

## Het probleem, kort

Werken met een AI-assistent ("vibe coding") voelt als toveren: je vraagt iets, en er rolt code uit.
Maar code legt alleen vast *hoe* iets werkt, niet *waarom* het zo gekozen is. Bij elke volgende vraag
raadt de AI opnieuw, en zonder geheugen van eerdere beslissingen gaat het langzaam mis — net als een
verbouwing zonder bouwtekening.

## Wat vibe-kit doet

vibe-kit voegt drie simpele gewoontes toe aan het samenwerken met een AI-assistent:

1. **De bedoeling wordt opgeschreven.** Naast de code houdt het project een laag in gewone taal bij:
   wat moet er gebeuren, en waarom. Dat is het blijvende geheugen van het project.
2. **De AI stelt eerst een plan voor.** Bij iets nieuws schrijft de assistent eerst een voorstel in
   gewone taal — wat hij gaat doen en waarom — en wacht op jouw "ja" vóór hij code schrijft.
3. **Code en bedoeling blijven gekoppeld.** Een ingebouwde controle bewaakt dat de code niet stilletjes
   wegdrijft van wat er bedoeld was.

Het resultaat: je houdt de regie, het project blijft begrijpelijk, en snelheid hoeft niet ten koste
te gaan van kwaliteit.

## Hoe het in de praktijk voelt

> Jij: *"Ik wil dat klanten kunnen betalen met iDEAL."*
> De assistent: *"Voorstel: ik voeg een betaal-stap toe die… Het is klaar als… Buiten scope is…
> Akkoord?"*
> Jij: *"Ja, ga verder."*
> De assistent bouwt het, schrijft een testje dat bewijst dat het werkt, en noteert de beslissing.

Niet elke kleinigheid krijgt dit proces — een typo verbeteren gaat gewoon meteen. Het zwaardere
overleg geldt alleen voor echte keuzes. De aanpak schaalt mee met hoe groot de wijziging is.

## Wat de assistent bij elke wijziging nagaat

Naast jouw "ja" loopt de assistent drie korte vragen langs — geen bureaucratie, gewoon checks die
problemen vroeg vangen:

- **Hergebruik** — bestaat dit al? Dan dat gebruiken, niet half namaken.
- **Structuur** — past het netjes in de opzet, of moet er eerst opgeruimd worden?
- **Bewijs** — is er een test die aantoont dat het echt klopt?

(De volledige versie staat in [`AGENTS.md`](AGENTS.md).)

## Onder de motorkap (de techniek, toegankelijk)

Hoe houdt vibe-kit "code" en "bedoeling" nu echt aan elkaar vast? Met drie eenvoudige bouwstenen:

**1. Notities met een naam.** Elke brok bedoeling is een kort notitietje in de map `wiki/`, met een
vaste, korte code-naam. Bijvoorbeeld een regel `rule-afronding`: *"bedragen afronden op halve centen,
omdat…"*.

**2. Ankers in de code — het scharnierpunt.** Waar de code zo'n notitie waarmaakt, zet de assistent
een klein labeltje erbij dat terugverwijst: een **`PW:`-anker** (PW staat voor *Product Wiki*).

```js
// PW: rule-afronding — bedragen afronden op halve centen
function rondAf(bedrag) { ... }
```

Dit ankertje is de lijm tussen *hoe* (de code) en *waarom* (de notitie). Met één zoekopdracht spring
je van een bedoeling naar alle code die haar uitvoert — en andersom. Zo raakt nooit zoek welke code
welke beslissing dient.

**3. De bewaker.** Een klein script (`drift-check`) leest alle ankers en alle notities en legt ze
naast elkaar. Wijst een anker naar een notitie die niet (meer) bestaat? Is er een regel zonder bewijs
dat hij werkt? Dan slaat het alarm — meteen, niet pas maanden later. Deze controle kun je ook
automatisch laten draaien bij elke wijziging.

En "het is klaar als…" uit een voorstel wordt telkens een **automatische test**, zodat "werkt het
echt?" geen mening is maar iets dat gecontroleerd wordt.

De bewaker kan optioneel ook drie **commando's** van je eigen project meedraaien: je tests, een
**kwaliteits-check** (lint/complexiteit) en een **security-check** (kwetsbaarheden, secrets). De kit
levert die tools niet zelf — hij roept aan wat jouw stack al heeft, geeft voorkeur aan tools die al
geïnstalleerd zijn (zoals `npm audit`), en je assistent stelt ze net als het testcommando ter
bevestiging voor. Alle drie staan standaard **uit**: stel je niets in, dan verandert er niets.

> Kort samengevat: **bedoeling (`wiki/`) ⇄ anker (`PW:`) ⇄ code**, met de bewaker eromheen die ze
> gekoppeld houdt.

## Kost dit extra tijd of rekenkracht?

Kort gezegd: vibe-kit **verschuift** het werk van je AI-assistent van "rondzoeken en achteraf
herstellen" naar "vooraf de bedoeling vastleggen en verifiëren". Voor één losse wijziging kan het totaal
iets omhooggaan; over de levensduur van een project kan het juist omlaag, doordat er minder herwerk en
dubbel werk is. En omdat de aanpak meeschaalt met hoe groot de wijziging is, betaal je die moeite alleen
waar hij iets oplevert — een typo verbeteren kost niks extra. (Onderzoek vond zelfs dat een kort
context-bestand zoals dit de doorlooptijd en het verbruik kán verlágen; zie [`docs/WHY.md`](docs/WHY.md).)

---

## Vereisten & compatibiliteit

**Nodig om te beginnen:**
- Een AI-coding-agent die `AGENTS.md` leest (zie *Werkt met welke agents?* hieronder).
- [Node.js](https://nodejs.org/) 18+ — alleen voor de twee hulpscripts van de kit (de bewaker en de
  reset), *niet* voor je applicatie: die mag in elke taal geschreven zijn (Python, Go, C#, …).
- Git, om je project te versioneren.

**Optioneel:**
- [`gh` (GitHub CLI)](https://cli.github.com/) — alleen voor de template-route hieronder.
- GitHub Actions — alleen als je de bewaker ook automatisch in de cloud wilt laten draaien (de CI).
- Een test-, lint- en/of security-tool van je eigen stack — *alleen* als je de bijbehorende hooks
  aanzet (zie *Onder de motorkap*). Default staan ze uit, dus standaard installeer je hier niets extra;
  vaak zit de tool al in je toolchain (bv. `npm audit`).

**Werkt met welke agents?** `AGENTS.md` is een [open standaard](https://agents.md/) die door meerdere
tools wordt gelezen — o.a. Claude Code, OpenAI Codex en Cursor — dus vibe-kit is niet tool-specifiek.
`CLAUDE.md` is enkel een pointer voor Claude Code. De `skills/` laden in Claude Code automatisch
on-demand; andere agents lezen ze als gewone gelinkte bestanden. Tot nu toe getest met Claude Code.

## Aan de slag (voor wie ermee gaat bouwen)

Dit deel is technisch.

```sh
gh repo create <project> --template AlainSadon/vibe-kit --private --clone
cd <project>
```

Open daarna je AI-assistent (bv. Claude Code) in het project. Bij een vers project richt hij zichzelf
in met een kort gesprekje: hij ruimt de voorbeeld-inhoud op, vraagt wat je gaat bouwen en stelt — als
het detecteerbaar is — je testcommando voor. Daarna stel je je eerste vraag en begint de werkwijze
hierboven.

> Liever zonder GitHub-template? `npx degit AlainSadon/vibe-kit <project>` kopieert de bestanden ook.

### Wat zit erin

| Onderdeel | Waarvoor |
|---|---|
| `AGENTS.md` (+ `CLAUDE.md`) | de werkwijze die je AI-assistent automatisch leest |
| `wiki/` | de bedoeling van je project, in gewone taal (de "notities") |
| `skills/` | stap-voor-stap recepten voor de assistent |
| `scripts/drift-check.mjs` + automatische controle (CI) | de bewaker die code en bedoeling gekoppeld houdt, handmatig én automatisch bij elke wijziging |
| `vibe-kit.config.mjs` | jouw instellingen voor de bewaker (o.a. de optionele test-, kwaliteit- en security-checks); staat los van de bewaker zodat een update je instellingen niet overschrijft |
| `playbook.md` | lessen die het project gaandeweg leert |
| `docs/WHY.md` | de wetenschappelijke onderbouwing achter de aanpak |

Meer weten over het waarom? Zie [`docs/WHY.md`](docs/WHY.md) — met cijfers en bronnen.

## Toevoegen aan een bestaand project

Heb je al een project en wil je de methode toevoegen? Dat kan **non-destructief** — je eigen README,
code en regels blijven ongemoeid. Draai vanuit de root van je project:

```sh
npx degit AlainSadon/vibe-kit .vibe-kit-install
node .vibe-kit-install/scripts/add-to-project.mjs          # dry-run: laat zien wat er gebeurt
node .vibe-kit-install/scripts/add-to-project.mjs --yes    # voer de installatie uit
```

Het script kopieert alleen wat nog ontbreekt (de werkwijze, skills, de bewaker, CI, een lege wiki) en
slaat bestaande bestanden over. Verwijder daarna de tijdelijke map (`.vibe-kit-install`). Open dan je
AI-assistent: hij vraagt wat je bouwt en vult `AGENTS.md` zelf in (skill `start-project`), en stelt
voor om met `import-codebase` je bestaande code naar wiki-intentie om te zetten.

> ⚠️ Gebruik hiervoor **niet** `init-project.mjs` — dat is voor verse template-clones en overschrijft
> bestanden. Voor een bestaand project is `add-to-project.mjs` de juiste, non-destructieve route.

## vibe-kit of Product Wiki?

vibe-kit en Omar Ismail's [Product Wiki](https://github.com/omarismailb/product-wiki) implementeren
dezelfde methode, maar met een ander gewicht:

- **Product Wiki** is de vollediger, dwingender variant — rijkere structuur en tooling die de poorten
  afdwingt. Sterk wanneer ook een minder technisch team meedoet of bij product-/UX-zwaar werk.
- **vibe-kit** is de lean variant voor **technische bouwers met een capabele agent**: minimale
  overhead, in een paar minuten te begrijpen en aan te passen.

Product Wiki is rijker in *productmodellering* (atomaire units als actors, jobs, stories en journeys,
gericht op ook niet-technische operators). vibe-kit laat die laag bewust weg en legt eigen accenten op
**verificatie en zelfstandig bouwen**. Bovenop de gedeelde methode voegt het toe:

- **Opt-in quality- en security-hooks** in de bewaker — naast je tests kun je een lint-/complexiteits-
  en een kwetsbaarheden-check laten meedraaien (default uit; je assistent stelt ze voor).
- **Een lerend playbook** (`playbook.md`, ACE-patroon) — gecureerde lessen die tussen sessies meereizen.
- **Reverse-import** (`import-codebase`) — bestaande code terugvertalen naar wiki-intentie.
- **Non-destructieve installer** (`add-to-project.mjs`) — de methode toevoegen aan een bestaand project
  zonder iets te overschrijven.
- **Agent-gestuurde onboarding** — een kort gesprek in plaats van handmatige setup.

Daarnaast is vibe-kit **Nederlandstalig**, terwijl Product Wiki Engels-only is — de methode zelf
werkt in elke taal, maar de uitvoering van Product Wiki is volledig in het Engels.

Kies vibe-kit als je licht en snel (en in het Nederlands) wilt; kies Product Wiki als je de complete,
voorschrijvende aanpak wilt.

## Naast andere AI-coding tools

Het idee van een intentielaag boven AI-code is niet uniek — het is een druk, snelgroeiend veld. Grofweg
twee populaire families:

- **Spec-driven frameworks** — zoals [GitHub Spec Kit](https://github.com/github/spec-kit),
  [BMAD-METHOD](https://github.com/bmad-code-org/bmad-method) en [Amazon Kiro](https://kiro.dev/): van
  spec naar plan naar taken naar code. Krachtig, maar vaak zwaar (een eigen IDE, tientallen agents en
  workflows).
- **Geheugen-frameworks** — zoals [Cline Memory Bank](https://docs.cline.bot/features/memory-bank):
  vaste Markdown-bestanden die je project "onthouden" tussen sessies. Licht, maar passief — ze bewaren
  context, maar bewaken niet of code en bedoeling samen blijven lopen.

vibe-kit mikt op het gat ertussen: **bedoeling en code actief gekoppeld houden** (via de `PW:`-ankers en
de bewaker) mét **minimale overhead** (dependency-vrij, elke taal en agent, in minuten te begrijpen).
Niet het breedste of zwaarste — wel licht én zelf-bewakend.

## Credit & licentie

De methode is afgeleid van [Omar Ismail — Product Wiki](https://github.com/omarismailb/product-wiki)
(MIT). vibe-kit valt onder de [MIT-licentie](LICENSE).
