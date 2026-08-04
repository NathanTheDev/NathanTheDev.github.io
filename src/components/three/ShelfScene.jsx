import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "../../data/projects";

// Cards recede into depth along -z, alternating x offset and y rotation like
// books leaning on a shelf. Spacing/dimensions match the original mockup 1:1
// so the proportions (card size vs. gap vs. camera fov) that read well there
// carry over untouched.
const SPACING = 6.5;
const CARD_WIDTH = 3.4;
const CARD_HEIGHT = 2.1;
const CARD_ASPECT = CARD_WIDTH / CARD_HEIGHT;

// object-fit: cover equivalent for a THREE.Texture — crops the wider axis so
// project screenshots of any aspect ratio fill the card face without
// stretching.
function applyCoverUV(texture) {
  const img = texture.image;
  if (!img) return;
  // useTexture doesn't tag loaded textures as sRGB color data, so an unlit
  // material (frontMaterial below) samples them as if linear and renders
  // washed out — this is what actually corrects it, not tonemapping.
  texture.colorSpace = THREE.SRGBColorSpace;
  const imgAspect = img.width / img.height;
  if (imgAspect > CARD_ASPECT) {
    const scale = CARD_ASPECT / imgAspect;
    texture.repeat.set(scale, 1);
    texture.offset.set((1 - scale) / 2, 0);
  } else {
    const scale = imgAspect / CARD_ASPECT;
    texture.repeat.set(1, scale);
    texture.offset.set(0, (1 - scale) / 2);
  }
  texture.needsUpdate = true;
}

function Card({ position, rotationY, texture, groupRef, onMaterials }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(CARD_WIDTH, CARD_HEIGHT, 0.12), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  // Unlit on purpose: the key/rim lights are tuned for the dark bevel
  // (sideMaterial) to give the cards depth. Letting them hit the image too
  // blows out light-UI screenshots (e.g. Helm's white dashboard) instead of
  // just reading the source colors.
  const frontMaterial = useMemo(() => {
    if (texture) applyCoverUV(texture);
    const material = new THREE.MeshBasicMaterial({ map: texture ?? null, transparent: true });
    // Read as a flat printed photo, not a lit/foggy scene object — the depth
    // fog graying out unfocused cards is a nice recession cue on the dark
    // bevel, but on the image itself it just looks like a dirty screen.
    material.toneMapped = false;
    material.fog = false;
    return material;
  }, [texture]);
  const sideMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.85, metalness: 0.1, transparent: true }),
    [],
  );
  const materials = useMemo(
    () => [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, sideMaterial],
    [sideMaterial, frontMaterial],
  );

  useEffect(() => {
    onMaterials({ front: frontMaterial, side: sideMaterial });
  }, [frontMaterial, sideMaterial, onMaterials]);

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={geometry} material={materials} />
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={0xffffff} transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

// Owns both the scroll-driven camera dolly and the per-card focus falloff in
// a single useFrame so the two stay in sync without relying on React render
// or cross-component useFrame ordering. activeIndexRef is a ref (not state)
// so scroll updates don't re-render the r3f tree — only the animation loop
// reads it, every frame.
function Shelf({ activeIndexRef }) {
  const textures = useTexture(projects.map((p) => p.image));
  const groupRefs = useRef([]);
  const materialRefs = useRef([]);
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
    const ease = Math.min(1, delta * 4.2);
    cameraZRef.current += (targetZ - cameraZRef.current) * ease;
    state.camera.position.z = cameraZRef.current;
    state.camera.lookAt(0, 0, state.camera.position.z - SPACING * 0.5);

    cards.forEach((card, i) => {
      const group = groupRefs.current[i];
      const mats = materialRefs.current[i];
      if (!group || !mats) return;
      const dist = Math.abs(card.position[2] - (state.camera.position.z - SPACING * 0.5));
      const focus = Math.max(0, 1 - dist / (SPACING * 1.4));
      const scale = 0.85 + focus * 0.15;
      group.scale.set(scale, scale, 1);
      const opacity = 0.32 + focus * 0.68;
      mats.front.opacity = opacity;
      mats.side.opacity = opacity;
    });
  });

  return cards.map((card, i) => (
    <Card
      key={card.slug}
      position={card.position}
      rotationY={card.rotationY}
      texture={textures[i]}
      groupRef={(el) => {
        groupRefs.current[i] = el;
      }}
      onMaterials={(mats) => {
        materialRefs.current[i] = mats;
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
      {/* Fog matches the surface color so the grid's distant lines fade out
          before their spacing collapses below a pixel and moirés into solid
          bands — a plain GridHelper with no falloff did exactly that. */}
      <fog attach="fog" args={[0x0a0a0a, 6, 26]} />
      <gridHelper args={[60, 24, 0x222222, 0x161616]} position={[0, -2.4, 0]} />
      <Suspense fallback={null}>
        <Shelf activeIndexRef={activeIndexRef} />
      </Suspense>
    </Canvas>
  );
}
