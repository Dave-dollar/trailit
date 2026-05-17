# Supabase Setup For TrailIt

Date: 2026-05-17

This is Phase 1 setup only. TrailIt still uses the existing localStorage/mock data service by default. Dave/Cali mock users, Trail Logs, Start Trail, Save Trail, members, and permissions are intentionally unchanged.

## Current Mode

The live static app defaults to:

```text
TRAILIT_DATA_MODE=mock
```

In this mode, the app keeps using:

- `trailit.localDb.v1`
- Dave/Cali mock users
- local Trail Logs, sightings, trails, notes, photos, members, and permissions

## Dual Data Modes

TrailIt now has one data interface selected at startup:

- `mock`: current localStorage-backed repository.
- `supabase`: Supabase-client-aware repository.

During Phase 2, Supabase mode is architectural only. It creates a Supabase client when credentials are present, but Trail Logs, sightings, trails, notes, photos, members, and permissions still fall back to the mock repository until schema, RLS, storage, and real repository writes are implemented.

This lets the app switch modes without rewriting the UI calls later.

## Auth Foundation

In `mock` mode:

- TrailIt boots immediately.
- Dave/Cali switching stays visible and unchanged.
- localStorage remains the source of user and Trail Log data.

In `supabase` mode:

- TrailIt shows a login/sign-up screen before starting GPS and app workflows.
- The Dave/Cali mock user switcher is hidden.
- The logout button is visible after a Supabase user is authenticated.
- The auth screen includes a dev-only "Use mock mode" escape hatch when the data-mode toggle is enabled.
- `window.TrailItRuntime.auth.user` exposes the current authenticated user for diagnostics.
- Trail Log data still uses the mock fallback repository until the database migration is implemented.

This means Supabase Auth can be tested now without moving Trail Logs to Supabase yet.

## Supabase Data Repository

Phase 4 replaces the Supabase-mode mock fallback with real Supabase table access. In `supabase` mode, TrailIt now reads and writes:

- `profiles`
- `trail_logs`
- `trail_log_members`
- `sightings`
- `trails`
- `notes`
- `photos`

Mock mode is unchanged and still uses localStorage.

Apply the schema/RLS migration before using Supabase mode:

```text
supabase/migrations/20260517000000_trailit_phase4_schema.sql
```

The Supabase repository maps database `snake_case` columns to the existing UI `camelCase` models so the current Trail Logs, Start Trail, Save Trail, members, and permissions UI can continue to use the same shapes.

Photos are metadata-only in this phase. The app creates `photos` rows, but it does not upload binary files to Supabase Storage yet.

## Supabase Project Values

Create or open a Supabase project, then collect:

- Project URL, for example `https://your-project-ref.supabase.co`
- Publishable key, for example `sb_publishable_...`
- Photo bucket name, default `trail-photos`

Use only a publishable key in browser code. Do not place Supabase secret keys, legacy service-role keys, database URLs, or any other privileged value in frontend files.

## Placeholder Files

For future Vite/Node builds, copy `.env.example` to `.env` and fill:

```text
TRAILIT_DATA_MODE=mock
TRAILIT_ENABLE_DATA_MODE_TOGGLE=false
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
VITE_SUPABASE_PHOTO_BUCKET=trail-photos
```

For the current static `index.html` app, fill the checked-in placeholder:

```text
js/trailit-env.js
```

```js
window.TRAILIT_ENV = {
  dataMode: "mock",
  enableDataModeToggle: true,
  supabaseUrl: "https://your-project-ref.supabase.co",
  supabasePublishableKey: "sb_publishable_your_key_here",
  supabasePhotoBucket: "trail-photos"
};
```

Do not use `dataMode: "supabase"` for production users until the schema, RLS policies, storage bucket, and real repository writes are implemented and tested.

## Development Mode Toggle

The app includes a small data-mode selector for development testing. It is visible when:

- Running on `localhost`, `127.0.0.1`, or a local file URL.
- `window.TRAILIT_ENV.enableDataModeToggle` is `true`.
- The URL includes `?trailitDev=1`.

The selector stores the chosen mode in localStorage under:

```text
trailit.dataMode.v1
```

You can also force a mode for one page load with:

```text
?dataMode=mock
?dataMode=supabase
```

## Runtime Setup Added In Phase 1

TrailIt now loads:

- `@supabase/supabase-js@2` from CDN
- `js/trailit-supabase-config.js`

The config script exposes:

```js
window.TrailItSupabase.getConfig()
window.TrailItSupabase.setDataMode("mock")
window.TrailItSupabase.setDataMode("supabase")
window.TrailItSupabase.createClient()
```

`createClient()` returns `null` unless both the Supabase URL and publishable key are configured and the Supabase JS library is available.

The app also exposes:

```js
window.TrailItRuntime
```

This is for diagnostics and the next migration phase. It does not replace the current local mock data path.

## Static HTML Configuration Options

Phase 1 supports two non-secret browser configuration methods:

1. `window.TRAILIT_ENV` from `js/trailit-env.js`
2. `<meta>` placeholders in `index.html`

The checked-in `index.html` keeps these placeholders empty and `data-mode` set to `mock`.

## Next Phase

Phase 2 should add real auth and the repository boundary:

- Add sign-in/sign-out UI.
- Create/load a Supabase profile for the signed-in user.
- Keep the local mock repository as fallback.
- Add a Supabase repository implementation only after tables and RLS policies exist.
- Hide Dave/Cali switching in backend mode, but keep it in mock mode.

## References

- Supabase JavaScript initialization: https://supabase.com/docs/reference/javascript/initializing
- Supabase Auth JavaScript overview: https://supabase.com/docs/reference/javascript/auth-api
- Supabase API keys: https://supabase.com/docs/guides/getting-started/api-keys
