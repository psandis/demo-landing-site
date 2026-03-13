// Predefined paths for each character
// Each path is a loop — character walks through all waypoints then repeats

export const explorerPath = [
  { x: 0, z: 0 },
  { x: 8, z: 5 },
  { x: 15, z: 2 },
  { x: 20, z: -5 },
  { x: 15, z: -12 },
  { x: 5, z: -10 },
  { x: -2, z: -12 },
  { x: -3, z: 3 },
]

export const hikerPath = [
  { x: 10, z: -5 },
  { x: 20, z: -8 },
  { x: 30, z: -3 },
  { x: 35, z: 5 },
  { x: 27, z: 18 },
  { x: 20, z: 20 },
  { x: 10, z: 15 },
  { x: 5, z: 8 },
  { x: 8, z: 0 },
]

export const joggerPath = [
  { x: -10, z: 5 },
  { x: -15, z: 15 },
  { x: -2, z: 22 },
  { x: 8, z: 18 },
  { x: 10, z: 10 },
  { x: 5, z: 3 },
  { x: -3, z: 0 },
  { x: -12, z: 0 },
]

export const wandererPath = [
  { x: -12, z: -3 },
  { x: -20, z: -10 },
  { x: -30, z: -5 },
  { x: -35, z: 5 },
  { x: -28, z: 12 },
  { x: -18, z: 8 },
  { x: -10, z: 3 },
]

export const scoutPath = [
  { x: 15, z: 6 },
  { x: 25, z: 10 },
  { x: 35, z: 8 },
  { x: 40, z: 0 },
  { x: 35, z: -10 },
  { x: 25, z: -15 },
  { x: 15, z: -8 },
  { x: 10, z: 0 },
]
