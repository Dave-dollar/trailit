import PEGS from "../data/pegs";

export default function Pegs() {
  return (
    <>
      {PEGS.map((peg) => {
        const angle = (peg.faceAngle * Math.PI) / 180;
        return (
          <group
            key={peg.id}
            position={[peg.position[0], 0, peg.position[1]]}
            rotation={[0, angle, 0]}
          >
            {/* Post */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 0.8, 6]} />
              <meshStandardMaterial color="#c8a86b" roughness={0.8} />
            </mesh>
            {/* Number disc */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.06, 8]} />
              <meshStandardMaterial color="#e8c84a" roughness={0.4} metalness={0.3} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}
