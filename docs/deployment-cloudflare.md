# TrailIt — Cloudflare Pages Deployment

## Overview

TrailIt is a static web app (no build step). Cloudflare Pages serves it directly from the GitHub repo root.

---

## 1. GitHub Setup

### First time

```bash
git init
git branch -m main
git remote add origin https://github.com/YOUR_USERNAME/trailit.git
git add .
git commit -m "Initial TrailIt Cloudflare-ready build"
git push -u origin main
```

### Pushing updates

```bash
git add .
git commit -m "Fix Google auth redirect handling"
git push
```

Commit title format — be specific:

| Good | Avoid |
|---|---|
| `Fix Google auth redirect handling` | `update` |
| `Add Supabase trail log sync` | `changes` |
| `Improve mobile auth gate` | `fix stuff` |
| `Remove debug logs after auth investigation` | `cleanup` |

---

## 2. Cloudflare Pages Setup

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages**
2. Connect to GitHub and select your TrailIt repo
3. Configure the build:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | *(leave empty)* |
| Build output directory | `/` |
| Root directory | *(leave empty)* |

4. Click **Save and Deploy**

Cloudflare will deploy automatically on every push to `main`.

---

## 3. Configuration Notes

### Supabase credentials

`js/trailit-env.js` contains the Supabase URL and publishable key. These are safe to commit — the publishable key is intentionally client-side (equivalent to a Stripe publishable key). Never put a Supabase service-role or secret key in this file.

```js
window.TRAILIT_ENV = {
  dataMode: "supabase",
  enableDataModeToggle: false,
  supabaseUrl: "https://your-project.supabase.co",
  supabasePublishableKey: "sb_publishable_...",
  supabasePhotoBucket: "trail-photos"
};
```

### Mock mode

To run locally in mock mode without Supabase, temporarily set `dataMode: "mock"` and `enableDataModeToggle: true` in `js/trailit-env.js`. Do not commit those values to `main`.

### Google OAuth redirect

The Supabase Google provider must have this redirect URI registered:
```
https://lofevketpoasiuxygtyd.supabase.co/auth/v1/callback
```

After Cloudflare Pages assigns a domain (e.g. `trailit.pages.dev`), add it as an **Authorised JavaScript origin** in Google Cloud Console → APIs & Services → Credentials → your OAuth client.

---

## 4. Updating the Live Site

Every `git push` to `main` triggers a new Cloudflare Pages deployment automatically. No manual steps needed after the initial setup.

To check deploy status: Cloudflare dashboard → Pages → your project → Deployments.
