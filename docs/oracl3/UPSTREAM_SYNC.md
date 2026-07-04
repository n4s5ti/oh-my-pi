# Upstream Sync

oracl3 is a standalone sidecar on an upstream-safe fork of `can1357/oh-my-pi`.
The fork exists at `https://github.com/n4s5ti/oh-my-pi` and is cloned into
this repo.

## Branch Strategy

| Branch | Tracks | Purpose |
|---|---|---|
| `main` | `upstream/main` (ff-only) | Clean mirror — never commit directly |
| `oracl3/main` | — | Integration branch — all oracl3 work lands here |

```
upstream/main ── ff ──► main
                           \
                           git merge main ──► oracl3/main
```

- `main` is a **fast-forward mirror** of `upstream/main`. No divergent commits.
- `oracl3/main` is the integration branch. It takes all OMP upstream changes
  (via `main`) plus the additive oracl3 packages.
- Feature branches fork from `oracl3/main` and merge back.

## Sync Commands

### Pull latest upstream (fetch)

```bash
git fetch upstream
```

### Fast-forward `main` to latest upstream

```bash
git switch main
git merge --ff-only upstream/main    # fails loudly if divergent
```

If `--ff-only` fails, someone committed directly to `main`. Reset:
```bash
git switch main
git reset --hard upstream/main
git push origin main --force-with-lease
```

### Bring `oracl3/main` up to date

```bash
git switch oracl3/main
git merge main                       # normal merge — oracl3 additions stay
```

Then push:
```bash
git push origin oracl3/main
```

### Cherry-pick a single upstream commit

When you only want a specific fix without pulling everything:

```bash
git switch oracl3/main
git cherry-pick <commit-sha>
```

List candidate commits from upstream that aren't in `oracl3/main`:
```bash
git log --oneline oracl3/main..upstream/main
```

## After Any Sync

- `bun install` if `bun.lock` or any `package.json` changed.
- Run `bun run check` in any oracl3 package that depends on OMP packages
  (the adapter only — core and cli are isolated).

## Golden Rules

1. **Never commit to `main`.** It is a read-only upstream mirror.
2. **Never modify an OMP core file** from this repo. All oracl3 changes are
   additive inside `packages/oracl3-*` and `docs/oracl3/`.
3. **Merge `main` into `oracl3/main`**, never the reverse. oracl3 additions
   must not pollute the upstream mirror.
