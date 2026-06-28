# vibe-kit

> **AI laat je razendsnel software bouwen — maar vergeet onderweg waaróm je keuzes maakte.**
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

> Kort samengevat: **bedoeling (`wiki/`) ⇄ anker (`PW:`) ⇄ code**, met de bewaker eromheen die ze
> gekoppeld houdt.

---

## Aan de slag (voor wie ermee gaat bouwen)

Dit deel is technisch. Je hebt nodig: [`gh` (GitHub CLI)](https://cli.github.com/) — ingelogd via
`gh auth login` — en [Node.js](https://nodejs.org/) 18+.

> **Let op:** Node.js is alleen nodig voor de twee hulpscripts van de kit (de bewaker en de reset),
> *niet* voor je applicatie zelf — die mag in elke taal geschreven zijn (Python, Go, C#, …). En `gh`
> heb je enkel nodig voor de template-route hieronder.

```sh
gh repo create <project> --template AlainSadon/vibe-kit --private --clone
cd <project>
```

Open daarna je AI-assistent (bv. Claude Code) in het project. Bij een vers project richt hij zichzelf
in via een kort vraaggesprek: wat doet het project, mag de voorbeeld-inhoud gewist worden, en wat is
je test-commando. Daarna stel je je eerste vraag en begint de werkwijze hierboven.

> Liever zonder GitHub-template? `npx degit AlainSadon/vibe-kit <project>` kopieert de bestanden ook.

### Wat zit erin

| Onderdeel | Waarvoor |
|---|---|
| `AGENTS.md` (+ `CLAUDE.md`) | de werkwijze die je AI-assistent automatisch leest |
| `wiki/` | de bedoeling van je project, in gewone taal (de "notities") |
| `skills/` | stap-voor-stap recepten voor de assistent |
| `scripts/drift-check.mjs` + automatische controle (CI) | de bewaker die code en bedoeling gekoppeld houdt — handmatig én automatisch bij elke wijziging |
| `playbook.md` | lessen die het project gaandeweg leert |
| `docs/WHY.md` | de wetenschappelijke onderbouwing achter de aanpak |

Meer weten over het waarom? Zie [`docs/WHY.md`](docs/WHY.md) — met cijfers en bronnen.

## vibe-kit of Product Wiki?

vibe-kit en Omar Ismail's [Product Wiki](https://github.com/omarismailb/product-wiki) implementeren
dezelfde methode, maar met een ander gewicht:

- **Product Wiki** is de vollediger, dwingender variant — rijkere structuur en tooling die de poorten
  afdwingt. Sterk wanneer ook een minder technisch team meedoet of bij product-/UX-zwaar werk.
- **vibe-kit** is de lean variant voor **technische bouwers met een capabele agent**: minimale
  overhead, in een paar minuten te begrijpen en aan te passen.

Daarnaast is vibe-kit **Nederlandstalig**, terwijl Product Wiki Engels-only is — de methode zelf
werkt in elke taal, maar de uitvoering van Product Wiki is volledig in het Engels.

Kies vibe-kit als je licht en snel (en in het Nederlands) wilt; kies Product Wiki als je de complete,
voorschrijvende aanpak wilt.

## Credit & licentie

De methode is afgeleid van [Omar Ismail — Product Wiki](https://github.com/omarismailb/product-wiki)
(MIT). vibe-kit valt onder de [MIT-licentie](LICENSE).
