import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import GallerySection from "../components/sections/GallerySection";
import ContactSection from "../components/sections/ContactSection";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="w-full">
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <ContactSection />
    </div>
  ),
});
