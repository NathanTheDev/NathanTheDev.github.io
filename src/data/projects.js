export const projects = [
  {
    slug: "aurora-dashboard",
    title: "Aurora Dashboard",
    description:
      "A real-time analytics dashboard with live-updating charts and alerting, built for teams monitoring production systems.",
    image: "/images/projects/project-1.svg",
    tags: ["React", "TypeScript", "WebSockets"],
    links: { github: "https://github.com/NathanTheDev" },
  },
  {
    slug: "northwind-cli",
    title: "Northwind CLI",
    description:
      "A developer-friendly command-line tool for scaffolding and managing microservice deployments across environments.",
    image: "/images/projects/project-2.svg",
    tags: ["Node.js", "Docker", "CLI"],
    links: { github: "https://github.com/NathanTheDev" },
  },
  {
    slug: "wavelength",
    title: "Wavelength",
    description:
      "An audio visualization playground exploring WebGL shaders driven by real-time frequency analysis.",
    image: "/images/projects/project-3.svg",
    tags: ["Three.js", "Web Audio API", "GLSL"],
    links: { github: "https://github.com/NathanTheDev" },
  },
  {
    slug: "fieldnote",
    title: "Fieldnote",
    description:
      "A lightweight, offline-first note-taking app with end-to-end encrypted sync between devices.",
    image: "/images/projects/project-4.svg",
    tags: ["React Native", "SQLite", "Encryption"],
    links: { github: "https://github.com/NathanTheDev" },
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
