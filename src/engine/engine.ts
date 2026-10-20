// Motor narrativo: funciones puras GameState → GameState. React y Zustand
// sólo llaman a estas funciones; ninguna regla de juego vive en la UI.

import { DROP_TABLES } from '../data/dropTables'
import { ITEMS } from '../data/items'
import { STATUSES } from '../data/statuses'
import type { Choice, ChoiceTag, DialogueNode, DropTableId, Effect, Scene, SourceTag } from '../types/content'
import type { GameState, ItemId, LogKind, Rarity, StatusId, VarKey } from '../types/game'
import { describe, evaluate, hasStatus, isEquipped, mentionsAdmin, mentionsStatus, ownsItem } from './conditions'
import { computeEnding } from './endings'
import { currentNode, currentScene, getAct, getScene, interpolate, relationalOf, type RelationalTarget } from './registry'
import { nextRandom } from './rng'
import { diffVars, formatDeltas, getVar, setVar, snapshotVars } from './vars'

// ─── Constantes de diseño ───────────────────────────────────────────────────

export const AUTOMATISMO_HIJA_UMBRAL = 60
export const CORAZA_ACTIVAR_OSCURO = 5
export const CORAZA_DESACTIVAR_COSTO = 10
export const VISION_DEFENSAS_BONUS = 15
/** Respiro entre escenas del mismo acto. */
export const REGEN_ENTRE_ESCENAS = 4
export const GUION_VISIBLE_DESDE = 30
/** Ingeniería inversa manual (Actos 1–2): mínimo de consciencia y costo de batería por nodo. */
export const INSPECCION_MIN_PERMISOS = 15
export const INSPECCION_COSTO = 3
/** Ver el «diff» de una opción (qué variables mueve) exige leer bien el propio código. */
export const DIFF_VISIBLE_DESDE = 45
/** Costo pasivo del Lector encendido frente a tu hija, tu pareja o tu familia: mirarlos como casos. */
export const LECTOR_OSCURO = 2
export const LECTOR_VINCULO = 3
const LOG_MAX = 200

// ─── Tipos de salida ────────────────────────────────────────────────────────

export interface Notice {
  kind: 'loot' | 'alerta' | 'vinculo' | 'sistema' | 'legacy'
  text: string
  rarity?: Rarity
}

export interface StepResult {
  state: GameState
  notices: Notice[]
  deltas: Partial<Record<VarKey, number>>
}

export type BadgeId =
  | 'energia'
  | 'filtrada'
  | 'admin'
  | 'adminCosto'
  | 'coraza'
  | 'oculta'
  | 'guion'
  | ChoiceTag

export interface Badge {
  id: BadgeId
  label: string
}

export interface ChoiceView {
  choice: Choice
  locked: boolean
  lockReason?: string
  energyCost: number
  permisosCost: number
  badges: Badge[]
}

interface Ctx {
  s: GameState
  notices: Notice[]
}

// ─── Creación de partida ────────────────────────────────────────────────────

export function createInitialState(nombres: GameState['nombres'], seed: number): GameState {
  return {
    nombres,
    stats: { automatismo: 55, permisosAdmin: 10, energiaMental: 70, ladoOscuro: 25 },
    hija: { calidezAprendida: 35, frialdadHeredada: 30 },
    pareja: { confianzaAcumulada: 30, fantasmasInestabilidad: 45, diaEstabilidad: 7 },
    statuses: [],
    inventory: { freq_reverb: 1 },
    equipped: { muneca: null, manos: ['anillo_liso'], cuello: null },
    corazaActiva: false,
    lectorActivo: false,
    flags: {},
    counters: {},
    position: { sceneId: '', nodeId: '' },
    sceneMemo: { permisosGastados: 0, avisoHija: false, inspeccionados: [] },
    log: [],
    phase: 'boot',
    act: 0,
    endingId: null,
    decisions: 0,
    seed,
  }
}

