import { useEffect, useRef } from "react";
import * as THREE from "three";

// Tracks normalized cursor position relative to a DOM container (e.g. the
// hero canvas wrapper) and exposes it as a ref shape DistortedPlane can
// consume: { uv, velocity, _target }. uv/velocity are smoothed and computed
// per-frame inside DistortedPlane's useFrame; this hook only ever writes
// the raw instantaneous _target, off DOM pointermove events (not React
// state, so it never triggers a re-render).
export function useHeroPointerUniform(containerRef) {
  const pointer = useRef({
    uv: new THREE.Vector2(-1, -1),
    velocity: new THREE.Vector2(0, 0),
    _target: new THREE.Vector2(-1, -1),
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    function handlePointerMove(event) {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      pointer.current._target.set(x, y);
    }

    function handlePointerLeave() {
      pointer.current._target.set(-1, -1);
    }

    window.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [containerRef]);

  return pointer;
}
