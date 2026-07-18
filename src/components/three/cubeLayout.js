// The X reads not as a flat 4-point starburst but as two circular rings of
// cubes, each ring tilted off-axis in opposite directions so they cross each
// other face-on to the camera — like two hoops seen edge-on, overlapping in
// an X. Individual cubes within a ring get a random static rotation so the
// ring reads as a cloud of tumbling cubes rather than a uniform gear.
function buildRing({ count, radius, cubeSize }) {
  const cubes = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    cubes.push({
      position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: cubeSize,
    });
  }
  return cubes;
}

export function generateCubeClusterLayout({
  centerSize = 1.8,
  outerCount = 22,
  outerRadius = 6.2,
  outerCubeSize = 0.46,
  innerCount = 13,
  innerRadius = 3.1,
  innerCubeSize = 0.34,
} = {}) {
  return {
    center: { scale: centerSize },
    ringBig: {
      cubes: buildRing({ count: outerCount, radius: outerRadius, cubeSize: outerCubeSize }),
      tiltZ: Math.PI / 4,
      tiltX: Math.PI / 7,
    },
    ringSmall: {
      cubes: buildRing({ count: innerCount, radius: innerRadius, cubeSize: innerCubeSize }),
      tiltZ: -Math.PI / 4,
      tiltX: -Math.PI / 7,
    },
  };
}
