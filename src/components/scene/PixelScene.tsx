import { useEffect, useRef } from 'react'
import type { SceneArt } from '../../types/content'
import { sceneShift, shiftColor, type Mood } from '../../theme/mood'
import { Gfx, H, W, type PaintParams } from './gfx'
import { PAINTERS } from './painters'

const FRAME_MS = 83 // ~12 fps: suficiente para pixel-art y barato en batería
const GLITCH_MS = 480

interface Props {
  art: SceneArt
  act: number
  mood: Mood
  params?: PaintParams
  /** Cada vez que cambia, la imagen hace un glitch breve. */
  glitchKey?: string
  className?: string
}

export function PixelScene({ art, act, mood, params, glitchKey, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const paramsRef = useRef<PaintParams>(params ?? {})
  const glitchAt = useRef(0)

  useEffect(() => {
    paramsRef.current = params ?? {}
  }, [params])

  useEffect(() => {
    if (glitchKey) glitchAt.current = performance.now()
  }, [glitchKey])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const shift = sceneShift(act, mood)
    const cache = new Map<string, string>()
    const tint = (hex: string) => {
      let c = cache.get(hex)
      if (!c) {
        c = shiftColor(hex, shift)
        cache.set(hex, c)
      }
      return c
    }
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    let raf = 0
    let last = 0

    const draw = (now: number) => {
      const t = reduceMotion ? 0 : (now - start) / 1000
      ctx.clearRect(0, 0, W, H)
      PAINTERS[art](new Gfx(ctx, tint, t, paramsRef.current))
      const since = now - glitchAt.current
      if (!reduceMotion && since < GLITCH_MS) {
        // Desplaza franjas horizontales: el «cable movido» de un monitor viejo.
        for (let i = 0; i < 6; i++) {
          const y = Math.floor(Math.random() * H)
          const h = 2 + Math.floor(Math.random() * 6)
          const dx = Math.round((Math.random() - 0.5) * 14)
          ctx.drawImage(canvas, 0, y, W, h, dx, y, W, h)
        }
      }
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - last < FRAME_MS) return
      last = now
      draw(now)
    }

    if (reduceMotion) draw(start)
    else raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [art, act, mood])

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      role="img"
      aria-label={`Escena: ${art}`}
      className={`pixelated block w-full h-auto ${className ?? ''}`}
    />
  )
}
