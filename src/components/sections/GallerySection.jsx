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
    <section id="projects" className="relative h-dvh w-full overflow-hidden bg-[#0a0a0a]">
      <div className="pointer-events-none absolute inset-x-0 top-8 z-10 flex flex-col items-center gap-1 text-center sm:top-16 sm:gap-2">
        <p className="text-xs tracking-[0.3em] text-white/40 uppercase">Projects</p>
        <DistortText
          text="Selected work"
          className="font-display text-2xl font-semibold text-white sm:text-3xl md:text-4xl"
        />
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
            className="flex h-full w-full shrink-0 snap-start flex-col items-center justify-center gap-3 px-6 py-16 text-center sm:gap-4 sm:py-20 md:gap-6"
          >
            <Link to="/projects/$slug" params={{ slug: project.slug }} className="relative inline-block">
              {project.status && (
                <span className="absolute top-2 left-2 z-10 rounded-full bg-amber-400/90 px-2.5 py-1 text-xs font-medium text-black">
                  {project.status}
                </span>
              )}
              <DistortImage
                src={project.image}
                alt={project.title}
                className="h-28 w-auto max-w-md rounded-2xl object-cover shadow-2xl sm:h-44 md:h-72"
              />
            </Link>
            <Link to="/projects/$slug" params={{ slug: project.slug }}>
              <DistortText
                as="h3"
                text={project.title}
                className="font-display text-xl font-semibold text-white sm:text-3xl md:text-5xl"
              />
            </Link>
            <p className="line-clamp-2 max-w-lg text-sm text-white/60 sm:line-clamp-3 sm:text-base">
              {project.description}
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="group font-display flex items-center gap-2 text-base text-white/80 underline underline-offset-4 transition-colors hover:text-white sm:text-lg md:text-xl"
            >
              View project
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2 sm:bottom-10">
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
