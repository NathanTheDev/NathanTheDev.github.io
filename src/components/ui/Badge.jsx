// Local, lightweight stand-in for shadcn/ui's Badge — pulling in the full
// shadcn toolchain (radix primitives, cva, components.json) for two variant
// pills isn't worth the dependency weight on a site this size. Replaces the
// three near-identical hand-rolled pill classNames that used to live in
// AboutSection, GallerySection, and $slug.jsx.
const VARIANTS = {
  tag: "bg-white/5 text-white/70 backdrop-blur-md",
  status: "bg-accent/90 text-black font-medium",
};

const SIZES = {
  sm: "px-2.5 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm",
  md: "px-3 py-1.5 text-sm",
};

export default function Badge({ children, variant = "tag", size = "md", className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full ${VARIANTS[variant]} ${SIZES[size]} ${className}`}>
      {children}
    </span>
  );
}
