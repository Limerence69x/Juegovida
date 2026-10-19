// Feedback visual dinámico (§6): el estado interno del protagonista tiñe toda la interfaz.

import type { GameState } from '../types/game'

export type Mood = 'frio' | 'calido' | 'neutro'

export const UMBRAL_FRIO = 70
export const UMBRAL_CALIDO = 60

export function computeMood(game: GameState | null): Mood {
  if (!game) return 'neutro'
  const { automatismo, ladoOscuro, permisosAdmin } = game.stats
  if (automatismo > UMBRAL_FRIO || ladoOscuro > UMBRAL_FRIO) return 'frio'
  const vinculo = Math.max(game.hija.calidezAprendida, game.pareja.confianzaAcumulada)
  if (permisosAdmin >= UMBRAL_CALIDO && vinculo >= UMBRAL_CALIDO) return 'calido'
  return 'neutro'
}

// ─── Transformaciones de color (para el pixel-art del canvas) ───────────────

type HSL = [h: number, s: number, l: number]

function hexToHsl(hex: string): HSL {
  const n = parseInt(hex.slice(1), 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h * 60, s, l]
}

function hslToHex([h, s, l]: HSL): string {
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const to = (x: number) =>
    Math.round(Math.max(0, Math.min(1, x)) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`
}

export interface ColorShift {
  /** Multiplicador de saturación. */
  sat: number
  /** 0–1: cuánto se tira el tono hacia el ámbar. */
  warm: number
  /** 0–1: cuánto se tira el tono hacia el azul acero. */
  cold: number
  /** Ajuste de luminosidad (−0.2 a 0.2). */
  light: number
}

const lerpHue = (from: number, to: number, t: number) => {
  const d = ((to - from + 540) % 360) - 180
  return (from + d * t + 360) % 360
}

/** Mezcla en RGB: calienta sin hacer girar los azules hacia el violeta. */
function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (shift: number) => Math.round(((pa >> shift) & 255) * (1 - t) + ((pb >> shift) & 255) * t)
  return `#${[16, 8, 0].map((sh) => ch(sh).toString(16).padStart(2, '0')).join('')}`
}

const AMBAR = '#e8a65d'

export function shiftColor(hex: string, shift: ColorShift): string {
  let [h, s, l] = hexToHsl(hex)
  s = Math.min(1, s * shift.sat)
  if (shift.cold) {
    h = lerpHue(h, 210, shift.cold)
    s -= (s - Math.min(s, 0.18)) * shift.cold
  }
  l = Math.max(0, Math.min(1, l + shift.light))
  const out = hslToHex([h, s, l])
  return shift.warm ? mixHex(out, AMBAR, shift.warm * 0.3) : out
}

/** Paleta del acto (§5): el acto 1 es desaturado, el 4 recupera el color de la montaña. */
const ACT_SHIFT: Record<number, ColorShift> = {
  0: { sat: 0.6, warm: 0, cold: 0, light: 0 },
  1: { sat: 0.35, warm: 0, cold: 0, light: -0.02 },
  2: { sat: 0.6, warm: 0.15, cold: 0, light: 0 },
  3: { sat: 0.7, warm: 0, cold: 0.1, light: 0 },
  4: { sat: 1, warm: 0, cold: 0, light: 0.02 },
  5: { sat: 0.9, warm: 0.05, cold: 0, light: 0 },
}

export function sceneShift(act: number, mood: Mood): ColorShift {
  const base = ACT_SHIFT[act] ?? ACT_SHIFT[0]
  if (mood === 'frio') return { sat: 0.1, warm: 0, cold: 1, light: -0.03 }
  if (mood === 'calido') return { sat: Math.max(base.sat, 0.85), warm: 0.6, cold: 0, light: 0.02 }
  return base
}
