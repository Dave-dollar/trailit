/**
 * WaterChannels.tsx — Narrow connecting water channels / drainage ditches.
 * Uses the same strip-geometry approach as Paths.tsx but with water colouring.
 */
import { useMemo } from "react";
import * as THREE from "three";
import CHANNELS from "../data/channels";
import type { ChannelDef } from "../data/channels";

function buildStrip(pts: THREE.Vector2[], halfW: number): THREE.ShapeGeometry {
  const left: THREE.Vector2[] = [];
  const right: THREE.Vector2[] = [];
  const n = pts.length;

  for (let i = 0; i < n; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(n - 1, i + 1)];
    const dir  = new THREE.Vector2().subVectors(next, prev).normalize();
    const norm = new THREE.Vector2(-dir.y, dir.x);
    left.push(new THREE.Vector2(pts[i].x + norm.x * halfW, pts[i].y + norm.y * halfW));
    right.push(new THREE.Vector2(pts[i].x - norm.x * halfW, pts[i].y - norm.y * halfW));
  }

  const shape = new THREE.Shape();
  shape.moveTo(left[0].x, left[0].y);
  left.forEach((p) => shape.lineTo(p.x, p.y));
  [...right].reverse().forEach((p) => shape.lineTo(p.x, p.y));
  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(-Math.PI / 2);
  return geo;
}

function Channel({ ch }: { ch: ChannelDef }) {
  const geo = useMemo(
    () => buildStrip(ch.points.map(([x, z]) => new THREE.Vector2(x, z)), ch.width / 2),
    [ch]
  );
  return (
    <mesh geometry={geo} position={[0, 0.04, 0]} receiveShadow>
      <meshStandardMaterial
        color="#163c6a"
        roughness={0.1}
        metalness={0.05}
        transparent
        opacity={0.82}
      />
    </mesh>
  );
}

export default function WaterChannels() {
  return (
    <>
      {CHANNELS.map((ch) => <Channel key={ch.id} ch={ch} />)}
    </>
  );
}
