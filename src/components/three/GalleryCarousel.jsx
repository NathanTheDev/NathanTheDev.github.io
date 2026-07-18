import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useNavigate } from "@tanstack/react-router";
import DistortedPlane from "./DistortedPlane";
import { useRaycastPointerUniform } from "../../hooks/useRaycastPointerUniform";

const RADIUS = 3.6;
const PLANE_WIDTH = 2.6;
const PLANE_ASPECT = 4 / 3;

// Each card faces radially outward from its own position, so with only 4
// cards at 90deg spacing, at any moment 2 face the camera and 2 face away —
// doubleSided keeps those back-facing cards visible instead of getting
// backface-culled to nothing, so the ring reads as a continuous cylinder
// rather than 2 cards popping in and out of existence as it spins.
function GalleryItem({ project, angle, reducedMotion }) {
  const meshRef = useRef();
  const texture = useTexture(project.image);
  const pointer = useRaycastPointerUniform(meshRef);
  const navigate = useNavigate();

  const position = [RADIUS * Math.sin(angle), 0, RADIUS * Math.cos(angle)];

  return (
    <DistortedPlane
      meshRef={meshRef}
      texture={texture}
      aspect={PLANE_ASPECT}
      width={PLANE_WIDTH}
      position={position}
      rotation={[0, angle, 0]}
      pointer={pointer}
      strength={reducedMotion ? 0 : 1}
      rgbShiftMax={0.02}
      doubleSided
      onClick={() => navigate({ to: "/projects/$slug", params: { slug: project.slug } })}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    />
  );
}

// Rotates based on how far the page has scrolled through the gallery
// section (read from sectionRef each frame), not a scroll-jacked area of
// its own — the browser's native scroll is left completely alone. A slow
// idle spin plus a resting offset of half the angular spacing are layered
// on top so the ring never settles with one card dead-center-facing the
// camera (which hides every other card directly behind or off to the
// sides) — at rest you always see the curve of at least two neighboring
// cards, which is what actually reads as a "cylinder" rather than a flat
// single image.
export default function GalleryCarousel({ projects, sectionRef, reducedMotion = false }) {
  const groupRef = useRef();
  const idleRef = useRef(0);
  const restOffset = Math.PI / projects.length;

  useFrame((_, delta) => {
    const section = sectionRef.current;
    const group = groupRef.current;
    if (!section || !group) return;

    if (!reducedMotion) {
      idleRef.current += delta * 0.12;
    }

    const rect = section.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const total = rect.height + viewportH;
    const progressed = viewportH - rect.top;
    const progress = Math.min(1, Math.max(0, progressed / total));

    group.rotation.y = idleRef.current + restOffset + progress * Math.PI;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 5]} intensity={1.1} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} />

      <Suspense fallback={null}>
        {projects.map((project, i) => (
          <GalleryItem
            key={project.slug}
            project={project}
            angle={(i / projects.length) * Math.PI * 2}
            reducedMotion={reducedMotion}
          />
        ))}
      </Suspense>
    </group>
  );
}
