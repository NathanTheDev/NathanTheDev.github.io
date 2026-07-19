export const projects = [
  {
    slug: "ladder",
    title: "Ladder MVP",
    description:
      "Lead backend engineer on Ladder, a staffing agency startup. Built the backend and database systems from scratch, shipping their MVP.",
    longDescription:
      "Lead backend engineer on Ladder, a staffing agency startup built as part of the UNSW Founders 10x Accelerator. Led a team of 6 engineers to design and deliver two production backend services powering the company's MVP.",
    highlights: [
      "Owned and architected backend systems to support 5,000+ users, planning for integration with schools and large scale onboarding using Express, Supabase (PostgreSQL, Auth), and Zod for schema validation, with Zod OpenAPI generating contract first API documentation.",
      "Established local development and testing workflows using local Supabase and Jest, supporting both integration and unit testing and improving trust between frontend and backend.",
      "Collaborated closely with frontend engineers to design APIs consumed by a React app using TanStack Query, shadcn/ui, and Tailwind CSS.",
      "Owned backend deployment and infrastructure, implementing CI/CD with GitHub Actions and provisioning cloud resources on AWS using Terraform.",
      "Oversaw and guided machine learning development, supporting the design of a matchmaking system built on a graph neural network.",
      "Built a local admin dashboard (React + Express) and packaged it as a Tauri desktop app, enabling offline access and simplifying internal operations.",
    ],
    image: "/images/projects/ladder.webp",
    tags: ["TypeScript", "Express", "Zod", "Jest", "Postgres", "Supabase"],
    links: { site: "https://ladder.inc" },
    private: true,
  },
  {
    slug: "helm",
    title: "Helm",
    status: "In progress",
    description:
      "A personal productivity dashboard featuring habit tracking, kanban project boards with time tracking, custom data tables, a real time collaborative notes editor, and Google Calendar integration, all in one place.",
    highlights: [
      "Built habit tracking with streaks and a completion history chart, alongside kanban project boards with drag and drop, tags, due dates, sub tasks, and per task time tracking rolled up into a worklog.",
      "Built custom, user defined data tables supporting arbitrary field types, sorting, filtering, and drag to reorder rows and columns.",
      "Built a markdown notes editor with live syntax highlighting and real time collaborative editing, powered by LiveCode, a separate collaboration service.",
      "Integrated Google Calendar via OAuth, surfacing upcoming events on the home dashboard.",
      "Implemented Firebase authentication with every route scoped to the signed in user.",
      "Designed a customizable appearance system with theme presets, a color theme builder, font picker, and a reorderable dashboard.",
    ],
    image: "/images/projects/helm.webp",
    tags: ["Next.js 16", "React 19", "Express", "Prisma", "Postgres", "Firebase Auth"],
    links: { github: "https://github.com/NathanTheDev/helm", live: "https://helm-six-self.vercel.app" },
  },
  {
    slug: "livecode",
    title: "LiveCode",
    description:
      "Headless real time collaboration service powering Helm's notes feature. Stores and syncs Yjs CRDT state over WebSockets, with Firebase authenticated access control.",
    highlights: [
      "Built a Rust and Axum backend using sqlx and Postgres to store each note's raw Yjs CRDT state and an active flag.",
      "Ran a Node y-websocket service as the real time sync endpoint, requiring a valid Firebase ID token to join a room.",
      "Enforced access control at the socket layer, polling note status every 5 seconds and disconnecting any client whose note is deactivated mid session.",
      "Designed the service to be headless and consumed entirely by Helm, which owns note titles, ownership, and listing, while LiveCode only holds notes that are actively or recently live collaborative.",
    ],
    image: "/images/projects/livecode.webp",
    tags: ["Rust", "Axum", "sqlx", "Node.js", "y-websocket", "Yjs"],
    links: { github: "https://github.com/NathanTheDev/LiveCode" },
  },
  {
    slug: "gitrank",
    title: "GitRank",
    description:
      "Competitive ranking system for GitHub profiles with Elo rating and tier ranks based on repos, stars, forks, commits, issues, and PRs, plus head to head comparisons and a seasonal leaderboard. Built at the NextGen Ventures Hackathon.",
    highlights: [
      "Scores GitHub profiles with a weighted formula covering commit message quality, lines changed, consistency, time of day, and day of week.",
      "Grades commit message quality through a machine learning pipeline (sentence transformer embeddings, a logistic regression classifier, and FAISS nearest neighbor retrieval) served by a FastAPI microservice.",
      "Runs an MMR system with daily rating deltas, time decay, and inactivity penalties, placing users into tiers from Plastic through Linus.",
      "Built with TanStack Start, tRPC, and shadcn/ui on the frontend, backed by Prisma and a serverless Neon Postgres database.",
      "Includes seasonal leaderboards and head to head profile comparisons.",
    ],
    image: "/images/projects/gitrank.webp",
    tags: ["TanStack Start", "React", "tRPC", "Postgres", "Prisma", "Python", "FastAPI"],
    links: { github: "https://github.com/joshua-poole/gitrank", devpost: "https://devpost.com/software/github-ranked-vqk476" },
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
