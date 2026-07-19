import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import DistortText from "../three/DistortText";
import DistortImage from "../three/DistortImage";
import { projects } from "../../data/projects";

// One project fills the viewport at a time in a horizontal filmstrip.
// useSectionSnapScroll drives it on wheel input (one tick = one project);
// snap-x/snap-start here just make touch-swipe and any native horizontal
// scrolling (trackpad shift-scroll, arrow-drag) land cleanly on a card too.
export default function GallerySection() {
  const trackRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    function handleScroll() {
      const cards = Array.from(track.querySelectorAll("[data-project-card]"));
      const scrollLeft = track.scrollLeft;
      let idx = 0;
      cards.forEach((card, i) => {
        if (card.offsetLeft - 10 <= scrollLeft) idx = i;
      });
      setActiveIndex(idx);
    }

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="projects" className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <div className="pointer-events-none absolute inset-x-0 top-16 z-10 flex flex-col items-center gap-2 text-center">
        <p className="text-xs tracking-[0.3em] text-white/40 uppercase">Projects</p>
        <DistortText text="Selected work" className="font-display text-3xl font-semibold text-white md:text-4xl" />
      </div>

      <div
        id="projects-track"
        ref={trackRef}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {projects.map((project) => (
          <div
            key={project.slug}
            data-project-card
            className="flex h-full w-full shrink-0 snap-start flex-col items-center justify-center gap-6 px-6 text-center"
          >
            <DistortImage
              src={project.image}
              alt={project.title}
              className="h-56 w-auto max-w-md rounded-2xl object-cover shadow-2xl md:h-72"
            />
            <DistortText
              as="h3"
              text={project.title}
              className="font-display text-3xl font-semibold text-white md:text-5xl"
            />
            <p className="max-w-lg text-white/60">{project.description}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-md">
                  {tag}
                </span>
              ))}
            </div>
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="font-display text-white/80 underline underline-offset-4 transition-colors hover:text-white"
            >
              View project
            </Link>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex justify-center gap-2">
        {projects.map((project, i) => (
          <span
            key={project.slug}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${i === activeIndex ? "bg-white" : "bg-white/25"}`}
          />
        ))}
      </div>
    </section>
  );
}
