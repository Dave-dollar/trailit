import { useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Scene from "./components/Scene";
import HUD from "./components/HUD";
import InfoPanel from "./components/InfoPanel";
import MarkerPanel from "./components/MarkerPanel";
import type { LakeDef } from "./data/lakes";
import type { NoteMarker } from "./data/markers";
import { DEFAULT_MARKERS } from "./data/markers";
import LAKES from "./data/lakes";

type CameraMode = "orbit" | "walk";

const STORAGE_KEY = "sivolia-fishery-markers";

function loadMarkers(): NoteMarker[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as NoteMarker[];
  } catch { /* ignore */ }
  return DEFAULT_MARKERS;
}

export default function App() {
  const [mode, setMode]               = useState<CameraMode>("orbit");
  const [selectedLake, setSelectedLake] = useState<LakeDef | null>(null);
  const [markers, setMarkers]         = useState<NoteMarker[]>(loadMarkers);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [placeMarkerMode, setPlaceMarkerMode]   = useState(false);
  const [markerPanelOpen, setMarkerPanelOpen]   = useState(false);
  const [showLabels, setShowLabels]   = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [hoverCoords, setHoverCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(markers));
  }, [markers]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPlaceMarkerMode(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleToggleMode() {
    setMode((p) => (p === "orbit" ? "walk" : "orbit"));
    setSelectedLake(null);
    setPlaceMarkerMode(false);
  }

  function handleLakeSelect(lake: LakeDef) {
    setSelectedLake((p) => (p?.id === lake.id ? null : lake));
    setSelectedMarkerId(null);
  }

  function handlePlaceMarker(position: [number, number, number]) {
    let lakeName: string | null = null;
    let bestDist = Infinity;
    for (const lake of LAKES) {
      const dx = position[0] - lake.center[0];
      const dz = position[2] - lake.center[2];
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d < bestDist) { bestDist = d; lakeName = lake.info.name; }
    }
    if (bestDist > 45) lakeName = null;

    const marker: NoteMarker = {
      id: `marker-${Date.now()}`,
      title: "New Note",
      lakeName,
      position,
      notes: "",
      photoUrl: "",
      createdAt: new Date().toISOString(),
    };
    setMarkers((p) => [...p, marker]);
    setSelectedMarkerId(marker.id);
    setMarkerPanelOpen(true);
    setPlaceMarkerMode(false);
  }

  const handleUpdateMarker = useCallback((updated: NoteMarker) => {
    setMarkers((p) => p.map((m) => (m.id === updated.id ? updated : m)));
  }, []);

  const handleDeleteMarker = useCallback((id: string) => {
    setMarkers((p) => p.filter((m) => m.id !== id));
    setSelectedMarkerId(null);
  }, []);

  function handleSelectMarker(id: string) {
    setSelectedMarkerId(id);
    setMarkerPanelOpen(true);
    setSelectedLake(null);
  }

  const handleHoverCoords = useCallback((coords: [number, number] | null) => {
    setHoverCoords(coords);
  }, []);

  return (
    <div
      style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#0a1218" }}
      data-place={placeMarkerMode ? "true" : undefined}
    >
      <style>{`[data-place="true"] canvas { cursor: crosshair !important; }`}</style>

      <Canvas
        shadows
        camera={{ position: [-18, 68, 88], fov: 50, near: 0.1, far: 500 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{ display: "block" }}
      >
        <Scene
          mode={mode}
          placeMarkerMode={placeMarkerMode}
          showLabels={showLabels}
          showMarkers={showMarkers}
          onLakeSelect={handleLakeSelect}
          selectedLakeId={selectedLake?.id ?? null}
          markers={markers}
          selectedMarkerId={selectedMarkerId}
          onSelectMarker={handleSelectMarker}
          onPlaceMarker={handlePlaceMarker}
          onHoverCoords={handleHoverCoords}
        />
      </Canvas>

      <HUD
        mode={mode}
        placeMarkerMode={placeMarkerMode}
        markerPanelOpen={markerPanelOpen}
        markerCount={markers.length}
        showLabels={showLabels}
        showMarkers={showMarkers}
        hoverCoords={hoverCoords}
        onToggleMode={handleToggleMode}
        onTogglePlaceMarker={() => { setPlaceMarkerMode((v) => !v); setSelectedLake(null); }}
        onToggleMarkerPanel={() => setMarkerPanelOpen((v) => !v)}
        onToggleLabels={() => setShowLabels((v) => !v)}
        onToggleMarkers={() => setShowMarkers((v) => !v)}
      />

      {markerPanelOpen && (
        <MarkerPanel
          markers={markers}
          selectedId={selectedMarkerId}
          onSelect={setSelectedMarkerId}
          onUpdate={handleUpdateMarker}
          onDelete={handleDeleteMarker}
          onClose={() => setMarkerPanelOpen(false)}
        />
      )}

      <InfoPanel lake={selectedLake} onClose={() => setSelectedLake(null)} />
    </div>
  );
}
