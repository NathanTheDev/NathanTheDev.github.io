# NathanTheDev.github.io

Personal portfolio site, built with React, react-three-fiber, TanStack Router, and Tailwind CSS v4.

The homepage is a single continuous scroll through four sections — a 3D hero
scene (a lit white cube cluster on a vignette background, plus a cursor-driven
liquid-distortion wordmark), an About section, a 3D scroll-driven carousel of
project links, and a contact section. Each project links out to its own
`/projects/$slug` detail page.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # eslint
```

## Deployment

Pushes to `main` trigger `.github/workflows/delpoy.yml`, which builds the
site and deploys it to GitHub Pages via GitHub Actions (not a `gh-pages`
branch push).
