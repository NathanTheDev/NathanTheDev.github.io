const LAYOUTS = {
  row: "flex items-center gap-3 px-5 py-3",
  column: "flex flex-col items-center gap-2 px-6 py-8 text-center",
};

// Local stand-in for shadcn/ui's Button, scoped to the one "glass tile" link
// style reused across ContactSection and the project detail page's action
// row — see the note in Badge.jsx for why this is hand-rolled rather than a
// full shadcn install. `layout` picks the spacing/alignment variant rather
// than leaving callers to override gap/padding utilities via className,
// which Tailwind can't guarantee wins over the base classes.
export default function Button({
  href,
  download,
  external,
  icon: Icon,
  iconClassName = "h-4 w-4 shrink-0 text-white/80",
  layout = "row",
  children,
  className = "",
}) {
  return (
    <a
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${LAYOUTS[layout]} rounded-xl bg-white/5 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/10 ${className}`}
    >
      {Icon && <Icon className={iconClassName} />}
      {children}
    </a>
  );
}