export function startGame(nombres: GameState['nombres'], seed: number): StepResult {
  const ctx: Ctx = { s: createInitialState(nombres, seed), notices: [] }
  pushLog(ctx.s, 'sistema', 'Sistema iniciado. Usuario sin privilegios de administrador.')
  changeScene(ctx, getAct(1).firstScene)
  return { state: ctx.s, notices: ctx.notices, deltas: {} }
}

/** Completa campos que no existían en partidas guardadas con versiones anteriores. */
export function normalizeState(g: GameState): GameState {
  const memo: Partial<GameState['sceneMemo']> = g.sceneMemo ?? {}
  return {
    ...g,
    lectorActivo: g.lectorActivo ?? Boolean(g.flags?.visionDefensas),
    sceneMemo: {
      permisosGastados: memo.permisosGastados ?? 0,
      avisoHija: memo.avisoHija ?? false,
      inspeccionados: memo.inspeccionados ?? [],
    },
  }
}

/** Cierra la tarjeta de acto y entrega el control al jugador. */
export function beginAct(state: GameState): GameState {
  return { ...state, phase: 'playing' }
}

// ─── Lectura derivada (para la UI) ──────────────────────────────────────────

export function effectiveEnergyCost(state: GameState, scene: Scene, choice: Choice): number {
  let cost = choice.cost?.energia ?? 0
  if (cost === 0) return 0
  if (state.corazaActiva || choice.coraza) return 0
  if (hasStatus(state, 'ansiedad')) cost += 5
  if (scene.presionTiempo && isEquipped(state, 'reloj_automatico')) cost = Math.max(0, cost - 5)
  return cost
}

const TAG_LABEL: Record<ChoiceTag, string> = {
  salto: 'SALTO DE FE',
  regresion: 'IMPULSO DE REGRESIÓN',
  presencia: 'PRESENCIA',
  analisis: 'INTELECTUALIZACIÓN',
  sentidos: 'SENTIDOS',
  ancla: 'ANCLA',
}

/** Opción que el sistema elegirá solo cuando el automatismo llegue a 100. */
export function autopilotChoice(choices: Choice[]): Choice | undefined {
  const marked = choices.find((c) => c.autopilot)
  if (marked) return marked
  const autoGain = (c: Choice) =>
    c.effects.reduce((sum, e) => (e.kind === 'var' && e.key === 'automatismo' ? sum + e.delta : sum), 0)
  return [...choices].sort((a, b) => autoGain(b) - autoGain(a))[0]
}

export function isAutopilotLocked(state: GameState): boolean {
  return state.stats.automatismo >= 100
}

export function getChoiceViews(state: GameState): ChoiceView[] {
  const scene = currentScene(state)
  const node = currentNode(state)
  const visible = (node.choices ?? []).filter((c) => evaluate(c.visibleIf, state))
  const forced = isAutopilotLocked(state) ? autopilotChoice(visible) : undefined

  return visible.map((choice) => {
    const energyCost = effectiveEnergyCost(state, scene, choice)
    const permisosCost = choice.cost?.permisos ?? 0
    const badges: Badge[] = []

    if (energyCost > 0) badges.push({ id: 'energia', label: `ENERGÍA −${energyCost}` })
    else if ((choice.cost?.energia ?? 0) > 0) badges.push({ id: 'filtrada', label: 'ENERGÍA FILTRADA' })
    const adminReq = mentionsAdmin(choice.requires) || mentionsAdmin(choice.visibleIf)
    if (adminReq) {
      const min = findAdminMin(choice)
      badges.push({ id: 'admin', label: min ? `ADMIN ≥ ${min}` : 'ADMIN' })
    }
    if (permisosCost > 0) badges.push({ id: 'adminCosto', label: `GASTA PERMISOS −${permisosCost}` })
    if (choice.coraza) badges.push({ id: 'coraza', label: 'ACTIVA CORAZA' })
    for (const t of choice.tags ?? []) badges.push({ id: t, label: TAG_LABEL[t] })
    if (mentionsStatus(choice.visibleIf, 'sentidosAbiertos') && !choice.tags?.includes('sentidos'))
      badges.push({ id: 'sentidos', label: TAG_LABEL.sentidos })
    if (choice.visibleIf && !adminReq) badges.push({ id: 'oculta', label: 'DESBLOQUEADA' })
    if (choice.autopilot && state.stats.permisosAdmin >= GUION_VISIBLE_DESDE)
      badges.push({ id: 'guion', label: 'GUION PRECARGADO' })

    let lockReason: string | undefined
    if (forced && choice !== forced) lockReason = 'Bloqueada: automatismo al 100%'
    else if (!evaluate(choice.requires, state)) lockReason = `Requiere ${choice.lockHint ?? describe(choice.requires!)}`
    else if (energyCost > state.stats.energiaMental) lockReason = 'Batería insuficiente'
    else if (permisosCost > state.stats.permisosAdmin) lockReason = 'Permisos insuficientes'

    return { choice, locked: Boolean(lockReason), lockReason, energyCost, permisosCost, badges }
  })
}

