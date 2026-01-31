import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <h1 className="text-6xl font-bold -mt-20">Hi, I'm Nathan</h1>
    </div>
  ),
});