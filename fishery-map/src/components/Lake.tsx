import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { LakeDef } from "../data/lakes";

interface LakeProps {
  lake: LakeDef;
  onSelect: (lake: LakeDef) => void;
  selected: boolean;
}

export default function Lake({ lake, onSelect, selected }: LakeProps) {
  const [hovered, setHovered] = useState(false);
  const waterRef = useRef<THREE.Mesh>(null);

  // Build outer shape with island holes punched through
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const [fx, fz] = lake.polygon[0];
    s.moveTo(fx, fz);
    for (let i = 1; i < lake.polygon.length; i++) {
      s.lineTo(lake.polygon[i][0], lake.polygon[i][1]);
    }
    s.closePath();

    // Each island is a hole — counter-clockwise winding cuts through the mesh
    for (const island of lake.islands) {
      const hole = new THREE.Path();
      hole.moveTo(island[0][0], island[0][1]);
      for (let i = 1; i < island.length; i++) {
        hole.lineTo(island[i][0], island[i][1]);
      }
      hole.closePath();
      s.holes.push(hole);
    }

    return s;
  }, [lake.polygon, lake.islands]);

  const geometry = useMemo(() => {
    const geo = new THREE.ShapeGeometry(shape, 4);
    // Shape is built in XY; rotate flat to XZ plane
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [shape]);

  // Shore outline — slightly larger, darker
  const shoreGeometry = useMemo(() => {
    const s = new THREE.Shape();
    const expand = 0.8;
    const cx = lake.polygon.reduce((acc, p) => acc + p[0], 0) / lake.polygon.length;
    const cz = lake.polygon.reduce((acc, p) => acc + p[1], 0) / lake.polygon.length;
    const [fx, fz] = lake.polygon[0];
    const d0x = fx - cx; const d0z = fz - cz;
    const l0 = Math.sqrt(d0x * d0x + d0z * d0z) || 1;
    s.moveTo(cx + (d0x / l0) * (l0 + expand), cz + (d0z / l0) * (l0 + expand));
    for (let i = 1; i < lake.polygon.length; i++) {
      const [px, pz] = lake.polygon[i];
      const dx = px - cx; const dz = pz - cz;
      const l = Math.sqrt(dx * dx + dz * dz) || 1;
      s.lineTo(cx + (dx / l) * (l + expand), cz + (dz / l) * (l + expand));
    }
    s.closePath();
    const geo = new THREE.ShapeGeometry(s, 4);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [lake.polygon]);

  useFrame(({ clock }) => {
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.MeshStandardMaterial;
      const t = clock.getElapsedTime();
      mat.opacity = 0.80 + Math.sin(t * 0.5) * 0.04;
    }
  });

  const waterColor = selected ? "#1e5a9a" : "#1a4878";
  const emissive    = selected ? "#003a70" : hovered ? "#002a58" : "#001830";

  return (
    <group>
      {/* Shore band — dark muddy edge */}
      <mesh geometry={shoreGeometry} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#283820" roughness={1} />
      </mesh>

      {/* Water surface (with island holes) */}
      <mesh
        ref={waterRef}
        geometry={geometry}
        position={[0, 0.06, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect(lake); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        receiveShadow
      >
        <meshStandardMaterial
          color={waterColor}
          emissive={emissive}
          emissiveIntensity={0.35}
          roughness={0.08}
          metalness={0.05}
          transparent
          opacity={0.84}
        />
      </mesh>
    </group>
  );
}
