/**
 * markers.ts — NoteMarker type definition.
 *
 * Markers are user-placed pins persisted to localStorage.
 * DEFAULT_MARKERS are used only on first load (empty localStorage).
 *
 * HOW TO PRE-SEED MARKERS
 * ────────────────────────
 * Add entries to DEFAULT_MARKERS. The app uses these as the initial
 * state when no saved data exists in the browser.
 *
 * ADDING PHOTOS
 * ─────────────
 * Set photoUrl to a full URL. The marker panel renders it inline.
 * To support uploads, add a file input in MarkerPanel.tsx and
 * upload to your storage service — no other changes needed.
 */

export interface NoteMarker {
  id: string;
  title: string;
  /** Which lake this marker is associated with, or null if general. */
  lakeName: string | null;
  /** World-space XYZ position (Y is always 0 on placement). */
  position: [number, number, number];
  notes: string;
  /** URL to a photo. Empty string = no photo. */
  photoUrl: string;
  /** ISO 8601 date — set automatically on creation. */
  createdAt: string;
}

/** Seed markers shown on first load. Update positions to match real pegs. */
export const DEFAULT_MARKERS: NoteMarker[] = [
  {
    id: "demo-1",
    title: "Good spod spot — 60 yds",
    lakeName: "Main Lake",
    position: [-20, 0, -14],
    notes:
      "Gravel bar at ~60 yards from peg area. Carp showing here at dusk. Best on a bottom bait tipped with plastic corn.",
    photoUrl: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Island margin — NW cast",
    lakeName: "Main Lake",
    position: [-30, 0, -20],
    notes:
      "Tight to the north-west side of the Central Island. Shallow margin — about 3 ft. Crucians and tench come through at dawn.",
    photoUrl: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    title: "Hobbs Croft — east peg area",
    lakeName: "Hobbs Croft Lake",
    position: [22, 0, 8],
    notes:
      "Deep east bank — 6 ft+ at 25 yds. Skimmers active on the method feeder. Try a small green pellet.",
    photoUrl: "",
    createdAt: new Date().toISOString(),
  },
];
