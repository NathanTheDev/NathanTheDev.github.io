import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

// Stagger variants for RevealGroup/RevealItem below.
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const ITEM_VARIANTS = {
  slide: {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  },
};

// Wraps a list of RevealItem children (e.g. the About stack pills, Contact
// link cards) so they fade/slide in one after another instead of all at
// once. Pair every RevealGroup with RevealItem children, not plain nodes.
export function RevealGroup({ as = "div", className, children, once = true, amount = 0.4, ...rest }) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  const Component = motion[as] ?? motion.div;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={containerVariants}
      {...rest}
    >
      {children}
    </Component>
  );
}

// Same stagger variants as RevealGroup, but driven by an explicit `active`
// boolean instead of whileInView/IntersectionObserver. GallerySection's
// filmstrip already tracks which card is current via activeIndex (the same
// state driving the dot indicators) — that's a more direct, reliable signal
// for "this card just became active" than viewport-intersection math on an
// element living inside a horizontally-scrolling container. Animates back
// to hidden when active goes false, so the outgoing card visibly resets.
export function ActiveRevealGroup({ as = "div", className, children, active, ...rest }) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  const Component = motion[as] ?? motion.div;
  return (
    <Component
      className={className}
      initial="hidden"
      animate={active ? "show" : "hidden"}
      variants={containerVariants}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function RevealItem({ as = "div", className, variant = "slide", children }) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const Component = motion[as] ?? motion.div;
  return (
    <Component className={className} variants={ITEM_VARIANTS[variant]}>
      {children}
    </Component>
  );
}

const DIRECTIONS = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
  none: {},
};

// Shared scroll-triggered entrance used across About/Contact/Projects so
// every section's reveal animation comes from one place instead of each
// component hand-rolling its own IntersectionObserver + rAF, as
// useSectionSnapScroll.js's animateScrollLeft used to before framer-motion
// was wired in. `once` defaults true — sections shouldn't re-animate every
// time they're scrolled back into view.
export default function Reveal({
  as = "div",
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.4,
}) {
  const reducedMotion = usePrefersReducedMotion();
  const Component = motion[as] ?? motion.div;

  if (reducedMotion) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const offset = DIRECTIONS[direction] ?? {};

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}
