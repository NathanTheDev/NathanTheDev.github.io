const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export default function SectionMenu() {
  return (
    <nav className="flex items-center overflow-hidden rounded-xl bg-black/40 shadow-xl backdrop-blur-md">
      {LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="px-6 py-3 text-sm text-white transition-colors hover:bg-white/10"
        >
          {link.label}
        </a>
      ))}
      <a
        href="https://github.com/NathanTheDev"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="flex items-center justify-center border-l border-white/10 px-5 py-3 text-white transition-colors hover:bg-white/10"
      >
        <GitHubIcon className="h-4 w-4" />
      </a>
    </nav>
  );
}
