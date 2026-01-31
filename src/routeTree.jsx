import { createRootRoute, createRoute } from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <h1>Hello from TanStack Router 👋</h1>,
});

export const routeTree = rootRoute.addChildren([]);
