/**
 * Markers3D.tsx — 3D note marker pins.
 * Pass showMarkers=false to hide all pins without deleting them.
 */
import { useState } from "react";
import { Html } from "@react-three/drei";
import type { NoteMarker } from "../data/markers";

interface Markers3DProps {
  markers: NoteMarker[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  showMarkers: boolean;
}

function MarkerPin({
  marker, selected, onSelect,
}: {
  marker: NoteMarker;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const headColor = selected ? "#ffcc00" : hovered ? "#ffaa00" : "#ff8800";
  const stemColor = selected ? "#cc8800" : "#553300";
  const glow      = selected ? "#cc9900" : hovered ? "#996600" : "#774400";

  return (
    <group
      position={marker.position}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.09, 1.8, 5]} />
        <meshStandardMaterial color={stemColor} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.25, 10, 8]} />
        <meshStandardMaterial
          color={headColor}
          emissive={glow}
          emissiveIntensity={selected ? 0.9 : 0.4}
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 10]} />
        <meshStandardMaterial
          color={selected ? "#ffcc00" : "#aa5500"}
          transparent opacity={0.4}
        />
      </mesh>
      <Html position={[0, 2.7, 0]} center zIndexRange={[5, 6]}>
        <div style={{
          background: selected ? "rgba(110,70,0,0.92)" : "rgba(36,20,4,0.80)",
          color: selected ? "#ffe880" : "#ddaa60",
          padding: "2px 7px",
          borderRadius: 4,
          fontSize: 9,
          fontFamily: "monospace",
          whiteSpace: "nowrap",
          border: `1px solid ${selected ? "rgba(255,200,0,0.5)" : "rgba(160,100,0,0.3)"}`,
          pointerEvents: "none",
          letterSpacing: "0.4px",
        }}>
          📍 {marker.title}
        </div>
      </Html>
    </group>
  );
}

export default function Markers3D({ markers, selectedId, onSelect, showMarkers }: Markers3DProps) {
  if (!showMarkers) return null;
  return (
    <>
      {markers.map((m) => (
        <MarkerPin
          key={m.id}
          marker={m}
          selected={selectedId === m.id}
          onSelect={() => onSelect(m.id)}
        />
      ))}
    </>
  );
}
