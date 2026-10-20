import { useEffect, useRef } from 'react'
import type { GameState, LogKind } from '../../types/game'
import { Inventory } from '../Inventory'

const LOG_COLOR: Record<LogKind, string> = {
  sistema: 'text-dim',
  consciencia: 'text-admin',
  vinculo: 'text-calidez',
  loot: 'text-singular',
  alerta: 'text-danger',
  legacy: 'text-frialdad',
}

export function AnclasPanel({ game }: { game: GameState }) {
  const logRef = useRef<HTMLOListElement>(null)
  const recent = game.log.slice(-80)

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [game.log.length])

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <Inventory game={game} />

      <section className="panel flex min-h-[220px] flex-1 flex-col p-3">
        <h3 className="label mb-2 text-fg">Registro de consciencia</h3>
        <ol ref={logRef} className="scroll-thin min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-live="polite">
          {recent.map((e) => (
            <li key={e.id} className={`term text-[16px] leading-tight ${LOG_COLOR[e.kind]}`}>
              <span className="text-dim/50">{String(e.id).padStart(3, '0')} </span>
              {e.text}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