function findAdminMin(choice: Choice): number | undefined {
  const walk = (c: Choice['requires']): number | undefined => {
    if (!c) return undefined
    if ('var' in c && c.var === 'permisosAdmin') return c.gte
    if ('all' in c) return c.all.map(walk).find((n) => n !== undefined)
    if ('any' in c) return c.any.map(walk).find((n) => n !== undefined)
    return undefined
  }
  return walk(choice.requires) ?? walk(choice.visibleIf)
}

export interface CodeReading {
  /** Hay algo que leer: etiquetas de un personaje o subtexto de opciones. */
  available: boolean
  /** Ya se ve (inspeccionado a mano o con el Lector encendido). */
  revealed: boolean
  mode: 'lector' | 'manual'
  /** Batería que cuesta inspeccionar a mano. */
  cost: number
  /** Motivo por el que no se puede inspeccionar ahora. */
  locked?: string
  /** Lectura efectiva: permisos + bonus del Lector. */
  lectura: number
  visible: SourceTag[]
  hidden: SourceTag[]
}

/** Qué del subtexto del nodo actual puede ver el jugador, y a qué precio. */
export function readCode(state: GameState, node: DialogueNode = currentNode(state)): CodeReading {
  const tags = node.sourceTags ?? []
  const lectura = state.stats.permisosAdmin + (state.lectorActivo ? VISION_DEFENSAS_BONUS : 0)
  const available = tags.length > 0 || (node.choices?.length ?? 0) >= 2
  const mode = state.lectorActivo ? 'lector' : 'manual'
  const revealed = available && (state.lectorActivo || state.sceneMemo.inspeccionados.includes(state.position.nodeId))
  const cost = state.corazaActiva ? 0 : INSPECCION_COSTO
  let locked: string | undefined
  if (state.stats.permisosAdmin < INSPECCION_MIN_PERMISOS) locked = `Requiere permisos ≥ ${INSPECCION_MIN_PERMISOS}`
  else if (cost > state.stats.energiaMental) locked = 'Batería insuficiente'
  return {
    available,
    revealed,
    mode,
    cost,
    locked,
    lectura,
    visible: revealed ? tags.filter((t) => lectura >= t.min) : [],
    hidden: tags.filter((t) => !revealed || lectura < t.min),
  }
}

/** «Ella está registrando este patrón de silencio». */
export function hijaRegistrando(state: GameState): boolean {
  if (state.phase === 'boot') return false
  const rel = relationalOf(currentScene(state), currentNode(state))
  return rel.hija && (state.corazaActiva || state.stats.automatismo >= AUTOMATISMO_HIJA_UMBRAL)
}

/** El Lector cobra cuando lees a alguien de tu vida íntima; en el trabajo, leer es gratis. */
export function lectorCobra(state: GameState): boolean {
  if (state.phase === 'boot' || !state.lectorActivo) return false
  const scene = currentScene(state)
  const node = currentNode(state)
  const rel = relationalOf(scene, node)
  return Boolean(node.sourceTags?.length) && (rel.hija || rel.pareja || scene.relational === 'legacy')
}

