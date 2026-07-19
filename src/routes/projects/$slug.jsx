import { createFileRoute, Link } from "@tanstack/react-router";
import { getProjectBySlug } from "../../data/projects";

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-white">
        <p className="text-white/60">Project not found.</p>
        <Link to="/" className="text-white underline">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-[#0a0a0a] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <Link to="/" hash="projects" className="text-sm text-white/50 transition-colors hover:text-white">
          &larr; Back to projects
        </Link>

        <img src={project.image} alt={project.title} className="w-full rounded-2xl border border-white/10" />

        <div className="flex flex-col gap-4">
          <h1 className="font-display text-4xl font-semibold">{project.title}</h1>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>

          <p className="leading-relaxed text-white/70">{project.description}</p>

          <div className="mt-2 flex flex-wrap gap-3">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-white/5 px-5 py-3 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/10"
              >
                <GitHubIcon className="h-4 w-4" />
                View on GitHub
              </a>
            )}
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/5 px-5 py-3 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/10"
              >
                Live demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
