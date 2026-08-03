import { Canvas } from "@react-three/fiber";
import CubeCluster from "./CubeCluster";
import StaticCubeX from "./StaticCubeX";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

// Smaller, self-contained echo of the Hero's cube cluster — gives About a
// tie back to the site's one recurring 3D motif instead of being pure text,
// without needing a portrait/headshot asset. Same low-power/reduced-motion
// fallback convention as everywhere else the cluster appears.
export default function AboutCubeMotif({ className = "" }) {
  const { isLowPower, isCoarsePointer } = useDeviceCapability();
  const reducedMotion = usePrefersReducedMotion();
  const useStaticFallback = isLowPower || isCoarsePointer;

  return (
    <div aria-hidden="true" className={`flex items-center justify-center ${className}`}>
      {useStaticFallback ? (
        <StaticCubeX size={220} />
      ) : (
        <Canvas camera={{ position: [0, 0, 9], fov: 42 }}>
          <group rotation={[0, 0, 0]}>
            <CubeCluster autoRotate={!reducedMotion} />
          </group>
        </Canvas>
      )}
    </div>
  );
}
