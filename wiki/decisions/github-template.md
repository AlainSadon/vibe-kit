---
id: dec-github-template
type: decision
status: active
links: [dec-projecten-private]
---

Distributie loopt via een **GitHub template repository**:
`gh repo create <project> --template <username>/vibe-kit --private --clone`. Eén mechanisme dekt beide
doelen: het kopieert het sjabloon én legt meteen de GitHub-koppeling voor eigen projecten, terwijl
derden dezelfde repo of de "Use this template"-knop gebruiken. Schoner dan `npx degit` (dat geen
koppeling maakt). Eenmalige voorwaarde: `gh` CLI + `gh auth login` (2026-06-28, met gebruiker).
