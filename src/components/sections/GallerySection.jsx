import { Canvas } from "@react-three/fiber";
import { Link } from "@tanstack/react-router";
import GalleryCarousel from "../three/GalleryCarousel";
import DistortText from "../three/DistortText";
import { projects } from "../../data/projects";
import { useInView } from "../../hooks/useInView";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

function GalleryFallback() {
  return (
    <div className="grid w-full max-w-4xl grid-cols-2 gap-4 px-6 sm:grid-cols-4">
      {projects.map((project) => (
        <Link
          key={project.slug}
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="group overflow-hidden rounded-xl border border-white/10"
        >
          <img
            src={project.image}
            alt={project.title}
            className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105"
          />
        </Link>
      ))}
    </div>
  );
}

export default function GallerySection() {
  const [sectionRef, inView] = useInView({ rootMargin: "200px" });
  const { isLowPower } = useDeviceCapability();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="projects" ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <div className="pointer-events-none absolute inset-x-0 top-16 z-10 flex flex-col items-center gap-2 text-center">
        <p className="text-xs tracking-[0.3em] text-white/40 uppercase">Projects</p>
        <DistortText text="Selected work" className="font-display text-3xl font-semibold text-white md:text-4xl" />
      </div>

      {isLowPower ? (
        <div className="flex h-full w-full items-center justify-center">
          <GalleryFallback />
        </div>
      ) : (
        inView && (
          <Canvas className="absolute inset-0" camera={{ position: [0, 0.6, 8.5], fov: 52 }}>
            <GalleryCarousel projects={projects} sectionRef={sectionRef} reducedMotion={reducedMotion} />
          </Canvas>
        )
      )}
    </section>
  );
}
