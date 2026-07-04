# `@oracl3/core`

Runtime-independent core contracts for the Oracl3 sidecar. Zero dependencies — pure TypeScript types and tiny helpers.

## Exports

| Export | Kind | Purpose |
|---|---|---|
| `AdviceSeverity` | type | `"error" \| "warning" \| "info"` |
| `RuntimeEventSource` | interface | File/line location span |
| `Advice` | interface | Severity-scoped diagnostic message |
| `ViolationCandidate` | interface | Unclassified finding for promotion |
| `ResearchRequest` | interface | Query with optional context |
| `ResearchResult` | interface | Findings correlated to a request id |
| `RuntimeEvent` | union | `advice \| violation \| research:request \| research:result` |
| `RuntimeAdapter` | interface | Push-based event subscription + dispose |
| `isViolationAdvice` | function | Type guard narrowing `Advice` to `"error" \| "warning"` |
