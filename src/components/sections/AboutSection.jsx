import DistortText from "../three/DistortText";

const STACK = ["React", "TypeScript", "Node.js", "Three.js", "Python", "PostgreSQL"];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-dvh w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 py-20 text-white sm:py-24 md:py-32"
    >
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <p className="text-xs tracking-[0.3em] text-white/40 uppercase">About</p>

        <DistortText text="Hi, I’m Nathan." className="font-display text-3xl font-semibold md:text-4xl" />

        <p className="text-white/60 leading-relaxed">
          A recent graduate from UNSW with a bachelor’s in computer science and economics,
          a software engineer passionate about building reliable, maintainable, and
          well-documented software. I specialize in full-stack development and have
          hands-on experience with real-world systems, from backend architecture and
          databases to frontend interfaces and deployment pipelines, and leadership.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {STACK.map((item) => (
            <span
              key={item}
              className="rounded-full bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-md"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
