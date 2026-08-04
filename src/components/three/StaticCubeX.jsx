import { generateCubeClusterLayout } from "./cubeLayout";

// Non-WebGL echo of CubeCluster for low-power/touch devices — reuses the same
// ring layout data (so the two stay roughly in sync) but renders plain
// rotated divs, projecting each ring's tilted 3D position down to a flat
// orthographic front view (matching three's default XYZ Euler order: tiltX
// applied to the ring first, then tiltZ) instead of lighting a real mesh.
function projectRing(ring) {
  const { tiltX, tiltZ } = ring;
  return ring.cubes.map((cube) => {
    const [x, , z] = cube.position;
    const x2 = x * Math.cos(tiltZ) + z * Math.sin(tiltX) * Math.sin(tiltZ);
    const y2 = x * Math.sin(tiltZ) - z * Math.sin(tiltX) * Math.cos(tiltZ);
    return { x: x2, y: y2, size: cube.scale, rotation: cube.rotation };
  });
}

const RAD_TO_DEG = 180 / Math.PI;

// Real CSS 3D cube — three shaded faces (top/front/side) via
// transform-style: preserve-3d, not one flat rotated square. That flat
// version read as a field of diamonds rather than cubes; this is what
// actually keeps the "cube" identity at a glance closer to CubeCluster's
// live lit render, without a second WebGL context.
function Cube({ size, rotation }) {
  const half = size / 2;
  const [rx, ry, rz] = rotation;

  return (
    <div
      className="absolute"
      style={{
        width: size,
        height: size,
        transformStyle: "preserve-3d",
        transform: `rotateX(${rx * RAD_TO_DEG}deg) rotateY(${ry * RAD_TO_DEG}deg) rotateZ(${rz * RAD_TO_DEG}deg)`,
      }}
    >
      <div
        className="absolute bg-white"
        style={{ width: size, height: size, opacity: 0.95, transform: `rotateX(90deg) translateZ(${half}px)` }}
      />
      <div
        className="absolute bg-white"
        style={{ width: size, height: size, opacity: 0.7, transform: `translateZ(${half}px)` }}
      />
      <div
        className="absolute bg-white"
        style={{ width: size, height: size, opacity: 0.45, transform: `rotateY(90deg) translateZ(${half}px)` }}
      />
    </div>
  );
}

export default function StaticCubeX({ size = 280 }) {
  const layout = generateCubeClusterLayout();
  const scale = size / 13;

  const ringBigPoints = projectRing(layout.ringBig);
  const ringSmallPoints = projectRing(layout.ringSmall);

  function renderPoint({ x, y, size: cubeScale, rotation }, key) {
    const px = size / 2 + x * scale;
    const py = size / 2 - y * scale;
    const cubeSize = cubeScale * scale * 1.8;

    return (
      <div
        key={key}
        className="absolute drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
        style={{ left: px - cubeSize / 2, top: py - cubeSize / 2, perspective: cubeSize * 4 }}
      >
        <Cube size={cubeSize} rotation={rotation} />
      </div>
    );
  }

  const centerSize = layout.center.scale * scale * 0.9;

  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden="true">
      {ringBigPoints.map((p, i) => renderPoint(p, `big-${i}`))}
      {ringSmallPoints.map((p, i) => renderPoint(p, `small-${i}`))}
      <div
        className="absolute drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        style={{
          left: size / 2 - centerSize / 2,
          top: size / 2 - centerSize / 2,
          perspective: centerSize * 4,
        }}
      >
        <Cube size={centerSize} rotation={[0.5, 0.7, 0.2]} />
      </div>
    </div>
  );
}
