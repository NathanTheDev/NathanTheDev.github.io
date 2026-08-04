import { motion } from "framer-motion";
import StaticCubeX from "./StaticCubeX";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const MotionDiv = motion.div;

// Smaller, self-contained echo of the Hero's cube cluster — gives About a
// tie back to the site's one recurring 3D motif instead of being pure text,
// without needing a portrait/headshot asset.
//
// Deliberately always the static div-based echo, never its own live
// react-three-fiber <Canvas>: every DistortText/DistortImage instance
// already mounts its own WebGL context (there's no shared canvas/renderer
// on this site), and the homepage was already stacking up around a dozen
// of those (Hero + 4 nav links + both section headings + 4 gallery
// thumbnails + 4 gallery titles). Giving About a live Canvas too pushed
// that past the browser's concurrent-WebGL-context cap and evicted Hero's
// context ("Too many active WebGL contexts. Oldest context will be lost"),
// which is why the whole Hero scene went blank. One more static motif
// costs nothing; one more live context was the one too many.
//
// A slow CSS rotation (not WebGL) keeps it from reading as a dead screenshot
// of Hero's live, spinning cluster — About should feel like the same object,
// just quieter, not a still photo of it.
export default function AboutCubeMotif({ className = "", size = 300 }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className={`relative flex items-center justify-center ${className}`}>
      {/* Reads the motif as lit by the same source as Hero's bright scene,
          not a flat icon floating in a black void. */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 65%)" }}
      />
      <MotionDiv
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <StaticCubeX size={size} />
      </MotionDiv>
    </div>
  );
}
