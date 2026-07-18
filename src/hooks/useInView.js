import { useEffect, useRef, useState } from "react";

// Once true, stays true — used to lazy-mount a WebGL canvas the first time
// its section nears the viewport rather than paying for it on initial load.
export function useInView({ rootMargin = "200px" } = {}) {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
}
