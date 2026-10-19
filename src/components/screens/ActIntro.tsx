import { useEffect } from 'react'
import { getAct } from '../../engine/registry'
import { useGame } from '../../store/gameStore'
import type { GameState } from '../../types/game'

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V']

/** Qué cambia en las reglas al empezar cada acto. */
const NOTAS: Record<number, string> = {
  1: 'Elige con calma. Toda decisión mueve al menos dos variables en tensión: no hay opciones gratis.',
  2: 'Batería parcialmente recargada. Alta presión de tiempo: un reloj propio ayuda.',
  3: 'Actualización instalada: Lector de Defensas v3.0. Las etiquetas de código fuente se leen con +15 de permisos. Cuidado con convertir a las personas en casos.',
  4: 'Sin señal: el ruido institucional y la ansiedad se limpian, el automatismo baja. Gestiona el ritmo; vacía la caché.',
  5: 'Manos en el volante. Lo que trajiste de los actos anteriores —recuerdos, anclas, vínculos— son tus argumentos.',
}

export function ActIntro({ game }: { game: GameState }) {
  const continueAct = useGame((s) => s.continueAct)
  const act = getAct(game.act)

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        continueAct()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [continueAct])

  return (
    <main className="mx-auto flex min-h-full max-w-[720px] flex-col justify-center gap-6 px-4 py-12">
      <p className="label text-accent">Acto {ROMAN[act.number]} de V</p>
      <h1 className="font-pixel text-[20px] leading-snug text-fg sm:text-[26px]">{act.title}</h1>
      <p className="term text-[24px] text-accent">{act.subtitle}</p>
      <blockquote className="border-l-2 border-line pl-4 text-[16px] italic leading-relaxed text-dim">{act.epigraph}</blockquote>
      <p className="term panel px-3 py-2 text-[18px] text-fg/90">{NOTAS[act.number]}</p>
      <button
        type="button"
        onClick={continueAct}
        autoFocus
        className="choice term self-start border border-accent bg-accent px-5 py-1.5 text-[22px] text-accent-ink hover:brightness-110"
      >
        Comenzar ▸
      </button>
    </main>
  )
}
