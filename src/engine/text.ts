import type { TextExtra } from '../types/content'
import type { GameState } from '../types/game'
import { evaluate } from './conditions'
import { interpolate } from './registry'

/** Texto final de un nodo o final: base + párrafos condicionales, con nombres resueltos. */
export function composeText(state: GameState, text: string, extras?: TextExtra[]): string {
  const parts = [text, ...(extras ?? []).filter((e) => evaluate(e.if, state)).map((e) => e.text)]
  return interpolate(parts.join('\n\n'), state)
}
