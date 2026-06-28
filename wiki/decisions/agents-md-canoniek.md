---
id: dec-agents-md-canoniek
type: decision
status: active
links: [rule-lean-contract, rule-een-bron-van-waarheid]
---

`AGENTS.md` is het **canonieke** altijd-aan contract; `CLAUDE.md` is een korte pointer ernaar. Reden:
`AGENTS.md` is een open, tool-agnostische standaard (breder publiek voor een publieke kit), en één
canoniek bestand voorkomt een tweede bron van waarheid. Claude Code leest `CLAUDE.md` automatisch en
wordt daarvandaan naar `AGENTS.md` verwezen. Het procedurele detail staat in `skills/` (zie
`rule-lean-contract`) (2026-06-28).

Compatibiliteit geverifieerd op 2026-06-28: `AGENTS.md` is een open standaard die o.a. **OpenAI Codex**
(officiële docs), Cursor en Claude Code lezen — de kit is dus niet tool-specifiek. Tot nu toe alleen
gedogfood met Claude Code. *(Geverifieerd via primaire bron: developers.openai.com/codex.)*
