import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform vec2 uMouseVelocity;
  uniform float uTime;
  uniform float uStrength;
  uniform float uRgbShiftMax;
  uniform float uFalloffRadius;
  uniform vec2 uAspect;
  uniform float uUseAlphaChannel;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 diff = (uv - uMouse) * uAspect;
    float dist = length(diff);
    float falloff = smoothstep(uFalloffRadius, 0.0, dist);

    float velocityMag = clamp(length(uMouseVelocity) * 6.0, 0.0, 1.5);
    float amount = falloff * uStrength * (0.35 + velocityMag);

    vec2 dir = dist > 0.0001 ? diff / dist : vec2(0.0);

    // Concentric ripple rings radiating from the cursor (smooth sine, not
    // per-pixel noise) — this is what gives the banded liquid look instead
    // of a flat/grainy push.
    float ring = sin(dist * 90.0 - uTime * 2.5) * 0.5 + 0.5;

    // Gentle swirl so letterforms curl near the cursor rather than only
    // pushing straight outward, reinforcing the "liquid" feel.
    float swirlAngle = amount * 0.55;
    float cs = cos(swirlAngle);
    float sn = sin(swirlAngle);
    vec2 swirlDir = vec2(dir.x * cs - dir.y * sn, dir.x * sn + dir.y * cs);

    vec2 displacement = swirlDir * amount * 0.1 * (0.45 + 0.55 * ring);

    float shift = uRgbShiftMax * amount * (0.5 + 0.7 * ring);
    vec2 shiftDir = dist > 0.0001 ? dir : vec2(1.0, 0.0);

    vec4 sampR = texture2D(uTexture, uv + displacement + shiftDir * shift);
    vec4 sampG = texture2D(uTexture, uv + displacement);
    vec4 sampB = texture2D(uTexture, uv + displacement - shiftDir * shift);

    // Alpha-mask content (e.g. black text on a transparent canvas texture)
    // carries no per-channel color to split, so the fringe is built from the
    // shifted alpha/coverage instead; photo textures use their real RGB.
    float r = mix(sampR.r, sampR.a, uUseAlphaChannel);
    float g = mix(sampG.g, sampG.a, uUseAlphaChannel);
    float b = mix(sampB.b, sampB.a, uUseAlphaChannel);
    float a = max(max(sampR.a, sampG.a), sampB.a);

    gl_FragColor = vec4(r, g, b, a);
  }
`;

export const DistortMaterial = shaderMaterial(
  {
    uTexture: null,
    uMouse: new THREE.Vector2(-1, -1),
    uMouseVelocity: new THREE.Vector2(0, 0),
    uTime: 0,
    uStrength: 1,
    uRgbShiftMax: 0.02,
    uFalloffRadius: 0.5,
    uAspect: new THREE.Vector2(1, 1),
    uUseAlphaChannel: 0,
  },
  vertexShader,
  fragmentShader,
);

extend({ DistortMaterial });
