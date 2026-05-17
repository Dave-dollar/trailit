# TrailIt Backend And Auth Replacement Plan

Date: 2026-05-17

## Goal

Replace the current hardcoded Dave/Cali local-only account model with a real account-ready backend while preserving the existing Trail Logs, Start Trail, Save Trail, members, and permissions flows. Mock mode remains available only as a development fallback.

## Current App Audit

The live TrailIt app is currently a static single-file app at `index.html`.

Key findings:

- Identity is mocked with `CURRENT_USER_ID = "user-dave"` and seeded Dave/Cali users in `ensureMockData`.
- User switching is a visible `<select>` wired through `renderUserSwitcher`, `switchUser`, and `TrailItData.setCurrentUserId`.
- All primary data is persisted in browser `localStorage` under `trailit.localDb.v1`.
- Legacy local-only markers and trails are migrated from `trailit.markers.v1`, `trailit.legacyMarkers.v1`, and `trailit.trails.v1`.
- The local model is already close to a backend schema: users, trailLogs, trailLogMembers, sightings, trails, notes, and photos.
- Permissions are currently enforced in frontend service methods, not by a secure backend.
- Photos are stored as compressed base64 data URLs inside localStorage. This will not scale and is not cross-device safe.

Important current behavior to preserve:

- Creating and switching active Trail Logs.
- Starting, ending, naming, saving, listing, and drawing Trail routes.
- Adding sightings with notes and photos.
- Owner/member access checks for sightings, trails, notes, photos, and deletion.
- Member invitation and permission editing.
- Existing local migration paths so current users do not lose browser-stored data.

## Recommended Backend

Use Supabase as the first backend target because the app comments already state that the local models mirror planned Supabase tables, and Supabase gives TrailIt the required pieces in one place:

- Auth for real user accounts.
- Postgres for Trail Logs, sightings, trails, notes, members, and permissions.
- Row Level Security for backend-enforced access.
- Storage for uploaded photos.
- Client SDK that works from the current static app, with a later path to Vite/React if desired.

Only public/publishable Supabase keys belong in the frontend. Service role keys must never be shipped to the browser.

## Target Architecture

Introduce a data/auth adapter boundary:

- `AuthProvider`
  - `getSession()`
  - `signIn(email)`
  - `signOut()`
  - `getCurrentUser()`
  - `onAuthStateChange(callback)`

- `TrailItRepository`
  - `listTrailLogsForUser()`
  - `getActiveTrailLog()`
  - `createTrailLog(name)`
  - `listMembers(trailLogId)`
  - `inviteMember(trailLogId, emailOrUserId)`
  - `updateMemberPermissions(memberId, permissions)`
  - `listSightingMarkers(trailLogId)`
  - `createSightingMarker(payload)`
  - `deleteSightingMarker(id)`
  - `listTrailRoutes(trailLogId)`
  - `createTrailRoute(payload)`
  - `uploadPhoto(fileOrDataUrl)`

Provide two implementations:

- `SupabaseTrailItRepository`: production/live account-backed data.
- `LocalMockTrailItRepository`: current localStorage behavior for development fallback only.

The UI should call the adapter, not localStorage directly. This keeps current flows intact while changing where the data lives.

## Database Model

Use UUID primary keys generated in Postgres or by the Supabase client.

### profiles

One row per auth account.

- `id uuid primary key references auth.users(id) on delete cascade`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `display_name text not null`
- `accent_color text`

### trail_logs

- `id uuid primary key`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `name text not null`
- `owner_user_id uuid not null references profiles(id)`
- `created_by_user_id uuid not null references profiles(id)`
- `visibility text not null default 'private'`

### trail_log_members

