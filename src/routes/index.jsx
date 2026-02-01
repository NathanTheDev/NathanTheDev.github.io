import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";


export const Route = createFileRoute("/")({
  component: () => {
    const text = "Hi, I'm Nathan.";
    const typingSpeed = 0.1;
    const totalDuration = text.length * typingSpeed;

    return (
      <div className="flex flex-col items-center justify-center h-screen overflow-hidden gap-8">
        <h1 className="text-4xl md:text-6xl font-bold flex items-center whitespace-pre">
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, display: "none" }}
              animate={{ opacity: 1, display: "inline" }}
              transition={{
                delay: index * typingSpeed,
                duration: 0,
              }}
            >
              {char}
            </motion.span>
          ))}
          
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{
              delay: totalDuration,
              duration: 0,
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "steps(2)",
              }}
              className="ml-1"
            >
              |
            </motion.span>
          </motion.span>
        </h1>
        
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
    );
  },
});