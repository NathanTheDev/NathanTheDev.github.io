import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [react(), tanstackRouter()],
  base: "/",
  build: {
    outDir: "dist",
  },

  server: {
    historyApiFallback: true,
  },
});
