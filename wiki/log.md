# Wiki — log (audit-trail)

Eén regel per goedgekeurd voorstel: datum, geraakte ID's, samenvatting.

| Datum | Units | Samenvatting |
|-------|-------|--------------|
| 2026-06-28 | alle | Eerste opzet van vibe-kit: contract, skills, drift-check, CI-stub, playbook en deze wiki (dogfooding). Beslissingen `dec-*` vastgelegd met de gebruiker. |
| 2026-06-28 | dec-onboarding-via-agent, skill start-project, AGENTS.md, README | Agent-gestuurde onboarding toegevoegd: skill `start-project` + eerste-run-trigger; handmatige setup-stappen vervallen. Placeholder reist bewust leeg mee zodat de trigger bij consumenten werkt. |
| 2026-06-28 | skill start-project, playbook | Dogfood-test: reset-vraag in mensentaal i.p.v. unit-id's; eerste playbook-les vastgelegd. |
| 2026-06-28 | skill start-project, dec-onboarding-via-agent, README | Onboarding vereenvoudigd na vergelijking met Product Wiki: gesprek i.p.v. multi-vraag-formulier, één hoofdvraag + één bevestiging, test-commando uitgesteld naar run-checks. |
| 2026-06-28 | dec-bestaand-project-installatie, add-to-project.mjs, start-project, README | Non-destructieve installer voor bestaande projecten toegevoegd; start-project verwijst naar import-codebase bij bestaande code. |
| 2026-06-28 | drift-check.mjs, add-to-project.mjs, playbook | Dogfood-test op bestaand project: `.vibe-kit-install` toegevoegd aan ignoreDirs (vals verweesd anker uit temp-map) + opruim-stap vóór de drift-check. |
| 2026-06-28 | start-project, run-checks, drift-check.mjs, dec-onboarding-via-agent | checksCommand via zelfde mechanisme als projectdoel: agent detecteert + stelt voor; drift-check meldt wanneer het op null staat. |
