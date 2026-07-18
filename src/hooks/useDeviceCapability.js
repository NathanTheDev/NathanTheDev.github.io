import { useEffect, useState } from "react";

// Touch devices get the static fallback regardless of raw performance —
// there's no persistent cursor to drive the distortion effect anyway, so
// the WebGL cost buys nothing there.
function computeCapability() {
  if (typeof window === "undefined") {
    return { isLowPower: false, isCoarsePointer: false };
  }

  const cores = navigator.hardwareConcurrency || 4;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  // Narrow viewport is a layout concern, not a hardware one — a resized
  // desktop window shouldn't drop to the static fallback. Only genuinely
  // low core counts do.
  const isLowPower = cores <= 2;

  return { isLowPower, isCoarsePointer };
}

export function useDeviceCapability() {
  const [capability, setCapability] = useState(computeCapability);

  useEffect(() => {
    function handleResize() {
      setCapability(computeCapability());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return capability;
}
