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

// Subtle cursor-driven drift on the cube cluster only (via a wrapping group,
// not the camera) so the background reads as responsive/3D while the
// foreground wordmark — which shares this same camera — stays put on screen
// instead of drifting with it. The camera itself is aimed once and never
// moves.
function CubeParallax({ enabled, targetRef }) {
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

  useFrame(() => {
    const group = targetRef.current;
    if (!group || !enabled) return;
    const nx = (pointerRef.current.x / window.innerWidth) * 2 - 1;
    const ny = (pointerRef.current.y / window.innerHeight) * 2 - 1;
    group.position.x += (nx * 0.18 - group.position.x) * 0.03;
    group.position.y += (-ny * 0.12 - group.position.y) * 0.03;
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
      rgbShiftMax={0.007}
      falloffRadius={0.21}
      alwaysOnTop
      useAlphaChannel
    />
  );
}

export default function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const { isLowPower, isCoarsePointer } = useDeviceCapability();
  const useStaticFallback = isLowPower || isCoarsePointer;
  const cubeGroupRef = useRef();

  return (
    <section id="home" className="relative flex h-dvh w-full flex-col overflow-hidden">
      <div className={`absolute inset-0 ${useStaticFallback ? "hero-vignette-dim" : "hero-vignette"}`} />

      {useStaticFallback ? (
        // Own self-contained flex layout (not the absolute-positioned nav
        // below) — that positioning is tuned for the desktop canvas's empty
        // lower-left space and overlaps this centered content on phones.
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-8 overflow-y-auto px-6 py-10">
          <div className="flex flex-col items-center gap-5">
            <StaticCubeX size={200} />
            <p className="font-display text-center text-3xl font-semibold text-white/90 sm:text-4xl">Nathan Smith</p>
          </div>
          <SectionMenu align="center" />
        </div>
      ) : (
        <>
          <Canvas
            className="absolute inset-0"
            gl={{ alpha: true }}
            camera={{ position: [0, 0, 13], fov: 42 }}
            onCreated={({ camera }) => camera.lookAt(0, 1.6, 0)}
          >
            <CubeParallax enabled={!reducedMotion} targetRef={cubeGroupRef} />
            <group ref={cubeGroupRef}>
              <CubeCluster position={[0, 1.6, 0]} autoRotate={!reducedMotion} />
            </group>
            <Wordmark strength={reducedMotion ? 0 : 0.32} />
          </Canvas>

          <div className="absolute top-[58%] left-[6.5%] z-10 flex flex-col items-start">
            <SectionMenu />
          </div>
        </>
      )}
    </section>
  );
}
