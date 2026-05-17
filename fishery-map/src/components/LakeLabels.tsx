/**
 * LakeLabels.tsx — HTML overlay labels for lakes and POIs.
 *
 * Labels are positioned at fixed world-space anchors and rendered via
 * @react-three/drei's <Html> component into a DOM overlay.
 * Pass showLabels=false to hide all labels.
 */
import { Html } from "@react-three/drei";
import LAKES from "../data/lakes";
import type { LakeDef } from "../data/lakes";
import { POIS } from "../data/venue";

interface LakeLabelsProps {
  onSelect: (lake: LakeDef) => void;
  selectedId: string | null;
  showLabels: boolean;
}

export default function LakeLabels({ onSelect, selectedId, showLabels }: LakeLabelsProps) {
  if (!showLabels) return null;

  return (
    <>
      {/* ── Lake name labels ─────────────────────────────────────────── */}
      {LAKES.map((lake) => (
        <Html
          key={lake.id}
          position={[lake.center[0], 1.8, lake.center[2]]}
          center
          zIndexRange={[1, 2]}
        >
          <div
            onClick={() => onSelect(lake)}
            style={{
              cursor: "pointer",
              background: selectedId === lake.id
                ? "rgba(0,90,190,0.90)"
                : "rgba(8,18,36,0.78)",
              color: "#cce6ff",
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "monospace",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              border: `1px solid ${selectedId === lake.id
                ? "rgba(70,160,255,0.8)"
                : "rgba(40,100,170,0.35)"}`,
              boxShadow: selectedId === lake.id
                ? "0 0 12px rgba(0,120,255,0.4)"
                : "0 2px 6px rgba(0,0,0,0.5)",
              userSelect: "none",
              letterSpacing: "0.4px",
              transition: "all 0.15s",
            }}
          >
            {lake.info.name}
          </div>
        </Html>
      ))}

      {/* ── POI labels (Fennes Rd, Entrance, Car Park) ──────────────── */}
      {POIS.map((poi) => (
        <Html
          key={poi.id}
          position={[poi.position[0], 1.2, poi.position[1]]}
          center
          zIndexRange={[1, 2]}
        >
          <div
            style={{
              background: poi.icon === "road"
                ? "rgba(28,26,18,0.82)"
                : "rgba(8,18,36,0.75)",
              color: poi.icon === "road" ? "#ccc4a0" : "#a8cce8",
              padding: "2px 7px",
              borderRadius: 4,
              fontSize: 9,
              fontFamily: "monospace",
              whiteSpace: "nowrap",
              border: `1px solid ${poi.icon === "road"
                ? "rgba(160,140,60,0.3)"
                : "rgba(50,100,160,0.3)"}`,
              letterSpacing: "0.7px",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {poi.label}
          </div>
        </Html>
      ))}
    </>
  );
}