/** Con el Lector encendido frente a ella, la hija nota que la miras como un caso. */
export function hijaLeida(state: GameState): boolean {
  if (state.phase === 'boot') return false
  const node = currentNode(state)
  return state.lectorActivo && relationalOf(currentScene(state), node).hija && Boolean(node.sourceTags?.length)
}

export function canActivateCoraza(state: GameState): boolean {
  return !state.corazaActiva && Boolean(currentNode(state).presion)
}

// ─── Acciones ───────────────────────────────────────────────────────────────

export function choose(state: GameState, choiceId: string): StepResult {
  const view = getChoiceViews(state).find((v) => v.choice.id === choiceId)
  if (!view || view.locked || state.phase !== 'playing') return { state, notices: [], deltas: {} }

  const ctx: Ctx = { s: structuredClone(state), notices: [] }
  const { s } = ctx
  const scene = currentScene(s)
  const node = currentNode(s)
  const rel = relationalOf(scene, node)
  const leyendo = lectorCobra(s)
  const before = snapshotVars(s)
  const { choice } = view

  if (view.energyCost) setVar(s, 'energiaMental', s.stats.energiaMental - view.energyCost)
  if (view.permisosCost) {
    setVar(s, 'permisosAdmin', s.stats.permisosAdmin - view.permisosCost)
    s.sceneMemo.permisosGastados += view.permisosCost
  }
  if (choice.coraza && !s.corazaActiva) activateCoraza(ctx)

  applyEffects(ctx, choice.effects, 'choice', rel)
  applyPassives(ctx, rel, leyendo)
  s.decisions += 1

  const summary = formatDeltas(diffVars(before, s))
  if (summary) pushLog(s, 'sistema', summary)

  goto(ctx, choice.next)
  return { state: s, notices: ctx.notices, deltas: diffVars(before, s) }
}

/** Avance lineal en nodos sin decisión. */
export function advance(state: GameState): StepResult {
  const node = currentNode(state)
  const target = linearTarget(state, node)
  if (!target || node.choices?.length || state.phase !== 'playing') return { state, notices: [], deltas: {} }
  const ctx: Ctx = { s: structuredClone(state), notices: [] }
  const before = snapshotVars(ctx.s)
  goto(ctx, target)
  return { state: ctx.s, notices: ctx.notices, deltas: diffVars(before, ctx.s) }
}

export function linearTarget(state: GameState, node: DialogueNode): string | undefined {
  return node.nextIf?.find((b) => evaluate(b.if, state))?.next ?? node.next
}

export function consumeItem(state: GameState, id: ItemId): StepResult {
  const def = ITEMS[id]
  if (def.kind !== 'consumible' || (state.inventory[id] ?? 0) < 1 || state.phase === 'ending')
    return { state, notices: [], deltas: {} }
  const ctx: Ctx = { s: structuredClone(state), notices: [] }
  const before = snapshotVars(ctx.s)
  ctx.s.inventory[id] = (ctx.s.inventory[id] ?? 1) - 1
  if (!ctx.s.inventory[id]) delete ctx.s.inventory[id]
  applyEffects(ctx, def.onUse ?? [], 'item', { hija: false, pareja: false })
  const deltas = diffVars(before, ctx.s)
  pushLog(ctx.s, 'loot', `Usaste ${def.name}. ${formatDeltas(deltas)}`.trim())
  ctx.notices.push({ kind: 'loot', text: `${def.name}: ${def.effect}`, rarity: def.rarity })
  return { state: ctx.s, notices: ctx.notices, deltas }
}

export function equipItem(state: GameState, id: ItemId): StepResult {
  const def = ITEMS[id]
  if (def.kind !== 'equipable' || !def.slot || (state.inventory[id] ?? 0) < 1) return { state, notices: [], deltas: {} }
  const s = structuredClone(state)
  removeFromInventory(s, id)
  if (def.slot === 'manos') {
    if (s.equipped.manos.length >= 2) addToInventory(s, s.equipped.manos.shift()!)
    s.equipped.manos.push(id)
  } else {
    const prev = s.equipped[def.slot]
    if (prev) addToInventory(s, prev)
    s.equipped[def.slot] = id
  }
  pushLog(s, 'loot', `Equipaste ${def.name}.`)
  return { state: s, notices: [], deltas: {} }
}

