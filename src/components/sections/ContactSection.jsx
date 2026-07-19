import DistortText from "../three/DistortText";

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  );
}

function DownloadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}>
      <path d="M12 3v12m0 0-4-4m4 4 4-4" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

const LINKS = [
  {
    icon: GitHubIcon,
    label: "GitHub",
    sub: "@NathanTheDev",
    href: "https://github.com/NathanTheDev",
    external: true,
  },
  {
    icon: LinkedInIcon,
    label: "LinkedIn",
    sub: "Connect with me",
    href: "https://www.linkedin.com/in/nathan-parker-smith/",
    external: true,
  },
  {
    icon: MailIcon,
    label: "Email",
    sub: "nathan.smith1922@gmail.com",
    href: "mailto:nathan.smith1922@gmail.com",
    external: false,
  },
  {
    icon: DownloadIcon,
    label: "Resume",
    sub: "Download PDF",
    href: "/resume.pdf",
    download: "Nathan_Resume.pdf",
    external: false,
  },
];

function CubeMotif() {
  return (
    <div aria-hidden="true" className="mb-8 flex items-center justify-center gap-2 opacity-40">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-3 w-3 rotate-45 border border-white/60" style={{ opacity: 1 - i * 0.25 }} />
      ))}
    </div>
  );
}

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-black px-6 py-24 text-white"
    >
      <CubeMotif />

      <p className="text-xs tracking-[0.3em] text-white/40 uppercase">Contact</p>
      <DistortText
        text="Let's build something."
        className="font-display mt-4 max-w-xl text-center text-4xl font-semibold md:text-5xl"
      />
      <p className="mt-4 max-w-md text-center text-white/50">
        Always open to interesting projects, collaborations, or just talking shop.
      </p>

      <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            download={link.download}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="flex items-center gap-4 rounded-xl bg-white/5 px-5 py-4 backdrop-blur-md transition-colors hover:bg-white/10"
          >
            <link.icon className="h-5 w-5 shrink-0 text-white/80" />
            <span className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white">{link.label}</span>
              <span className="truncate text-xs text-white/50">{link.sub}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
