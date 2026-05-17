/**
 * VenueMarkers.tsx — Fixed venue POI posts (Entrance, Car Park).
 * Road-sign POIs are rendered as labels only in LakeLabels.tsx.
 */
import { useState } from "react";
import { Html } from "@react-three/drei";
import { POIS } from "../data/venue";

export default function VenueMarkers() {
  const [hovered, setHovered] = useState<string | null>(null);

  // Only render physical posts for non-road POIs
  const physicalPois = POIS.filter((p) => p.icon !== "road");

  return (
    <>
      {physicalPois.map((poi) => (
        <group key={poi.id} position={[poi.position[0], 0, poi.position[1]]}>
          {/* Post */}
          <mesh
            position={[0, 0.8, 0]}
            castShadow
            onPointerOver={() => setHovered(poi.id)}
            onPointerOut={() => setHovered(null)}
          >
            <cylinderGeometry args={[0.12, 0.14, 1.6, 6]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Sign board */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <boxGeometry args={[0.7, 0.45, 0.08]} />
            <meshStandardMaterial
              color={hovered === poi.id ? "#0a3a80" : "#0f3460"}
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>
          <Html position={[0, 2.5, 0]} center zIndexRange={[1, 2]}>
            <div
              style={{
                background: hovered === poi.id
                  ? "rgba(0,140,255,0.88)"
                  : "rgba(10,24,52,0.82)",
                color: "#d0eaff",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 10,
                fontFamily: "monospace",
                whiteSpace: "nowrap",
                border: "1px solid rgba(80,140,220,0.3)",
                transition: "background 0.15s",
                pointerEvents: "none",
              }}
            >
              {poi.label}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}
