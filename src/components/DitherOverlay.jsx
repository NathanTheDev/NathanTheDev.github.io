import { useDeviceCapability } from "../hooks/useDeviceCapability";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// Fallback for the plain-DOM regions the WebGL dithering in distortMaterial
// (DistortText/DistortImage) and CubeCluster's onBeforeCompile patch can't
// reach — About's bio paragraph, badge/eyebrow text, Contact's sub-labels,
// and the reduced-motion/low-power plain-text fallbacks those components
// already fall back to. Same 4x4 Bayer matrix as the WebGL shader (see
// shaders/dither.js), baked into public/dither-tile.svg, so it reads as one
// dithering system rather than two unrelated patterns. Gated behind the
// same capability/motion checks as every other visual effect on the site.
export default function DitherOverlay() {
  const { isLowPower, isCoarsePointer } = useDeviceCapability();
  const reducedMotion = usePrefersReducedMotion();

  if (isLowPower || isCoarsePointer || reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage: "url('/dither-tile.svg')",
        backgroundSize: "16px 16px",
        backgroundRepeat: "repeat",
      }}
    />
  );
}
