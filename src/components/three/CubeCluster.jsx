import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Both rings share the same 4 diagonal angles (45/135/225/315deg) so the
// cluster reads as one continuous X rather than two separate rings.
const DIAGONAL_ANGLES = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

// Per-cube tilt (in addition to the 45deg in-plane spin) so each cube shows
// enough side/top face to read as a lit 3D volume, without tilting the
// overall X arrangement itself off-axis (which would foreshorten the four
// arms unevenly and break the symmetric X silhouette).
const CUBE_TILT = [0.22, 0.22, Math.PI / 4];

// innerRadius is chosen so the inner ring's cube tips slightly overlap the
// outer ring's tips (R_inner >~ R_outer - cubeSize*sqrt(2)) rather than
// leaving a gap between two visually separate rings.
export function generateCubeLayout({
  cubeSize = 1,
  outerRadius = 2.6,
  innerRadius = 1.45,
  centerScale = 1.15,
} = {}) {
  // Cubes sit in the camera-facing XY plane (z=0) rather than the ground
  // plane — the X only reads clearly face-on, like an emblem, not from a
  // bird's-eye angle.
  const cubes = [{ position: [0, 0, 0], rotation: CUBE_TILT, scale: cubeSize * centerScale }];

  for (const radius of [innerRadius, outerRadius]) {
    for (const angle of DIAGONAL_ANGLES) {
      cubes.push({
        position: [radius * Math.cos(angle), radius * Math.sin(angle), 0],
        rotation: CUBE_TILT,
        scale: cubeSize,
      });
    }
  }

  return cubes;
}

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
