// Local stand-in for shadcn/ui's Button, scoped to the one "glass tile" link
// style reused across ContactSection and the project detail page's action
// row — see the note in Badge.jsx for why this is hand-rolled rather than a
// full shadcn install.
export default function Button({ href, download, external, icon: Icon, children, className = "" }) {
  return (
    <a
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`flex items-center gap-3 rounded-xl bg-white/5 px-5 py-3 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/10 ${className}`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-white/80" />}
      {children}
    </a>
  );
}
