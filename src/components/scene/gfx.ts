// Primitivas de dibujo pixel-art sobre un canvas de baja resolución.
// Todos los colores pasan por `tint`, que aplica la paleta del acto y el estado anímico.

export const W = 160
export const H = 90

export type Tint = (hex: string) => string

export interface PaintParams {
  /** 0–100, sólo para el jefe final. */
  coherencia?: number
}

export class Gfx {
  readonly ctx: CanvasRenderingContext2D
  readonly tint: Tint
  /** Segundos desde que se montó la escena. */
  readonly t: number
  readonly params: PaintParams

  constructor(ctx: CanvasRenderingContext2D, tint: Tint, t: number, params: PaintParams) {
    this.ctx = ctx
    this.tint = tint
    this.t = t
    this.params = params
  }

  rect(x: number, y: number, w: number, h: number, color: string) {
    if (w <= 0 || h <= 0) return
    this.ctx.fillStyle = this.tint(color)
    this.ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
  }

  px(x: number, y: number, color: string) {
    this.rect(x, y, 1, 1, color)
  }

  alpha(a: number, draw: () => void) {
    const prev = this.ctx.globalAlpha
    this.ctx.globalAlpha = prev * a
    draw()
    this.ctx.globalAlpha = prev
  }

  /** Bandas horizontales con transición tramada entre colores. */
  bands(x: number, y: number, w: number, h: number, colors: string[]) {
    const seg = h / colors.length
    colors.forEach((c, i) => {
      const y0 = y + Math.round(i * seg)
      const y1 = y + Math.round((i + 1) * seg)
      this.rect(x, y0, w, y1 - y0, c)
      const next = colors[i + 1]
      if (next) this.dither(x, y1 - 1, w, 2, next, 2)
    })
  }

  /** Damero: pinta `color` en una de cada `step` celdas. */
  dither(x: number, y: number, w: number, h: number, color: string, step = 2) {
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) if ((i + j) % step === 0) this.px(x + i, y + j, color)
  }

  /** Cordillera: rellena desde una línea quebrada hasta `bottom`. */
  ridge(points: [number, number][], color: string, bottom = H) {
    for (let k = 0; k < points.length - 1; k++) {
      const [x0, y0] = points[k]
      const [x1, y1] = points[k + 1]
      for (let x = Math.round(x0); x < Math.round(x1); x++) {
        const y = y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
        this.rect(x, y, 1, bottom - y, color)
      }
    }
  }

  /** Nieve en las cumbres: sólo los píxeles de la cordillera sobre `line`. */
  snowcaps(points: [number, number][], line: number, color: string) {
    for (let k = 0; k < points.length - 1; k++) {
      const [x0, y0] = points[k]
      const [x1, y1] = points[k + 1]
      for (let x = Math.round(x0); x < Math.round(x1); x++) {
        const y = y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
        if (y < line) this.rect(x, y, 1, Math.min(line - y, 3 + ((x * 7) % 3)), color)
      }
    }
  }

  disc(cx: number, cy: number, r: number, color: string) {
    for (let y = -r; y <= r; y++) {
      const half = Math.round(Math.sqrt(r * r - y * y))
      this.rect(cx - half, cy + y, half * 2 + 1, 1, color)
    }
  }

  ring(cx: number, cy: number, r: number, color: string, thick = 1) {
    for (let a = 0; a < Math.PI * 2; a += 0.5 / r) {
      for (let k = 0; k < thick; k++) {
        this.px(cx + Math.cos(a) * (r - k), cy + Math.sin(a) * (r - k), color)
      }
    }
  }

  line(x0: number, y0: number, x1: number, y1: number, color: string) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1)
    for (let i = 0; i <= steps; i++) this.px(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, color)
  }

  /** Figura humana mínima: cabeza 4×4, torso, piernas. (x, y) = esquina sup. izq. de la cabeza. */
  person(
    x: number,
    y: number,
    o: { body: string; hair: string; skin?: string; legs?: string; child?: boolean; sitting?: boolean; armUp?: boolean },
  ) {
    const skin = o.skin ?? '#d9a77f'
    const legs = o.legs ?? '#2b2f3a'
    const s = o.child ? 3 : 4
    const torso = o.child ? 6 : 9
    this.rect(x, y, s, s, skin)
    this.rect(x, y, s, 1, o.hair)
    this.rect(x - 1, y, 1, 2, o.hair)
    const bx = x - (o.child ? 1 : 1)
    const bw = s + 2
    this.rect(bx, y + s, bw, torso, o.body)
    if (o.armUp) this.rect(bx + bw, y - 4, 1, s + 5, o.body)
    if (o.sitting) {
      this.rect(bx, y + s + torso, bw + 3, 2, legs)
      this.rect(bx + bw + 1, y + s + torso + 2, 2, 4, legs)
    } else {
      this.rect(bx, y + s + torso, 2, o.child ? 5 : 8, legs)
      this.rect(bx + bw - 2, y + s + torso, 2, o.child ? 5 : 8, legs)
    }
  }
}

/** Pseudoaleatorio determinista para decorados (no depende del estado de juego). */
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
