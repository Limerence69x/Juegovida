// Ingeniería inversa aplicada a las propias opciones: qué protege cada respuesta
// y, con suficiente consciencia, qué variables mueve.

import type { Choice } from '../types/content'
import type { GameState, VarKey } from '../types/game'
import { DIFF_VISIBLE_DESDE } from './engine'
import { VAR_KEYS } from './vars'

/** Subtexto por defecto según la etiqueta dominante de la opción. */
const DEFAULT_SUBTEXT = {
  coraza: 'PROTOCOLO LEGACY · Protege tu batería congelando el vínculo. Lo que no sientes hoy lo paga alguien cerca.',
  autopilot: 'GUION PRECARGADO · La respuesta que el sistema ya tenía escrita. Evita el conflicto ahora y lo posterga.',
  analisis: 'INTELECTUALIZACIÓN · Entender para no sentir. Ganas claridad; el otro se queda solo con la suya.',
  regresion: 'IMPULSO DE REGRESIÓN · Distancia preventiva: irte un poco antes de que te dejen.',
  salto: 'SALTO DE FE · Exponerte para proteger lo que se está construyendo. Puede doler; por eso vale.',
  presencia: 'PRESENCIA · Cuesta batería y rompe el ciclo: ella aprende de lo que haces, no de lo que dices.',
  sentidos: 'PERCEPCIÓN ABIERTA · Una salida que sólo aparece cuando el cuerpo baja la guardia.',
  ancla: 'ANCLA · Elegir algo pequeño que es tuyo, contra la homogeneización.',
  propia: 'ELECCIÓN PROPIA · Sin guion previo. El costo es tuyo, y también lo que se mueve.',
} as const

export function choiceSubtext(choice: Choice): string {
  if (choice.subtext) return choice.subtext
  if (choice.coraza) return DEFAULT_SUBTEXT.coraza
  if (choice.autopilot) return DEFAULT_SUBTEXT.autopilot
  const tag = (['analisis', 'regresion', 'salto', 'presencia', 'sentidos', 'ancla'] as const).find((t) =>
    choice.tags?.includes(t),
  )
  return DEFAULT_SUBTEXT[tag ?? 'propia']
}

/** Dirección (+1 sube, −1 baja) de cada variable que la opción toca, sin magnitudes. */
export function choiceDiff(choice: Choice): { key: VarKey; dir: 1 | -1 }[] {
  const net = new Map<VarKey, number>()
  const add = (k: VarKey, d: number) => net.set(k, (net.get(k) ?? 0) + d)
  if (choice.cost?.energia) add('energiaMental', -choice.cost.energia)
  if (choice.cost?.permisos) add('permisosAdmin', -choice.cost.permisos)
  if (choice.coraza) add('ladoOscuro', 5)
  for (const e of choice.effects) if (e.kind === 'var') add(e.key, e.delta)
  return VAR_KEYS.filter((k) => (net.get(k) ?? 0) !== 0).map((k) => ({ key: k, dir: (net.get(k)! > 0 ? 1 : -1) as 1 | -1 }))
}

export interface ChoiceInsight {
  subtext: string
  /** Sólo con permisos suficientes para leer el propio código. */
  diff: { key: VarKey; dir: 1 | -1 }[] | null
}

export function choiceInsight(state: GameState, choice: Choice): ChoiceInsight {
  return {
    subtext: choiceSubtext(choice),
    diff: state.stats.permisosAdmin >= DIFF_VISIBLE_DESDE ? choiceDiff(choice) : null,
  }
}
