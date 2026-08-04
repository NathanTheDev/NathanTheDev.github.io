import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getProjectBySlug } from "../../data/projects";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import DistortText from "../../components/three/DistortText";
import DistortImage from "../../components/three/DistortImage";
import { RevealGroup, RevealItem } from "../../components/motion/Reveal";

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

  // Landing here from the projects shelf/filmstrip leaves body scroll
  // wherever the homepage was (deep into the Projects section) — this is a
  // separate route/page, so it should always open at its own top rather than
  // inheriting that position. "instant" avoids a visible scroll-down glide.
  useEffect(() => {
    document.body.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!project) {
    return (
      <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-surface text-white">
        <p className="text-white/60">Project not found.</p>
        <Link to="/" className="text-white underline">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-surface px-6 py-16 text-white">
      <RevealGroup as="div" className="mx-auto flex max-w-3xl flex-col gap-8">
        <RevealItem as="div">
          <Link to="/" hash="projects" className="text-sm text-white/50 transition-colors hover:text-white">
            &larr; Back to projects
          </Link>
        </RevealItem>

        <RevealItem as="div" variant="scale" className="flex justify-center">
          {/* DistortImage sizes off a fixed height (its proven usage
              pattern, matching GallerySection's thumbnails) rather than
              w-full — its inline-block wrapper can't resolve a percentage
              width against an auto-width ancestor. */}
          <DistortImage
            src={project.image}
            alt={project.title}
            className="h-56 w-auto max-w-full rounded-2xl border border-white/10 object-cover sm:h-72 md:h-96"
          />
        </RevealItem>

        <div className="flex flex-col gap-4">
          <RevealItem as="div" className="flex flex-wrap items-center gap-3">
            <DistortText as="h1" text={project.title} className="font-display text-4xl font-semibold" />
            {project.status && (
              <Badge variant="status" size="sm">
                {project.status}
              </Badge>
            )}
          </RevealItem>

          <RevealItem as="div" className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} size="sm">
                {tag}
              </Badge>
            ))}
          </RevealItem>

          <RevealItem as="p" className="leading-relaxed text-white/70">
            {project.longDescription ?? project.description}
          </RevealItem>

          {project.highlights && (
            <RevealItem as="ul" className="flex flex-col gap-3">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 leading-relaxed text-white/70">
                  <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                  {highlight}
                </li>
              ))}
            </RevealItem>
          )}

          <RevealItem as="div" className="mt-2 flex flex-wrap items-center gap-3">
            {project.links?.site && (
              <Button href={project.links.site} external>
                Company site
              </Button>
            )}
            {project.links?.github && (
              <Button href={project.links.github} external icon={GitHubIcon}>
                View on GitHub
              </Button>
            )}
            {project.links?.live && (
              <Button href={project.links.live} external>
                Live demo
              </Button>
            )}
            {project.links?.devpost && (
              <Button href={project.links.devpost} external>
                View on Devpost
              </Button>
            )}
            {project.private && <span className="text-sm text-white/40">Private repo</span>}
          </RevealItem>
        </div>
      </RevealGroup>
    </div>
  );
}
