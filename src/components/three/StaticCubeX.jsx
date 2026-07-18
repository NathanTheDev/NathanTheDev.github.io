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
    return { x: x2, y: y2, size: cube.scale };
  });
}

export default function StaticCubeX({ size = 280 }) {
  const layout = generateCubeClusterLayout();
  const scale = size / 10;

  const ringBigPoints = projectRing(layout.ringBig);
  const ringSmallPoints = projectRing(layout.ringSmall);

  function renderPoint({ x, y, size: cubeScale }, color, key) {
    const px = size / 2 + x * scale;
    const py = size / 2 - y * scale;
    const cubeSize = cubeScale * scale * 1.8;

    return (
      <div
        key={key}
        className="absolute rounded-[2px]"
        style={{
          width: cubeSize,
          height: cubeSize,
          left: px - cubeSize / 2,
          top: py - cubeSize / 2,
          background: color,
          boxShadow: `0 0 10px ${color}55`,
          transform: "rotate(45deg)",
        }}
      />
    );
  }

  const centerSize = layout.center.scale * scale * 0.9;

  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden="true">
      {ringBigPoints.map((p, i) => renderPoint(p, layout.ringBig.color, `big-${i}`))}
      {ringSmallPoints.map((p, i) => renderPoint(p, layout.ringSmall.color, `small-${i}`))}
      <div
        className="absolute rounded-[3px] bg-white/90 shadow-[0_0_16px_rgba(255,255,255,0.3)]"
        style={{
          width: centerSize,
          height: centerSize,
          left: size / 2 - centerSize / 2,
          top: size / 2 - centerSize / 2,
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
}
