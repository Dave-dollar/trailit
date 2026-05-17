# TrailIt

A browser-based field journal for recording wildlife sightings, GPS trails, notes, and photos in the field.

## What it does

- **Trail Logs** — private or shared logs for organising field sessions
- **Sightings** — pin wildlife signs on a live map with type, notes, and photos
- **GPS Trails** — record walks with distance, steps, duration, and route
- **Members** — invite others to a Trail Log with fine-grained read/write permissions
- **Accent colours** — each member's contributions are colour-coded on the map
- **Google Sign-In** — authenticate via Supabase OAuth (email/password also supported)
- **Mock mode** — full offline/local mode for development without Supabase

## Tech

- Single-file static web app (`index.html`)
- [Leaflet](https://leafletjs.com/) for maps
- [Supabase](https://supabase.com/) for auth and database
- No build step — deploy the repo root directly

## Deployment

Hosted on Cloudflare Pages, auto-deploying from the `main` branch.

See [`docs/deployment-cloudflare.md`](docs/deployment-cloudflare.md) for setup steps.

## Development

Open `index.html` directly in a browser. Mock mode runs without any Supabase credentials.

To use Supabase locally, copy `js/trailit-env.example.js` to `js/trailit-env.js` and fill in your project URL and publishable key.

## Pushing changes

```bash
git add .
git commit -m "type: short title

- what changed
- why it changed
- impact"
git push
```

See [`docs/git-workflow.md`](docs/git-workflow.md) for the full commit format.
