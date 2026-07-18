import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import CubeCluster from "../three/CubeCluster";
import DistortedPlane from "../three/DistortedPlane";
import SectionMenu from "../nav/SectionMenu";
import { useRaycastPointerUniform } from "../../hooks/useRaycastPointerUniform";
import { useTextTexture } from "../../hooks/useTextTexture";

function Wordmark() {
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
      strength={1.3}
      rgbShiftMax={0.025}
      useAlphaChannel
    />
  );
}

export default function HeroSection() {
  return (
    <section id="home" className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="hero-vignette absolute inset-0" />

      <Canvas className="absolute inset-0" gl={{ alpha: true }} camera={{ position: [0, 0, 13], fov: 42 }}>
        <CubeCluster position={[0, 1.6, 0]} />
        <Wordmark />
      </Canvas>

      <div className="relative z-10 mt-auto mb-16 flex w-full justify-center">
        <SectionMenu />
      </div>
    </section>
  );
}
