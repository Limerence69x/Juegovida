import { useCallback, useEffect, useState } from 'react'
import type { TextSpeed } from '../store/gameStore'

const MS_PER_CHAR: Record<TextSpeed, number> = { lenta: 26, normal: 12, instantanea: 0 }

/** Revela `text` carácter a carácter. `key` reinicia el efecto (p. ej. al cambiar de nodo). */
export function useTypewriter(text: string, speed: TextSpeed, key: string) {
  const [state, setState] = useState({ key, count: 0 })
  const ms = MS_PER_CHAR[speed]
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const instant = ms === 0 || reduce
  // Reiniciar al cambiar de nodo, sin esperar a un efecto.
  const count = state.key === key ? state.count : 0
  if (state.key !== key) setState({ key, count: 0 })

  useEffect(() => {
    if (instant) return
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const n = Math.min(text.length, Math.floor((now - start) / ms))
      setState((s) => (s.key === key && s.count < n ? { key, count: n } : s))
      if (n < text.length) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [key, text, ms, instant])

  const shownCount = instant ? text.length : count
  const skip = useCallback(() => setState({ key, count: text.length }), [key, text.length])
  return { shown: text.slice(0, shownCount), done: shownCount >= text.length, skip }
}
