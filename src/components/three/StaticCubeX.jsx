import { generateCubeLayout } from "./CubeCluster";

// Non-WebGL echo of CubeCluster for low-power/touch devices — reuses the
// same layout data (so the two stay in sync) but renders plain rotated divs
// instead of lit 3D meshes.
export default function StaticCubeX({ size = 280 }) {
  const cubes = generateCubeLayout();
  const scale = size / 6.6;

  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden="true">
      {cubes.map((cube, i) => {
        const px = size / 2 + cube.position[0] * scale;
        const py = size / 2 - cube.position[1] * scale;
        const cubeSize = cube.scale * scale * 0.9;

        return (
          <div
            key={i}
            className="absolute rounded-[2px] bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.25)]"
            style={{
              width: cubeSize,
              height: cubeSize,
              left: px - cubeSize / 2,
              top: py - cubeSize / 2,
              transform: "rotate(45deg)",
            }}
          />
        );
      })}
    </div>
  );
}
