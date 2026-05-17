# Git Workflow — TrailIt

## Commit format

```
type: short title

- what changed
- why it changed
- impact
```

### Types

| Type | Use for |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `auth` | Auth flow changes |
| `style` | UI/CSS only — no logic change |
| `refactor` | Code restructure, no behaviour change |
| `docs` | Documentation only |
| `chore` | Config, tooling, deployment |
| `debug` | Temporary diagnostic code (remove before next push) |

### Examples

```
feat: add GPS trail recording with step counter

- added trail start/stop button and live stats card
- records distance, steps, duration, and route coordinates
- saves trail to Supabase on stop
```

```
fix: prevent auth screen re-appearing after Google login

- onAuthStateChange was clearing currentUser on transient null events
- added SIGNED_OUT guard so only explicit sign-out clears the user
- resolves mobile redirect loop after OAuth callback
```

```
auth: gate app immediately in Supabase mode

- auth screen now shown before any async session check
- prevents app content flashing during page load
- applies only to Supabase mode — mock mode unaffected
```

## Push workflow

```bash
git add .
git commit -m "type: short title

- what changed
- why it changed
- impact"
git push
```

Cloudflare Pages deploys automatically on every push to `main`.

## Branch policy

- `main` is the production branch — Cloudflare deploys from it directly
- All changes go straight to `main` for this project
- Use descriptive commit titles so the Cloudflare deploy history is readable
