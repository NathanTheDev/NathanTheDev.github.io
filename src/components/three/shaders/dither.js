// Shared 4x4 ordered Bayer dithering + palette quantization used by both
// distortMaterial's fragment shader (DistortText/DistortImage) and
// CubeCluster's lit material via onBeforeCompile injection (see
// applyDither.js) — one implementation instead of two copies of the same
// matrix. Written with branches on floor()'d coords rather than dynamic
// array indexing, since GLSL ES 1.00 (WebGL1) fragment shaders don't
// reliably support indexing an array by a non-constant expression.
export const DITHER_GLSL = /* glsl */ `
  float ditherBayerValue(vec2 fragCoord) {
    float x = mod(floor(fragCoord.x), 4.0);
    float y = mod(floor(fragCoord.y), 4.0);
    if (y < 1.0) {
      if (x < 1.0) return 0.0 / 16.0;
      if (x < 2.0) return 8.0 / 16.0;
      if (x < 3.0) return 2.0 / 16.0;
      return 10.0 / 16.0;
    } else if (y < 2.0) {
      if (x < 1.0) return 12.0 / 16.0;
      if (x < 2.0) return 4.0 / 16.0;
      if (x < 3.0) return 14.0 / 16.0;
      return 6.0 / 16.0;
    } else if (y < 3.0) {
      if (x < 1.0) return 3.0 / 16.0;
      if (x < 2.0) return 11.0 / 16.0;
      if (x < 3.0) return 1.0 / 16.0;
      return 9.0 / 16.0;
    } else {
      if (x < 1.0) return 15.0 / 16.0;
      if (x < 2.0) return 7.0 / 16.0;
      if (x < 3.0) return 13.0 / 16.0;
      return 5.0 / 16.0;
    }
  }

  // pixelSize groups fragCoord into blocks before looking up the Bayer
  // matrix, so each dither "pixel" covers a pixelSize x pixelSize block of
  // real screen pixels instead of a single one — at pixelSize=1 the pattern
  // is only a few device pixels wide and reads as fine noise/grain rather
  // than the chunky, deliberately-pixelated look this site wants.
  vec3 ditherQuantize(vec3 color, vec2 fragCoord, float levels, float strength, float pixelSize) {
    vec2 cell = fragCoord / max(pixelSize, 1.0);
    float threshold = ditherBayerValue(cell) - 0.5;
    vec3 shifted = color + threshold * strength / max(levels, 2.0);
    return floor(shifted * levels + 0.5) / levels;
  }
`;