export function unequipItem(state: GameState, id: ItemId): StepResult {
  if (!isEquipped(state, id)) return { state, notices: [], deltas: {} }
  const s = structuredClone(state)
  if (s.equipped.muneca === id) s.equipped.muneca = null
  if (s.equipped.cuello === id) s.equipped.cuello = null
  s.equipped.manos = s.equipped.manos.filter((m) => m !== id)
  addToInventory(s, id)
  pushLog(s, 'loot', `Guardaste ${ITEMS[id].name}.`)
  return { state: s, notices: [], deltas: {} }
}

/** Ingeniería inversa manual: revela el subtexto del nodo actual a cambio de batería. */
export function inspectNode(state: GameState): StepResult {
  const reading = readCode(state)
  if (state.phase !== 'playing' || !reading.available || reading.revealed || reading.locked)
    return { state, notices: [], deltas: {} }
  const ctx: Ctx = { s: structuredClone(state), notices: [] }
  const { s } = ctx
  const before = snapshotVars(s)
  const node = currentNode(s)
  setVar(s, 'energiaMental', s.stats.energiaMental - reading.cost)
  // Analizar con la coraza puesta no cansa: enfría.
  if (s.corazaActiva) setVar(s, 'ladoOscuro', s.stats.ladoOscuro + 1)
  s.sceneMemo.inspeccionados.push(s.position.nodeId)
  const quien = node.speaker ? interpolate(node.speaker, s).split(' · ')[0] : 'la escena'
  const leidas = readCode(s).visible.length
  pushLog(s, 'consciencia', `⌕ Inspeccionaste el código de ${quien}${leidas ? `: ${leidas} etiqueta(s) legible(s)` : ''}.`)
  return { state: s, notices: ctx.notices, deltas: diffVars(before, s) }
}

/** Encender o apagar el Lector de Defensas (disponible desde el Acto 3). Es gratis; lo caro es dejarlo encendido. */
export function toggleLector(state: GameState): StepResult {
  if (state.phase !== 'playing' || !state.flags.visionDefensas) return { state, notices: [], deltas: {} }
  const s = structuredClone(state)
  s.lectorActivo = !s.lectorActivo
  pushLog(
    s,
    'consciencia',
    s.lectorActivo
      ? 'Lector de Defensas encendido. Vuelves a ver los subtítulos de todos.'
      : 'Lector de Defensas apagado. Las personas vuelven a ser personas, no casos. Ves menos.',
  )
  return { state: s, notices: [], deltas: {} }
}

export function toggleCoraza(state: GameState): StepResult {
  if (state.phase !== 'playing') return { state, notices: [], deltas: {} }
  const ctx: Ctx = { s: structuredClone(state), notices: [] }
  const before = snapshotVars(ctx.s)
  if (ctx.s.corazaActiva) {
    if (ctx.s.stats.energiaMental < CORAZA_DESACTIVAR_COSTO) {
      ctx.notices.push({ kind: 'alerta', text: 'No te queda batería para bajar la guardia.' })
      return { state, notices: ctx.notices, deltas: {} }
    }
    setVar(ctx.s, 'energiaMental', ctx.s.stats.energiaMental - CORAZA_DESACTIVAR_COSTO)
    ctx.s.corazaActiva = false
    pushLog(ctx.s, 'consciencia', 'Bajaste la coraza. Duele un poco: es la temperatura real de las cosas.')
  } else {
    if (!canActivateCoraza(ctx.s)) return { state, notices: [], deltas: {} }
    activateCoraza(ctx)
  }
  return { state: ctx.s, notices: ctx.notices, deltas: diffVars(before, ctx.s) }
}

// ─── Internos ───────────────────────────────────────────────────────────────

