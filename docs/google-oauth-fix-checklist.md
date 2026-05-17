# Google OAuth Fix Checklist
Error: "Unable to exchange external code"

This error means Supabase received the Google auth code but could not exchange
it. The cause is almost always a redirect URI mismatch or missing Supabase config.

---

## 1. Google Cloud Console

Go to: console.cloud.google.com → APIs & Services → Credentials → your OAuth client

### Authorised redirect URIs
Must contain exactly:
```
https://lofevketpoasiuxygtyd.supabase.co/auth/v1/callback
```
- This is the ONLY redirect URI Google should send the code to
- Do NOT add https://trailit.sivolia.org here
- No trailing slash variation needed

### Authorised JavaScript origins
Must contain:
```
https://trailit.sivolia.org
```
- This is where the OAuth popup/redirect is initiated from
- Does NOT handle the code — just needs to be listed as a trusted origin

---

## 2. Supabase Dashboard

Go to: supabase.com/dashboard → your project → Authentication → URL Configuration

### Site URL
```
https://trailit.sivolia.org
```
- This is where Supabase redirects after the code exchange is complete
- Must match the domain the app is served from
- No trailing slash

### Redirect URLs (allowlist)
Add both:
```
https://trailit.sivolia.org
https://trailit.sivolia.org/
```
- Supabase validates the redirectTo value against this list
- Both with and without trailing slash to be safe

---

## 3. Supabase → Authentication → Providers → Google

Confirm:
- [ ] Google provider is toggled ON
- [ ] Client ID matches the one in Google Cloud Console
- [ ] Client Secret matches the one in Google Cloud Console
- [ ] No extra whitespace in either field

---

## Summary of what goes where

| Value | Where it goes |
|---|---|
| `https://lofevketpoasiuxygtyd.supabase.co/auth/v1/callback` | Google Cloud → Redirect URIs |
| `https://trailit.sivolia.org` | Google Cloud → JavaScript origins |
| `https://trailit.sivolia.org` | Supabase → Site URL |
| `https://trailit.sivolia.org` and `https://trailit.sivolia.org/` | Supabase → Redirect URLs |

---

## After making changes

Google Cloud changes apply immediately.
Supabase config changes apply within a few seconds.

Test: open https://trailit.sivolia.org → click Continue with Google →
complete Google account selection → should return to TrailIt logged in.

If still failing, check the browser console for the exact Supabase error
and the `[Auth]` logs added in the last build.