- `id uuid primary key`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `trail_log_id uuid not null references trail_logs(id) on delete cascade`
- `user_id uuid not null references profiles(id) on delete cascade`
- `role text not null default 'reader'`
- `can_read boolean not null default true`
- `can_write_spottings boolean not null default false`
- `can_write_trails boolean not null default false`
- `can_add_notes boolean not null default false`
- `can_edit_own_inputs boolean not null default false`
- `can_edit_others_inputs boolean not null default false`
- Unique constraint on `(trail_log_id, user_id)`.

### sightings

- `id uuid primary key`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `trail_log_id uuid not null references trail_logs(id) on delete cascade`
- `created_by_user_id uuid not null references profiles(id)`
- `type text not null`
- `latitude double precision not null`
- `longitude double precision not null`

### trails

- `id uuid primary key`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `trail_log_id uuid not null references trail_logs(id) on delete cascade`
- `created_by_user_id uuid not null references profiles(id)`
- `name text not null`
- `date timestamptz`
- `distance_miles numeric`
- `steps integer`
- `duration_seconds integer`
- `start_time timestamptz`
- `end_time timestamptz`
- `route_coordinates jsonb not null default '[]'::jsonb`

### notes

- `id uuid primary key`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `trail_log_id uuid not null references trail_logs(id) on delete cascade`
- `created_by_user_id uuid not null references profiles(id)`
- `sighting_id uuid references sightings(id) on delete cascade`
- `trail_id uuid references trails(id) on delete cascade`
- `content text not null`

### photos

- `id uuid primary key`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `trail_log_id uuid not null references trail_logs(id) on delete cascade`
- `created_by_user_id uuid not null references profiles(id)`
- `sighting_id uuid references sightings(id) on delete cascade`
- `trail_id uuid references trails(id) on delete cascade`
- `storage_bucket text not null default 'trail-photos'`
- `storage_path text not null`
- `caption text`

Do not keep base64 photo data in the database for live accounts. Store images in Supabase Storage and keep only object metadata in `photos`.

## Backend Permission Model

Frontend permission checks should stay for user experience, but the database must be the source of truth.

RLS policy requirements:

- A user can read a Trail Log only if they are a member with `can_read = true` or they own it.
- A user can insert a Trail Log for themselves.
- A Trail Log owner is automatically inserted as an owner member.
- Only owners can invite members and update member permissions.
- Members can insert sightings only when `can_write_spottings = true`.
- Members can insert trails only when `can_write_trails = true`.
- Members can insert notes/photos only when `can_add_notes = true`.
- Members can update/delete their own inputs only when `can_edit_own_inputs = true`.
- Members can update/delete others' inputs only when `can_edit_others_inputs = true`.
- Owners always have full permissions.

Avoid using user-editable auth metadata in authorization. Use table relationships and `auth.uid()` checks in RLS policies.

## Photo Storage

Create a private `trail-photos` bucket.

Suggested path format:

`trail-logs/{trail_log_id}/{auth_user_id}/{photo_id}.jpg`

Rules:

- Upload only after confirming the signed-in user can add notes/photos to that Trail Log.
- Store the returned `storage_path` in `photos`.
- Serve images through signed URLs or authenticated download calls.
- Keep current client compression before upload to reduce mobile bandwidth.

## Local Migration Strategy

Keep local data safe through a one-time import flow:

1. User signs in.
2. App detects `trailit.localDb.v1`.
3. App shows an import prompt.
4. Import maps old local users to the signed-in account by default.
5. Dave's local Trail Logs become owned by the signed-in user.
6. Existing members that do not have real accounts remain local mock members until invited by email, or are skipped with a clear import report.
7. Sightings, trails, notes, and photos are uploaded into the new backend.
8. After successful import, mark local data as imported with a new key such as `trailit.backendImport.v1`.
9. Do not delete local data automatically until the user confirms the backend copy is visible.

For development fallback, keep local mock seed data behind a flag such as:

- `TRAILIT_DATA_MODE=mock`
- or `?mock=1` for local development only

Production should default to backend mode and never expose Dave/Cali switching as the account system.

## Implementation Path

