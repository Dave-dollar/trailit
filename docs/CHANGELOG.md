# Changelog

## [Unreleased]

---

## 2026-05-17 — Initial Cloudflare-ready build

**Commit:** `ec45a50`

### Included in initial push

- `index.html` — full TrailIt single-file app
- `js/trailit-env.js` — Supabase config (supabase mode, publishable key)
- `js/trailit-supabase-config.js` — Supabase client factory with implicit OAuth flow
- `supabase/migrations/` — Phase 4 schema (profiles, trail_logs, members, sightings, trails, notes, photos, RLS policies)
- `docs/` — backend auth plan, Supabase setup, Google auth setup, test checklist, Cloudflare deployment guide
- `fishery-map/` — separate 3D venue map prototype (React + Vite + R3F)
- `.gitignore` — protects `.env`, `.netlify`, `.claude`, `test-results`, `node_modules`

### Auth features at time of first push

- Email/password login and signup via Supabase
- Google OAuth via Supabase (`flowType: "implicit"`)
- `redirectTo: window.location.origin` — works on Netlify and local dev
- Auth screen is a `position: fixed` full-screen gate
- `body.auth-open` locks scroll and hides app shell while unauthenticated
- `onAuthStateChange` registered before `getSession()` to catch OAuth redirect session
- Guard: transient null auth events ignored unless event is `SIGNED_OUT`
- App only starts (`finishAppStart`) after valid session confirmed
- Mock mode bypasses auth entirely
- Sign out button in top bar (visible only when authenticated)
- Debug logs present for auth event tracing (to be removed after investigation)

---

<!-- Add new entries above this line, newest first -->
