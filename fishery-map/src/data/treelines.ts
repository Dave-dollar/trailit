/**
 * treelines.ts — Explicit tree belt definitions traced from the reference map.
 *
 * Each belt follows a polyline; trees are generated at `density` trees per
 * 10 world units with random perpendicular `spread`.
 *
 * HOW TO EDIT
 * ────────────
 * Adjust `path` to reposition a belt.
 * Increase `density` for a denser tree line.
 * Increase `spread` for a wider, looser band.
 * `seed` keeps the randomness deterministic across hot-reloads.
 */

export interface TreeBelt {
  id: string;
  /** Polyline the belt follows — [x, z] world coords. */
  path: [number, number][];
  /** Trees per 10 world units of path length. */
  density: number;
  /** Max perpendicular offset either side of the centre-line. */
  spread: number;
  minScale: number;
  maxScale: number;
  seed: number;
}

const TREE_BELTS: TreeBelt[] = [
  // ── Main Lake — north bank belt (densest — faces the North Field) ─────
  {
    id: "ml-north-a",
    path: [
      [-45, -37], [-39, -38], [-33, -38], [-27, -37],
      [-21, -35], [-15, -31], [-11, -28], [-8, -24],
    ],
    density: 9,
    spread: 3.2,
    minScale: 0.75,
    maxScale: 1.5,
    seed: 1001,
  },
  {
    id: "ml-north-b",
    path: [
      [-8, -24], [-6, -20], [-5, -15], [-4, -10],
    ],
    density: 5,
    spread: 2.2,
    minScale: 0.65,
    maxScale: 1.2,
    seed: 1002,
  },

  // ── Main Lake — west bank (the prominent "Tree Line" on reference map) ─
  {
    id: "ml-west",
    path: [
      [-45, -34], [-45, -28], [-44, -24], [-44, -20],
      [-43, -17], [-41, -14], [-38, -11], [-34, -8],
      [-31, -6],  [-27, -4],  [-23, -2],  [-20, 0],
    ],
    density: 8,
    spread: 3.0,
    minScale: 0.8,
    maxScale: 1.5,
    seed: 1003,
  },

  // ── Main Lake — south bank ─────────────────────────────────────────────
  {
    id: "ml-south",
    path: [
      [-17, 1], [-13, 1], [-10, 1], [-8, 1],
      [-6, -1], [-5, -4],
    ],
    density: 6,
    spread: 2.5,
    minScale: 0.65,
    maxScale: 1.3,
    seed: 1004,
  },

  // ── Main Lake — east bank (sparse — pegs access needed, road nearby) ──
  {
    id: "ml-east",
    path: [
      [-4, -10], [-5, -4], [-6, -1],
    ],
    density: 3,
    spread: 1.2,
    minScale: 0.55,
    maxScale: 0.95,
    seed: 1005,
  },

  // ── Northern Island Chain (in the narrow arm) ─────────────────────────
  {
    id: "ml-island-north",
    path: [
      [-44, -35], [-42, -36], [-40, -34], [-40, -31],
      [-42, -30], [-44, -32],
    ],
    density: 6,
    spread: 0.9,
    minScale: 0.45,
    maxScale: 0.85,
    seed: 1006,
  },
  {
    id: "ml-island-north2",
    path: [
      [-39, -33], [-37, -35], [-35, -34], [-35, -31],
      [-37, -29], [-40, -30],
    ],
    density: 5,
    spread: 0.8,
    minScale: 0.40,
    maxScale: 0.75,
    seed: 1007,
  },

  // ── Main Central Island ───────────────────────────────────────────────
  {
    id: "ml-island-central",
    path: [
      [-25, -12], [-25, -9],  [-24, -6],  [-19, -5],
      [-14, -5],  [-13, -8],  [-14, -11], [-17, -13],
      [-22, -13], [-25, -12],
    ],
    density: 7,
    spread: 1.4,
    minScale: 0.60,
    maxScale: 1.1,
    seed: 1008,
  },

  // ── South Island ──────────────────────────────────────────────────────
  {
    id: "ml-island-south",
    path: [
      [-20, -4], [-16, -6], [-12, -4], [-12, 0],
      [-16, 1],  [-20, -1], [-20, -4],
    ],
    density: 5,
    spread: 0.9,
    minScale: 0.50,
    maxScale: 0.90,
    seed: 1009,
  },

  // ── Hobbs Croft — full perimeter belt ─────────────────────────────────
  {
    id: "hc-perimeter-a",
    path: [
      [4, 0], [7, -1], [12, -1], [16, -1], [20, 1],
      [24, 4], [27, 8], [28, 12],
    ],
    density: 7,
    spread: 2.8,
    minScale: 0.7,
    maxScale: 1.3,
    seed: 2001,
  },
  {
    id: "hc-perimeter-b",
    path: [
      [28, 12], [27, 16], [23, 19], [18, 19],
      [13, 18], [9, 15], [8, 11], [6, 7], [4, 3],
    ],
    density: 7,
    spread: 2.8,
    minScale: 0.7,
    maxScale: 1.3,
    seed: 2002,
  },
  {
    id: "hc-island",
    path: [
      [5, 4], [7, 6], [10, 7], [11, 4], [9, 2], [7, 3],
    ],
    density: 5,
    spread: 0.7,
    minScale: 0.40,
    maxScale: 0.75,
    seed: 2003,
  },

  // ── East side of Fennes Rd (the "Tree Line" east label) ───────────────
  {
    id: "fennes-east-trees",
    path: [
      [6, -30], [7, -20], [7, -10], [6, 0],
    ],
    density: 5,
    spread: 2.0,
    minScale: 0.65,
    maxScale: 1.2,
    seed: 3001,
  },

  // ── North field boundary ──────────────────────────────────────────────
  {
    id: "hedge-north",
    path: [
      [-50, -48], [-30, -48], [-10, -46], [5, -46],
    ],
    density: 4,
    spread: 1.4,
    minScale: 0.7,
    maxScale: 1.4,
    seed: 3002,
  },

  // ── South field boundary ──────────────────────────────────────────────
  {
    id: "hedge-south",
    path: [
      [-50, 36], [-20, 34], [0, 32], [20, 30], [40, 30],
    ],
    density: 4,
    spread: 1.4,
    minScale: 0.7,
    maxScale: 1.4,
    seed: 3003,
  },

  // ── West field boundary ───────────────────────────────────────────────
  {
    id: "hedge-west",
    path: [
      [-62, -46], [-64, -20], [-64, 0], [-62, 24], [-62, 36],
    ],
    density: 4,
    spread: 1.2,
    minScale: 0.75,
    maxScale: 1.3,
    seed: 3004,
  },

  // ── East boundary ─────────────────────────────────────────────────────
  {
    id: "hedge-east",
    path: [
      [50, -44], [52, -20], [52, 0], [50, 20], [50, 30],
    ],
    density: 4,
    spread: 1.2,
    minScale: 0.7,
    maxScale: 1.3,
    seed: 3005,
  },
];

export default TREE_BELTS;
