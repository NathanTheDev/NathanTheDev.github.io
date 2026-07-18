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
  uniform vec2 uAspect;
  uniform float uUseAlphaChannel;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    vec2 diff = (uv - uMouse) * uAspect;
    float dist = length(diff);
    float falloff = smoothstep(0.5, 0.0, dist);

    float velocityMag = clamp(length(uMouseVelocity) * 6.0, 0.0, 1.5);
    float ripple = falloff * uStrength * (0.25 + velocityMag);

    float n = hash(uv * 9.0 + uTime * 0.4) * 2.0 - 1.0;
    vec2 dir = dist > 0.0001 ? diff / dist : vec2(0.0);
    vec2 displacement = dir * ripple * 0.08 + vec2(n, n) * ripple * 0.015;

    float shift = uRgbShiftMax * ripple;
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
    uAspect: new THREE.Vector2(1, 1),
    uUseAlphaChannel: 0,
  },
  vertexShader,
  fragmentShader,
);

extend({ DistortMaterial });
