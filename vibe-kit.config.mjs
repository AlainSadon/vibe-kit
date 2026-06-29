// vibe-kit.config.mjs — instellingen voor de drift-check.
//
// Dit bestand is van JOU. Een upgrade van scripts/drift-check.mjs (de "motor") overschrijft het niet,
// zodat je instellingen een update overleven. Pas hier alles aan; ontbreekt een sleutel of het hele
// bestand, dan valt de drift-check terug op zijn ingebouwde defaults. Waarden vervangen de default
// (arrays worden niet samengevoegd).
//
// Geen dependencies. Pure Node (>=16, ESM).

export default {
  // Map waar de intentie-units (de wiki) staan.
  wikiDir: "wiki",

  // Mappen die nooit op PW:-ankers worden gescand.
  ignoreDirs: ["node_modules", ".git", "dist", "build", "out", "coverage", "wiki", ".next", "vendor", ".vibe-kit-install"],

  // Bestandsextensies die als "code" gelden voor de anker-scan.
  codeExts: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".go", ".rs", ".java", ".rb", ".php", ".cs", ".kt", ".swift", ".css", ".scss", ".vue", ".svelte", ".sql", ".sh"],

  // Unit-types die in code verankerd én getest horen te zijn.
  anchorableTypes: ["rule", "capability"],

  // ── Command-hooks (alle drie optioneel, null = uit) ─────────────────────────
  // Elke hook draait een commando van JOUW project; de kit levert geen scanners zelf en blijft zo
  // dependency-vrij en stack-agnostisch. Je agent detecteert ze en stelt ze ter bevestiging voor
  // (skills start-project / run-checks). Zie wiki/decisions/quality-security-hooks.md.
  //
  // 1. Tests / acceptatiecriteria. Bijvoorbeeld:
  //   "node --test"        (Node ingebouwde test-runner)
  //   "npm test --silent"  (npm-script)
  //   "pytest -q"          (Python)
  //   "go test ./..."      (Go)
  //   "dotnet test"        (.NET)
  checksCommand: null,
  // 2. Kwaliteit / lint (complexiteit, duplicatie, stijl). Bijvoorbeeld:
  //   "npm run lint"       (ESLint e.d.)
  //   "ruff check ."       (Python)
  //   "golangci-lint run"  (Go)
  //   "dotnet format --verify-no-changes"  (.NET)
  qualityCommand: null,
  // 3. Security (kwetsbaarheden, secrets, kwetsbare dependencies). Voorkeur voor tooling die al in je
  //    toolchain zit (geen extra install):
  //   "npm audit --audit-level=high"     (JS — ingebouwd)
  //   "pip-audit"                         (Python)
  //   "govulncheck ./..."                 (Go)
  //   "dotnet list package --vulnerable"  (.NET — ingebouwd)
  //   "cargo audit" (Rust) · "gitleaks detect" (secrets, elke taal)
  securityCommand: null,
};
