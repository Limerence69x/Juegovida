// mulberry32: pequeño, rápido y con estado serializable (la semilla vive en GameState).
export function nextRandom(seed: number): [value: number, nextSeed: number] {
  let t = (seed + 0x6d2b79f5) | 0
  const nextSeed = t
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296
  return [value, nextSeed]
}

export function freshSeed(): number {
  return (Math.random() * 2 ** 31) | 0
}
