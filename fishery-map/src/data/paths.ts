/**
 * paths.ts — Road and track geometry traced from the 1:1 reference map.
 *
 * Fennes Rd runs roughly N–S, passing just east of Main Lake's SE corner.
 * It sits at X ≈ 0–3, curving slightly.
 * The access track branches west from the junction at (0, 0).
 *
 * Width is in world units (1 unit ≈ 5 m).
 */

export interface PathDef {
  id: string;
  label: string;
  showRoadLabel?: boolean;
  points: [number, number][];
  width: number;
  color: string;
}

const PATHS: PathDef[] = [
  // ── Fennes Rd — north section ─────────────────────────────────────────
  // Enters from the North Field, slight east lean at the top.
  {
    id: "fennes-north",
    label: "Fennes Rd",
    showRoadLabel: true,
    points: [
      [ 3, -41],  // north entry
      [ 3, -33],
      [ 3, -24],
      [ 2, -17],
      [ 1,  -8],
      [ 0,   0],  // entrance junction
    ],
    width: 3.2,
    color: "#686050",
  },
  // ── Fennes Rd — south section ─────────────────────────────────────────
  {
    id: "fennes-south",
    label: "Fennes Rd",
    showRoadLabel: true,
    points: [
      [ 0,   0],  // entrance junction
      [-2,   7],
      [-3,  13],
      [-4,  20],
      [-5,  28],
    ],
    width: 3.2,
    color: "#686050",
  },
  // ── Access track — Fennes Rd junction to Car Park ─────────────────────
  {
    id: "access-east",
    label: "Access Track",
    points: [
      [ 0,  0],
      [-3,  1],
      [-7,  2],
      [-10, 3],  // car-park entrance
    ],
    width: 2.8,
    color: "#5c4c30",
  },
  // ── Car-park internal track (continues west to the building) ──────────
  {
    id: "access-south",
    label: "Car Park Track",
    points: [
      [-7,  2],
      [-7,  6],
      [-7, 12],  // second car-park / building area
    ],
    width: 2.4,
    color: "#5c4c30",
  },
  // ── North bank track — follows north shore of Main Lake ───────────────
  {
    id: "north-bank",
    label: "North Bank",
    points: [
      [-10,  3],
      [-12, -4],
      [-17, -14],
      [-26, -22],
      [-36, -28],
      [-44, -30],
    ],
    width: 1.6,
    color: "#4e3e22",
  },
  // ── South bank track — follows south shore of Main Lake ───────────────
  {
    id: "south-bank",
    label: "South Bank",
    points: [
      [-10,  3],
      [-13,  8],
      [-20,  9],
      [-30,  8],
      [-40,  4],
      [-44,  0],
    ],
    width: 1.6,
    color: "#4e3e22",
  },
  // ── Hobbs Croft approach track ────────────────────────────────────────
  {
    id: "hobbs-track",
    label: "Hobbs Croft Track",
    points: [
      [ 0,  4],
      [ 3,  3],
      [ 5,  2],  // reaches NW corner of Hobbs Croft
    ],
    width: 1.8,
    color: "#4e3e22",
  },
];

export default PATHS;
