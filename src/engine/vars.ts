import type { GameState, HijaKey, ParejaKey, StatKey, VarKey } from '../types/game'

export const STAT_KEYS: StatKey[] = ['automatismo', 'permisosAdmin', 'energiaMental', 'ladoOscuro']
export const HIJA_KEYS: HijaKey[] = ['calidezAprendida', 'frialdadHeredada']
export const PAREJA_KEYS: ParejaKey[] = ['confianzaAcumulada', 'fantasmasInestabilidad']
export const VAR_KEYS: VarKey[] = [...STAT_KEYS, ...HIJA_KEYS, ...PAREJA_KEYS]

export const VAR_LABEL: Record<VarKey, string> = {
  automatismo: 'Automatismo',
  permisosAdmin: 'Permisos',
  energiaMental: 'Energía',
  ladoOscuro: 'Lado Oscuro',
  calidezAprendida: 'Calidez',
  frialdadHeredada: 'Frialdad',
  confianzaAcumulada: 'Confianza',
  fantasmasInestabilidad: 'Fantasmas',
}

/** +1 si subir la variable es bueno para el protagonista, −1 si es malo. */
export const VAR_VALENCE: Record<VarKey, 1 | -1> = {
  automatismo: -1,
  permisosAdmin: 1,
  energiaMental: 1,
  ladoOscuro: -1,
  calidezAprendida: 1,
  frialdadHeredada: -1,
  confianzaAcumulada: 1,
  fantasmasInestabilidad: -1,
}

const isStat = (k: VarKey): k is StatKey => (STAT_KEYS as string[]).includes(k)
const isHija = (k: VarKey): k is HijaKey => (HIJA_KEYS as string[]).includes(k)

export function getVar(state: GameState, key: VarKey): number {
  if (isStat(key)) return state.stats[key]
  if (isHija(key)) return state.hija[key]
  return state.pareja[key]
}

export const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

/** Escribe con clamp y devuelve el delta efectivamente aplicado. */
export function setVar(state: GameState, key: VarKey, value: number): number {
  const before = getVar(state, key)
  const after = clamp(value)
  if (isStat(key)) state.stats[key] = after
  else if (isHija(key)) state.hija[key] = after
  else state.pareja[key] = after
  return after - before
}

export function snapshotVars(state: GameState): Record<VarKey, number> {
  return Object.fromEntries(VAR_KEYS.map((k) => [k, getVar(state, k)])) as Record<VarKey, number>
}

export function diffVars(before: Record<VarKey, number>, state: GameState): Partial<Record<VarKey, number>> {
  const out: Partial<Record<VarKey, number>> = {}
  for (const k of VAR_KEYS) {
    const d = getVar(state, k) - before[k]
    if (d !== 0) out[k] = d
  }
  return out
}

export function formatDeltas(deltas: Partial<Record<VarKey, number>>): string {
  return VAR_KEYS.filter((k) => deltas[k])
    .map((k) => `${VAR_LABEL[k]} ${deltas[k]! > 0 ? '+' : '−'}${Math.abs(deltas[k]!)}`)
    .join(' · ')
}
