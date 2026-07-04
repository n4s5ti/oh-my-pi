# Architecture

oracl3 is an independent advisory sidecar that lives inside the OMP monorepo
without modifying any OMP core runtime files. It follows the same package
conventions as OMP itself (TypeScript ESM, `packages/*`, workspace-managed).

## Package Layout

```
packages/
  oracl3-core/         # Standalone — zero OMP imports
  oracl3-cli/          # Standalone — depends on oracl3-core only
  oracl3-omp-adapter/  # Bridge — MAY import OMP internals
docs/
  oracl3/              # These docs
```

### `@oracl3/core`

The heart of the sidecar. Implements all domain logic, models, and protocols.
**Must never import anything from `@oh-my-pi/*` or any OMP-internal module.**
This is the hard boundary that keeps oracl3 portable and independently testable.

Typical contents:
- Provider abstraction and routing
- Advisor state machine
- Prompt/context assembly
- Configuration types
- Result shaping

### `@oracl3/cli`

Entry point for human and agent use. A thin CLI that takes a query, passes it
to core, and prints the result. Depends only on `@oracl3/core`.

When run:
```bash
oracl3 ask "what should I do about X?"
```

The binary is a registered `sh3d` pass-through tool, making it callable as
`sh3d-oracl3-ask` inside the OMP environment and as a native `oracl3` subcommand outside it.

### `@oracl3/omp-adapter`

**The only package that touches OMP internals.** Adapts oracl3 output into
OMP-native formats (tool results, TUI renderables, event streams). This is
the thin seam where OMP integration lives and the only place that imports
from `@oh-my-pi/*` packages.

## Dependency Boundary

```
oracl3/cli ──► oracl3/core   (never OMP)
oracl3/omp-adapter ──► OMP   (authorised; imports @oh-my-pi/*)
```

- **core** and **cli** must compile and test without a running OMP instance.
- **adapter** depends on core for results and on OMP for delivery.
- No package outside `oracl3-omp-adapter` may import from `@oh-my-pi/*`.

## OMP Integration Seam

OMP core is never edited for oracl3. The only future change to OMP permitted
is a **thin event-stream seam**: a simple hook or extension point that lets
OMP broadcast lifecycle events (session start, tool result, provider response)
that the adapter subscribes to. This seam:

- Lives in a single file (e.g. `packages/oracl3-omp-adapter/seam.ts`)
- Is **opt-in** — OMP without oracl3 is unaffected
- Is the **only** modification to OMP core files ever allowed from this fork

Until that seam exists, the adapter runs in polling or command-injection mode.

## Branch Model

```
upstream/main  ──► main (ff-only mirror)
                      └──► oracl3/main (integration)
                              ├── packages/oracl3-core
                              ├── packages/oracl3-cli
                              ├── packages/oracl3-omp-adapter
                              └── docs/oracl3/
```

`main` is a pure upstream mirror. Everything oracl3 lives on `oracl3/main`.
See [UPSTREAM_SYNC.md](./UPSTREAM_SYNC.md) for the exact sync procedure.

## Testing Philosophy

- **core**: unit tests with no OMP context, no mocks of OMP types.
- **cli**: integration tests against a real or simulated core.
- **adapter**: acceptance tests that verify oracl3 results render correctly
  in OMP surfaces. May need a running OMP instance or a mock of the event seam.

## Non-Goals

- Turning OMP into oracl3. This is a sidecar, not a new runtime.
- Modifying OMP's provider, tool, or session pipeline.
- Replacing OMP's own advisor or watchdog.
- Adding OMP-level configuration for oracl3 (it has its own config in
  `@oracl3/core`).
