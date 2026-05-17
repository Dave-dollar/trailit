/**
 * Trees.tsx — Low-poly trees planted along the explicit tree belts
 * defined in treelines.ts.
 *
 * Trees are generated once at startup from the belt definitions —
 * zero per-frame cost. Increase belt `density` values in treelines.ts
 * to add more trees to a specific bank.
 */
import { useMemo } from "react";
import TREE_BELTS from "../data/treelines";
import type { TreeBelt } from "../data/treelines";

// ── Seeded deterministic RNG ─────────────────────────────────────────────────
function seededRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface TreeInstance {
  x: number; z: number; scale: number; rotation: number;
}

// ── Generate trees along a polyline ──────────────────────────────────────────
function generateAlongPath(belt: TreeBelt): TreeInstance[] {
  const { path, density, spread, minScale, maxScale, seed } = belt;
  const rng = seededRng(seed);
  const trees: TreeInstance[] = [];

  for (let seg = 0; seg < path.length - 1; seg++) {
    const [ax, az] = path[seg];
    const [bx, bz] = path[seg + 1];
    const dx = bx - ax;
    const dz = bz - az;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len < 0.001) continue;

    // Normal (perpendicular to segment direction)
    const nx = -dz / len;
    const nz =  dx / len;

    const count = Math.max(1, Math.round((len / 10) * density));
    for (let i = 0; i < count; i++) {
      const t = rng();
      const px = ax + dx * t;
      const pz = az + dz * t;
      // Spread either side
      const off = (rng() * 2 - 1) * spread;
      trees.push({
        x: px + nx * off,
        z: pz + nz * off,
        scale: minScale + rng() * (maxScale - minScale),
        rotation: rng() * Math.PI * 2,
      });
    }
  }
  return trees;
}

// ── Low-poly tree geometry ────────────────────────────────────────────────────
function LowPolyTree({ x, z, scale, rotation }: TreeInstance) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.22, 1.3, 5]} />
        <meshStandardMaterial color="#5a3c1a" roughness={1} />
      </mesh>
      {/* Lower canopy */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[1.55, 2.4, 6]} />
        <meshStandardMaterial color="#2e5c1c" roughness={0.85} flatShading />
      </mesh>
      {/* Mid canopy */}
      <mesh position={[0, 3.6, 0]} castShadow>
        <coneGeometry args={[1.05, 1.9, 6]} />
        <meshStandardMaterial color="#387020" roughness={0.85} flatShading />
      </mesh>
      {/* Top canopy */}
      <mesh position={[0, 4.7, 0]} castShadow>
        <coneGeometry args={[0.6,  1.3, 5]} />
        <meshStandardMaterial color="#468226" roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Trees() {
  const allTrees = useMemo(
    () => TREE_BELTS.flatMap(generateAlongPath),
    []
  );

  return (
    <>
      {allTrees.map((tree, i) => (
        <LowPolyTree key={i} {...tree} />
      ))}
    </>
  );
}
