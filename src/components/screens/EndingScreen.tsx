import { useState } from 'react'
import { ENDINGS } from '../../data/endings'
import { composeText } from '../../engine/text'
import { useGame } from '../../store/gameStore'
import type { Mood } from '../../theme/mood'
import type { GameState } from '../../types/game'
import { RichText } from '../RichText'
import { PixelScene } from '../scene/PixelScene'

export function EndingScreen({ game, mood }: { game: GameState; mood: Mood }) {
  const reset = useGame((s) => s.reset)
  const [confirm, setConfirm] = useState(false)
  const ending = ENDINGS[game.endingId ?? 'modoSeguro']
  const art = ending.id === 'administrador' ? 'portezuelo' : ending.id === 'coraza' ? 'legacy' : ending.id === 'npc' ? 'oficina' : 'auto'
  const { stats, hija, pareja } = game

  const resumen: [string, string | number, string][] = [
    ['Automatismo', stats.automatismo, 'text-coraza'],
    ['Permisos admin', stats.permisosAdmin, 'text-admin'],
    ['Energía mental', stats.energiaMental, 'text-energia'],
    ['Lado oscuro', stats.ladoOscuro, 'text-fantasmas'],
    ['Calidez aprendida', hija.calidezAprendida, 'text-calidez'],
    ['Frialdad heredada', hija.frialdadHeredada, 'text-frialdad'],
    ['Confianza', pareja.confianzaAcumulada, 'text-confianza'],
    ['Fantasmas', pareja.fantasmasInestabilidad, 'text-fantasmas'],
    ['Día de estabilidad', game.flags.pausaPareja ? `${pareja.diaEstabilidad} (tras pausa)` : pareja.diaEstabilidad, 'text-confianza'],
    ['Decisiones', game.decisions, 'text-fg'],
  ]

  return (
    <main className="mx-auto max-w-[820px] space-y-6 px-4 py-10">
      <div className="panel overflow-hidden">
        <PixelScene art={art} act={5} mood={mood} params={{ coherencia: game.counters.coherencia }} />
      </div>
      <header className="space-y-2">
        <p className="label text-accent">Final · sesión cerrada</p>
        <h1 className="font-pixel text-[18px] leading-snug sm:text-[24px]">{ending.title}</h1>
        <p className="term text-[22px] text-accent">{ending.subtitle}</p>
      </header>
      <article className="panel p-4">
        <RichText text={composeText(game, ending.text, ending.extras)} />
      </article>
      <section className="panel p-4">
        <h2 className="label mb-3 text-fg">Volcado de memoria</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
          {resumen.map(([k, v, c]) => (
            <div key={k} className="flex items-baseline justify-between gap-2 border-b border-line/50 py-1">
              <dt className="text-[12.5px] text-dim">{k}</dt>
              <dd className={`term text-[20px] ${c}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <button
        type="button"
        onClick={() => (confirm ? reset() : setConfirm(true))}
        className="choice term border border-accent px-5 py-1.5 text-[22px] text-accent hover:bg-accent hover:text-accent-ink"
      >
        {confirm ? '¿Borrar esta sesión y reiniciar? Sí' : 'Reiniciar sistema'}
      </button>
    </main>
  )
}
