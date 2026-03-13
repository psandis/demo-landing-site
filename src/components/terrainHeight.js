// Shared terrain height function
// The PlaneGeometry is rotated -PI/2 around X, so plane (x, y) maps to world (x, -y).
// To get height at world position (wx, wz), we use plane coords (wx, -wz).
export function getTerrainHeight(worldX, worldZ) {
  const px = worldX
  const py = -worldZ
  return (
    Math.sin(px * 0.3) * 0.8 +
    Math.cos(py * 0.2) * 0.6 +
    Math.sin(px * 0.1 + py * 0.1) * 1.5 +
    Math.cos(px * 0.5) * Math.sin(py * 0.4) * 0.4
  )
}
