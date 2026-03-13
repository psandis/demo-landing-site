// Shared world data so the walking man knows where trees are

// Generate tree positions once (deterministic with seed)
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const TREE_COUNT = 80
const rand = seededRandom(42)

export const treePositions = []
for (let i = 0; i < TREE_COUNT; i++) {
  const x = (rand() - 0.5) * 140
  const z = (rand() - 0.5) * 140
  const scale = 0.8 + rand() * 1.2
  treePositions.push({ x, z, radius: 1.8 * scale }) // collision radius
}
