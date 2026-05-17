/**
 * lakes.ts — Lake geometry derived from the 1:1 scale reference map.
 *
 * ══════════════════════════════════════════════════════════════════
 * COORDINATE SYSTEM
 * ══════════════════════════════════════════════════════════════════
 *  Plane  : XZ  (Y = up, Y = 0 = ground level)
 *  Scale  : 1 world unit = 5 metres real world
 *  Origin : Entrance / Access Track junction with Fennes Rd = (0, 0)
 *  +X     = East   (toward Hobbs Croft)
 *  −X     = West   (toward Main Lake)
 *  −Z     = North  (toward the North Field)
 *  +Z     = South  (toward the South Field / Car Park)
 *
 *  Derived from the 1:1 scale reference satellite map.
 *  Scale bar calibration: 100 m ≈ 249 px → 1 world unit ≈ 12.5 px.
 *
 * ══════════════════════════════════════════════════════════════════
 * HOW TO EDIT
 * ══════════════════════════════════════════════════════════════════
 *  • Outer polygon  = CLOCKWISE   [x, z] pairs
 *  • Island holes   = COUNTER-CLOCKWISE [x, z] pairs
 *    (Three.js punches CCW paths as holes in the water mesh)
 *  • Edit any named constant below — Vite hot-reloads instantly.
 *
 * HOW TO ADD A NEW LAKE
 * ══════════════════════════════════════════════════════════════════
 *  1. Copy a LakeDef block, give it a unique id.
 *  2. Define polygon + islands (empty array if none).
 *  3. Add it to the LAKES array.
 *  4. Add matching pegs in pegs.ts.
 */

export interface LakeInfo {
  id: string;
  name: string;
  species: string[];
  description: string;
  totalPegs: number;
  recordWeight?: string;
}

