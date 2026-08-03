import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const SPRING = { stiffness: 150, damping: 15, mass: 0.1 };
const STRENGTH = 0.25;
const MotionDiv = motion.div;

// Cursor-following hover for Contact's link tiles — nudges toward the
// pointer within the tile bounds and springs back on leave. Reduced-motion
// gets a plain static wrapper.
export default function MagneticTile({ children, className = "" }) {
  const reducedMotion = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * STRENGTH);
    y.set((event.clientY - rect.top - rect.height / 2) * STRENGTH);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <MotionDiv
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </MotionDiv>
  );
}
