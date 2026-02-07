import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="relative min-h-screen w-screen">
      <div className="orb overflow-hidden" />
        <Outlet />
    </div>
  ),
});

