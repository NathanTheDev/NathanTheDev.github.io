import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useNavigate } from "@tanstack/react-router";
import DistortedPlane from "./DistortedPlane";
import { useRaycastPointerUniform } from "../../hooks/useRaycastPointerUniform";

const RADIUS = 4.5;
const PLANE_WIDTH = 3;
const PLANE_ASPECT = 4 / 3;

function GalleryItem({ project, angle }) {
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
      strength={1}
      rgbShiftMax={0.02}
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
// its own — the browser's native scroll is left completely alone.
export default function GalleryCarousel({ projects, sectionRef }) {
  const groupRef = useRef();

  useFrame(() => {
    const section = sectionRef.current;
    const group = groupRef.current;
    if (!section || !group) return;

    const rect = section.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const total = rect.height + viewportH;
    const progressed = viewportH - rect.top;
    const progress = Math.min(1, Math.max(0, progressed / total));

    group.rotation.y = progress * Math.PI;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 5]} intensity={1.1} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} />

      <Suspense fallback={null}>
        {projects.map((project, i) => (
          <GalleryItem key={project.slug} project={project} angle={(i / projects.length) * Math.PI * 2} />
        ))}
      </Suspense>
    </group>
  );
}
