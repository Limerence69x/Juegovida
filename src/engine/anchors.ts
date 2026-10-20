// Lectura de las Anclas de Identidad: qué pasivas están trabajando en la escena actual
// y qué consumible conviene usar antes de la próxima decisión.

import { ITEMS } from '../data/items'
import type { GameState, ItemId } from '../types/game'
import { hasStatus, ownsItem } from './conditions'
import { currentNode, currentScene, interpolate, relationalOf } from './registry'

export interface PassiveStatus {
  id: ItemId
  active: boolean
  note: string
}

/** Estado de cada ancla equipada o reliquia en la escena actual. */
export function passiveReport(state: GameState): PassiveStatus[] {
  if (state.phase === 'boot') return []
  const scene = currentScene(state)
  const node = currentNode(state)
  const { muneca, cuello, manos } = state.equipped
  const equipped = [muneca, cuello, ...manos].filter((x): x is ItemId => Boolean(x))
  const reliquias = (Object.keys(state.inventory) as ItemId[]).filter((id) => ITEMS[id].kind === 'reliquia')
  const burocratico = scene.entorno === 'burocratico'

  return [...equipped, ...reliquias].map((id) => {
    const def = ITEMS[id]
    if (id === 'reloj_automatico') {
      return scene.presionTiempo
        ? { id, active: true, note: 'Presión de tiempo aquí: automatismo ganado ×0,5 y cada costo de energía −5.' }
        : { id, active: false, note: 'En reposo: esta escena no tiene presión de tiempo.' }
    }
    if (def.burocraciaShield) {
      return burocratico
        ? { id, active: true, note: `Entorno burocrático: −${def.burocraciaShield} automatismo en cada decisión.` }
        : { id, active: false, note: 'En reposo fuera de entornos burocráticos.' }
    }
    if (id === 'dibujo_hija') {
      const activo = state.corazaActiva && relationalOf(scene, node).hija
      return activo
        ? { id, active: true, note: 'Coraza frente a ella: la frialdad registrada se reduce a la mitad.' }
        : { id, active: false, note: interpolate('Se activa si llevas la coraza frente a {hija}. También es un argumento final.', state) }
    }
    if (id === 'piedra_portezuelo') {
      return { id, active: scene.id === 'a5_jefe', note: 'Un argumento propio frente al Algoritmo de Inercia.' }
    }
    return { id, active: false, note: def.effect }
  })
}

/** Total de reducción burocrática equipada (para el encabezado del inventario). */
export function burocraciaShieldTotal(state: GameState): number {
  const { muneca, cuello, manos } = state.equipped
  return [muneca, cuello, ...manos].reduce((sum, id) => sum + (id ? (ITEMS[id].burocraciaShield ?? 0) : 0), 0)
}

/** Consejo contextual para un consumible, según el estado actual. */
export function itemAdvice(state: GameState, id: ItemId): string | null {
  const cat = ITEMS[id].category
  if (cat === 'frecuencia') {
    if (state.stats.automatismo >= 100) return 'El sistema está eligiendo por ti: esto corta el piloto automático.'
    if (hasStatus(state, 'ruidoInstitucional')) return 'Hay Ruido Institucional activo: +2 automatismo en cada decisión hasta limpiarlo.'
    if (state.stats.automatismo >= 70) return `Automatismo en ${state.stats.automatismo}: la interfaz ya está en modo frío.`
    return null
  }
  if (cat === 'perfume') {
    if (hasStatus(state, 'ansiedad')) return 'Hay Ansiedad activa: cada decisión con costo de energía cuesta +5.'
    if (state.phase === 'playing' && currentNode(state).presion) return 'Momento de presión: abre opciones creativas o empáticas.'
    return null
  }
  return null
}

export interface QuickAnchor {
  id: ItemId
  reason: string
}

const FRECUENCIAS: ItemId[] = ['freq_reverb', 'freq_postpunk', 'freq_ladob', 'freq_demo']
const DECANTS: ItemId[] = ['decant_vetiver', 'decant_incienso', 'decant_higo']
const RECARGAS: ItemId[] = ['freq_demo', 'decant_higo']

/** Hasta dos consumibles que conviene usar antes de decidir en el nodo actual. */
export function quickAnchors(state: GameState): QuickAnchor[] {
  if (state.phase !== 'playing') return []
  const node = currentNode(state)
  if (!node.choices?.length) return []
  const owned = (id: ItemId) => (state.inventory[id] ?? 0) > 0 && ownsItem(state, id)
  const out: QuickAnchor[] = []
  const push = (id: ItemId | undefined, reason: string) => {
    if (id && !out.some((q) => q.id === id)) out.push({ id, reason })
  }
  if (state.stats.automatismo >= 90 || hasStatus(state, 'ruidoInstitucional'))
    push(FRECUENCIAS.find(owned), state.stats.automatismo >= 90 ? 'corta la inercia' : 'limpia el ruido')
  if (hasStatus(state, 'ansiedad')) push(DECANTS.find(owned), 'disuelve la ansiedad')
  if (state.stats.energiaMental < 15) push(RECARGAS.find(owned), 'recarga batería')
  return out.slice(0, 2)
}