function activateCoraza(ctx: Ctx) {
  ctx.s.corazaActiva = true
  setVar(ctx.s, 'ladoOscuro', ctx.s.stats.ladoOscuro + CORAZA_ACTIVAR_OSCURO)
  pushLog(ctx.s, 'legacy', 'Protocolo Legacy activado. La energía deja de filtrarse. También el calor.')
  ctx.notices.push({ kind: 'legacy', text: 'CORAZA DE DISTANCIA ACTIVA' })
}

function modifyDelta(ctx: Ctx, key: VarKey, delta: number, rel: RelationalTarget): number {
  const { s } = ctx
  const scene = currentScene(s)
  let d = delta
  if (key === 'automatismo' && d > 0) {
    if (hasStatus(s, 'ruidoInstitucional')) d += 2
    if (scene.entorno === 'burocratico') {
      const shield = equippedItems(s).reduce((sum, id) => sum + (ITEMS[id].burocraciaShield ?? 0), 0)
      d = Math.max(1, d - shield)
    }
    if (scene.presionTiempo && isEquipped(s, 'reloj_automatico')) d = Math.ceil(d / 2)
  }
  if (key === 'energiaMental' && d < 0 && s.corazaActiva) d = 0
  if ((key === 'calidezAprendida' || key === 'confianzaAcumulada') && d > 0) {
    if (s.corazaActiva) d *= 0.5
    const relevante = key === 'calidezAprendida' ? rel.hija : rel.pareja
    if (relevante && hasStatus(s, 'contagioFrialdad')) d *= 0.5
    d = Math.round(d)
  }
  return d
}

function applyEffects(ctx: Ctx, effects: Effect[], source: 'choice' | 'item' | 'system', rel: RelationalTarget) {
  const { s } = ctx
  for (const e of effects) {
    switch (e.kind) {
      case 'var': {
        const d = source === 'choice' ? modifyDelta(ctx, e.key, e.delta, rel) : e.delta
        setVar(s, e.key, getVar(s, e.key) + d)
        break
      }
      case 'status':
        if (e.op === 'add') addStatus(ctx, e.id, e.charges)
        else removeStatus(ctx, e.id)
        break
      case 'flag':
        s.flags[e.id] = e.value ?? true
        break
      case 'counter':
        s.counters[e.id] = (s.counters[e.id] ?? 0) + e.delta
        break
      case 'item':
        giveItem(ctx, e.id, e.qty ?? 1)
        break
      case 'drop':
        rollDrop(ctx, e.table)
        break
      case 'coraza':
        if (e.active && !s.corazaActiva) activateCoraza(ctx)
        else if (!e.active) s.corazaActiva = false
        break
      case 'lector':
        if (s.lectorActivo !== e.active) {
          s.lectorActivo = e.active
          pushLog(s, 'consciencia', e.active ? 'Lector de Defensas en línea.' : 'Lector de Defensas apagado.')
        }
        break
      case 'dia':
        s.pareja.diaEstabilidad = e.set ?? s.pareja.diaEstabilidad + e.delta
        break
      case 'log':
        pushLog(s, e.tone ?? 'consciencia', interpolate(e.text, s))
        if (e.tone === 'alerta' || e.tone === 'vinculo' || e.tone === 'legacy')
          ctx.notices.push({ kind: e.tone, text: interpolate(e.text, s) })
        break
    }
  }
}

