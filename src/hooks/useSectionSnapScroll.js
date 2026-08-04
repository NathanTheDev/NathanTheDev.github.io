import { useEffect, useRef } from "react";
import { animate } from "framer-motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const SECTION_IDS = ["home", "about", "projects", "contact"];
const PROJECTS_INDEX = SECTION_IDS.indexOf("projects");
const SECTION_ANIMATION_MS = 450;
// Project-to-project is driven by framer-motion's animate() (below) rather
// than native scrollIntoView smooth-scroll, whose duration the browser
// controls.
const PROJECT_ANIMATION_MS = 260;

function animateScrollLeft(el, target, duration) {
  const start = el.scrollLeft;
  if (start === target) return;

  animate(start, target, {
    duration: duration / 1000,
    ease: "easeInOut",
    onUpdate: (latest) => el.scrollTo({ left: latest, behavior: "instant" }),
  });
}

function currentSectionIndex() {
  const scrollPos = document.body.scrollTop;
  let idx = 0;
  SECTION_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop - 10 <= scrollPos) idx = i;
  });
  return idx;
}

function getProjectCards() {
  const track = document.getElementById("projects-track");
  if (!track) return [];
  return Array.from(track.querySelectorAll("[data-project-card]"));
}

function currentProjectIndex(track, cards) {
  if (!cards.length) return 0;
  const scrollLeft = track.scrollLeft;
  let idx = 0;
  cards.forEach((card, i) => {
    if (card.offsetLeft - 10 <= scrollLeft) idx = i;
  });
  return idx;
}

// Turns one wheel gesture into one full-section jump (Home -> About -> ... )
// using the same scrollIntoView({behavior:"smooth"}) call the nav links use,
// so the animation matches exactly. The Projects section is a horizontal
// filmstrip nested inside that vertical flow: while there are more project
// cards in the scrolled direction, a wheel tick moves sideways through them
// instead of leaving the section; only once at the first/last card does it
// fall through to the previous/next outer section. Disabled entirely under
// reduced-motion, where free native scrolling is left alone.
export function useSectionSnapScroll() {
  const reducedMotion = usePrefersReducedMotion();
  const lockedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) return undefined;

    function unlockAfter(ms) {
      window.setTimeout(() => {
        lockedRef.current = false;
      }, ms);
    }

    function handleWheel(event) {
      if (lockedRef.current) {
        event.preventDefault();
        return;
      }

      const direction = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
      if (direction === 0) return;

      const sectionIndex = currentSectionIndex();

      if (sectionIndex === PROJECTS_INDEX) {
        const track = document.getElementById("projects-track");
        const cards = getProjectCards();
        const projectIndex = currentProjectIndex(track, cards);
        const nextProjectIndex = projectIndex + direction;

        if (nextProjectIndex >= 0 && nextProjectIndex < cards.length) {
          event.preventDefault();
          lockedRef.current = true;
          animateScrollLeft(track, cards[nextProjectIndex].offsetLeft, PROJECT_ANIMATION_MS);
          unlockAfter(PROJECT_ANIMATION_MS);
          return;
        }
      }

      const nextSectionIndex = sectionIndex + direction;
      if (nextSectionIndex < 0 || nextSectionIndex >= SECTION_IDS.length) return;

      event.preventDefault();
      lockedRef.current = true;
      document.getElementById(SECTION_IDS[nextSectionIndex]).scrollIntoView({ behavior: "smooth", block: "start" });

      if (nextSectionIndex === PROJECTS_INDEX) {
        // Position the filmstrip instantly (not via scrollIntoView, and not a
        // plain scrollLeft assignment either — the track has scroll-behavior:
        // smooth, which makes even direct scrollLeft writes animate). Both of
        // those would either fight the still-mid-animation outer vertical
        // scrollIntoView above (nudging body.scrollTop to bring the card
        // "into view") or visibly glide the filmstrip while the section is
        // still arriving. An explicit "instant" behavior sidesteps both.
        const track = document.getElementById("projects-track");
        const cards = getProjectCards();
        const entryCard = direction === 1 ? cards[0] : cards[cards.length - 1];
        if (track && entryCard) {
          track.scrollTo({ left: entryCard.offsetLeft, behavior: "instant" });
        }
      }

      unlockAfter(SECTION_ANIMATION_MS);
    }

    document.body.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.body.removeEventListener("wheel", handleWheel);
  }, [reducedMotion]);
}
