// Validación estática del contenido narrativo. Corre en los tests: si alguien escribe
// una escena rota o una decisión «gratis», el build de pruebas falla.

import { ACTS, SCENES } from '../data/acts'
import { DROP_TABLES } from '../data/dropTables'
import { ITEMS } from '../data/items'
import type { Choice, Scene } from '../types/content'
import type { VarKey } from '../types/game'
import { VAR_VALENCE } from './vars'

export interface Issue {
  where: string
  message: string
}

/** Variables que una decisión mueve, con el signo de su impacto (+1 favorable, −1 costo). */
export function choiceImpact(choice: Choice): Map<VarKey, number> {
  const impact = new Map<VarKey, number>()
  const add = (key: VarKey, valence: number) => impact.set(key, (impact.get(key) ?? 0) + valence)
  if (choice.cost?.energia) add('energiaMental', -1)
  if (choice.cost?.permisos) add('permisosAdmin', -1)
  if (choice.coraza) add('ladoOscuro', -1)
  for (const e of choice.effects) {
    if (e.kind === 'var' && e.delta !== 0) add(e.key, Math.sign(e.delta) * VAR_VALENCE[e.key])
  }
  return impact
}

function checkTarget(where: string, target: string, scene: Scene, issues: Issue[]) {
  if (target === '#FIN') return
  if (target.startsWith('@')) {
    if (!SCENES[target.slice(1)]) issues.push({ where, message: `Escena destino inexistente: ${target}` })
  } else if (!scene.nodes[target]) {
    issues.push({ where, message: `Nodo destino inexistente: ${target}` })
  }
}

export function validateContent(): Issue[] {
  const issues: Issue[] = []

  for (const act of ACTS) {
    const first = SCENES[act.firstScene]
    if (!first) issues.push({ where: `Acto ${act.number}`, message: `firstScene inexistente: ${act.firstScene}` })
    else if (first.act !== act.number)
      issues.push({ where: `Acto ${act.number}`, message: `firstScene pertenece al acto ${first.act}` })
  }

  for (const scene of Object.values(SCENES)) {
    if (!scene.nodes[scene.start]) issues.push({ where: scene.id, message: `start inexistente: ${scene.start}` })
    if (!ACTS.some((a) => a.number === scene.act)) issues.push({ where: scene.id, message: `Acto ${scene.act} no declarado` })

    for (const [nodeId, node] of Object.entries(scene.nodes)) {
      const where = `${scene.id}/${nodeId}`
      const choices = node.choices ?? []
      const exits = [...choices.map((c) => c.next), ...(node.next ? [node.next] : []), ...(node.nextIf ?? []).map((b) => b.next)]
      if (exits.length === 0) issues.push({ where, message: 'Nodo sin salida (ni opciones ni next)' })
      if (choices.length && node.next) issues.push({ where, message: 'Nodo con opciones y next a la vez' })
      if (node.nextIf?.length && !node.next) issues.push({ where, message: 'nextIf sin next por defecto' })
      for (const t of exits) checkTarget(where, t, scene, issues)

      if (choices.length >= 2) {
        const autopilots = choices.filter((c) => c.autopilot)
        if (autopilots.length !== 1)
          issues.push({ where, message: `Debe haber exactamente 1 opción de piloto automático (hay ${autopilots.length})` })
      }

      const ids = new Set<string>()
      for (const choice of choices) {
        const cw = `${where}#${choice.id}`
        if (ids.has(choice.id)) issues.push({ where: cw, message: 'id de opción duplicado' })
        ids.add(choice.id)

        if (choice.autopilot && (choice.requires || choice.visibleIf || choice.cost))
          issues.push({ where: cw, message: 'El piloto automático no puede tener requisitos ni costos (evita bloqueos)' })

        // Regla de diseño §7: ninguna decisión es gratis.
        const impact = choiceImpact(choice)
        if (impact.size < 2) issues.push({ where: cw, message: `Mueve ${impact.size} variable(s); se exigen al menos 2` })
        const signs = [...impact.values()]
        if (!signs.some((v) => v < 0)) issues.push({ where: cw, message: 'Decisión gratis: no tiene ningún costo' })
        if (!signs.some((v) => v > 0)) issues.push({ where: cw, message: 'Decisión sin tensión: no ofrece ninguna ganancia' })

        for (const e of choice.effects) {
          if (e.kind === 'item' && !ITEMS[e.id]) issues.push({ where: cw, message: `Item inexistente: ${e.id}` })
          if (e.kind === 'drop' && !DROP_TABLES[e.table]) issues.push({ where: cw, message: `Tabla de drop inexistente: ${e.table}` })
        }
      }
    }
  }

  // Alcanzabilidad: todas las escenas deben poder visitarse desde el acto 1.
  const reached = new Set<string>()
  const queue = [ACTS[0].firstScene]
  while (queue.length) {
    const id = queue.shift()!
    if (reached.has(id) || !SCENES[id]) continue
    reached.add(id)
    for (const node of Object.values(SCENES[id].nodes)) {
      const targets = [...(node.choices ?? []).map((c) => c.next), node.next, ...(node.nextIf ?? []).map((b) => b.next)]
      for (const t of targets) if (t?.startsWith('@')) queue.push(t.slice(1))
    }
  }
  for (const id of Object.keys(SCENES)) {
    if (!reached.has(id)) issues.push({ where: id, message: 'Escena inalcanzable' })
  }

  return issues
}
