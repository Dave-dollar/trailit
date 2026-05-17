# Google Auth Setup — TrailIt

## 1. Google Cloud — Create OAuth Client

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Select or create a project
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Application type: **Web application**
6. Name: `TrailIt`
7. Under **Authorised redirect URIs**, add:
   ```
   https://lofevketpoasiuxygtyd.supabase.co/auth/v1/callback
   ```
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

> If prompted to configure the OAuth consent screen first, set User Type to **External**, fill in the app name and your email, then return to step 4.

---

## 2. Supabase Dashboard — Enable Google Provider

1. Go to your Supabase project: [supabase.com/dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication → Providers**
3. Find **Google** and toggle it **on**
4. Paste in the **Client ID** and **Client Secret** from step 1
5. Click **Save**

---

## 3. Quick Test

1. Open TrailIt in supabase mode (ensure `dataMode=supabase`)
2. The "Continue with Google" button should be visible on the login screen
3. Click it — Google's sign-in page should open
4. Sign in with a Google account
5. You should be redirected back to TrailIt and land in the app as an authenticated user
6. Check **Supabase → Authentication → Users** — the Google account should appear with provider `google`

---

## Notes

- The redirect URI must match exactly — no trailing slash
- Google's OAuth consent screen must be published (or your test email added as a test user) before other users can sign in
- First-time Google sign-in creates a new Supabase user; subsequent logins reuse the same account
