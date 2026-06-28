---
id: chk-drift-check-schoon
type: check
status: active
links: [cap-drift-detectie]
---

`cap-drift-detectie` werkt en deze repo bevat geen drift-fouten. Verifieer met:

```
node scripts/drift-check.mjs
```

Verwacht: exit-code 0 (geen verweesde ankers of checks). Waarschuwingen voor documentatie-rules
zonder code-anker zijn toegestaan zolang ze bewust zijn; `--strict` laat ook die falen.
