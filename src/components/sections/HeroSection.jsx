import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import CubeCluster from "../three/CubeCluster";
import DistortedPlane from "../three/DistortedPlane";
import StaticCubeX from "../three/StaticCubeX";
import SectionMenu from "../nav/SectionMenu";
import { useRaycastPointerUniform } from "../../hooks/useRaycastPointerUniform";
import { useTextTexture } from "../../hooks/useTextTexture";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";

function Wordmark({ strength }) {
  const meshRef = useRef();
  const pointer = useRaycastPointerUniform(meshRef);
  const { texture, aspect } = useTextTexture("Nathan Smith", { color: "#ffffff" });

  if (!texture) return null;

  return (
    <DistortedPlane
      meshRef={meshRef}
      texture={texture}
      aspect={aspect}
      width={5}
      position={[0, -1.9, 0]}
      pointer={pointer}
      strength={strength}
      rgbShiftMax={0.025}
      useAlphaChannel
    />
  );
}

export default function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const { isLowPower, isCoarsePointer } = useDeviceCapability();
  const useStaticFallback = isLowPower || isCoarsePointer;

  return (
    <section id="home" className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="hero-vignette absolute inset-0" />

      {useStaticFallback ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
          <StaticCubeX size={280} />
          <p className="font-display text-4xl font-semibold text-white/90 md:text-5xl">Nathan Smith</p>
        </div>
      ) : (
        <Canvas className="absolute inset-0" gl={{ alpha: true }} camera={{ position: [0, 0, 13], fov: 42 }}>
          <CubeCluster position={[0, 1.6, 0]} autoRotate={!reducedMotion} />
          <Wordmark strength={reducedMotion ? 0 : 1.3} />
        </Canvas>
      )}

      <div className="relative z-10 mt-auto mb-16 flex w-full justify-center">
        <SectionMenu />
      </div>
    </section>
  );
}
