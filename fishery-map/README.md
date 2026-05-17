# Sivølia Fishery — 3D Venue Map

A browser-based 3D digital-twin prototype of the Fennes Farm Fishery (Main Lake + Hobbs Croft Lake), built with **React + Vite + TypeScript + Three.js / React Three Fiber**.

---

## Running Locally

```bash
cd fishery-map
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Project Structure

```
src/
  data/
    lakes.ts     — lake polygons, island polygons, names, info panel content
    pegs.ts      — fishing peg positions and facing angles
    paths.ts     — Fennes Rd + venue access tracks
    channels.ts  — narrow connecting water channels / ditches
    venue.ts     — venue metadata and POI markers
    markers.ts   — NoteMarker type + default seed markers
  components/
    Scene.tsx         — root Three.js scene (lights, fog, all objects)
    Terrain.tsx       — flat grass ground plane + click-to-place handler
    Lake.tsx          — water surface polygon with island holes + click
    Islands.tsx       — raised terrain patches for lake islands
    Paths.tsx         — road / track strip meshes
    WaterChannels.tsx — narrow connecting water strips
    Fields.tsx        — surrounding agricultural field patches + hedges
    Trees.tsx         — low-poly tree clusters around lake banks
    Pegs.tsx          — fishing peg post + disc markers
    VenueMarkers.tsx  — POI posts (Entrance, Car Park)
    LakeLabels.tsx    — HTML labels: lake names, Fennes Rd, POIs
    Markers3D.tsx     — 3D note marker pins
    MarkerPanel.tsx   — left-side note editing panel
    WalkController.tsx — first-person WASD walk controls
    HUD.tsx           — top bar with mode, notes, place-marker controls
    InfoPanel.tsx     — right-side lake info panel
```

---

## How to Edit Lake Shapes

Open [src/data/lakes.ts](src/data/lakes.ts). The exported constants are:

| Constant | Description |
|---|---|
| `mainLakePolygon` | Outer boundary of Main Lake — `[x, z]` pairs, clockwise |
| `mainLakeIslands` | Array of island polygons — `[x, z]` pairs, **counter-clockwise** |
| `hobbsCroftPolygon` | Outer boundary of Hobbs Croft Lake |
| `hobbsCroftIslands` | Island polygons for Hobbs Croft |

**Coordinate system:** `1 unit ≈ 5 metres`. The scene origin (0, 0) is at the Fennes Rd / venue-entrance junction. `X` increases eastward, `Z` increases southward.

**Island winding:** islands must be wound **counter-clockwise** — this is what tells Three.js to punch a hole in the water mesh rather than fill it.

```ts
// To add a new island to Main Lake:
export const mainLakeIslands: [number, number][][] = [
  // ... existing islands ...
  [
    // counter-clockwise vertices of new island
    [x4, z4], [x3, z3], [x2, z2], [x1, z1],
  ],
];
```

**To add a brand new lake**, copy a `LakeDef` block in the `LAKES` array at the bottom of `lakes.ts`, give it a unique `id`, and add matching pegs in `pegs.ts`.

---

## How to Add / Move Pegs

Open [src/data/pegs.ts](src/data/pegs.ts):

```ts
{
  id: "ml-15",       // unique string
  lakeId: "main-lake", // must match a lake's id
  number: 15,
  position: [-30, -28], // [x, z] world coords
  faceAngle: 175,       // degrees (0 = face +Z, 90 = face +X)
}
```

---

## How to Add / Edit Roads and Paths

Open [src/data/paths.ts](src/data/paths.ts). Each entry is a polyline extruded to `width` units. Fennes Rd is split into north and south segments so both get a road label.

---

## How to Update the Info Panel

Edit the `info` property inside each `LakeDef` in `lakes.ts`:

```ts
info: {
  name: "Main Lake",
  species: ["Common Carp", "Mirror Carp"],
  description: "…",
  totalPegs: 30,
  recordWeight: "42 lb 6 oz",
}
```

---

## Note Markers (Drop-Pin System)

### Placing a marker
1. Click **"📍 Add Note"** in the top bar.
2. The cursor changes to a crosshair.
3. Click anywhere on the terrain to drop the pin.
4. The Notes panel opens automatically.
5. Edit the title, notes, lake name, and (optionally) a photo URL.

### Editing an existing marker
- Click **"📋 Notes"** to open the notes panel.
- Click any marker in the list to open its edit form.
- Changes save automatically when you blur a field.
- Click a 3D pin on the map to jump straight to its edit form.

### Persistence
Markers are saved to `localStorage` in the browser. They survive page reloads. To clear all markers, open browser DevTools → Application → Local Storage → delete the `sivolia-fishery-markers` key.

### Adding a photo
Paste a full URL into the **Photo URL** field (e.g. from Dropbox, Google Photos share link, or a local web server). The image renders inline in the marker panel.

### Pre-seeding markers
Add entries to `DEFAULT_MARKERS` in [src/data/markers.ts](src/data/markers.ts). These are used only when `localStorage` is empty (first load / after clearing).

---

## Camera Modes

| Mode | Controls |
|---|---|
| **Orbit** (default) | Drag to rotate · Scroll to zoom · Click a lake to view info |
| **Walk** | Click canvas to lock mouse · WASD / arrow keys to move · Shift to sprint · toggle in top-right |

---

## Adding Venue POI Markers (Entrance, Car Park, etc.)

Edit `POIS` in [src/data/venue.ts](src/data/venue.ts):

```ts
{ id: "toilets", label: "Toilets", icon: "toilet", position: [-6, 3] }
```

Available icon keys: `entrance`, `carpark`, `toilet`, `tackle`, `cafe`, `road`.
`road` type renders as a label only (no 3D post).

---

## Future Photo Upload Integration

The `photoUrl` field in `NoteMarker` is a string URL placeholder. To integrate real uploads:

1. Add a file input in `MarkerPanel.tsx` alongside the URL field.
2. On file select, upload to your storage service (S3, Cloudflare R2, Supabase, etc.) and set `photoUrl` to the returned URL.
3. No other changes are needed — the image rendering is already in place.

---

## Performance Notes

- Trees are generated once at startup from lake polygon math — zero per-frame cost.
- Water animation uses one `useFrame` listener per lake (minimal overhead).
- Shadow map is 2048×2048. Reduce to 1024 in `Scene.tsx` for lower-end hardware.
- HTML labels (`<Html>`) render in a DOM overlay — not inside WebGL.
