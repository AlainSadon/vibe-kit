---
name: propose-change
description: Schrijf een voorstel in gewone taal vóór je code raakt, bij een substantiële wijziging (nieuwe feature/regel/capability, breaking change, gedrag over meerdere paden). Wacht op goedkeuring van de mens voordat je compileert.
---

# propose-change

De afstemmingspoort uit het contract: **de mens keurt intentie goed vóór code.** Gebruik deze skill
zodra een wijziging substantieel is (zie de ceremonie-tabel in `AGENTS.md`).

## Stappen

1. **Bepaal de scope.** Welke bedoeling verandert er? Begin bij het geheel, versmal stapsgewijs.
2. **Schrijf het voorstel** — kort, in `intake/<korte-naam>.md` of direct in de chat. Bevat:
   - *Wat* verandert er aan de intentie, en *waarom*.
   - Welke `wiki/`-units worden geraakt of nieuw aangemaakt (rules/capabilities/decisions).
   - **Acceptatiecriteria**: meetbaar wanneer dit "af en correct" is. Vaag = nog niet af.
   - Open beslispunten (beleidskeuzes) expliciet markeren.
   - **Non-goals**: wat valt buiten scope.
3. **Toets vooraf aan de drie poorten** (reuse / architectuur / correctheid) en benoem risico's.
4. **Wacht op goedkeuring.** Geen code vóór akkoord. Bij bijsturing: pas het voorstel aan en vraag
   opnieuw.

## Daarna

Na akkoord → ga door met de skill `compile-change`. Log de goedkeuring later in `wiki/log.md`.

## Niet doen

- Geen voorstel voor triviale/kleine wijzigingen (gewoon doen, resp. mentale poort-check).
- Geen code "vast vooruit" schrijven "om te laten zien wat ik bedoel".
