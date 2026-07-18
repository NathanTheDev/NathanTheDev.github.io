import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { generateCubeLayout } from "./cubeLayout";

// Pure-white cubes on a white/grey background only read as 3D forms via
// shading, so the lighting rig (key/fill/rim) matters more here than the
// geometry itself. Lights stay fixed (outside the rotating group) so the
// shading is consistent regardless of cluster rotation.
export default function CubeCluster({ autoRotate = true, ...groupProps }) {
  const rotationRef = useRef();
  const cubes = useMemo(() => generateCubeLayout(), []);

  useFrame((_, delta) => {
    if (autoRotate && rotationRef.current) {
      // Spins in-plane (around the camera axis) so the X stays face-on,
      // rather than orbiting it edge-on like a Y-axis spin would.
      rotationRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group {...groupProps}>
      <directionalLight position={[4, 6, 5]} intensity={2.4} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[-3, 5, -6]} intensity={1.3} />

      <group ref={rotationRef}>
        {cubes.map((cube, i) => (
          <mesh key={i} position={cube.position} rotation={cube.rotation} scale={cube.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ffffff" roughness={0.35} metalness={0} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
