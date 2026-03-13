import { treePositions } from './worldData'

const AVOIDANCE_RADIUS = 5
const AVOIDANCE_STRENGTH = 8
const PERSON_AVOIDANCE_RADIUS = 3
const PERSON_AVOIDANCE_STRENGTH = 6
const MAX_BOUNDS = 60 // absolute max terrain limit

// Shared registry of all person positions
export const personPositions = {}

export function isPointClearOfTrees(x, z, minDist = 2.5) {
  return treePositions.every(t => {
    const dx = x - t.x
    const dz = z - t.z
    return Math.sqrt(dx * dx + dz * dz) > minDist
  })
}

// Generate a waypoint within a given range from a center point
export function generateWaypoint(range = 40, centerX = 0, centerZ = 0) {
  for (let attempts = 0; attempts < 50; attempts++) {
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * range
    const x = centerX + Math.cos(angle) * dist
    const z = centerZ + Math.sin(angle) * dist
    // Keep within terrain bounds
    if (Math.abs(x) < MAX_BOUNDS && Math.abs(z) < MAX_BOUNDS && isPointClearOfTrees(x, z)) {
      return { x, z }
    }
  }
  return { x: centerX, z: centerZ }
}

export function getAvoidanceForce(px, pz, personId) {
  let forceX = 0
  let forceZ = 0

  for (const tree of treePositions) {
    const dx = px - tree.x
    const dz = pz - tree.z
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist < AVOIDANCE_RADIUS && dist > 0.01) {
      const strength = AVOIDANCE_STRENGTH * Math.pow(1 - dist / AVOIDANCE_RADIUS, 2)
      forceX += (dx / dist) * strength
      forceZ += (dz / dist) * strength
    }
  }

  for (const [id, other] of Object.entries(personPositions)) {
    if (id === personId) continue
    const dx = px - other.x
    const dz = pz - other.z
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist < PERSON_AVOIDANCE_RADIUS && dist > 0.01) {
      const strength = PERSON_AVOIDANCE_STRENGTH * Math.pow(1 - dist / PERSON_AVOIDANCE_RADIUS, 2)
      forceX += (dx / dist) * strength
      forceZ += (dz / dist) * strength
    }
  }

  return { x: forceX, z: forceZ }
}

export function isInsideAnyTree(x, z) {
  return treePositions.some(t => {
    const dx = x - t.x
    const dz = z - t.z
    return Math.sqrt(dx * dx + dz * dz) < t.radius + 0.5
  })
}

export function clampBounds(pos) {
  pos.x = Math.max(-MAX_BOUNDS, Math.min(MAX_BOUNDS, pos.x))
  pos.z = Math.max(-MAX_BOUNDS, Math.min(MAX_BOUNDS, pos.z))
}