### Phase 1: Adapter Boundary

- Move the current `TrailItData` localStorage service behind a repository interface.
- Keep method names and return shapes stable so UI functions do not break.
- Add a data mode switch: backend by default, mock only in local/dev mode.
- Hide or replace the mock user switcher in backend mode.

Acceptance checks:

- Existing local Trail Logs still open.
- Start Trail, End Trail, Save Trail still work in mock mode.
- Member permission UI still reflects current permissions.

### Phase 2: Auth Foundation

- Add Supabase client configuration.
- Add sign-in/sign-out UI.
- Replace `CURRENT_USER_ID` with the authenticated `auth.uid()`.
- Create or load a `profiles` row after sign-in.
- Active Trail Log remains a local preference, but must be validated against backend membership.

Acceptance checks:

- Signed-out users see login, not Dave/Cali switching.
- Signed-in users see only their Trail Logs.
- Refreshing the page restores the signed-in session and active Trail Log.

### Phase 3: Schema, RLS, And Storage

- Create migrations for the tables above.
- Enable RLS on every public table.
- Add policies for read/write/member/owner rules.
- Create the private `trail-photos` bucket and storage policies.
- Add backend indexes for `trail_log_id`, `created_by_user_id`, and membership lookups.

Acceptance checks:

- Direct client queries cannot read another user's private Trail Log.
- Read-only members cannot insert sightings/trails/notes/photos.
- Contributors can do only the permissions granted by the owner.
- Owners can manage members.

### Phase 4: Backend Repository

- Implement `SupabaseTrailItRepository` with the same public behavior as the local service.
- Convert backend snake_case rows to current UI camelCase view models.
- Upload photos to storage before inserting `photos` rows.
- Use transactions or RPC functions for multi-row operations where partial writes would be bad, especially creating sightings with notes/photos and creating Trail Logs with owner membership.

Acceptance checks:

- Create Trail Log works and creates owner membership.
- Save sighting with note/photo works cross-device.
- Save Trail route works cross-device.
- Permission denial paths show the current UI status messages.

### Phase 5: Local Import

- Build import tooling from `trailit.localDb.v1`.
- Import sightings, trails, notes, photos, members, and permissions.
- Convert data URL photos to uploaded storage files.
- Produce an import summary.

Acceptance checks:

- A browser with existing local data can sign in and import without losing local data.
- Imported Trail Logs appear on another device after sign-in.
- Imported photos load from backend storage.

### Phase 6: Remove Mock As Product UX

- Remove Dave/Cali user switching from production UI.
- Keep mock users and localStorage repository only behind dev fallback.
- Update visible status text from "saved to this device" to backend-aware wording.

Acceptance checks:

- Production app has no final-user Dave/Cali switcher.
- Mock mode can still be enabled for development.
- All existing workflows are preserved.

## First Code Changes To Make

1. Extract `TrailItData` into a repository-style module or clearly separated script section.
2. Rename current implementation to `LocalMockTrailItRepository`.
3. Add a tiny `TrailItAuth` facade, initially backed by current local user selection.
4. Replace direct UI references to `TrailItData` with `trailItRepository`.
5. Gate `userSwitchSelect` behind mock mode and introduce account UI placeholders.
6. Add Supabase env/config placeholders without enabling live mode until schema and RLS exist.

This order keeps the current app working while making the backend swap deliberate.

## Risk Notes

- The highest-risk change is moving permission enforcement from frontend-only to frontend plus RLS. Test denial cases directly.
- Photo import can be slow because current photos are base64 strings; run it as a resumable import.
- Route coordinates can grow large; keep them as `jsonb` initially, but consider a separate `trail_route_points` table later if route analytics become important.
- Inviting by selecting from existing mock users will not make sense for real accounts. Replace with invite by email or member lookup.
- The app is currently static. Supabase client-side auth can work, but any privileged user management or invite acceptance logic may eventually need serverless functions.
