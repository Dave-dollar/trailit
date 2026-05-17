import type { ThreeEvent } from "@react-three/fiber";

interface TerrainProps {
  onPlaceMarker?: (position: [number, number, number]) => void;
  onHoverCoords?: (coords: [number, number] | null) => void;
}

export default function Terrain({ onPlaceMarker, onHoverCoords }: TerrainProps) {
  function handleClick(e: ThreeEvent<MouseEvent>) {
    if (!onPlaceMarker) return;
    e.stopPropagation();
    onPlaceMarker([e.point.x, 0, e.point.z]);
  }

  function handleMove(e: ThreeEvent<PointerEvent>) {
    onHoverCoords?.([
      Math.round(e.point.x * 10) / 10,
      Math.round(e.point.z * 10) / 10,
    ]);
  }

  function handleLeave() {
    onHoverCoords?.(null);
  }

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onClick={onPlaceMarker ? handleClick : undefined}
      onPointerMove={onHoverCoords ? handleMove : undefined}
      onPointerLeave={onHoverCoords ? handleLeave : undefined}
    >
      <planeGeometry args={[200, 200, 1, 1]} />
      <meshStandardMaterial color="#4a6741" roughness={0.95} metalness={0} />
    </mesh>
  );
}
