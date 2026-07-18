import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Renders text to an offscreen 2D canvas (using the self-hosted display
// font) and hands it back as a THREE.CanvasTexture + aspect ratio. This is
// the text-as-texture path DistortedPlane consumes for the hero wordmark —
// deliberately not drei's <Text>/troika, since the plane just needs a flat
// texture to distort, not extruded 3D glyph geometry.
export function useTextTexture(
  text,
  {
    fontFamily = "Bourbon St",
    fontWeight = 400,
    color = "#000000",
    fontSizePx = 200,
    paddingRatio = 0.08,
  } = {},
) {
  const [state, setState] = useState({ texture: null, aspect: 1 });
  const textureRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
    const fontSpec = `${fontWeight} ${fontSizePx}px "${fontFamily}"`;

    async function draw() {
      try {
        await document.fonts.load(fontSpec);
        await document.fonts.ready;
      } catch {
        // Fall through and rasterize with whatever font is available.
      }
      if (cancelled) return;

      const measure = document.createElement("canvas").getContext("2d");
      measure.font = fontSpec;
      const textWidth = measure.measureText(text).width;
      const textHeight = fontSizePx * 1.2;
      const padding = textHeight * paddingRatio;

      const cssWidth = textWidth + padding * 2;
      const cssHeight = textHeight + padding * 2;

      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(cssWidth * pixelRatio);
      canvas.height = Math.ceil(cssHeight * pixelRatio);
      const ctx = canvas.getContext("2d");
      ctx.scale(pixelRatio, pixelRatio);
      ctx.font = fontSpec;
      ctx.fillStyle = color;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(text, cssWidth / 2, cssHeight / 2);

      if (cancelled) return;

      textureRef.current?.dispose();
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      textureRef.current = texture;
      setState({ texture, aspect: cssWidth / cssHeight });
    }

    draw();

    return () => {
      cancelled = true;
    };
  }, [text, fontFamily, fontWeight, color, fontSizePx, paddingRatio]);

  useEffect(() => {
    return () => textureRef.current?.dispose();
  }, []);

  return state;
}
