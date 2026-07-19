import { useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import DistortedPlane from "./DistortedPlane";
import { useTextTexture } from "../../hooks/useTextTexture";
import { useRaycastPointerUniform } from "../../hooks/useRaycastPointerUniform";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

function DistortTextScene({ text, color, fontWeight, strength, rgbShiftMax, falloffRadius }) {
  const meshRef = useRef();
  const pointer = useRaycastPointerUniform(meshRef);
  const { texture, aspect } = useTextTexture(text, { color, fontWeight });
  const viewport = useThree((state) => state.viewport);

  if (!texture) return null;

  return (
    <DistortedPlane
      meshRef={meshRef}
      texture={texture}
      aspect={aspect}
      width={viewport.width}
      pointer={pointer}
      strength={strength}
      rgbShiftMax={rgbShiftMax}
      falloffRadius={falloffRadius}
      useAlphaChannel
    />
  );
}

// Same hover liquid/RGB-shift effect as the hero wordmark, reused for plain
// display headings — at a much lower strength/rgbShiftMax so it reads as a
// subtle accent rather than the hero's centerpiece effect. An invisible real
// `Tag` sibling reserves the exact responsive layout box (same className,
// so text-3xl/md:text-4xl breakpoints etc. still apply) that the canvas
// overlay is sized to. Falls back to plain text on low-power/coarse-pointer
// devices or reduced-motion, matching the rest of the site's convention.
export default function DistortText({
  as = "h2",
  text,
  className,
  color = "#ffffff",
  fontWeight,
  strength = 0.1,
  rgbShiftMax = 0.002,
  falloffRadius = 0.35,
}) {
  const Tag = as;
  const { isLowPower, isCoarsePointer } = useDeviceCapability();
  const reducedMotion = usePrefersReducedMotion();

  if (isLowPower || isCoarsePointer || reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <div className="relative inline-block">
      <Tag className={className} style={{ visibility: "hidden" }}>
        {text}
      </Tag>
      <Canvas
        style={{ position: "absolute", inset: 0 }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true }}
      >
        <DistortTextScene
          text={text}
          color={color}
          fontWeight={fontWeight}
          strength={strength}
          rgbShiftMax={rgbShiftMax}
          falloffRadius={falloffRadius}
        />
      </Canvas>
    </div>
  );
}
