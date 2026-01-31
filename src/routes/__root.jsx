import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <div className="orb" />
      <div className="relative z-10 p-8">
        <Outlet />
      </div>
    </div>
  ),
});
