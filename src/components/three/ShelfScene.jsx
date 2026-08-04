import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useNavigate } from "@tanstack/react-router";
import * as THREE from "three";
import DistortedPlane from "./DistortedPlane";
import { useRaycastPointerUniform } from "../../hooks/useRaycastPointerUniform";
import { projects } from "../../data/projects";

// Cards recede into depth along -z, alternating x offset and y rotation like
// books leaning on a shelf. Spacing/dimensions match the original mockup 1:1
// so the proportions (card size vs. gap vs. camera fov) that read well there
// carry over untouched.
const SPACING = 6.5;
const CARD_WIDTH = 3.4;
const CARD_HEIGHT = 2.1;
const CARD_ASPECT = CARD_WIDTH / CARD_HEIGHT;

// object-fit: cover equivalent for a texture of arbitrary aspect ratio —
// crops the wider axis instead of stretching. distortMaterial's shader reads
// these as plain uniforms (uUvRepeat/uUvOffset), not THREE's built-in
// texture.repeat/offset transform, since it samples the texture directly.
function computeCoverUV(texture) {
  const img = texture.image;
  // useTexture doesn't tag loaded textures as sRGB color data, and this
  // custom shader doesn't get the automatic decode built-in materials get —
  // without this the images render visibly washed out.
  texture.colorSpace = THREE.SRGBColorSpace;
  if (!img) return { repeat: [1, 1], offset: [0, 0] };
  const imgAspect = img.width / img.height;
  if (imgAspect > CARD_ASPECT) {
    const scale = CARD_ASPECT / imgAspect;
    return { repeat: [scale, 1], offset: [(1 - scale) / 2, 0] };
  }
  const scale = imgAspect / CARD_ASPECT;
  return { repeat: [1, scale], offset: [0, (1 - scale) / 2] };
}

// The clickable, hover-distorting image plane sitting just in front of the
// card's box (see Card below). Reuses the same distortMaterial-driven liquid
// warp as the rest of the site's images/text — this is what the old 2D
// filmstrip's DistortImage cards had before the 3D shelf replaced them, and
// what "bring the hover effect back" means here.
function CardImage({ texture, slug }) {
  const meshRef = useRef();
  const navigate = useNavigate();
  const pointer = useRaycastPointerUniform(meshRef);
  const uv = useMemo(() => computeCoverUV(texture), [texture]);

  function handleClick(event) {
    event.stopPropagation();
    navigate({ to: "/projects/$slug", params: { slug } });
  }

  function handlePointerOver(event) {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  }

  function handlePointerOut() {
    document.body.style.cursor = "auto";
  }

  return (
    <DistortedPlane
      meshRef={meshRef}
      texture={texture}
      aspect={CARD_ASPECT}
      width={CARD_WIDTH}
      position={[0, 0, 0.065]}
      pointer={pointer}
      strength={0.4}
      rgbShiftMax={0.008}
      falloffRadius={0.4}
      uvRepeat={uv.repeat}
      uvOffset={uv.offset}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}

function Card({ position, rotationY, texture, slug, groupRef }) {
  // Now just the dark bevel/frame behind CardImage — the image itself is a
  // separate plane (see CardImage) so it can carry its own distortMaterial
  // hover effect instead of a flat baked-in texture face.
  const geometry = useMemo(() => new THREE.BoxGeometry(CARD_WIDTH, CARD_HEIGHT, 0.12), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={0x141414} roughness={0.85} metalness={0.1} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={0xffffff} transparent opacity={0.25} />
      </lineSegments>
      <CardImage texture={texture} slug={slug} />
    </group>
  );
}

// Owns the scroll-driven camera dolly and the per-card focus falloff (scale
// only — opacity used to fade unfocused cards too, but that read as the
// images going transparent, so focus is now a size cue alone). activeIndexRef
// is a ref (not state) so scroll updates don't re-render the r3f tree — only
// the animation loop reads it, every frame.
function Shelf({ activeIndexRef }) {
  const textures = useTexture(projects.map((p) => p.image));
  const groupRefs = useRef([]);
  const cameraZRef = useRef(5);

  const cards = useMemo(
    () =>
      projects.map((project, i) => ({
        slug: project.slug,
        position: [i % 2 === 0 ? -0.6 : 0.6, 0, -i * SPACING],
        rotationY: i % 2 === 0 ? 0.18 : -0.18,
      })),
    [],
  );

  useFrame((state, delta) => {
    const targetZ = 5 - activeIndexRef.current * SPACING;
    const ease = Math.min(1, delta * 11);
    cameraZRef.current += (targetZ - cameraZRef.current) * ease;
    state.camera.position.z = cameraZRef.current;
    state.camera.lookAt(0, 0, state.camera.position.z - SPACING * 0.5);

    cards.forEach((card, i) => {
      const group = groupRefs.current[i];
      if (!group) return;
      const dist = Math.abs(card.position[2] - (state.camera.position.z - SPACING * 0.5));
      const focus = Math.max(0, 1 - dist / (SPACING * 1.4));
      const scale = 0.85 + focus * 0.15;
      group.scale.set(scale, scale, 1);
    });
  });

  return cards.map((card, i) => (
    <Card
      key={card.slug}
      position={card.position}
      rotationY={card.rotationY}
      texture={textures[i]}
      slug={card.slug}
      groupRef={(el) => {
        groupRefs.current[i] = el;
      }}
    />
  ));
}

// Full-bleed r3f canvas for the projects shelf. Deliberately a single Canvas
// (unlike the old per-card DistortImage/DistortText canvases this replaces)
// to avoid the WebGL context exhaustion the homepage hit previously.
export default function ShelfScene({ activeIndex }) {
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <Canvas
      className="absolute inset-0"
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 5], fov: 45 }}
    >
      <ambientLight intensity={1.1} color={0x404040} />
      <directionalLight position={[4, 6, 8]} intensity={1.2} />
      <directionalLight position={[-5, -2, -4]} intensity={0.5} color={0xfbbf24} />
      <Suspense fallback={null}>
        <Shelf activeIndexRef={activeIndexRef} />
      </Suspense>
    </Canvas>
  );
}
