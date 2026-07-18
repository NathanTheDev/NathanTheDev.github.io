import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Same ref shape as useHeroPointerUniform, but for meshes that aren't a
// fixed full-width DOM element (e.g. gallery thumbnails moving through a
// scrolling scene) — raycasts the shared pointer against the given mesh
// each frame to find local UV coordinates, rather than projecting from a
// DOM bounding rect.
export function useRaycastPointerUniform(meshRef) {
  const pointer = useRef({
    uv: new THREE.Vector2(-1, -1),
    velocity: new THREE.Vector2(0, 0),
    _target: new THREE.Vector2(-1, -1),
  });

  const { raycaster, camera, pointer: ndcPointer } = useThree();

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    raycaster.setFromCamera(ndcPointer, camera);
    const hit = raycaster.intersectObject(mesh, false)[0];
    if (hit?.uv) {
      pointer.current._target.copy(hit.uv);
    } else {
      pointer.current._target.set(-1, -1);
    }
  });

  return pointer;
}