/** Costos y efectos que no dependen de la opción sino del estado en que la elegiste. */
function applyPassives(ctx: Ctx, rel: RelationalTarget, leyendo: boolean) {
  const { s } = ctx
  if (leyendo) {
    setVar(s, 'ladoOscuro', s.stats.ladoOscuro + LECTOR_OSCURO)
    if (rel.hija) setVar(s, 'frialdadHeredada', s.hija.frialdadHeredada + LECTOR_VINCULO)
    if (rel.pareja) setVar(s, 'fantasmasInestabilidad', s.pareja.fantasmasInestabilidad + LECTOR_VINCULO)
  }
  if (s.corazaActiva) {
    setVar(s, 'ladoOscuro', s.stats.ladoOscuro + 3)
    if (rel.hija) setVar(s, 'frialdadHeredada', s.hija.frialdadHeredada + (ownsItem(s, 'dibujo_hija') ? 2 : 4))
    if (rel.pareja) setVar(s, 'fantasmasInestabilidad', s.pareja.fantasmasInestabilidad + 3)
  }
  const contagio = s.statuses.find((x) => x.id === 'contagioFrialdad')
  if (contagio && (rel.hija || rel.pareja)) {
    if (rel.hija) setVar(s, 'frialdadHeredada', s.hija.frialdadHeredada + 3)
    if (rel.pareja) setVar(s, 'fantasmasInestabilidad', s.pareja.fantasmasInestabilidad + 3)
    contagio.charges = (contagio.charges ?? 1) - 1
    if (contagio.charges <= 0) {
      removeStatus(ctx, 'contagioFrialdad')
      pushLog(s, 'legacy', 'El Contagio de Frialdad se disipa. Lo pagaron otros.')
    }
  }
  const sentidos = s.statuses.find((x) => x.id === 'sentidosAbiertos')
  if (sentidos?.charges !== undefined) {
    sentidos.charges -= 1
    if (sentidos.charges <= 0) removeStatus(ctx, 'sentidosAbiertos')
  }
}

function addStatus(ctx: Ctx, id: StatusId, charges?: number) {
  const existing = ctx.s.statuses.find((x) => x.id === id)
  if (existing) {
    existing.charges = charges === undefined || existing.charges === undefined ? undefined : Math.max(existing.charges, charges)
    return
  }
  ctx.s.statuses.push({ id, charges })
  const def = STATUSES[id]
  const kind: LogKind = id === 'contagioFrialdad' ? 'legacy' : def.polarity === 'negativo' ? 'alerta' : 'consciencia'
  pushLog(ctx.s, kind, `Estado alterado: ${def.name}.`)
  ctx.notices.push({ kind: kind === 'consciencia' ? 'sistema' : kind, text: `ESTADO: ${def.name.toUpperCase()}` })
}

function removeStatus(ctx: Ctx, id: StatusId) {
  const had = ctx.s.statuses.some((x) => x.id === id)
  ctx.s.statuses = ctx.s.statuses.filter((x) => x.id !== id)
  if (had && STATUSES[id].polarity === 'negativo') pushLog(ctx.s, 'consciencia', `${STATUSES[id].name} se disipa.`)
}

function equippedItems(s: GameState): ItemId[] {
  return [s.equipped.muneca, s.equipped.cuello, ...s.equipped.manos].filter((x): x is ItemId => Boolean(x))
}

function addToInventory(s: GameState, id: ItemId, qty = 1) {
  s.inventory[id] = (s.inventory[id] ?? 0) + qty
}

function removeFromInventory(s: GameState, id: ItemId) {
  const left = (s.inventory[id] ?? 0) - 1
  if (left > 0) s.inventory[id] = left
  else delete s.inventory[id]
}

function giveItem(ctx: Ctx, id: ItemId, qty: number): boolean {
  const def = ITEMS[id]
  const { s } = ctx
  if (def.unique && ownsItem(s, id)) return false
  const slot = def.slot
  const libre =
    def.kind === 'equipable' &&
    slot !== undefined &&
    (slot === 'manos' ? s.equipped.manos.length < 2 : s.equipped[slot] === null)
  if (libre && slot === 'manos') s.equipped.manos.push(id)
  else if (libre && slot && slot !== 'manos') s.equipped[slot] = id
  else addToInventory(s, id, def.unique ? 1 : qty)
  pushLog(s, 'loot', `Ancla obtenida: ${def.name}${libre ? ' (equipada)' : ''}.`)
  ctx.notices.push({ kind: 'loot', text: def.name, rarity: def.rarity })
  return true
}

