// Contrato de datos del motor narrativo. Las escenas son datos puros:
// el motor (src/engine) las interpreta sin conocer su contenido.

import type {
  EndingId,
  EquipSlot,
  ItemCategory,
  ItemId,
  Rarity,
  StatusId,
  VarKey,
} from './game'

// ─── Condiciones ────────────────────────────────────────────────────────────

export type Condition =
  | { var: VarKey; gte?: number; lte?: number }
  | { flag: string; is?: boolean }
  | { item: ItemId }
  | { equipped: ItemId }
  | { status: StatusId; is?: boolean }
  | { coraza: boolean }
  | { counter: string; gte?: number; lte?: number }
  | { compare: [VarKey, VarKey] } // a >= b
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }

// ─── Efectos ────────────────────────────────────────────────────────────────

export type Effect =
  | { kind: 'var'; key: VarKey; delta: number }
  | { kind: 'status'; op: 'add' | 'remove'; id: StatusId; charges?: number }
  | { kind: 'flag'; id: string; value?: boolean }
  | { kind: 'counter'; id: string; delta: number }
  | { kind: 'item'; id: ItemId; qty?: number }
  | { kind: 'drop'; table: DropTableId }
  | { kind: 'coraza'; active: boolean }
  | { kind: 'dia'; delta: number; set?: never }
  | { kind: 'dia'; set: number; delta?: never }
  | { kind: 'log'; text: string; tone?: 'sistema' | 'consciencia' | 'vinculo' | 'alerta' | 'legacy' }

// ─── Decisiones ─────────────────────────────────────────────────────────────

/** Etiquetas de subtexto visibles en la opción. Algunas se derivan solas (costos, requisitos). */
export type ChoiceTag =
  | 'salto' // Salto de Fe
  | 'regresion' // Impulso de Regresión
  | 'presencia' // presencia real con la hija
  | 'analisis' // intelectualización: alimenta el lado oscuro
  | 'sentidos' // opción creativa/empática habilitada por perfume
  | 'ancla' // usa un objeto de identidad

export interface Choice {
  id: string
  text: string
  tags?: ChoiceTag[]
  /** La respuesta vacía / políticamente correcta. El sistema la elige solo si automatismo = 100. */
  autopilot?: boolean
  /** Si no se cumple, la opción no aparece (opciones ocultas). */
  visibleIf?: Condition
  /** Si no se cumple, la opción aparece bloqueada con su motivo. */
  requires?: Condition
  /** Motivo legible del bloqueo; si falta, se deriva de `requires`. */
  lockHint?: string
  /** Recursos que se gastan al elegir. Bloquea la opción si no alcanzan. */
  cost?: { energia?: number; permisos?: number }
  /** Activa la Coraza de Distancia al elegirla. */
  coraza?: boolean
  effects: Effect[]
  /** `nodeId` en la misma escena, `@sceneId` para saltar de escena, `#FIN` para evaluar el final. */
  next: string
}

// ─── Nodos y escenas ────────────────────────────────────────────────────────

export type SourceTagKind = 'DEFENSA' | 'MIEDO' | 'MOTIVACIÓN' | 'HISTORIA' | 'PATRÓN'

/** Etiqueta de código fuente: lo que hay detrás de lo que alguien dice. */
export interface SourceTag {
  kind: SourceTagKind
  /** Permisos de administrador necesarios para leerla. */
  min: number
  text: string
}

export interface TextExtra {
  if: Condition
  text: string
}

export interface DialogueNode {
  /** Quién habla. Sin `speaker`, es narración. Admite `{hija}` / `{pareja}`. */
  speaker?: string
  text: string
  /** Párrafos que se agregan si se cumple su condición. */
  extras?: TextExtra[]
  sourceTags?: SourceTag[]
  /** Momento de alta presión: permite activar la Coraza manualmente. */
  presion?: boolean
  /** Sobrescribe el nodo relacional de la escena para este nodo. */
  relational?: 'hija' | 'pareja' | 'ambos'
  choices?: Choice[]
  /** Avance lineal sin decisión (botón «continuar»). */
  next?: string
  /** Desvíos condicionales del avance lineal: gana la primera condición que se cumpla. */
  nextIf?: { if: Condition; next: string }[]
  onEnter?: Effect[]
}

export type SceneArt =
  | 'dormitorio'
  | 'oficina'
  | 'reunion'
  | 'micro'
  | 'hogar'
  | 'recinto'
  | 'relojeria'
  | 'legacy'
  | 'estudio'
  | 'plaza'
  | 'sendero'
  | 'acarreo'
  | 'portezuelo'
  | 'campamento'
  | 'auto'
  | 'algoritmo'

export type Entorno = 'burocratico' | 'hogar' | 'legacy' | 'montana' | 'transito' | 'interior'

export interface Scene {
  id: string
  act: number
  title: string
  location: string
  time: string
  /** Etiqueta del día en el reloj del sistema. */
  day: string
  art: SceneArt
  entorno: Entorno
  /** Nodo relacional en juego: activa sus reglas (aviso de la hija, contagio, legacy). */
  relational?: 'hija' | 'pareja' | 'ambos' | 'legacy'
  /** Presión de tiempo administrativa (el reloj mecánico la amortigua). */
  presionTiempo?: boolean
  onEnter?: Effect[]
  /** Barra extra en pantalla ligada a un contador (p. ej. coherencia del jefe final). */
  meter?: { counter: string; label: string; max: number }
  start: string
  nodes: Record<string, DialogueNode>
}

export interface ActMeta {
  number: number
  title: string
  subtitle: string
  epigraph: string
  firstScene: string
  onEnter?: Effect[]
}

// ─── Inventario ─────────────────────────────────────────────────────────────

export type DropTableId = 'rutina' | 'pausa' | 'cuidado' | 'montana' | 'raro'

export interface DropTable {
  id: DropTableId
  /** Probabilidad (0–1) de que caiga algo. */
  chance: number
  entries: { item: ItemId; weight: number }[]
}

export interface ItemDef {
  id: ItemId
  name: string
  rarity: Rarity
  category: ItemCategory
  kind: 'consumible' | 'equipable' | 'reliquia'
  slot?: EquipSlot
  /** Efecto mecánico, en una línea. */
  effect: string
  flavor: string
  /** Lo que ocurre al consumirlo. */
  onUse?: Effect[]
  /** Reducción de automatismo por decisión en entornos burocráticos (joyería). */
  burocraciaShield?: number
  /** Si es único, no se vuelve a dropear una vez obtenido. */
  unique?: boolean
}

export interface EndingDef {
  id: EndingId
  title: string
  subtitle: string
  text: string
  extras?: TextExtra[]
}
