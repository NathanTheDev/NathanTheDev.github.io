import DistortText from "../three/DistortText";
import AboutCubeMotif from "../three/AboutCubeMotif";
import Badge from "../ui/Badge";
import Reveal, { RevealGroup, RevealItem } from "../motion/Reveal";

const STACK = [
  "JavaScript",
  "C",
  "C++",
  "Rust",
  "Python",
  "PostgreSQL",
  "AWS",
  "Git",
  "React",
  "Node.js",
  "WebSockets",
  "Docker",
  "Linux",
  "Tauri",
  "Supabase",
  "Express",
  "Three.js",
  "Tailwind CSS",
  "TanStack Router",
  "Vite",
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-dvh w-full flex-col items-center justify-center bg-surface px-6 py-20 text-white sm:py-24 md:py-32"
    >
      {/* Echoes the light Hero fades out of just above — keeps the seam a
          bleed instead of a cut. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-white/[0.08] to-transparent"
      />

      <div className="relative grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          {/* Same motif as the lg:block one further down, just smaller and
              stacked above the copy instead of beside it — below lg there's
              no side column to put it in, but it shouldn't just vanish. */}
          <Reveal as="div" className="lg:hidden">
            <AboutCubeMotif className="h-32 w-32 sm:h-40 sm:w-40" size={160} />
          </Reveal>

          <Reveal as="p" className="text-xs tracking-[0.3em] text-white/40 uppercase">
            About
          </Reveal>

          <DistortText
            text="Hi, I’m Nathan."
            className="font-display text-4xl font-semibold md:text-5xl xl:text-6xl"
          />

          <Reveal
            as="p"
            delay={0.1}
            className="dither-text max-w-md text-left text-lg text-white/60 leading-relaxed sm:max-w-lg lg:max-w-none xl:text-xl"
          >
            A recent graduate from UNSW with a bachelor’s in computer science and economics,
            a software engineer passionate about building reliable, maintainable, and
            well documented software. I specialize in full stack development and have
            hands on experience with real world systems, from backend architecture and
            databases to frontend interfaces and deployment pipelines, and leadership.
          </Reveal>

          <RevealGroup className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
            {STACK.map((item) => (
              <RevealItem key={item} as="span">
                <Badge>{item}</Badge>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal as="div" direction="right" delay={0.15} className="hidden lg:block">
          <AboutCubeMotif className="h-80 w-full xl:h-96" size={300} />
        </Reveal>
      </div>
    </section>
  );
}