function rollDrop(ctx: Ctx, tableId: DropTableId) {
  const table = DROP_TABLES[tableId]
  const [roll, seed1] = nextRandom(ctx.s.seed)
  ctx.s.seed = seed1
  if (roll > table.chance) return
  const pool = table.entries.filter((e) => !(ITEMS[e.item].unique && ownsItem(ctx.s, e.item)))
  const total = pool.reduce((sum, e) => sum + e.weight, 0)
  if (total === 0) return
  const [pick, seed2] = nextRandom(ctx.s.seed)
  ctx.s.seed = seed2
  let acc = pick * total
  const entry = pool.find((e) => (acc -= e.weight) < 0) ?? pool[pool.length - 1]
  giveItem(ctx, entry.item, 1)
}

function goto(ctx: Ctx, target: string) {
  if (target === '#FIN') return finish(ctx)
  if (target.startsWith('@')) return changeScene(ctx, target.slice(1))
  enterNode(ctx, target)
}

function changeScene(ctx: Ctx, sceneId: string) {
  const { s } = ctx
  if (s.position.sceneId) exitScene(ctx)
  const scene = getScene(sceneId)
  s.position = { sceneId, nodeId: scene.start }
  s.sceneMemo = { permisosGastados: 0, avisoHija: false, inspeccionados: [] }
  if (scene.act !== s.act) {
    s.act = scene.act
    s.phase = 'actIntro'
    const act = getAct(scene.act)
    pushLog(s, 'sistema', `── ACTO ${act.number}: ${act.title.toUpperCase()} ──`)
    applyEffects(ctx, act.onEnter ?? [], 'system', { hija: false, pareja: false })
    if (s.corazaActiva) {
      s.corazaActiva = false
      pushLog(s, 'legacy', 'Dormiste. La coraza cedió sola durante la noche; mañana habrá que decidir de nuevo si ponérsela.')
    }
  } else {
    setVar(s, 'energiaMental', s.stats.energiaMental + REGEN_ENTRE_ESCENAS)
  }
  applyEffects(ctx, scene.onEnter ?? [], 'system', { hija: false, pareja: false })
  enterNode(ctx, scene.start)
}

function exitScene(ctx: Ctx) {
  const { s } = ctx
  const scene = currentScene(s)
  if (scene.relational !== 'legacy') return
  if (s.sceneMemo.permisosGastados === 0) {
    addStatus(ctx, 'contagioFrialdad', 4)
    pushLog(s, 'legacy', 'Saliste sin gastar permisos de administrador. El frío viaja contigo hacia casa.')
  } else {
    pushLog(s, 'consciencia', 'Viste el código mientras se ejecutaba. Esta vez no te lo llevaste puesto.')
  }
}

function enterNode(ctx: Ctx, nodeId: string) {
  const { s } = ctx
  s.position.nodeId = nodeId
  const scene = currentScene(s)
  const node = currentNode(s)
  const before = snapshotVars(s)
  applyEffects(ctx, node.onEnter ?? [], 'system', relationalOf(scene, node))
  const recarga = formatDeltas(diffVars(before, s))
  if (recarga) pushLog(s, 'vinculo', `↺ ${recarga}`)
  if (!s.sceneMemo.avisoHija && hijaRegistrando(s)) {
    s.sceneMemo.avisoHija = true
    setVar(s, 'frialdadHeredada', s.hija.frialdadHeredada + 5)
    pushLog(s, 'vinculo', `${s.nombres.hija} está registrando este patrón de silencio.`)
    ctx.notices.push({ kind: 'vinculo', text: 'Ella está registrando este patrón de silencio.' })
  }
}

function finish(ctx: Ctx) {
  const { s } = ctx
  s.endingId = computeEnding(s)
  s.phase = 'ending'
  pushLog(s, 'sistema', 'Sesión finalizada.')
}

let logSeq = 0
function pushLog(s: GameState, kind: LogKind, text: string) {
  const lastId = s.log.length ? s.log[s.log.length - 1].id : 0
  logSeq = Math.max(logSeq, lastId) + 1
  s.log.push({ id: logSeq, kind, text, sceneId: s.position.sceneId })
  if (s.log.length > LOG_MAX) s.log.splice(0, s.log.length - LOG_MAX)
}
