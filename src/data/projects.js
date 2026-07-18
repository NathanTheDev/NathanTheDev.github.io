export const projects = [];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
