import { useEffect, useRef } from 'react'
import { currentNode, currentScene, getAct } from '../../engine/registry'
import type { Mood } from '../../theme/mood'
import type { GameState } from '../../types/game'
import { DialogBox } from '../DialogBox'
import { PixelScene } from '../scene/PixelScene'

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V']

export function ScenePanel({ game, mood }: { game: GameState; mood: Mood }) {
  const scene = currentScene(game)
  const node = currentNode(game)
  const nodeKey = `${scene.id}/${game.position.nodeId}`
  const act = getAct(scene.act)
  const meterValue = scene.meter ? Math.max(0, Math.min(scene.meter.max, game.counters[scene.meter.counter] ?? 0)) : 0
  const glitchy = /glitch|pixela|SISTEMA|parpadea/i.test(node.text)

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [nodeKey])

  return (
    <section className="flex h-full min-h-0 flex-col" aria-label="Escena">
      <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <p className="label text-accent">
            Acto {ROMAN[act.number]} · {act.title}
          </p>
          <h2 className="mt-1 truncate text-[17px] font-semibold">{scene.title}</h2>
        </div>
        <p className="term text-[18px] text-dim">
          {scene.location} · {scene.day} · {scene.time}
        </p>
      </header>

      <div ref={scrollRef} className="scroll-thin min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[760px] space-y-4 px-4 py-4">
          <div className="panel overflow-hidden">
            <PixelScene
              art={scene.art}
              act={scene.act}
              mood={mood}
              params={{ coherencia: game.counters.coherencia }}
              glitchKey={glitchy ? nodeKey : scene.id}
            />
          </div>

          {scene.meter && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="label text-danger">{scene.meter.label}</span>
                <span className="term text-[19px] text-danger">{meterValue}</span>
              </div>
              <div className="h-2 bg-line/60">
                <div className="h-full bg-danger transition-all duration-700" style={{ width: `${(meterValue / scene.meter.max) * 100}%` }} />
              </div>
            </div>
          )}

          <DialogBox game={game} />
        </div>
      </div>
    </section>
  )
}
