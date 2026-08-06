import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import ShelfScene from "../three/ShelfScene";
import DistortText from "../three/DistortText";
import DistortImage from "../three/DistortImage";
import StaticCubeX from "../three/StaticCubeX";
import Badge from "../ui/Badge";
import { ActiveRevealGroup, RevealItem } from "../motion/Reveal";
import { projects } from "../../data/projects";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const MotionDot = motion.span;

// Shared by both branches below: tracks which project the horizontal
// #projects-track (real filmstrip on touch/reduced-motion, a hidden scroll
// proxy on the 3D branch) is currently sitting on. useSectionSnapScroll.js
// drives that scroll position on wheel input; this just mirrors it into
// React state for the HUD/dots to read.
function useActiveProjectIndex() {
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

  return { trackRef, activeIndex };
}

function ProjectDots({ activeIndex }) {
  return (
    <div className="flex items-center gap-2">
      {projects.map((project, i) => (
        <MotionDot
          key={project.slug}
          className="block rounded-full bg-white/25"
          animate={{
            width: i === activeIndex ? 18 : 6,
            height: 6,
            backgroundColor: i === activeIndex ? "#ffffff" : "rgba(255,255,255,0.25)",
          }}
          transition={{ type: "spring", stiffness: 600, damping: 32 }}
        />
      ))}
    </div>
  );
}

// Full 3D shelf: cards recede into depth, camera dollies through them as the
// hidden #projects-track scrolls. Desktop/capable devices only — the wheel
// gesture this leans on doesn't exist on touch, and a full-viewport r3f
// scene isn't worth the cost on low-power hardware.
function ShelfGallery() {
  const { trackRef, activeIndex } = useActiveProjectIndex();
  const active = projects[activeIndex] ?? projects[0];

  return (
    <section id="projects" className="relative h-dvh w-full overflow-hidden bg-surface">
      <div className="pointer-events-none absolute inset-x-0 top-8 z-10 flex flex-col items-center gap-1 text-center sm:top-16 sm:gap-2">
        {/* Same "X" motif that opens Hero and bookends Contact — without it,
            Projects reads as a different site pasted into the scroll. */}
        <div className="mb-1 opacity-30">
          <StaticCubeX size={40} />
        </div>
        <p className="text-xs tracking-[0.3em] text-white/40 uppercase">Projects</p>
        <DistortText
          text="Selected work"
          className="font-display text-2xl font-semibold text-white sm:text-3xl md:text-4xl"
        />
      </div>

      <ShelfScene activeIndex={activeIndex} />

      {/* Invisible scroll proxy: purely a geometry source for useSectionSnapScroll's
          offsetLeft math — see that hook's comments. pointer-events-none so it
          doesn't sit on top of ShelfScene's canvas and swallow clicks/hover
          meant for the card images; the wheel handler that drives it lives on
          document.body and doesn't need this element to receive events itself.
          All visible content lives in ShelfScene/HUD. */}
      <div
        id="projects-track"
        ref={trackRef}
        aria-hidden="true"
        className="no-scrollbar pointer-events-none absolute inset-0 flex h-full w-full snap-x snap-mandatory overflow-x-auto opacity-0"
      >
        {projects.map((project) => (
          <div key={project.slug} data-project-card className="h-full w-full shrink-0 snap-start" />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 grid grid-cols-1 items-end gap-5 px-6 text-center sm:bottom-12 sm:grid-cols-[1fr_auto_1fr] sm:px-10 sm:text-left">
        <div className="order-2 mx-auto max-w-md sm:order-1 sm:mx-0">
          <p className="text-xs tracking-[0.3em] text-white/40 uppercase">
            {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
          <h3 className="font-display mt-1 text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
            {active.title}
          </h3>
          <p className="dither-text mt-2 line-clamp-2 text-sm text-white/60 sm:text-base">{active.description}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
            {active.tags.map((tag) => (
              <Badge key={tag} size="sm">
                {tag}
              </Badge>
            ))}
          </div>
          <Link
            to="/projects/$slug"
            params={{ slug: active.slug }}
            className="group font-display pointer-events-auto -my-2.5 mt-4 inline-flex items-center gap-2 py-2.5 text-base text-white/80 underline underline-offset-4 transition-colors hover:text-white"
          >
            View project
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="order-1 sm:order-2">
          <ProjectDots activeIndex={activeIndex} />
        </div>

        <div className="order-3 hidden sm:block" aria-hidden="true" />
      </div>
    </section>
  );
}

// One project fills the viewport at a time in a horizontal filmstrip.
// useSectionSnapScroll drives it on wheel input (one tick = one project);
// snap-x/snap-start here just make touch-swipe and any native horizontal
// scrolling (trackpad shift-scroll, arrow-drag) land cleanly on a card too.
// This is the fallback for touch/low-power/reduced-motion devices, where the
// 3D shelf's wheel-driven camera dolly either doesn't apply or isn't worth
// the render cost.
function FilmstripGallery() {
  const { trackRef, activeIndex } = useActiveProjectIndex();

  return (
    <section id="projects" className="relative h-dvh w-full overflow-hidden bg-surface">
      <div className="pointer-events-none absolute inset-x-0 top-8 z-10 flex flex-col items-center gap-1 text-center sm:top-16 sm:gap-2">
        {/* Same "X" motif that opens Hero and bookends Contact — without it,
            Projects reads as a different site pasted into the scroll. */}
        <div className="mb-1 opacity-30">
          <StaticCubeX size={40} />
        </div>
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
        {projects.map((project, index) => (
          <ActiveRevealGroup
            key={project.slug}
            as="div"
            data-project-card
            active={activeIndex === index}
            className="flex h-full w-full shrink-0 snap-start flex-col items-center justify-center gap-4 px-6 py-16 text-center sm:gap-4 sm:py-20 md:gap-6"
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
                  className="h-52 w-auto max-w-md rounded-2xl object-cover shadow-2xl sm:h-56 md:h-72 xl:h-96"
                />
              </Link>
            </RevealItem>
            <RevealItem as="div">
              <Link to="/projects/$slug" params={{ slug: project.slug }}>
                <DistortText
                  as="h3"
                  text={project.title}
                  className="font-display text-2xl font-semibold text-white sm:text-3xl md:text-5xl xl:text-6xl"
                />
              </Link>
            </RevealItem>
            <RevealItem
              as="p"
              className="dither-text line-clamp-2 max-w-lg text-sm text-white/60 sm:line-clamp-3 sm:text-base xl:max-w-xl xl:text-lg"
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
                className="group font-display -my-2.5 flex items-center gap-2 py-2.5 text-base text-white/80 underline underline-offset-4 transition-colors hover:text-white sm:text-lg md:text-xl"
              >
                View project
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </RevealItem>
          </ActiveRevealGroup>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2 sm:bottom-10">
        {projects.map((project, i) => (
          <MotionDot
            key={project.slug}
            className="h-1.5 w-1.5 rounded-full bg-white"
            animate={{ scale: i === activeIndex ? 1.4 : 1, opacity: i === activeIndex ? 1 : 0.25 }}
            transition={{ type: "spring", stiffness: 600, damping: 28 }}
          />
        ))}
      </div>
    </section>
  );
}

export default function GallerySection() {
  const { isLowPower, isCoarsePointer } = useDeviceCapability();
  const reducedMotion = usePrefersReducedMotion();

  if (isLowPower || isCoarsePointer || reducedMotion) {
    return <FilmstripGallery />;
  }

  return <ShelfGallery />;
}
