import StaticCubeX from "./StaticCubeX";

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
export default function AboutCubeMotif({ className = "" }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center ${className}`}>
      <StaticCubeX size={220} />
    </div>
  );
}
