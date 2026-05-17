/**
 * Fields.tsx — Surrounding field patches, hedgerows, and car park surface.
 * All purely cosmetic. Adjust FIELD_PATCHES / HEDGES to reposition.
 */

interface Patch {
  x: number; z: number; w: number; d: number; color: string;
}
interface Hedge {
  x: number; z: number; w: number; d: number; h: number;
}

// Agricultural field patches — sized to match the reference map regions
const FIELD_PATCHES: Patch[] = [
  // North Field (above the lakes and road, right side)
  { x:  12, z: -36, w: 24, d: 10, color: "#4e6e36" },
  // West Field (large brown/tan arable field, west side)
  { x: -58, z: -18, w: 14, d: 30, color: "#8a7050" },  // ploughed
  { x: -58, z:  12, w: 14, d: 18, color: "#7a6848" },  // ploughed 2
  // Open Grass Meadow (east of road, north of Hobbs Croft)
  { x:  30, z: -18, w: 18, d: 22, color: "#5a7840" },
  // South Field (below car park)
  { x:  -8, z:  28, w: 28, d: 10, color: "#507038" },
  // Fields further south / SE
  { x:  28, z:  26, w: 18, d: 12, color: "#4e6c35" },
  { x: -36, z:  30, w: 18, d: 10, color: "#527040" },
  // Far east
  { x:  52, z:   4, w: 12, d: 30, color: "#4a6830" },
  // Far north
  { x: -20, z: -50, w: 30, d: 10, color: "#527240" },
];

// Car park / building surface
const CAR_PARK: Patch[] = [
  { x: -6, z: 4, w: 6, d: 5, color: "#505048" },  // gravel surface
];

const HEDGES: Hedge[] = [
  { x: -62, z: -10, w: 1.2, d: 56, h: 2.2 },  // west boundary
  { x: -18, z: -44, w: 56,  d: 1.2, h: 1.8 },  // north boundary
  { x:  48, z:   4, w: 1.2, d: 44,  h: 2.0 },  // east boundary
  { x:   4, z:  34, w: 76,  d: 1.2, h: 1.8 },  // south boundary
  // Internal hedge between North Field and meadow
  { x:  10, z: -22, w: 1.2, d: 16,  h: 1.6 },
];

function FlatPatch({ x, z, w, d, color }: Patch) {
  return (
    <mesh position={[x, -0.01, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[w * 2, d * 2]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}

function HedgeRow({ x, z, w, d, h }: Hedge) {
  return (
    <mesh position={[x, h / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color="#243812" roughness={0.9} flatShading />
    </mesh>
  );
}

export default function Fields() {
  return (
    <>
      {FIELD_PATCHES.map((p, i) => <FlatPatch key={`f${i}`} {...p} />)}
      {CAR_PARK.map((p, i) => <FlatPatch key={`cp${i}`} {...p} />)}
      {HEDGES.map((h, i) => <HedgeRow key={`h${i}`} {...h} />)}
    </>
  );
}
