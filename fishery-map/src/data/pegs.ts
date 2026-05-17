/**
 * pegs.ts — Fishing peg positions calibrated to the new lake geometry.
 *
 * Pegs run CLOCKWISE around each lake starting from peg 1 on the east
 * bank (nearest the road / car park).
 *
 * position: [x, z] — just outside the bank line.
 * faceAngle: degrees (0 = face south/+Z, 90 = face east/+X, 180 = face north).
 */

export interface PegDef {
  id: string;
  lakeId: string;
  number: number;
  position: [number, number];
  faceAngle: number;
}

const PEGS: PegDef[] = [
  // ── Main Lake — east bank (pegs face west into water) ────────────────
  { id: "ml-1",  lakeId: "main-lake", number:  1, position: [-3,  -8], faceAngle: 255 },
  { id: "ml-2",  lakeId: "main-lake", number:  2, position: [-3, -14], faceAngle: 250 },
  { id: "ml-3",  lakeId: "main-lake", number:  3, position: [-3, -19], faceAngle: 245 },
  // ── north bank going NW (pegs face south into water) ─────────────────
  { id: "ml-4",  lakeId: "main-lake", number:  4, position: [-8,  -23], faceAngle: 215 },
  { id: "ml-5",  lakeId: "main-lake", number:  5, position: [-13, -27], faceAngle: 200 },
  { id: "ml-6",  lakeId: "main-lake", number:  6, position: [-18, -30], faceAngle: 185 },
  { id: "ml-7",  lakeId: "main-lake", number:  7, position: [-24, -32], faceAngle: 175 },
  { id: "ml-8",  lakeId: "main-lake", number:  8, position: [-30, -33], faceAngle: 165 },
  { id: "ml-9",  lakeId: "main-lake", number:  9, position: [-36, -33], faceAngle: 155 },
  { id: "ml-10", lakeId: "main-lake", number: 10, position: [-41, -32], faceAngle: 143 },
  // ── west bank going south (pegs face east) ───────────────────────────
  { id: "ml-11", lakeId: "main-lake", number: 11, position: [-44, -24], faceAngle: 100 },
  { id: "ml-12", lakeId: "main-lake", number: 12, position: [-44, -18], faceAngle:  90 },
  { id: "ml-13", lakeId: "main-lake", number: 13, position: [-43, -12], faceAngle:  80 },
  { id: "ml-14", lakeId: "main-lake", number: 14, position: [-42,  -6], faceAngle:  70 },
  // ── south bank going east (pegs face north) ──────────────────────────
  { id: "ml-15", lakeId: "main-lake", number: 15, position: [-38,   0], faceAngle:  20 },
  { id: "ml-16", lakeId: "main-lake", number: 16, position: [-32,   3], faceAngle:   8 },
  { id: "ml-17", lakeId: "main-lake", number: 17, position: [-26,   3], faceAngle: 355 },
  { id: "ml-18", lakeId: "main-lake", number: 18, position: [-20,   2], faceAngle: 345 },
  { id: "ml-19", lakeId: "main-lake", number: 19, position: [-15,   0], faceAngle: 335 },

  // ── Hobbs Croft — clockwise from NW ──────────────────────────────────
  { id: "hc-1",  lakeId: "hobbs-croft", number:  1, position: [ 5,   1], faceAngle:  65 },
  { id: "hc-2",  lakeId: "hobbs-croft", number:  2, position: [11,  -1], faceAngle:  10 },
  { id: "hc-3",  lakeId: "hobbs-croft", number:  3, position: [17,  -1], faceAngle: 345 },
  { id: "hc-4",  lakeId: "hobbs-croft", number:  4, position: [24,   4], faceAngle: 300 },
  { id: "hc-5",  lakeId: "hobbs-croft", number:  5, position: [28,   9], faceAngle: 270 },
  { id: "hc-6",  lakeId: "hobbs-croft", number:  6, position: [29,  14], faceAngle: 250 },
  { id: "hc-7",  lakeId: "hobbs-croft", number:  7, position: [26,  18], faceAngle: 215 },
  { id: "hc-8",  lakeId: "hobbs-croft", number:  8, position: [20,  21], faceAngle: 185 },
  { id: "hc-9",  lakeId: "hobbs-croft", number:  9, position: [13,  20], faceAngle: 160 },
  { id: "hc-10", lakeId: "hobbs-croft", number: 10, position: [ 8,  16], faceAngle: 120 },
  { id: "hc-11", lakeId: "hobbs-croft", number: 11, position: [ 6,  10], faceAngle: 100 },
];

export default PEGS;
