import { DITHER_GLSL } from "./dither";

// Injects the shared Bayer dithering + palette quantization into a lit
// material's (e.g. MeshStandardMaterial) compiled fragment shader — it runs
// its own lighting pipeline that distortMaterial's hand-written shader
// doesn't share, so this patches the compiled program instead. `<dithering_fragment>`
// is the last chunk three appends to every standard/physical fragment shader
// (its own anti-banding dither runs there too), so that's where this hooks in —
// after tonemapping/colorspace conversion, same as three's own dithering step.
export function applyDither(material, { strength = 1, levels = 6 } = {}) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uDitherStrength = { value: strength };
    shader.uniforms.uDitherLevels = { value: levels };

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "void main() {",
        `uniform float uDitherStrength;\nuniform float uDitherLevels;\n${DITHER_GLSL}\nvoid main() {`,
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
        if (uDitherStrength > 0.0) {
          gl_FragColor.rgb = ditherQuantize(gl_FragColor.rgb, gl_FragCoord.xy, uDitherLevels, uDitherStrength);
        }`,
      );

    material.userData.shader = shader;
  };
  material.customProgramCacheKey = () => `dither-${strength}-${levels}`;
}
