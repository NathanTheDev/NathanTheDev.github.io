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
// Trackpads (and momentum/inertial scrolling generally) fire a long stream
// of many small-delta wheel events per physical swipe, not one — often
// lasting well past a single section/project's animation duration. This is
// how long a gap between wheel events has to be before we consider the
// physical gesture actually over; see armUnlock below.
const WHEEL_QUIET_MS = 120;
// Ceiling on how long one physical gesture can hold the lock open — a
// defensive backstop, not the primary mechanism (see MIN_MEANINGFUL_DELTA
// below), for input devices that never taper off. A real trackpad flick's
// momentum tail can keep emitting above-noise (MIN_MEANINGFUL_DELTA) deltas
// for over a second, so this has to clear that comfortably or it cuts a
// still-active swipe off mid-gesture — the next real event from the SAME
// swipe then reads as a brand-new one and fires a second advance, skipping
// more than one project/section per swipe (the bug this backstop is meant
// to prevent, reintroduced by being too tight).
const MAX_GESTURE_LOCK_MS = 1800;
// A trackpad's momentum tail decays from real, page-worthy deltas down to
// near-zero residual events before it actually stops. Below this magnitude
// a wheel event is noise, not gesture activity: it shouldn't extend the
// lock (or the site stays "stuck" for the whole slow decay, not just the
// real swipe) and it shouldn't be treated as a brand-new gesture either
// (or the very next dribble event right after unlock re-triggers another
// advance). Only "real" deltas count in either direction.
const MIN_MEANINGFUL_DELTA = 4;
// Touch has no wheel-style delta stream to read momentum off of, so section
// snapping there is gesture-shape-based instead: how far the finger has
// moved decides both which axis the swipe belongs to and whether it was
// deliberate. Below this many px of movement we haven't even learned the
// gesture's axis yet (a tap or a barely-there wobble shouldn't commit either
// way — small enough that real vertical swipes and real horizontal filmstrip
// swipes both clear it almost immediately).
const TOUCH_AXIS_LOCK_PX = 10;
// Once the gesture reads as vertical, this is how far it has to travel
// before it counts as an intentional "change section" swipe rather than a
// small drag — comparable to the swipe-to-dismiss thresholds most mobile UI
// uses, well past accidental finger movement but well under a full-height
// swipe.
const TOUCH_TRIGGER_PX = 60;

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

