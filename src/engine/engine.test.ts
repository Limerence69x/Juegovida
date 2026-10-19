import { describe, expect, it } from 'vitest'
import { SCENES } from '../data/acts'
import type { GameState, ItemId } from '../types/game'
import {
  advance,
  beginAct,
  choose,
  getChoiceViews,
  hijaRegistrando,
  linearTarget,
  startGame,
  toggleCoraza,
  consumeItem,
} from './engine'
import { nextRandom } from './rng'
import { currentNode } from './registry'
import { validateContent } from './validate'

const NOMBRES = { hija: 'Emilia', pareja: 'Dani' }

function at(state: GameState, sceneId: string, nodeId?: string): GameState {
  return {
    ...state,
    phase: 'playing',
    act: SCENES[sceneId].act,
    position: { sceneId, nodeId: nodeId ?? SCENES[sceneId].start },
    sceneMemo: { permisosGastados: 0, avisoHija: false },
  }
}

function fresh(): GameState {
  return beginAct(startGame(NOMBRES, 1234).state)
}

/** Un jugador atento: recarga batería y corta el piloto automático con sus anclas. */
function consumeLikeAPlayer(s: GameState): GameState {
  const owned = (id: ItemId) => (s.inventory[id] ?? 0) > 0
  if (s.stats.energiaMental < 15) {
    const recarga = (['freq_demo', 'decant_higo'] as ItemId[]).find(owned)
    if (recarga) s = consumeItem(s, recarga).state
  }
  if (s.statuses.some((x) => x.id === 'ansiedad')) {
    const decant = (['decant_vetiver', 'decant_higo', 'decant_incienso'] as ItemId[]).find(owned)
    if (decant) s = consumeItem(s, decant).state
  }
  if (s.stats.automatismo >= 80 || s.statuses.some((x) => x.id === 'ruidoInstitucional')) {
    const freq = (['freq_reverb', 'freq_postpunk', 'freq_ladob', 'freq_demo'] as ItemId[]).find(owned)
    if (freq) s = consumeItem(s, freq).state
  }
  return s
}

/** Recorre el juego eligiendo opciones al azar (con semilla) hasta un final. */
function playthrough(seed: number, pick: 'random' | 'autopilot' | 'authentic' = 'random') {
  let s = beginAct(startGame(NOMBRES, seed).state)
  let r = seed
  for (let step = 0; step < 500; step++) {
    if (s.phase === 'ending') return { state: s, steps: step }
    if (s.phase === 'actIntro') {
      s = beginAct(s)
      continue
    }
    const node = currentNode(s)
    if (!node.choices?.length) {
      expect(linearTarget(s, node)).toBeDefined()
      s = advance(s).state
      continue
    }
    if (pick === 'authentic') s = consumeLikeAPlayer(s)
    const open = getChoiceViews(s).filter((v) => !v.locked)
    expect(open.length, `sin opciones disponibles en ${s.position.sceneId}/${s.position.nodeId}`).toBeGreaterThan(0)
    let choice = open[0]
    if (pick === 'autopilot') choice = open.find((v) => v.choice.autopilot) ?? open[0]
    else if (pick === 'authentic') {
      const authentic = open.filter(
        (v) => !v.choice.autopilot && !v.choice.coraza && !v.choice.tags?.some((t) => t === 'analisis' || t === 'regresion'),
      )
      choice = authentic.find((v) => v.choice.requires || v.choice.visibleIf) ?? authentic[0] ?? open[0]
    } else {
      const [x, next] = nextRandom(r)
      r = next
      choice = open[Math.floor(x * open.length)]
    }
    s = choose(s, choice.choice.id).state
  }
  throw new Error('La partida no terminó en 500 pasos')
}

describe('contenido narrativo', () => {
  it('no tiene escenas rotas ni decisiones gratis', () => {
    expect(validateContent()).toEqual([])
  })
})

