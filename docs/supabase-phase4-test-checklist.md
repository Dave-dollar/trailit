# TrailIt Supabase Phase 4 Test Checklist

Date: 2026-05-17

Use this checklist before starting Phase 5. Phase 4 should prove that Supabase mode stores and reads TrailIt data from Supabase while mock mode remains unchanged.

## 1. Apply Migration

Migration file:

```text
supabase/migrations/20260517000000_trailit_phase4_schema.sql
```

Preferred local CLI flow:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Dashboard fallback:

1. Open Supabase Dashboard.
2. Select the TrailIt project.
3. Open SQL Editor.
4. Paste the full migration SQL.
5. Run it once.

Confirm these tables exist:

- `profiles`
- `trail_logs`
- `trail_log_members`
- `sightings`
- `trails`
- `notes`
- `photos`

Confirm RLS is enabled on all seven public tables.

## 2. Env And Runtime Config

For the current static app, set [js/trailit-env.js](<../js/trailit-env.js>) to:

```js
window.TRAILIT_ENV = {
  dataMode: "supabase",
  enableDataModeToggle: true,
  supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
  supabasePublishableKey: "sb_publishable_or_anon_key",
  supabasePhotoBucket: "trail-photos"
};
```

For future build tooling, mirror these values from [.env.example](<../.env.example>):

```text
TRAILIT_DATA_MODE=supabase
TRAILIT_ENABLE_DATA_MODE_TOGGLE=true
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_or_anon_key
VITE_SUPABASE_PHOTO_BUCKET=trail-photos
```

Never use a service-role key in browser config.

## 3. Signup/Login Test

- Open TrailIt with Supabase mode active.
- Confirm the login/sign-up screen appears.
- Confirm Dave/Cali mock user switcher is hidden.
- Sign up with a new email and password.
- If email confirmation is enabled, confirm the email, then log in.
- Confirm the auth screen closes after login.
- Confirm Logout button appears.
- In Supabase Dashboard, check `profiles` contains the authenticated user.

Expected result: user can authenticate and the app loads without local mock switching.

## 4. Create Trail Log Test

- Open `Trail Logs`.
- Create a new Trail Log, for example `Phase 4 Test Log`.
- Confirm it opens and appears in the Trail Logs list.
- In Supabase Dashboard, check:
  - `trail_logs` has one row with `owner_user_id` matching the auth user id.
  - `trail_log_members` has an owner row for that Trail Log.

Expected result: Trail Log and owner membership are stored in Supabase.

## 5. Add Sighting Test

- Open the new Trail Log.
- Tap the map or use Add Here.
- Add a sighting type and a note.
- Save it.
- Confirm the marker appears on the map and in Recent Finds.
- In Supabase Dashboard, check:
  - `sightings` has a row for the active Trail Log.
  - `notes` has a row linked to that `sighting_id`.
  - `photos` remains empty unless a photo was selected.

Expected result: sighting and note persist in Supabase and render in the app.

## 6. Start/Save Trail Test

- Click Start Trail.
- Allow GPS if prompted.
- End the trail after recording at least one point.
- Save with a unique name.
- Confirm the trail appears in Saved Trails.
- In Supabase Dashboard, check `trails` contains:
  - `trail_log_id`
  - `created_by_user_id`
  - `name`
  - `distance_miles`
  - `steps`
  - `duration_seconds`
  - `route_coordinates`

Expected result: saved trail persists in Supabase and appears after refresh.

## 7. Invite Member Test

Current Phase 4 member invites can only add users already present in `profiles`.

- Create a second Supabase account and log in once so its profile row exists.
- Log back in as the owner.
- Open the Trail Log members panel.
- Confirm the second profile appears as invitable.
- Invite the second user.
- In Supabase Dashboard, check `trail_log_members` has a reader row for the second user.

Expected result: invited member is added as read-only.

## 8. Permissions Test

As owner:

- Confirm owner can add sightings.
- Confirm owner can save trails.
- Confirm owner can update member permissions.

As invited read-only member:

- Log in as the invited user.
- Confirm the shared Trail Log is visible.
- Confirm Add Here / save sighting is blocked or disabled.
- Confirm Start Trail / Save Trail is blocked or disabled.

Back as owner:

- Grant `Write sightings`.
- Log in as invited member and confirm sighting save works.
- Grant `Write trails`.
- Log in as invited member and confirm trail save works.
- Grant `Add notes`.
- Confirm notes/photos metadata are allowed only when this permission is granted.

Expected result: frontend behavior matches membership permissions, and RLS denies unauthorized direct writes.

## 9. Second-Device Login Test

Use another browser profile, incognito window, or another device:

- Open TrailIt in Supabase mode.
- Log in as the original owner.
- Confirm the created Trail Log appears.
- Open it and confirm sightings, notes, and saved trails appear.
- Log out.
- Log in as the invited member.
- Confirm only member-accessible Trail Logs appear.
- Confirm permissions match that member row.

Expected result: data follows the account, not the device.

## 10. Mock Mode Regression Check

- Switch data mode back to `mock`.
- Confirm Dave/Cali switcher is visible.
- Confirm existing local Trail Logs still work.
- Create a local Trail Log.
- Add a sighting.
- Start/save a trail.
- Change member permissions.

Expected result: mock mode remains fully functional and localStorage-backed.

## Common Errors To Watch For

- `Supabase is not configured.`  
  Check `supabaseUrl` and `supabasePublishableKey` in `js/trailit-env.js`.

- `relation "profiles" does not exist` or similar table errors.  
  Migration was not applied to the active Supabase project.

- Insert succeeds for `trail_logs` but owner member insert fails.  
  Check `trail_log_members` RLS insert policy and user profile row.

- Trail Log creates but does not appear after refresh.  
  Check membership row exists and `can_read = true`.

- `new row violates row-level security policy`.  
  Check the active signed-in user id matches `created_by_user_id` and membership permissions.

- Invitable users list is empty.  
  The other user must sign up/log in once so a `profiles` row exists.

- Photos do not render cross-device.  
  Expected in Phase 4 for newly selected photos: only metadata is stored. Storage upload is Phase 5+.

- Trails save with empty route points.  
  GPS permission may be denied, unavailable, or the test ended too quickly.

- Mock data appears in Supabase mode.  
  Check the data mode toggle/localStorage key `trailit.dataMode.v1` and `window.TRAILIT_ENV.dataMode`.

## Pass Criteria

Phase 4 is ready for Phase 5 when:

- Supabase mode can sign up/login/logout.
- Authenticated users can create Trail Logs.
- Trail Logs survive refresh and second-device login.
- Sightings, notes, trails, members, and permission changes persist in Supabase.
- Read-only members cannot write.
- Mock mode still passes its local regression check.
