import { createFileRoute, Link } from "@tanstack/react-router";
import { getProjectBySlug } from "../../data/projects";

export const Route = createFileRoute("/projects/$slug")({
  component: () => {
    const { slug } = Route.useParams();
    const project = getProjectBySlug(slug);

    if (!project) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-white">
          <p className="text-white/60">Project not found.</p>
          <Link to="/" className="text-white underline">
            Back home
          </Link>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-white">
        <p className="text-white/40 text-sm">Project detail placeholder</p>
        <h1 className="text-3xl font-bold">{project.title}</h1>
      </div>
    );
  },
});