export interface LakeDef {
  id: string;
  /** Outer boundary — [x, z] pairs, CLOCKWISE when viewed from above. */
  polygon: [number, number][];
  /**
   * Island holes — each is a [x, z] array wound COUNTER-CLOCKWISE.
   * They appear as raised terrain visible through holes in the water mesh.
   */
  islands: [number, number][][];
  /** World-space centre for the lake label and info-panel anchor. */
  center: [number, number, number];
  info: LakeInfo;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN LAKE
//
// Long diagonal lake running NW → SE.
// NW end = narrow arm / channel.  Main body widens to the SE.
// Three islands: Northern Chain/Reeds (in arm), Main Central, South Island.
//
// All points pixel-traced from the 1:1 scale reference map.
// Adjust individual [x, z] vertices to fine-tune bank accuracy.
// ─────────────────────────────────────────────────────────────────────────────

export const mainLakePolygon: [number, number][] = [
  // ── NW tip (narrow arm) ─────────────────────────── move to extend arm
  [-45, -37],
  // ── North bank of narrow arm (going east) ──────────────────────────────
  [-39, -38],  // N arm bank
  [-33, -38],  // N arm bank mid
  [-27, -37],  // arm opening into main body
  // ── Main body — north bank (heading SE toward Fennes Rd) ───────────────
  [-21, -35],  // N bank
  [-15, -31],  // N bank
  [-11, -28],  // N bank NE
  [ -8, -24],  // NE
  [ -6, -20],  // E upper (near Fennes Rd)
  [ -5, -15],  // E bank
  [ -4, -10],  // E bank lower
  // ── SE taper (closest point to the road) ───────────────────────────────
  [ -5,  -4],  // SE corner upper
  [ -6,  -1],  // SE corner
  // ── South bank (heading west) ──────────────────────────────────────────
  [ -8,   1],  // S bank start  ← adjust eastward to widen SE tail
  [-10,   1],  // S
  [-13,   1],  // S
  [-17,   1],  // S
  [-20,   0],  // S-W transition
  [-23,  -2],  // SW
  [-27,  -4],  // W lower
  [-31,  -6],  // W
  [-34,  -8],  // W
  [-38, -11],  // W upper
  // ── West bank (heading north) ──────────────────────────────────────────
  [-41, -14],  // W bank
  [-43, -17],  // W bank
  [-44, -20],  // W bank upper
  [-44, -24],  // W of narrow arm
  // ── South bank of narrow arm ───────────────────────────────────────────
  [-45, -28],  // SW narrow arm
  [-45, -32],  // S bank arm
  [-45, -34],  // close to NW tip
];

export const mainLakeIslands: [number, number][][] = [
  // ── Northern Island Chain / Reeds — west clump (CCW) ──────────────────
  // Located in the narrow NW arm of the lake.
  // Adjust Z values to move further into the arm.
  [
    [-44, -32],
    [-42, -30],
    [-40, -31],
    [-40, -34],
    [-42, -36],
    [-44, -35],
  ],
  // ── Northern Island Chain — east clump (CCW) ───────────────────────────
  [
    [-40, -30],
    [-37, -29],
    [-35, -31],
    [-35, -34],
    [-37, -35],
    [-39, -33],
  ],
  // ── Main Central Island (CCW) ─────────────────────────────────────────
  // The large treed island in the centre of the main body.
  // Pixel origin of island: roughly (–24, –10) in world coords.
  [
    [-25,  -9],
    [-24,  -6],
    [-19,  -5],
    [-14,  -5],
    [-13,  -8],
    [-14, -11],
    [-17, -13],
    [-22, -13],
    [-25, -12],
  ],
  // ── South Island (CCW) ────────────────────────────────────────────────
  // Smaller island below and east of the Central Island.
  [
    [-16,  -6],
    [-12,  -4],
    [-12,   0],
    [-16,   1],
    [-20,  -1],
    [-20,  -4],
  ],
];

// ─────────────────────────────────────────────────────────────────────────────
// HOBBS CROFT LAKE
//
// Compact irregular lake south-east of the entrance junction.
// Its NW corner is closest to Fennes Rd.
// ─────────────────────────────────────────────────────────────────────────────

export const hobbsCroftPolygon: [number, number][] = [
  // ── NW corner (closest to Fennes Rd) ──────────────────────────────────
  [  4,   0],
  // ── North bank ────────────────────────────────────────────────────────
  [  7,  -1],
  [ 12,  -1],
  [ 16,  -1],  // NE shelf
  // ── East bank ─────────────────────────────────────────────────────────
  [ 20,   1],
  [ 24,   4],
  [ 27,   8],
  [ 28,  12],  // E mid
  // ── SE corner ─────────────────────────────────────────────────────────
  [ 27,  16],
  // ── South bank ────────────────────────────────────────────────────────
  [ 23,  19],
  [ 18,  19],
  // ── SW bank ───────────────────────────────────────────────────────────
  [ 13,  18],
  [  9,  15],
  // ── West bank ─────────────────────────────────────────────────────────
  [  8,  11],
  [  6,   7],
  [  4,   3],  // back to NW
];

export const hobbsCroftIslands: [number, number][][] = [
  // Small island / peninsula on the inner NW of Hobbs Croft (CCW)
  [
    [  7,   3],
    [  9,   2],
    [ 11,   4],
    [ 10,   7],
    [  7,   6],
    [  5,   4],
  ],
];

// ─────────────────────────────────────────────────────────────────────────────
// LAKES ARRAY — imported by Scene, LakeLabels, Trees, Pegs, etc.
// ─────────────────────────────────────────────────────────────────────────────
const LAKES: LakeDef[] = [
  {
    id: "main-lake",
    polygon: mainLakePolygon,
    islands: mainLakeIslands,
    center: [-25, 0, -17],
    info: {
      id: "main-lake",
      name: "Main Lake",
      species: ["Common Carp", "Mirror Carp", "Tench", "Bream"],
      description:
        "Large elongated carp lake running NW to SE. The narrow NW arm holds the Northern Island Chain / Reeds feature. Three islands in the main body. Dense mature tree belt all round. Night tickets by prior arrangement.",
      totalPegs: 30,
      recordWeight: "42 lb 6 oz",
    },
  },
  {
    id: "hobbs-croft",
    polygon: hobbsCroftPolygon,
    islands: hobbsCroftIslands,
    center: [16, 0, 9],
    info: {
      id: "hobbs-croft",
      name: "Hobbs Croft Lake",
      species: ["F1 Carp", "Skimmers", "Crucians", "Roach"],
      description:
        "Compact day-ticket match water south-east of the entrance. Good depth on the east bank. Fishes well on the method feeder and pellet waggler throughout the season.",
      totalPegs: 18,
      recordWeight: "14 lb 4 oz",
    },
  },
];

export default LAKES;
