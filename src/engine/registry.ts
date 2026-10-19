import { ACTS, SCENES } from '../data/acts'
import type { ActMeta, DialogueNode, Scene } from '../types/content'
import type { GameState } from '../types/game'

export function getScene(id: string): Scene {
  const scene = SCENES[id]
  if (!scene) throw new Error(`Escena desconocida: ${id}`)
  return scene
}

export function getAct(n: number): ActMeta {
  const act = ACTS.find((a) => a.number === n)
  if (!act) throw new Error(`Acto desconocido: ${n}`)
  return act
}

export function currentScene(state: GameState): Scene {
  return getScene(state.position.sceneId)
}

export function currentNode(state: GameState): DialogueNode {
  const scene = currentScene(state)
  const node = scene.nodes[state.position.nodeId]
  if (!node) throw new Error(`Nodo desconocido: ${scene.id}/${state.position.nodeId}`)
  return node
}

/** Reemplaza los nombres configurables en cualquier texto narrativo. */
export function interpolate(text: string, state: GameState): string {
  return text
    .replaceAll('{hija}', state.nombres.hija)
    .replaceAll('{pareja}', state.nombres.pareja)
    .replaceAll('{dia}', String(state.pareja.diaEstabilidad))
}

export type RelationalTarget = { hija: boolean; pareja: boolean }

export function relationalOf(scene: Scene, node: DialogueNode): RelationalTarget {
  const r = node.relational ?? scene.relational
  return { hija: r === 'hija' || r === 'ambos', pareja: r === 'pareja' || r === 'ambos' }
}