// Turns one wheel gesture (or, on touch, one vertical swipe) into one full-
// section jump (Home -> About -> ... ) using the same
// scrollIntoView({behavior:"smooth"}) call the nav links use, so the
// animation matches exactly. The Projects section is a horizontal filmstrip
// nested inside that vertical flow: on wheel input, while there are more
// project cards in the scrolled direction, a wheel tick moves sideways
// through them instead of leaving the section, only falling through to the
// previous/next outer section at the first/last card. On touch, horizontal
// movement through the filmstrip is real finger-driven swiping handled
// natively by the track's own scroll-snap (see GallerySection), so a
// vertical swipe there always leaves the section rather than needing to
// exhaust the cards first. Disabled entirely under reduced-motion, where
// free native scrolling is left alone.
export function useSectionSnapScroll() {
  const reducedMotion = usePrefersReducedMotion();
  const lockedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) return undefined;

    let unlockTimer;
    let gestureStartedAt = 0;

    // A fixed-duration lock that starts counting the moment the first event
    // in a gesture (wheel stream or touch drag) arrives expires mid-stream,
    // so later events from the SAME physical gesture get treated as fresh
    // gestures and keep advancing — one swipe could blow through every
    // section or project. Every meaningful event received while locked
    // pushes the unlock back out instead, so the lock only actually
    // releases once the gesture genuinely goes quiet — but never later than
    // MAX_GESTURE_LOCK_MS after the gesture started, so a slow-decaying
    // momentum tail can't hold the lock open forever.
    function armUnlock(ms) {
      window.clearTimeout(unlockTimer);
      const remaining = MAX_GESTURE_LOCK_MS - (Date.now() - gestureStartedAt);
      unlockTimer = window.setTimeout(() => {
        lockedRef.current = false;
      }, Math.max(0, Math.min(ms, remaining)));
    }

    // Shared by the wheel and touch handlers: jumps the page to the next/
    // previous outer section, positioning the filmstrip instantly if
    // Projects is the entry point. Returns false (without locking or
    // animating anything) if there's no section in that direction, so
    // callers can leave native behavior (e.g. rubber-banding) alone.
    function advanceSection(direction) {
      const sectionIndex = currentSectionIndex();
      const nextSectionIndex = sectionIndex + direction;
      if (nextSectionIndex < 0 || nextSectionIndex >= SECTION_IDS.length) return false;

      lockedRef.current = true;
      gestureStartedAt = Date.now();
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

      armUnlock(Math.max(SECTION_ANIMATION_MS, WHEEL_QUIET_MS));
      return true;
    }

    function handleWheel(event) {
      const meaningful = Math.abs(event.deltaY) >= MIN_MEANINGFUL_DELTA;

      if (lockedRef.current) {
        event.preventDefault();
        // Only real deltas keep the lock open — a dribble of near-zero
        // residual events doesn't extend it, so the lock still releases
        // shortly after the actual swipe ends rather than however long the
        // decay happens to trail on for.
        if (meaningful) armUnlock(WHEEL_QUIET_MS);
        return;
      }

      if (!meaningful) {
        // Swallow stray residual events instead of letting native scroll
        // act on them (they'd otherwise nudge document.body a few px) —
        // but don't treat them as a new gesture.
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
          gestureStartedAt = Date.now();
          animateScrollLeft(track, cards[nextProjectIndex].offsetLeft, PROJECT_ANIMATION_MS);
          armUnlock(Math.max(PROJECT_ANIMATION_MS, WHEEL_QUIET_MS));
          return;
        }
      }

      if (!advanceSection(direction)) return;
      event.preventDefault();
    }

    // Touch has no delta stream to read a gesture's shape off of the way
    // wheel events do, so this tracks raw finger position instead: where the
    // gesture started, and — once it's moved enough to tell — which axis it
    // belongs to. A horizontal drag is left alone entirely (that's the
    // Projects filmstrip's own native scroll-snap); a vertical drag is
    // hijacked to drive the same advanceSection used by wheel, once it's
    // moved far enough to read as deliberate.
    let touchStart = null;
    let touchAxis = null;

    function handleTouchStart(event) {
      if (event.touches.length !== 1) {
        touchStart = null;
        touchAxis = null;
        return;
      }
      const touch = event.touches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
      touchAxis = null;
    }

    function handleTouchMove(event) {
      if (!touchStart || event.touches.length !== 1) return;

      if (lockedRef.current) {
        // Block native scroll for the rest of this gesture while an
        // animation from a previous one is still settling.
        event.preventDefault();
        return;
      }

      const touch = event.touches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;

      if (touchAxis == null) {
        if (Math.abs(dx) < TOUCH_AXIS_LOCK_PX && Math.abs(dy) < TOUCH_AXIS_LOCK_PX) return;
        touchAxis = Math.abs(dy) > Math.abs(dx) ? "vertical" : "horizontal";
      }

      if (touchAxis !== "vertical") return;

      // Committed to a vertical gesture: hold the page still ourselves
      // (native free-scroll is what this hook replaces) until it either
      // clears the trigger distance or the finger lifts.
      event.preventDefault();
      if (Math.abs(dy) < TOUCH_TRIGGER_PX) return;

      advanceSection(dy < 0 ? 1 : -1);
      touchStart = null;
      touchAxis = null;
    }

    function handleTouchEnd() {
      touchStart = null;
      touchAxis = null;
    }

    document.body.addEventListener("wheel", handleWheel, { passive: false });
    document.body.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.body.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.body.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.body.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    return () => {
      document.body.removeEventListener("wheel", handleWheel);
      document.body.removeEventListener("touchstart", handleTouchStart);
      document.body.removeEventListener("touchmove", handleTouchMove);
      document.body.removeEventListener("touchend", handleTouchEnd);
      document.body.removeEventListener("touchcancel", handleTouchEnd);
      window.clearTimeout(unlockTimer);
    };
  }, [reducedMotion]);
}