describe('motor', () => {
  it('arranca en la tarjeta del acto 1 con el estado inicial', () => {
    const { state } = startGame(NOMBRES, 1)
    expect(state.phase).toBe('actIntro')
    expect(state.act).toBe(1)
    expect(state.position.sceneId).toBe('a1_alarma')
    expect(state.pareja.diaEstabilidad).toBe(7)
  })

  it('cobra energía y mueve al menos dos variables por decisión', () => {
    const s = fresh()
    const { state, deltas } = choose(s, 'minuto')
    expect(state.stats.energiaMental).toBe(s.stats.energiaMental - 5)
    expect(Object.keys(deltas).length).toBeGreaterThanOrEqual(2)
  })

  it('la coraza anula el costo de energía pero sube el lado oscuro', () => {
    const s = at(fresh(), 'a1_reunion', 'r3')
    const on = toggleCoraza(s).state
    expect(on.corazaActiva).toBe(true)
    expect(on.stats.ladoOscuro).toBe(s.stats.ladoOscuro + 5)
    const callar = getChoiceViews(on).find((v) => v.choice.id === 'callar')!
    expect(callar.energyCost).toBe(0)
    const after = choose(on, 'callar').state
    expect(after.stats.energiaMental).toBe(on.stats.energiaMental)
    expect(after.stats.ladoOscuro).toBeGreaterThan(on.stats.ladoOscuro)
  })

  it('no deja activar la coraza fuera de momentos de presión', () => {
    const s = fresh() // a1_alarma/inicio no es nodo de presión
    expect(toggleCoraza(s).state.corazaActiva).toBe(false)
  })

  it('con automatismo 100 bloquea todo salvo el piloto automático', () => {
    const s = fresh()
    s.stats.automatismo = 100
    const views = getChoiceViews(s)
    const open = views.filter((v) => !v.locked)
    expect(open).toHaveLength(1)
    expect(open[0].choice.autopilot).toBe(true)
  })

  it('una Frecuencia de Aislamiento devuelve el control', () => {
    const s = fresh()
    s.stats.automatismo = 100
    s.statuses.push({ id: 'ruidoInstitucional' })
    const after = consumeItem(s, 'freq_reverb').state
    expect(after.stats.automatismo).toBe(88)
    expect(after.statuses.some((x) => x.id === 'ruidoInstitucional')).toBe(false)
    expect(getChoiceViews(after).filter((v) => !v.locked).length).toBeGreaterThan(1)
  })

  it('salir de una escena legacy sin gastar permisos contagia frialdad', () => {
    let s = at(fresh(), 'a2_visita', 'v1')
    s = choose(s, 'idioma').state
    s = advance(s).state
    s = choose(s, 'reir').state
    s = advance(s).state
    expect(s.position.sceneId).toBe('a2_cena')
    expect(s.statuses.some((x) => x.id === 'contagioFrialdad')).toBe(true)
  })

  it('gastar permisos en la escena legacy evita el contagio', () => {
    let s = at(fresh(), 'a2_visita', 'v1')
    s.stats.permisosAdmin = 30
    s = choose(s, 'verpatron').state
    expect(s.sceneMemo.permisosGastados).toBe(8)
    s = advance(s).state
    s = choose(s, 'reir').state
    s = advance(s).state
    expect(s.statuses.some((x) => x.id === 'contagioFrialdad')).toBe(false)
  })

  it('avisa que la hija registra el silencio con automatismo alto', () => {
    const base = fresh()
    base.stats.automatismo = 70
    const s = at(base, 'a1_casa', 'h1')
    expect(hijaRegistrando(s)).toBe(true)
  })

  it('los drops son reproducibles con la misma semilla', () => {
    const a = playthrough(42)
    const b = playthrough(42)
    expect(a.state.inventory).toEqual(b.state.inventory)
    expect(a.state.endingId).toBe(b.state.endingId)
  })
})

describe('recorridos completos', () => {
  it('todas las partidas aleatorias llegan a un final', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const { state } = playthrough(seed)
      expect(state.phase).toBe('ending')
      expect(state.endingId).not.toBeNull()
    }
  })

  it('jugar siempre en piloto automático termina como NPC', () => {
    expect(playthrough(7, 'autopilot').state.endingId).toBe('npc')
  })

  it('jugar con presencia auténtica obtiene permisos de administrador', () => {
    const { state } = playthrough(7, 'authentic')
    expect(state.endingId).toBe('administrador')
  })
})
