# Waarom vibe-kit zo ontworpen is — de onderbouwing

> De ontwerpkeuzes van vibe-kit zijn geen smaak maar onderbouwd. Deze pagina is de **canonieke bron**
> voor het *waarom*; de wiki-units en skills verwijzen hiernaar in plaats van de argumentatie te
> dupliceren (zie [`rule-een-bron-van-waarheid`](../wiki/rules/een-bron-van-waarheid.md)).
>
> **Transparantie over verificatie.** Per bevinding staat hoe grondig de bron is gecontroleerd
> (primair gelezen / abstract / niet geverifieerd). Dat onderscheid is bewust: claims die het ontwerp
> dragen zijn primair geverifieerd; de rest is referentie.

## Bevindingen → ontwerpkeuzes

### 1. Een kort, gericht context-bestand is meetbaar efficiënter
*Impact of AGENTS.md on Efficiency* (arXiv 2601.20404), 10 repos / 124 PR's: de aanwezigheid van een
`AGENTS.md` gaf **−28,64% mediane runtime** en **−16,58% output-tokens** bij **gelijke
taakvoltooiing**. *(Geverifieerd via abstract.)*

→ Onderbouwt het **lean altijd-aan contract**: zie [`rule-lean-contract`](../wiki/rules/lean-contract.md)
en [`dec-agents-md-canoniek`](../wiki/decisions/agents-md-canoniek.md). Procedureel detail staat in
[`skills/`](../skills/), niet in het contract.

### 2. Kwaliteit boven kwantiteit — verouderde context schaadt
*Evaluating AGENTS.md* (arXiv 2602.11988): de winst op slagingskans is gemengd/bescheiden (~2–5% in
gunstige gevallen); **te lang, verouderd of redundant materiaal schaadt juist**. *(Primair gelezen,
PDF.)*

→ Onderbouwt dat het contract kort blijft én dat we **veroudering actief bewaken** met de drift-check:
zie [`cap-drift-detectie`](../wiki/capabilities/drift-detectie.md) en de skill
[`reconcile-wiki`](../skills/reconcile-wiki/SKILL.md).

### 3. De bottleneck is spec-begrip + verificatie, niet codegeneratie
SE-agent-survey (arXiv 2510.09721), 50+ benchmarks: aanbevolen zijn een *executable spec* (natuurlijke
taal + tests), generate-test-revise-loops met uitvoerings-/formele feedback, gestructureerd
repo-geheugen en SE-specifieke tools boven een ruwe terminal. Belangrijke waarschuwing van de auteurs:
**"over-specificatie schept starheid"** — simpele 3-fasen-processen verslaan soms uitgebreide
planning. *(Primair gelezen, HTML.)*

→ Onderbouwt twee pijlers tegelijk: acceptatiecriteria-als-uitvoerbare-[`checks/`](../wiki/checks/)
(skill [`run-checks`](../skills/run-checks/SKILL.md)) én de **ceremonie die meeschaalt** met de
wijziging (zie de tabel in [`AGENTS.md`](../AGENTS.md) en [`non-goals.md`](../wiki/non-goals.md)). Geen
ceremonie om de ceremonie.

### 4. Zelf-verbeterende context werkt — maar selectief (ACE)
*Agentic Context Engineering* (arXiv 2510.04618, SambaNova/Stanford/UC Berkeley): een lus van
**Generator** (genereert trajecten) → **Reflector** (destilleert lessen) → **Curator** (voegt ze
deterministisch, non-LLM samen) in een "evolving playbook" voorkomt *context collapse* en
*brevity bias*. Resultaten: **+10,6%** op agent-benchmarks (AppWorld), **+8,6%** op finance; plus
forse efficiency-winst (offline −82,3% latency / −75,1% rollouts; online −91,5% latency / −83,6%
token-kosten). *(Primair gelezen, volledige HTML; cijfers geverifieerd.)*

**Nuance van de auteurs zelf:** een groeiend playbook loont vooral bij taken met veel domeinkennis en
kan **overbodig** zijn bij taken die juist baat hebben bij beknopte instructies.

→ Onderbouwt [`playbook.md`](../playbook.md) — **mits selectief toegepast**. Voor een bewust lean kit
is dat geen detail maar een gebruiksrichtlijn; ze staat in het playbook zelf.

## Bronnen — met verificatiestatus

**In het ontwerp verwerkt (primair geverifieerd):**
- [Impact of AGENTS.md on Efficiency (arXiv 2601.20404)](https://arxiv.org/abs/2601.20404) — *geverifieerd (abstract)*
- [Evaluating AGENTS.md (arXiv 2602.11988)](https://arxiv.org/pdf/2602.11988) — *primair gelezen (PDF)*
- [SE Agentic Systems Survey (arXiv 2510.09721)](https://arxiv.org/html/2510.09721v3) — *primair gelezen (HTML)*
- [Agentic Context Engineering / ACE (arXiv 2510.04618)](https://arxiv.org/abs/2510.04618) — *primair gelezen (HTML); cijfers geverifieerd*

**Herkomst van de methode (geen wetenschap):**
- [Ismail — Making English a Programming Language](https://omarismail.com/projects/making-english-a-programming-language)
- [Product Wiki repo (MIT)](https://github.com/omarismailb/product-wiki)

**Alleen referentie/conventie — niet primair geverifieerd:**
- [Memory in the Age of AI Agents: A Survey (arXiv 2512.13564)](https://arxiv.org/pdf/2512.13564) — *niet gelezen*
- Praktijkbronnen (Anthropic best practices & Agent Skills, AGENTS.md-gidsen, Thoughtworks SDD) — *conventie via zoek-snippets, niet primair geverifieerd*

> Eerder stond hier arXiv 2510.26493 ("Context Engineering 2.0") vermeld; dat is verwijderd omdat het
> abusievelijk met ACE was verward en niet in het ontwerp is gebruikt.
