import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WalkControllerProps {
  active: boolean;
}

export default function WalkController({ active }: WalkControllerProps) {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(-0.3);
  const locked = useRef(false);

  // Starting walk position
  useEffect(() => {
    if (active) {
      camera.position.set(0, 1.7, 20);
      yaw.current = Math.PI;
      pitch.current = -0.1;
    }
  }, [active, camera]);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const onKeyUp   = (e: KeyboardEvent) => { keys.current[e.code] = false; };

    const onMouseMove = (e: MouseEvent) => {
      if (!locked.current) return;
      yaw.current   -= e.movementX * 0.002;
      pitch.current -= e.movementY * 0.002;
      pitch.current  = Math.max(-1.2, Math.min(0.4, pitch.current));
    };

    const onLockChange = () => {
      locked.current = document.pointerLockElement === gl.domElement;
    };

    const onClick = () => {
      if (!locked.current) gl.domElement.requestPointerLock();
    };

    document.addEventListener("keydown",  onKeyDown);
    document.addEventListener("keyup",    onKeyUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onLockChange);
    gl.domElement.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("keydown",  onKeyDown);
      document.removeEventListener("keyup",    onKeyUp);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onLockChange);
      gl.domElement.removeEventListener("click", onClick);
      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock();
      }
    };
  }, [active, gl]);

  useFrame((_, delta) => {
    if (!active) return;

    const speed = keys.current["ShiftLeft"] || keys.current["ShiftRight"] ? 12 : 5;
    const forward = new THREE.Vector3(
      -Math.sin(yaw.current) * Math.cos(pitch.current),
      Math.sin(pitch.current),
      -Math.cos(yaw.current) * Math.cos(pitch.current)
    );
    const right = new THREE.Vector3(
      Math.cos(yaw.current),
      0,
      -Math.sin(yaw.current)
    );

    const move = new THREE.Vector3();
    if (keys.current["KeyW"] || keys.current["ArrowUp"])    move.add(forward);
    if (keys.current["KeyS"] || keys.current["ArrowDown"])  move.sub(forward);
    if (keys.current["KeyA"] || keys.current["ArrowLeft"])  move.sub(right);
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) move.add(right);

    move.y = 0;
    if (move.lengthSq() > 0) move.normalize().multiplyScalar(speed * delta);
    camera.position.add(move);
    camera.position.y = 1.7; // lock height

    // Apply yaw + pitch as euler
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
  });

  return null;
}
