import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import CubeCluster from "../three/CubeCluster";
import DistortedPlane from "../three/DistortedPlane";
import StaticCubeX from "../three/StaticCubeX";
import SectionMenu from "../nav/SectionMenu";
import { useRaycastPointerUniform } from "../../hooks/useRaycastPointerUniform";
import { useTextTexture } from "../../hooks/useTextTexture";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";

// Subtle cursor-driven camera drift so the cube cluster feels responsive to
// the pointer, mirroring the parallax in the reference design. Tracks raw
// window pointer position (not a DOM-rect-relative uv) since it drives the
// camera itself rather than a shader uniform.
function CameraParallax({ enabled }) {
  const pointerRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    if (!enabled) return undefined;
    function handlePointerMove(event) {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
    }
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [enabled]);

  useFrame(({ camera }) => {
    if (enabled) {
      const nx = (pointerRef.current.x / window.innerWidth) * 2 - 1;
      const ny = (pointerRef.current.y / window.innerHeight) * 2 - 1;
      camera.position.x += (nx * 1.4 - camera.position.x) * 0.03;
      camera.position.y += (-ny * 0.9 - camera.position.y) * 0.03;
    }
    // Always re-aim at the cluster center, even with parallax disabled, so
    // "vertically centered" means the same world y in both cases.
    camera.lookAt(0, 1.6, 0);
  });

  return null;
}

// Left-aligned, vertically centered on the cluster's look-at target (1.6) —
// sized/positioned from the live viewport so it holds its ~6%-from-left
// placement and never overflows on narrow aspect ratios.
function Wordmark({ strength }) {
  const meshRef = useRef();
  const pointer = useRaycastPointerUniform(meshRef);
  const { texture, aspect } = useTextTexture("Nathan Smith", { color: "#ffffff" });
  const viewport = useThree((state) => state.viewport);

  if (!texture) return null;

  const width = Math.min(5, viewport.width * 0.62);
  const x = -viewport.width * 0.44 + width / 2;

  return (
    <DistortedPlane
      meshRef={meshRef}
      texture={texture}
      aspect={aspect}
      width={width}
      position={[x, 1.6, 0]}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
          <StaticCubeX size={280} />
          <p className="font-display text-center text-4xl font-semibold text-white/90 md:text-5xl">Nathan Smith</p>
        </div>
      ) : (
        <Canvas className="absolute inset-0" gl={{ alpha: true }} camera={{ position: [0, 0, 13], fov: 42 }}>
          <CameraParallax enabled={!reducedMotion} />
          <CubeCluster position={[0, 1.6, 0]} autoRotate={!reducedMotion} />
          <Wordmark strength={reducedMotion ? 0 : 1.3} />
        </Canvas>
      )}

      <div className="absolute top-[58%] left-[6%] z-10 flex flex-col items-start">
        <SectionMenu />
      </div>
    </section>
  );
}
