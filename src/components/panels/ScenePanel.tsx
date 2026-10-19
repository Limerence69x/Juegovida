import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import {
  GUION_VISIBLE_DESDE,
  VISION_DEFENSAS_BONUS,
  getChoiceViews,
  hijaRegistrando,
  isAutopilotLocked,
  linearTarget,
  visibleSourceTags,
} from '../../engine/engine'
import { currentNode, currentScene, getAct, interpolate } from '../../engine/registry'
import { composeText } from '../../engine/text'
import { useGame } from '../../store/gameStore'
import type { Mood } from '../../theme/mood'
import type { SourceTagKind } from '../../types/content'
import type { GameState } from '../../types/game'
import { ChoiceButton } from '../ChoiceButton'
import { RichText } from '../RichText'
import { PixelScene } from '../scene/PixelScene'
import { useTypewriter } from '../useTypewriter'

const TAG_COLOR: Record<SourceTagKind, string> = {
  DEFENSA: 'text-admin border-admin/50',
  MIEDO: 'text-danger border-danger/50',
  MOTIVACIÓN: 'text-confianza border-confianza/50',
  HISTORIA: 'text-calidez border-calidez/50',
  PATRÓN: 'text-fantasmas border-fantasmas/50',
}

const AUTOPILOT_SECONDS = 6
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V']

export function ScenePanel({ game, mood }: { game: GameState; mood: Mood }) {
  const settings = useGame((s) => s.settings)
  const choose = useGame((s) => s.choose)
  const advance = useGame((s) => s.advance)
  const hasFrecuencia = Object.keys(game.inventory).some((id) => id.startsWith('freq_'))

  const scene = currentScene(game)
  const node = currentNode(game)
  const nodeKey = `${scene.id}/${game.position.nodeId}`
  const text = useMemo(() => composeText(game, node.text, node.extras), [game, node])
  const { shown, done, skip } = useTypewriter(text, settings.velocidad, nodeKey)

  const views = useMemo(() => getChoiceViews(game), [game])
  const tags = visibleSourceTags(game, node)
  const registrando = hijaRegistrando(game)
  const autopilot = isAutopilotLocked(game) && views.length > 0
  const forced = autopilot ? views.find((v) => !v.locked) : undefined
  const linear = !views.length && linearTarget(game, node)
  const act = getAct(scene.act)
  const meterValue = scene.meter ? Math.max(0, Math.min(scene.meter.max, game.counters[scene.meter.counter] ?? 0)) : 0
  const glitchy = /glitch|pixela|SISTEMA|parpadea/i.test(node.text)

  // Cuenta regresiva del piloto automático (automatismo = 100).
  const [countdown, setCountdown] = useState<{ key: string; left: number } | null>(null)
  const left = countdown?.key === nodeKey ? countdown.left : AUTOPILOT_SECONDS
  useEffect(() => {
    if (!autopilot || !done || !forced) return
    if (left <= 0) {
      choose(forced.choice.id)
      return
    }
    const id = setTimeout(() => setCountdown({ key: nodeKey, left: left - 1 }), 1000)
    return () => clearTimeout(id)
  }, [autopilot, done, forced, left, nodeKey, choose])

  // Teclado: 1–9 elige, Enter/Espacio completa el texto o avanza.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
    if (e.key === 'Enter' || e.key === ' ') {
      if (target?.tagName === 'BUTTON') return
      e.preventDefault()
      if (!done) skip()
      else if (linear) advance()
      return
    }
    const n = Number(e.key)
    if (done && n >= 1 && n <= views.length) {
      const v = views[n - 1]
      if (!v.locked) choose(v.choice.id)
    }
  })
  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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

          <article className="panel space-y-4 p-4" onClick={() => !done && skip()} aria-live="polite">
            {node.speaker && <p className="label text-accent">{interpolate(node.speaker, game)}</p>}
            <RichText text={shown} caret={!done} />
            {!done && <p className="term text-[16px] text-dim/70">clic o Enter para completar</p>}
          </article>

          {done && (tags.visible.length > 0 || tags.hidden.length > 0) && (
            <div className="space-y-1.5" aria-label="Etiquetas de código fuente">
              {tags.visible.map((t) => (
                <p key={t.kind + t.text} className={`term toast-in border-l-2 bg-panel/60 px-2.5 py-1 text-[17px] leading-tight ${TAG_COLOR[t.kind]}`}>
                  &lt;{t.kind}&gt; <span className="text-fg/85">{t.text}</span>
                </p>
              ))}
              {tags.hidden.map((t) => (
                <p key={t.kind + t.text} className="term px-2.5 text-[16px] text-dim/70">
                  ▒▒▒ etiqueta cifrada · requiere permisos ≥ {Math.max(0, t.min - (game.flags.visionDefensas ? VISION_DEFENSAS_BONUS : 0))}
                </p>
              ))}
            </div>
          )}

          {registrando && (
            <p className="pulse-soft term text-[18px] italic text-frialdad">◌ Ella está registrando este patrón de silencio.</p>
          )}

          {done && autopilot && forced && (
            <div className="border border-danger/70 bg-danger/10 px-3 py-2" role="alert">
              <p className="label text-danger">Automatismo 100% · piloto automático</p>
              <p className="term mt-1 text-[18px]">
                El sistema elegirá por ti en {left}…{' '}
                {hasFrecuencia
                  ? 'Usa una Frecuencia de Aislamiento (panel Anclas) para recuperar el control.'
                  : 'No tienes Frecuencias de Aislamiento para cortar el ruido.'}
              </p>
            </div>
          )}

          {done && views.length > 0 && (
            <div className="space-y-2" role="group" aria-label="Opciones">
              {views.map((v, i) => (
                <ChoiceButton
                  key={v.choice.id}
                  view={v}
                  index={i}
                  text={interpolate(v.choice.text, game)}
                  lockReason={v.lockReason && interpolate(v.lockReason, game)}
                  onChoose={() => choose(v.choice.id)}
                />
              ))}
              {game.stats.permisosAdmin < GUION_VISIBLE_DESDE && (
                <p className="term pt-1 text-[16px] text-dim/70">
                  Con más permisos de administrador podrías reconocer cuál de estas respuestas es un guion precargado.
                </p>
              )}
            </div>
          )}

          {done && linear && (
            <button
              type="button"
              onClick={advance}
              className="choice term w-full border border-accent/70 px-3 py-2 text-left text-[20px] text-accent hover:bg-accent hover:text-accent-ink"
            >
              ▸ continuar
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
