# Playbook — gecureerde lessen

> **Wat is dit?** Een groeiend, lerend geheugen (ACE-patroon: Generator → Reflector → Curator). Na
> een wijziging die een herbruikbare les opleverde, voeg je hier één compacte, geteste richtlijn toe.
> Houd het **gecureerd**: voeg toe wat generaliseert, verwijder wat achterhaald of te specifiek is.
> Dit is geen logboek (dat is `wiki/log.md`) en geen regelset (dat is `wiki/rules/`).

> **Selectief toepassen.** De ACE-auteurs vinden dat een groeiend playbook vooral loont bij taken met
> veel domeinkennis, en **overbodig** kan zijn bij taken die juist baat hebben bij beknopte
> instructies. Voor een bewust lean kit: voeg alleen lessen toe die echt generaliseren; laat dit
> bestand leeg als het project simpel is. Onderbouwing: [`docs/WHY.md` §4](docs/WHY.md).

## Hoe een les toevoegen

- **Eén les per bullet**, in de imperatief, met de *waarom* erbij.
- Verwijs naar de unit/skill waar de les bij hoort.
- Twijfel je of het generaliseert? Wacht tot je hem twee keer nodig had.

## Lessen

- **Sluit tijdelijke/installatie-mappen uit van de drift-check (of ruim ze op vóór je checkt).** Een
  map als `.vibe-kit-install` bevat kopieën van de kit-scripts mét het dogfood-anker; scant de
  drift-check die mee, dan meldt hij een vals "verweesd anker". Opgelost door `.vibe-kit-install` aan
  `ignoreDirs` (in `vibe-kit.config.mjs`) toe te voegen en de opruim-stap vóór de check te zetten.
  (gevonden bij een dogfood-test van [`add-to-project`](scripts/add-to-project.mjs) op een bestaand project)
- **Stel vragen aan de mens in mensentaal, zonder interne unit-id's of jargon.** Bij onboarding/
  bevestiging zag een tester "reset draaien? de wiki bevat nog `dec-naam-vibe-kit`" — verwarrend,
  want die id zegt een gebruiker niets. Beschrijf het effect ("de voorbeeld-inhoud wissen en met een
  schone lei beginnen"), niet de implementatie. Geldt voor elke skill die de mens iets vraagt.
  (gevonden tijdens dogfood-test van [`start-project`](skills/start-project/SKILL.md))
