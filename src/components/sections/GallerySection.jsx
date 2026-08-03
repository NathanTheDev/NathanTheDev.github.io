import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import DistortText from "../three/DistortText";
import DistortImage from "../three/DistortImage";
import Badge from "../ui/Badge";
import { RevealGroup, RevealItem } from "../motion/Reveal";
import { projects } from "../../data/projects";

const MotionDot = motion.span;

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
    <section id="projects" className="relative h-dvh w-full overflow-hidden bg-surface">
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
          <RevealGroup
            key={project.slug}
            as="div"
            data-project-card
            once={false}
            amount={0.55}
            className="flex h-full w-full shrink-0 snap-start flex-col items-center justify-center gap-3 px-6 py-16 text-center sm:gap-4 sm:py-20 md:gap-6"
          >
            <RevealItem as="div" variant="scale">
              <Link to="/projects/$slug" params={{ slug: project.slug }} className="relative inline-block">
                {project.status && (
                  <Badge variant="status" size="sm" className="absolute top-2 left-2 z-10">
                    {project.status}
                  </Badge>
                )}
                <DistortImage
                  src={project.image}
                  alt={project.title}
                  className="h-28 w-auto max-w-md rounded-2xl object-cover shadow-2xl sm:h-44 md:h-72 xl:h-96"
                />
              </Link>
            </RevealItem>
            <RevealItem as="div">
              <Link to="/projects/$slug" params={{ slug: project.slug }}>
                <DistortText
                  as="h3"
                  text={project.title}
                  className="font-display text-xl font-semibold text-white sm:text-3xl md:text-5xl xl:text-6xl"
                />
              </Link>
            </RevealItem>
            <RevealItem
              as="p"
              className="line-clamp-2 max-w-lg text-sm text-white/60 sm:line-clamp-3 sm:text-base xl:max-w-xl xl:text-lg"
            >
              {project.description}
            </RevealItem>
            <RevealItem as="div" className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} size="sm">
                  {tag}
                </Badge>
              ))}
            </RevealItem>
            <RevealItem as="div">
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
            </RevealItem>
          </RevealGroup>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2 sm:bottom-10">
        {projects.map((project, i) => (
          <MotionDot
            key={project.slug}
            className="h-1.5 w-1.5 rounded-full bg-white"
            animate={{ scale: i === activeIndex ? 1.4 : 1, opacity: i === activeIndex ? 1 : 0.25 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        ))}
      </div>
    </section>
  );
}
