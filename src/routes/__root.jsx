import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <div className="orb" />
        <Outlet />
    </div>
  ),
});

