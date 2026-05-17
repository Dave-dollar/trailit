import { VENUE_INFO } from "../data/venue";

type CameraMode = "orbit" | "walk";

interface HUDProps {
  mode: CameraMode;
  placeMarkerMode: boolean;
  markerPanelOpen: boolean;
  markerCount: number;
  showLabels: boolean;
  showMarkers: boolean;
  hoverCoords: [number, number] | null;
  onToggleMode: () => void;
  onTogglePlaceMarker: () => void;
  onToggleMarkerPanel: () => void;
  onToggleLabels: () => void;
  onToggleMarkers: () => void;
}

const BASE_BTN: React.CSSProperties = {
  border: "1px solid rgba(50,110,200,0.4)",
  color: "#b8d8f4",
  padding: "5px 11px",
  borderRadius: 5,
  cursor: "pointer",
  fontFamily: "monospace",
  fontSize: 10,
  letterSpacing: "0.4px",
  transition: "background 0.12s",
};

function Btn({
  active, children, onClick, title, warn,
}: {
  active?: boolean; children: React.ReactNode;
  onClick: () => void; title?: string; warn?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        ...BASE_BTN,
        background: warn && active
          ? "rgba(160,80,0,0.82)"
          : active
          ? "rgba(0,90,180,0.75)"
          : "rgba(12,26,56,0.72)",
        borderColor: warn && active
          ? "rgba(230,140,0,0.55)"
          : active
          ? "rgba(60,140,230,0.55)"
          : "rgba(50,110,200,0.4)",
        color: warn && active ? "#ffdf80" : active ? "#cce8ff" : "#8aaecc",
      }}
    >
      {children}
    </button>
  );
}

export default function HUD({
  mode, placeMarkerMode, markerPanelOpen, markerCount,
  showLabels, showMarkers, hoverCoords,
  onToggleMode, onTogglePlaceMarker, onToggleMarkerPanel,
  onToggleLabels, onToggleMarkers,
}: HUDProps) {
  let hint = placeMarkerMode
    ? "Click the map to drop a note marker Â· Esc to cancel"
    : mode === "walk"
    ? "WASD / arrows to move Â· Shift to sprint Â· Click to lock mouse"
    : "Drag to orbit Â· Scroll to zoom Â· Click a lake for info";

  return (
    <>
      {/* â”€â”€ Top bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 50,
        background: "rgba(5,10,20,0.90)",
        borderBottom: "1px solid rgba(50,110,200,0.22)",
        display: "flex", alignItems: "center",
        padding: "0 16px", gap: 10,
        backdropFilter: "blur(10px)", zIndex: 10,
      }}>
        {/* Brand */}
        <span style={{
          color: "#ddeeff", fontFamily: "monospace",
          fontWeight: "bold", fontSize: 14, letterSpacing: 2,
        }}>SIVÃ˜LIA</span>
        <span style={{
          color: "#2e5878", fontFamily: "monospace", fontSize: 10, letterSpacing: 1,
        }}>{VENUE_INFO.name}</span>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "rgba(60,120,200,0.2)", marginLeft: 4 }} />

        {/* View toggles */}
        <Btn active={showLabels} onClick={onToggleLabels} title="Show/hide map labels">
          Labels
        </Btn>
        <Btn active={showMarkers} onClick={onToggleMarkers} title="Show/hide note pins">
          Pins
        </Btn>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Action buttons */}
        <Btn
          active={markerPanelOpen}
          onClick={onToggleMarkerPanel}
          title="Open notes panel"
        >
          ðŸ“‹ Notes{markerCount > 0 ? ` (${markerCount})` : ""}
        </Btn>

        <Btn
          active={placeMarkerMode}
          warn
          onClick={onTogglePlaceMarker}
          title={placeMarkerMode ? "Cancel â€” click to place marker" : "Drop a note marker"}
        >
          {placeMarkerMode ? "âœ• Cancel" : "ðŸ“ Add Note"}
        </Btn>

        <Btn
          active={mode === "walk"}
          onClick={onToggleMode}
          title="Toggle camera mode"
        >
          {mode === "orbit" ? "ðŸš¶ Walk" : "ðŸ”­ Orbit"}
        </Btn>
      </div>

      {/* â”€â”€ Bottom hint + coordinate readout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{
        position: "absolute", bottom: 14, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: 8, alignItems: "center",
        zIndex: 10, pointerEvents: "none",
      }}>
        <div style={{
          background: "rgba(5,10,20,0.75)",
          border: "1px solid rgba(50,110,200,0.2)",
          color: placeMarkerMode ? "#ffcc55" : "#446680",
          fontFamily: "monospace", fontSize: 9,
          padding: "4px 14px", borderRadius: 18,
          letterSpacing: "0.7px", whiteSpace: "nowrap",
        }}>
          {hint}
        </div>

        {/* Coordinate readout */}
        {hoverCoords && (
          <div style={{
            background: "rgba(5,10,20,0.80)",
            border: "1px solid rgba(50,110,200,0.2)",
            color: "#405868",
            fontFamily: "monospace", fontSize: 9,
            padding: "4px 10px", borderRadius: 18,
            letterSpacing: "0.6px", whiteSpace: "nowrap",
          }}>
            {hoverCoords[0].toFixed(1)}, {hoverCoords[1].toFixed(1)}
          </div>
        )}
      </div>
    </>
  );
}
