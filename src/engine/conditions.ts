import { ITEMS } from '../data/items'
import { STATUSES } from '../data/statuses'
import type { Condition } from '../types/content'
import type { GameState } from '../types/game'
import { getVar, VAR_LABEL } from './vars'

export function ownsItem(state: GameState, id: keyof typeof ITEMS): boolean {
  const e = state.equipped
  return (state.inventory[id] ?? 0) > 0 || e.muneca === id || e.cuello === id || e.manos.includes(id)
}

export function isEquipped(state: GameState, id: keyof typeof ITEMS): boolean {
  const e = state.equipped
  return e.muneca === id || e.cuello === id || e.manos.includes(id)
}

export function hasStatus(state: GameState, id: keyof typeof STATUSES): boolean {
  return state.statuses.some((s) => s.id === id)
}

const inRange = (n: number, gte?: number, lte?: number) =>
  (gte === undefined || n >= gte) && (lte === undefined || n <= lte)

export function evaluate(cond: Condition | undefined, state: GameState): boolean {
  if (!cond) return true
  if ('all' in cond) return cond.all.every((c) => evaluate(c, state))
  if ('any' in cond) return cond.any.some((c) => evaluate(c, state))
  if ('not' in cond) return !evaluate(cond.not, state)
  if ('var' in cond) return inRange(getVar(state, cond.var), cond.gte, cond.lte)
  if ('flag' in cond) return Boolean(state.flags[cond.flag]) === (cond.is ?? true)
  if ('item' in cond) return ownsItem(state, cond.item)
  if ('equipped' in cond) return isEquipped(state, cond.equipped)
  if ('status' in cond) return hasStatus(state, cond.status) === (cond.is ?? true)
  if ('coraza' in cond) return state.corazaActiva === cond.coraza
  if ('counter' in cond) return inRange(state.counters[cond.counter] ?? 0, cond.gte, cond.lte)
  if ('compare' in cond) return getVar(state, cond.compare[0]) >= getVar(state, cond.compare[1])
  return true
}

/** Texto corto para explicar por qué una opción está bloqueada. */
export function describe(cond: Condition): string {
  const unique = (parts: string[]) => [...new Set(parts)]
  if ('all' in cond) return unique(cond.all.map(describe)).join(' + ')
  if ('any' in cond) return unique(cond.any.map(describe)).join(' o ')
  if ('not' in cond) return `sin ${describe(cond.not)}`
  if ('var' in cond) {
    const label = VAR_LABEL[cond.var]
    if (cond.gte !== undefined && cond.lte !== undefined) return `${label} ${cond.gte}–${cond.lte}`
    if (cond.gte !== undefined) return `${label} ≥ ${cond.gte}`
    return `${label} ≤ ${cond.lte}`
  }
  if ('flag' in cond) return cond.is === false ? 'otra historia' : 'una decisión anterior'
  if ('item' in cond) return ITEMS[cond.item].name
  if ('equipped' in cond) return `${ITEMS[cond.equipped].name} equipado`
  if ('status' in cond) return cond.is === false ? `sin ${STATUSES[cond.status].name}` : STATUSES[cond.status].name
  if ('coraza' in cond) return cond.coraza ? 'Coraza activa' : 'Coraza desactivada'
  if ('counter' in cond) return 'progreso previo'
  if ('compare' in cond) return `${VAR_LABEL[cond.compare[0]]} ≥ ${VAR_LABEL[cond.compare[1]]}`
  return ''
}

/** ¿La condición depende de permisos de administrador? (para la etiqueta ADMIN). */
export function mentionsAdmin(cond: Condition | undefined): boolean {
  if (!cond) return false
  if ('all' in cond) return cond.all.some(mentionsAdmin)
  if ('any' in cond) return cond.any.some(mentionsAdmin)
  if ('not' in cond) return false
  return 'var' in cond && cond.var === 'permisosAdmin'
}

export function mentionsStatus(cond: Condition | undefined, id: keyof typeof STATUSES): boolean {
  if (!cond) return false
  if ('all' in cond) return cond.all.some((c) => mentionsStatus(c, id))
  if ('any' in cond) return cond.any.some((c) => mentionsStatus(c, id))
  return 'status' in cond && cond.status === id && cond.is !== false
}
