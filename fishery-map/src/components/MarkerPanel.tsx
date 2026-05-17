/**
 * MarkerPanel.tsx — Slide-in left panel for viewing and editing note markers.
 *
 * Shows a list of all markers. Selecting one opens an edit form.
 * All changes are passed back up via onUpdate / onDelete.
 */
import { useState, useEffect } from "react";
import type { NoteMarker } from "../data/markers";

interface MarkerPanelProps {
  markers: NoteMarker[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (marker: NoteMarker) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const PANEL_W = 300;

// ── Shared style tokens ────────────────────────────────────────────────────
const S = {
  panel: {
    position: "absolute" as const,
    top: 56,
    left: 0,
    bottom: 0,
    width: PANEL_W,
    background: "rgba(6, 12, 24, 0.94)",
    borderRight: "1px solid rgba(60,120,220,0.25)",
    display: "flex",
    flexDirection: "column" as const,
    fontFamily: "monospace",
    color: "#c8e8ff",
    backdropFilter: "blur(8px)",
    zIndex: 10,
    overflowY: "hidden" as const,
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(60,120,220,0.2)",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  title: { fontSize: 13, fontWeight: "bold" as const, color: "#e0f0ff", flex: 1 },
  closeBtn: {
    background: "none", border: "none", color: "#446688",
    fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 2,
  },
  list: { overflowY: "auto" as const, flex: 1 },
  item: (active: boolean): React.CSSProperties => ({
    padding: "10px 16px",
    borderBottom: "1px solid rgba(40,80,140,0.2)",
    cursor: "pointer",
    background: active ? "rgba(0,80,180,0.2)" : "transparent",
    transition: "background 0.15s",
  }),
  itemTitle: { fontSize: 12, fontWeight: "bold" as const, color: "#c8e8ff" },
  itemMeta:  { fontSize: 10, color: "#4488aa", marginTop: 2 },
  empty: { padding: "24px 16px", fontSize: 12, color: "#446688", textAlign: "center" as const },
  form: {
    padding: "12px 16px",
    borderTop: "1px solid rgba(60,120,220,0.2)",
    overflowY: "auto" as const,
    flex: 1,
  },
  label: { fontSize: 10, color: "#4488aa", letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 3 },
  input: {
    width: "100%",
    background: "rgba(20,40,80,0.5)",
    border: "1px solid rgba(60,120,200,0.3)",
    borderRadius: 4,
    color: "#c8e8ff",
    fontFamily: "monospace",
    fontSize: 12,
    padding: "5px 8px",
    marginBottom: 12,
    boxSizing: "border-box" as const,
    outline: "none",
  },
  textarea: {
    width: "100%",
    background: "rgba(20,40,80,0.5)",
    border: "1px solid rgba(60,120,200,0.3)",
    borderRadius: 4,
    color: "#c8e8ff",
    fontFamily: "monospace",
    fontSize: 12,
    padding: "5px 8px",
    marginBottom: 12,
    boxSizing: "border-box" as const,
    outline: "none",
    resize: "vertical" as const,
    minHeight: 72,
  },
  btnRow: { display: "flex", gap: 8, marginTop: 4 },
  btnBack: {
    flex: 1,
    background: "rgba(20,40,80,0.6)",
    border: "1px solid rgba(60,120,200,0.3)",
    color: "#88aad0",
    padding: "6px 0",
    borderRadius: 5,
    cursor: "pointer",
    fontFamily: "monospace",
    fontSize: 11,
  },
  btnDel: {
    flex: 1,
    background: "rgba(80,20,20,0.6)",
    border: "1px solid rgba(200,60,60,0.3)",
    color: "#e08080",
    padding: "6px 0",
    borderRadius: 5,
    cursor: "pointer",
    fontFamily: "monospace",
    fontSize: 11,
  },
  coords: { fontSize: 10, color: "#335566", marginBottom: 12 },
} as const;

export default function MarkerPanel({
  markers,
  selectedId,
  onSelect,
  onUpdate,
  onDelete,
  onClose,
}: MarkerPanelProps) {
  const selected = markers.find((m) => m.id === selectedId) ?? null;
  const [draft, setDraft] = useState<NoteMarker | null>(null);

  // Sync draft when selection changes
  useEffect(() => {
    setDraft(selected ? { ...selected } : null);
  }, [selectedId, selected]);

  function save() {
    if (draft) onUpdate(draft);
  }

  function handleBack() {
    if (draft && selected) onUpdate(draft);
    onSelect(null);
  }

  return (
    <div style={S.panel}>
      {/* Header */}
      <div style={S.header}>
        {draft ? (
          <button style={S.closeBtn} onClick={handleBack} title="Back to list">‹</button>
        ) : null}
        <span style={S.title}>
          {draft ? "Edit Note" : `Notes (${markers.length})`}
        </span>
        <button style={S.closeBtn} onClick={onClose} title="Close panel">×</button>
      </div>

      {/* Detail / edit form */}
      {draft ? (
        <div style={S.form}>
          <div style={S.coords}>
            {draft.position[0].toFixed(1)}, {draft.position[2].toFixed(1)} (world XZ)
          </div>

          <div style={S.label}>Title</div>
          <input
            style={S.input}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            onBlur={save}
          />

          <div style={S.label}>Lake / Location</div>
          <input
            style={S.input}
            value={draft.lakeName ?? ""}
            placeholder="e.g. Main Lake"
            onChange={(e) => setDraft({ ...draft, lakeName: e.target.value || null })}
            onBlur={save}
          />

          <div style={S.label}>Notes</div>
          <textarea
            style={S.textarea}
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            onBlur={save}
          />

          <div style={S.label}>Photo URL</div>
          <input
            style={S.input}
            value={draft.photoUrl}
            placeholder="https://… or leave blank"
            onChange={(e) => setDraft({ ...draft, photoUrl: e.target.value })}
            onBlur={save}
          />

          {draft.photoUrl && (
            <img
              src={draft.photoUrl}
              alt="marker photo"
              style={{
                width: "100%",
                borderRadius: 5,
                marginBottom: 12,
                border: "1px solid rgba(60,120,200,0.2)",
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}

          <div style={S.btnRow}>
            <button style={S.btnBack} onClick={handleBack}>← Back</button>
            <button style={S.btnDel} onClick={() => { onDelete(draft.id); onSelect(null); }}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        // List view
        <div style={S.list}>
          {markers.length === 0 ? (
            <div style={S.empty}>
              No notes yet.<br />
              Use the "Add Note" button to drop a marker on the map.
            </div>
          ) : (
            markers.map((m) => (
              <div
                key={m.id}
                style={S.item(m.id === selectedId)}
                onClick={() => onSelect(m.id)}
              >
                <div style={S.itemTitle}>📍 {m.title}</div>
                <div style={S.itemMeta}>
                  {m.lakeName ?? "General"} · {new Date(m.createdAt).toLocaleDateString()}
                </div>
                {m.notes && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#6688aa",
                      marginTop: 4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {m.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
