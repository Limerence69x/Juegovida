// Estado de juego: todo lo que el motor lee y escribe.

/** Barras de sistema (0–100). */
export type StatKey = 'automatismo' | 'permisosAdmin' | 'energiaMental' | 'ladoOscuro'

/** EspejoGeneracional: memoria de observación de la hija. */
export type HijaKey = 'calidezAprendida' | 'frialdadHeredada'

/** SincronizacionFaseBeta: variables en tensión con la pareja. */
export type ParejaKey = 'confianzaAcumulada' | 'fantasmasInestabilidad'

/** Cualquier variable numérica 0–100 que una decisión puede mover. */
export type VarKey = StatKey | HijaKey | ParejaKey

export type Rarity = 'comun' | 'raro' | 'epico' | 'singular'

export type ItemCategory = 'frecuencia' | 'reloj' | 'perfume' | 'joyeria' | 'reliquia'

export type EquipSlot = 'muneca' | 'manos' | 'cuello'

export type ItemId =
  | 'freq_reverb'
  | 'freq_postpunk'
  | 'freq_demo'
  | 'freq_ladob'
  | 'reloj_automatico'
  | 'decant_vetiver'
  | 'decant_higo'
  | 'decant_incienso'
  | 'anillo_liso'
  | 'anillo_sello'
  | 'cadena_plata'
  | 'dibujo_hija'
  | 'piedra_portezuelo'

export type StatusId =
  | 'ruidoInstitucional'
  | 'contagioFrialdad'
  | 'ansiedad'
  | 'sentidosAbiertos'

export interface ActiveStatus {
  id: StatusId
  /** Decisiones (o interacciones relacionales) restantes. `undefined` = hasta que algo lo limpie. */
  charges?: number
}

export type LogKind = 'sistema' | 'consciencia' | 'vinculo' | 'loot' | 'alerta' | 'legacy'

export interface LogEntry {
  id: number
  kind: LogKind
  text: string
  /** Escena en la que ocurrió (para el registro). */
  sceneId: string
}

export type Phase = 'boot' | 'actIntro' | 'playing' | 'ending'

export type EndingId = 'administrador' | 'coraza' | 'npc' | 'modoSeguro'

export interface Equipment {
  muneca: ItemId | null
  manos: ItemId[]
  cuello: ItemId | null
}

export interface GameState {
  nombres: { hija: string; pareja: string }
  stats: Record<StatKey, number>
  hija: Record<HijaKey, number>
  pareja: Record<ParejaKey, number> & { diaEstabilidad: number }
  statuses: ActiveStatus[]
  inventory: Partial<Record<ItemId, number>>
  equipped: Equipment
  corazaActiva: boolean
  /** Lector de Defensas (Acto 3+): muestra el subtexto de todos, a costa de mirarlos como casos. */
  lectorActivo: boolean
  flags: Record<string, boolean>
  counters: Record<string, number>
  position: { sceneId: string; nodeId: string }
  /** Memoria de la escena en curso: se reinicia en cada cambio de escena. */
  sceneMemo: { permisosGastados: number; avisoHija: boolean; inspeccionados: string[] }
  log: LogEntry[]
  phase: Phase
  act: number
  endingId: EndingId | null
  decisions: number
  /** Semilla del generador pseudoaleatorio de drops (reproducible y persistible). */
  seed: number
}
