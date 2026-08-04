import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const MotionDiv = motion.div;

// Previously a hard cut between the gallery filmstrip and a project's detail
// route with no transition at all. AnimatePresence + a route-keyed fade/rise
// gives every navigation a brief cross-fade instead.
function AnimatedOutlet() {
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <Outlet />;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionDiv
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Outlet />
      </MotionDiv>
    </AnimatePresence>
  );
}

export const Route = createRootRoute({
  component: AnimatedOutlet,
});
