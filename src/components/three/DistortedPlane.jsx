import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./shaders/distortMaterial";

// Shared cursor-driven liquid distortion + chromatic aberration plane, used for
// both the hero wordmark texture and the gallery image textures (see DistortedPlane
// consumers: useTextTexture-backed CanvasTexture vs TextureLoader-backed image texture
// are both just THREE.Texture, so this component doesn't care which it got).
export default function DistortedPlane({
  texture,
  aspect = 1,
  width,
  strength = 1,
  rgbShiftMax = 0.02,
  falloffRadius = 0.5,
  ditherStrength = 0.45,
  ditherLevels = 10,
  ditherPixelSize = 6,
  useAlphaChannel = false,
  doubleSided = false,
  alwaysOnTop = false,
  pointer,
  meshRef,
  ...meshProps
}) {
  const materialRef = useRef();
  const localMeshRef = useRef();
  const mesh = meshRef ?? localMeshRef;

  const [planeWidth, planeHeight] = useMemo(() => {
    const w = width ?? 1;
    return [w, w / aspect];
  }, [width, aspect]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uTime = state.clock.elapsedTime;

    if (pointer?.current) {
      const p = pointer.current;
      const prevUv = p.uv.clone();
      const lerpFactor = Math.min(1, delta * 12);
      p.uv.lerp(p._target, lerpFactor);
      p.velocity.subVectors(p.uv, prevUv).multiplyScalar(delta > 0 ? 1 / delta : 0);
      material.uMouse = p.uv;
      material.uMouseVelocity = p.velocity;
    }
  });

  return (
    <mesh ref={mesh} renderOrder={alwaysOnTop ? 10 : 0} {...meshProps}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <distortMaterial
        ref={materialRef}
        uTexture={texture}
        uStrength={strength}
        uRgbShiftMax={rgbShiftMax}
        uFalloffRadius={falloffRadius}
        uAspect={[1, planeHeight / planeWidth]}
        uUseAlphaChannel={useAlphaChannel ? 1 : 0}
        uDitherStrength={ditherStrength}
        uDitherLevels={ditherLevels}
        uDitherPixelSize={ditherPixelSize}
        side={doubleSided ? THREE.DoubleSide : THREE.FrontSide}
        depthTest={!alwaysOnTop}
        transparent
      />
    </mesh>
  );
}
