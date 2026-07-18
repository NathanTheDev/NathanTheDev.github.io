import DistortText from "../three/DistortText";

const STACK = ["React", "TypeScript", "Node.js", "Three.js", "Python", "PostgreSQL"];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 py-32 text-white"
    >
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <p className="text-xs tracking-[0.3em] text-white/40 uppercase">About</p>

        <DistortText
          text="Software developer, occasional pixel-pusher."
          className="font-display text-3xl font-semibold md:text-4xl"
        />

        <p className="text-white/60 leading-relaxed">
          I build things for the web — from backend systems to the small interactive
          details that make an interface feel alive. This site's homepage is one of
          those details: a good excuse to spend a weekend deep in shaders.
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
