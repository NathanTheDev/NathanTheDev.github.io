import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { generateCubeClusterLayout } from "./cubeLayout";

// Two tilted rings of small cubes, spinning independently in opposite
// directions, cross each other face-on to the camera to form an X — plus a
// larger center cube. Lights stay fixed (outside the rotating groups) so
// shading is consistent regardless of ring rotation.
export default function CubeCluster({ autoRotate = true, ...groupProps }) {
  const centerRef = useRef();
  const ringBigRef = useRef();
  const ringSmallRef = useRef();
  const layout = useMemo(() => generateCubeClusterLayout(), []);

  useFrame((_, delta) => {
    if (!autoRotate) return;

    if (centerRef.current) {
      centerRef.current.rotation.x += delta * 0.25;
      centerRef.current.rotation.y += delta * 0.35;
    }
    if (ringBigRef.current) {
      ringBigRef.current.rotation.y += delta * 0.22;
    }
    if (ringSmallRef.current) {
      ringSmallRef.current.rotation.y -= delta * 0.32;
    }
  });

  return (
    <group {...groupProps}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 6, 5]} intensity={1.8} />
      <directionalLight position={[-3, 5, -6]} intensity={1} />
      <pointLight position={[6, 6, 8]} color="#ffffff" intensity={3.5} decay={0} />
      <pointLight position={[-6, -4, -6]} color="#ffffff" intensity={2.2} decay={0} />

      <mesh ref={centerRef} scale={layout.center.scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} metalness={0} />
      </mesh>

      <group ref={ringBigRef} rotation={[layout.ringBig.tiltX, 0, layout.ringBig.tiltZ]}>
        {layout.ringBig.cubes.map((cube, i) => (
          <mesh key={i} position={cube.position} rotation={cube.rotation} scale={cube.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ffffff" roughness={0.35} metalness={0} />
          </mesh>
        ))}
      </group>

      <group ref={ringSmallRef} rotation={[layout.ringSmall.tiltX, 0, layout.ringSmall.tiltZ]}>
        {layout.ringSmall.cubes.map((cube, i) => (
          <mesh key={i} position={cube.position} rotation={cube.rotation} scale={cube.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ffffff" roughness={0.35} metalness={0} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
