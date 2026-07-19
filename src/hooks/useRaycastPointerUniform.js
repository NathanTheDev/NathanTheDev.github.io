import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Same ref shape as useHeroPointerUniform, but for meshes that aren't a
// fixed full-width DOM element (e.g. gallery thumbnails moving through a
// scrolling scene) — raycasts the shared pointer against the given mesh
// each frame to find local UV coordinates, rather than projecting from a
// DOM bounding rect.
//
// R3F's ambient NDC pointer defaults to (0,0) — the canvas's own center —
// until a real pointermove lands on that canvas's DOM element. For a small
// per-element canvas sized tightly around a text plane (nav links, section
// headings), (0,0) *is* dead-center of the text, so raycasting against it
// unconditionally reports a permanent "hover" the instant the canvas mounts,
// with no real cursor interaction. Gate raycasting on having seen a genuine
// pointermove on this canvas first, and drop back to "not hovering" on
// pointerleave, so idle canvases stay undistorted.
export function useRaycastPointerUniform(meshRef) {
  const pointer = useRef({
    uv: new THREE.Vector2(-1, -1),
    velocity: new THREE.Vector2(0, 0),
    _target: new THREE.Vector2(-1, -1),
  });
  const hasPointerRef = useRef(false);

  const { raycaster, camera, pointer: ndcPointer, gl } = useThree();

  useEffect(() => {
    const dom = gl.domElement;

    function handleMove() {
      hasPointerRef.current = true;
    }
    function handleLeave() {
      hasPointerRef.current = false;
      pointer.current._target.set(-1, -1);
    }

    dom.addEventListener("pointermove", handleMove);
    dom.addEventListener("pointerleave", handleLeave);
    return () => {
      dom.removeEventListener("pointermove", handleMove);
      dom.removeEventListener("pointerleave", handleLeave);
    };
  }, [gl]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh || !hasPointerRef.current) return;

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
