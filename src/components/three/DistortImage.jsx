import { Suspense, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import DistortedPlane from "./DistortedPlane";
import { useRaycastPointerUniform } from "../../hooks/useRaycastPointerUniform";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

function DistortImageScene({ src, strength, rgbShiftMax, falloffRadius }) {
  const meshRef = useRef();
  const pointer = useRaycastPointerUniform(meshRef);
  const texture = useTexture(src);
  const viewport = useThree((state) => state.viewport);
  const aspect = texture.image.width / texture.image.height;

  return (
    <DistortedPlane
      meshRef={meshRef}
      texture={texture}
      aspect={aspect}
      width={viewport.width}
      pointer={pointer}
      strength={strength}
      rgbShiftMax={rgbShiftMax}
      falloffRadius={falloffRadius}
    />
  );
}

// Same cursor-driven liquid/RGB-shift warp as the hero wordmark and headings,
// applied to a real image texture instead of canvas-rendered text — this is
// what the old 3D gallery carousel's cards used, reused here for the plain
// project thumbnails. Falls back to a plain <img> on low-power/coarse-pointer
// devices or reduced-motion.
export default function DistortImage({
  src,
  alt,
  className,
  strength = 0.4,
  rgbShiftMax = 0.008,
  falloffRadius = 0.4,
}) {
  const { isLowPower, isCoarsePointer } = useDeviceCapability();
  const reducedMotion = usePrefersReducedMotion();

  if (isLowPower || isCoarsePointer || reducedMotion) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className="relative inline-block">
      <img src={src} alt={alt} className={className} style={{ visibility: "hidden" }} />
      <Canvas
        style={{ position: "absolute", inset: 0 }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true }}
      >
        <Suspense fallback={null}>
          <DistortImageScene src={src} strength={strength} rgbShiftMax={rgbShiftMax} falloffRadius={falloffRadius} />
        </Suspense>
      </Canvas>
    </div>
  );
}
