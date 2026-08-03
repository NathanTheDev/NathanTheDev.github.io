import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* Belt-and-suspenders for framer-motion specifically: components
            here mostly check usePrefersReducedMotion themselves already,
            but reducedMotion="user" also catches transform/layout
            animations (e.g. GallerySection's dot indicators) that don't. */}
        <MotionConfig reducedMotion="user">
            <RouterProvider router={router} />
        </MotionConfig>
    </React.StrictMode>
);
