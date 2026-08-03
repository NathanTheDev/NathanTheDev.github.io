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
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <Reveal as="p" className="text-xs tracking-[0.3em] text-white/40 uppercase">
            About
          </Reveal>

          <DistortText
            text="Hi, I’m Nathan."
            className="font-display text-4xl font-semibold md:text-5xl xl:text-6xl"
          />

          <Reveal as="p" delay={0.1} className="text-lg text-white/60 leading-relaxed xl:text-xl">
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
          <AboutCubeMotif className="h-72 w-full xl:h-80" />
        </Reveal>
      </div>
    </section>
  );
}
