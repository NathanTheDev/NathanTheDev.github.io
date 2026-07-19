export const projects = [
  {
    slug: "ladder",
    title: "Ladder MVP",
    description:
      "Lead backend engineer on Ladder, a staffing agency startup — built the backend and database systems from scratch, shipping their MVP.",
    image: "/images/projects/ladder.webp",
    tags: ["TypeScript", "Express", "Zod", "Jest", "Postgres", "Supabase"],
    links: { site: "https://ladder.inc" },
    private: true,
  },
  {
    slug: "helm",
    title: "Helm",
    description:
      "A personal productivity dashboard — habit tracking, kanban project boards with time tracking, custom data tables, a real-time collaborative notes editor, and Google Calendar integration, all in one place.",
    image: "/images/projects/project-2.svg",
    tags: ["Next.js 16", "React 19", "Express", "Prisma", "Postgres", "Firebase Auth"],
    links: { github: "https://github.com/NathanTheDev/helm", live: "https://helm-six-self.vercel.app" },
  },
  {
    slug: "livecode",
    title: "LiveCode",
    description:
      "Headless real-time collaboration service powering Helm's notes feature — stores and syncs Yjs CRDT state over WebSockets, with Firebase-authenticated access control.",
    image: "/images/projects/project-3.svg",
    tags: ["Rust", "Axum", "sqlx", "Node.js", "y-websocket", "Yjs"],
    links: { github: "https://github.com/NathanTheDev/LiveCode" },
  },
  {
    slug: "gitrank",
    title: "GitRank",
    description:
      "Competitive ranking system for GitHub profiles — Elo rating and tier ranks based on repos, stars, forks, commits, issues, and PRs, plus head-to-head comparisons and a seasonal leaderboard. Built at the NextGen Ventures Hackathon.",
    image: "/images/projects/gitrank.webp",
    tags: ["TanStack Start", "React", "tRPC", "Postgres", "Prisma", "Python", "FastAPI"],
    links: { github: "https://github.com/joshua-poole/gitrank", devpost: "https://devpost.com/software/github-ranked-vqk476" },
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
