import { useMemo } from "react";
import * as THREE from "three";
import PATHS from "../data/paths";

export default function Paths() {
  return (
    <>
      {PATHS.map((path) => (
        <PathMesh key={path.id} path={path} />
      ))}
    </>
  );
}

function PathMesh({ path }: { path: (typeof PATHS)[number] }) {
  const geometry = useMemo(() => {
    const pts = path.points.map(([x, z]) => new THREE.Vector2(x, z));
    const shape = buildStripShape(pts, path.width / 2);
    const geo = new THREE.ShapeGeometry(shape);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [path]);

  return (
    <mesh geometry={geometry} position={[0, 0.03, 0]} receiveShadow>
      <meshStandardMaterial color={path.color} roughness={0.9} />
    </mesh>
  );
}

function buildStripShape(pts: THREE.Vector2[], halfWidth: number): THREE.Shape {
  const left: THREE.Vector2[] = [];
  const right: THREE.Vector2[] = [];

  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    const dir = new THREE.Vector2()
      .subVectors(next, prev)
      .normalize();
    const normal = new THREE.Vector2(-dir.y, dir.x);
    left.push(
      new THREE.Vector2(
        pts[i].x + normal.x * halfWidth,
        pts[i].y + normal.y * halfWidth
      )
    );
    right.push(
      new THREE.Vector2(
        pts[i].x - normal.x * halfWidth,
        pts[i].y - normal.y * halfWidth
      )
    );
  }

  const shape = new THREE.Shape();
  shape.moveTo(left[0].x, left[0].y);
  left.forEach((p) => shape.lineTo(p.x, p.y));
  [...right].reverse().forEach((p) => shape.lineTo(p.x, p.y));
  shape.closePath();
  return shape;
}
