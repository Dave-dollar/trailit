import { OrbitControls } from "@react-three/drei";
import Terrain from "./Terrain";
import Lake from "./Lake";
import Islands from "./Islands";
import Paths from "./Paths";
import WaterChannels from "./WaterChannels";
import Fields from "./Fields";
import Trees from "./Trees";
import Pegs from "./Pegs";
import VenueMarkers from "./VenueMarkers";
import LakeLabels from "./LakeLabels";
import Markers3D from "./Markers3D";
import WalkController from "./WalkController";
import LAKES from "../data/lakes";
import type { LakeDef } from "../data/lakes";
import type { NoteMarker } from "../data/markers";

type CameraMode = "orbit" | "walk";

interface SceneProps {
  mode: CameraMode;
  placeMarkerMode: boolean;
  showLabels: boolean;
  showMarkers: boolean;
  onLakeSelect: (lake: LakeDef) => void;
  selectedLakeId: string | null;
  markers: NoteMarker[];
  selectedMarkerId: string | null;
  onSelectMarker: (id: string) => void;
  onPlaceMarker: (position: [number, number, number]) => void;
  onHoverCoords: (coords: [number, number] | null) => void;
}

export default function Scene({
  mode, placeMarkerMode, showLabels, showMarkers,
  onLakeSelect, selectedLakeId,
  markers, selectedMarkerId, onSelectMarker,
  onPlaceMarker, onHoverCoords,
}: SceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.48} color="#d8ecff" />
      <directionalLight
        position={[30, 80, 20]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={280}
        shadow-camera-left={-110}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        color="#fff5e8"
      />
      <hemisphereLight args={["#88d0f0", "#2c5818", 0.32]} />
      <fog attach="fog" args={["#182818", 90, 240]} />

      {/* Ground layers */}
      <Fields />
      <Terrain
        onPlaceMarker={placeMarkerMode ? onPlaceMarker : undefined}
        onHoverCoords={onHoverCoords}
      />

      {/* Roads and water */}
      <Paths />
      <WaterChannels />

      {/* Lakes */}
      {LAKES.map((lake) => (
        <Lake
          key={lake.id}
          lake={lake}
          onSelect={onLakeSelect}
          selected={selectedLakeId === lake.id}
        />
      ))}
      <Islands />

      {/* Objects */}
      <Trees />
      <Pegs />
      <VenueMarkers />

      {/* Labels */}
      <LakeLabels
        onSelect={onLakeSelect}
        selectedId={selectedLakeId}
        showLabels={showLabels}
      />

      {/* Note markers */}
      <Markers3D
        markers={markers}
        selectedId={selectedMarkerId}
        onSelect={onSelectMarker}
        showMarkers={showMarkers}
      />

      {/* Camera */}
      {mode === "orbit" ? (
        <OrbitControls
          makeDefault
          minDistance={8}
          maxDistance={160}
          maxPolarAngle={Math.PI / 2 - 0.04}
          target={[-20, 0, -8]}
        />
      ) : (
        <WalkController active={mode === "walk"} />
      )}
    </>
  );
}
