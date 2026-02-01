import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden gap-8">
      <h1 className="text-6xl font-bold">Hi, I'm Nathan</h1>
      
      <div className="flex bg-black/40 backdrop-blur-md rounded-xl overflow-hidden shadow-xl">
        <button className="px-8 py-3 text-white hover:bg-white/10 transition-colors cursor-pointer">
          About
        </button>
        <a 
          href="https://github.com/NathanTheDev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-8 py-3 text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
        >
          Projects
        </a>
        <a 
          href="/resume.pdf" 
          download="Nathan_Resume.pdf"
          className="px-8 py-3 text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
        >
          Resume
        </a>
      </div>
    </div>
  ),
});