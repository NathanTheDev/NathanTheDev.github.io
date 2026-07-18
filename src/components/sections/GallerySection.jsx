import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import GalleryCarousel from "../three/GalleryCarousel";
import { projects } from "../../data/projects";

export default function GallerySection() {
  const sectionRef = useRef();

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-16 z-10 flex flex-col items-center gap-2 text-center">
        <p className="text-xs tracking-[0.3em] text-white/40 uppercase">Projects</p>
        <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">Selected work</h2>
      </div>

      <Canvas className="absolute inset-0" camera={{ position: [0, 0.6, 9], fov: 45 }}>
        <GalleryCarousel projects={projects} sectionRef={sectionRef} />
      </Canvas>
    </section>
  );
}
