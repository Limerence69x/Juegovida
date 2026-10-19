// Atajos de autoría para que los actos se lean como guion y no como JSON.

import type { Condition, DropTableId, Effect } from '../types/content'
import type { ItemId, StatusId, VarKey } from '../types/game'

const v = (key: VarKey) => (delta: number): Effect => ({ kind: 'var', key, delta })

export const auto = v('automatismo')
export const admin = v('permisosAdmin')
export const energia = v('energiaMental')
export const oscuro = v('ladoOscuro')
export const calidez = v('calidezAprendida')
export const frialdad = v('frialdadHeredada')
export const confianza = v('confianzaAcumulada')
export const fantasmas = v('fantasmasInestabilidad')

export const addStatus = (id: StatusId, charges?: number): Effect => ({ kind: 'status', op: 'add', id, charges })
export const removeStatus = (id: StatusId): Effect => ({ kind: 'status', op: 'remove', id })
export const flag = (id: string, value = true): Effect => ({ kind: 'flag', id, value })
export const counter = (id: string, delta: number): Effect => ({ kind: 'counter', id, delta })
export const give = (id: ItemId, qty = 1): Effect => ({ kind: 'item', id, qty })
export const drop = (table: DropTableId): Effect => ({ kind: 'drop', table })
export const dia = (delta: number): Effect => ({ kind: 'dia', delta })
export const diaReset = (): Effect => ({ kind: 'dia', set: 0 })
export const log = (text: string, tone: Extract<Effect, { kind: 'log' }>['tone'] = 'consciencia'): Effect => ({
  kind: 'log',
  text,
  tone,
})

// Condiciones
export const has = (flagId: string): Condition => ({ flag: flagId })
export const hasNot = (flagId: string): Condition => ({ flag: flagId, is: false })
export const adminMin = (n: number): Condition => ({ var: 'permisosAdmin', gte: n })
export const varMin = (key: VarKey, n: number): Condition => ({ var: key, gte: n })
export const varMax = (key: VarKey, n: number): Condition => ({ var: key, lte: n })
export const item = (id: ItemId): Condition => ({ item: id })
export const status = (id: StatusId): Condition => ({ status: id })
export const all = (...c: Condition[]): Condition => ({ all: c })
export const any = (...c: Condition[]): Condition => ({ any: c })
export const not = (c: Condition): Condition => ({ not: c })

/** Une párrafos: el motor los muestra separados. */
export const txt = (...parrafos: string[]) => parrafos.join('\n\n')
