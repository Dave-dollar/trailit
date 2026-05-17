import type { LakeDef } from "../data/lakes";

interface InfoPanelProps {
  lake: LakeDef | null;
  onClose: () => void;
}

export default function InfoPanel({ lake, onClose }: InfoPanelProps) {
  if (!lake) return null;

  const { info } = lake;

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        right: 20,
        width: 300,
        background: "rgba(8, 16, 32, 0.92)",
        border: "1px solid rgba(60,140,220,0.4)",
        borderRadius: 10,
        padding: "20px 22px",
        color: "#c8e8ff",
        fontFamily: "monospace",
        boxShadow: "0 4px 32px rgba(0,80,200,0.25)",
        backdropFilter: "blur(8px)",
        zIndex: 10,
        animation: "fadeSlideIn 0.2s ease",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          background: "none",
          border: "none",
          color: "#6698cc",
          cursor: "pointer",
          fontSize: 18,
          lineHeight: 1,
        }}
        title="Close"
      >
        ×
      </button>

      <div
        style={{
          fontSize: 11,
          color: "#4488bb",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        Water Info
      </div>

      <h2
        style={{
          margin: "0 0 12px",
          fontSize: 18,
          color: "#e8f4ff",
          fontWeight: "bold",
        }}
      >
        {info.name}
      </h2>

      <p
        style={{
          margin: "0 0 14px",
          fontSize: 12,
          lineHeight: 1.6,
          color: "#99bedd",
        }}
      >
        {info.description}
      </p>

      <Row label="Species" value={info.species.join(", ")} />
      <Row label="Pegs" value={String(info.totalPegs)} />
      {info.recordWeight && (
        <Row label="Record" value={info.recordWeight} />
      )}

      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: "1px solid rgba(60,120,200,0.25)",
          fontSize: 11,
          color: "#4488bb",
        }}
      >
        Click the water surface or label to select a lake.
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 6,
        fontSize: 12,
      }}
    >
      <span style={{ color: "#4488bb" }}>{label}</span>
      <span style={{ color: "#c8e8ff", textAlign: "right", maxWidth: 180 }}>{value}</span>
    </div>
  );
}
