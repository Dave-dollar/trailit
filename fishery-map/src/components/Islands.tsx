/**
 * Islands.tsx — Renders raised terrain patches for lake islands.
 *
 * These sit slightly above the terrain plane so they show through the
 * water mesh holes cut in Lake.tsx.
 */
import { useMemo } from "react";
import * as THREE from "three";
import LAKES from "../data/lakes";

function IslandPatch({ polygon }: { polygon: [number, number][] }) {
  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(polygon[0][0], polygon[0][1]);
    for (let i = 1; i < polygon.length; i++) {
      s.lineTo(polygon[i][0], polygon[i][1]);
    }
    s.closePath();
    const geo = new THREE.ShapeGeometry(s, 4);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [polygon]);

  return (
    <>
      {/* Island terrain */}
      <mesh geometry={geometry} position={[0, 0.12, 0]} receiveShadow>
        <meshStandardMaterial color="#3d5c2a" roughness={0.95} />
      </mesh>
      {/* Shoreline ring */}
      <mesh geometry={geometry} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#2a3c1c" roughness={1} />
      </mesh>
    </>
  );
}

export default function Islands() {
  return (
    <>
      {LAKES.flatMap((lake) =>
        lake.islands.map((island, i) => (
          <IslandPatch key={`${lake.id}-island-${i}`} polygon={island} />
        ))
      )}
    </>
  );
}
