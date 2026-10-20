// Caja de diálogo: texto con máquina de escribir, ingeniería inversa del subtexto
// (botón «Inspeccionar código» o Lector de Defensas) y opciones.

import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { ITEMS } from '../data/items'
import { quickAnchors } from '../engine/anchors'
import {
  GUION_VISIBLE_DESDE,
  INSPECCION_MIN_PERMISOS,
  VISION_DEFENSAS_BONUS,
  getChoiceViews,
  hijaLeida,
  hijaRegistrando,
  isAutopilotLocked,
  linearTarget,
  readCode,
} from '../engine/engine'
import { choiceInsight } from '../engine/insight'
import { currentNode, currentScene, interpolate } from '../engine/registry'
import { composeText } from '../engine/text'
import { useGame } from '../store/gameStore'
import type { Choice, SourceTagKind } from '../types/content'
import type { GameState } from '../types/game'
import { ChoiceButton } from './ChoiceButton'
import { RichText } from './RichText'
import { useTypewriter } from './useTypewriter'

const TAG_COLOR: Record<SourceTagKind, string> = {
  DEFENSA: 'text-admin border-admin/50',
  MIEDO: 'text-danger border-danger/50',
  MOTIVACIÓN: 'text-confianza border-confianza/50',
  HISTORIA: 'text-calidez border-calidez/50',
  PATRÓN: 'text-fantasmas border-fantasmas/50',
}

const AUTOPILOT_SECONDS = 6

function readInsight(game: GameState, choice: Choice) {
  const insight = choiceInsight(game, choice)
  return { ...insight, subtext: interpolate(insight.subtext, game) }
}

function InspectControl({ game }: { game: GameState }) {
  const inspect = useGame((s) => s.inspect)
  const toggleLector = useGame((s) => s.toggleLector)
  const reading = readCode(game)
  const lectorDisponible = Boolean(game.flags.visionDefensas)

  const lectorToggle = lectorDisponible && (
    <button
      type="button"
      onClick={toggleLector}
      aria-pressed={game.lectorActivo}
      title={
        game.lectorActivo
          ? 'Apagar el Lector: dejas de ver el subtexto y de cobrarte en lado oscuro.'
          : 'Encender el Lector: ves el subtexto de todos (+15 de lectura), pero cada decisión frente a tu hija, tu pareja o tu familia suma lado oscuro y enfría el vínculo.'
      }
      className={`term border px-2 text-[16px] leading-6 ${
        game.lectorActivo ? 'border-admin bg-admin/15 text-admin' : 'border-line text-dim hover:border-admin hover:text-admin'
      }`}
    >
      {game.lectorActivo ? '◉ Lector encendido' : '○ Lector apagado'}
    </button>
  )

  let manual = null
  if (reading.available && !game.lectorActivo) {
    manual = reading.revealed ? (
      <span className="term px-2 text-[16px] leading-6 text-admin">⌕ código leído</span>
    ) : (
      <button
        type="button"
        onClick={inspect}
        disabled={Boolean(reading.locked)}
        title={reading.locked ?? 'Ingeniería inversa: revela el miedo o la defensa real de quien habla y lo que protege cada respuesta. Tecla I.'}
        className={`term border px-2 text-[16px] leading-6 ${
          reading.locked ? 'cursor-not-allowed border-line/60 text-dim/60' : 'border-admin/70 text-admin hover:bg-admin hover:text-accent-ink'
        }`}
      >
        ⌕ Inspeccionar código{reading.locked ? ` · ${reading.locked.toLowerCase()}` : reading.cost ? ` · energía −${reading.cost}` : ' · filtrado'}
      </button>
    )
  }

  if (!lectorToggle && !manual) return null
  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      {manual}
      {lectorToggle}
    </div>
  )
}

export function DialogBox({ game }: { game: GameState }) {
  const settings = useGame((s) => s.settings)
  const choose = useGame((s) => s.choose)
  const advance = useGame((s) => s.advance)
  const inspect = useGame((s) => s.inspect)
  const consumir = useGame((s) => s.consumeItem)

  const scene = currentScene(game)
  const node = currentNode(game)
  const nodeKey = `${scene.id}/${game.position.nodeId}`
  const text = useMemo(() => composeText(game, node.text, node.extras), [game, node])
  const { shown, done, skip } = useTypewriter(text, settings.velocidad, nodeKey)

  const views = useMemo(() => getChoiceViews(game), [game])
  const reading = readCode(game)
  const anchors = quickAnchors(game)
  const registrando = hijaRegistrando(game)
  const leida = hijaLeida(game)
  const autopilot = isAutopilotLocked(game) && views.length > 0
  const forced = autopilot ? views.find((v) => !v.locked) : undefined
  const linear = !views.length && linearTarget(game, node)
  const hasFrecuencia = Object.keys(game.inventory).some((id) => id.startsWith('freq_'))
  const bonus = game.lectorActivo ? VISION_DEFENSAS_BONUS : 0

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

  // Teclado: 1–9 elige, Enter/Espacio completa o avanza, I inspecciona.
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
    if ((e.key === 'i' || e.key === 'I') && !reading.revealed && !reading.locked) {
      inspect()
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

  return (
    <div className="space-y-4">
      <article className="panel relative space-y-4 p-4" onClick={() => !done && skip()} aria-live="polite">
        <div className="flex flex-wrap items-start justify-between gap-2">
          {node.speaker ? <p className="label text-accent">{interpolate(node.speaker, game)}</p> : <span />}
          <div onClick={(e) => e.stopPropagation()}>
            <InspectControl game={game} />
          </div>
        </div>
        <RichText text={shown} caret={!done} />
        {!done && <p className="term text-[16px] text-dim/70">clic o Enter para completar</p>}
      </article>

      {done && reading.revealed && (reading.visible.length > 0 || reading.hidden.length > 0) && (
        <div className="space-y-1.5" aria-label="Etiquetas de código fuente">
          {reading.visible.map((t) => (
            <p key={t.kind + t.text} className={`term toast-in border-l-2 bg-panel/60 px-2.5 py-1 text-[17px] leading-tight ${TAG_COLOR[t.kind]}`}>
              &lt;{t.kind}&gt; <span className="text-fg/85">{t.text}</span>
            </p>
          ))}
          {reading.hidden.map((t) => (
            <p key={t.kind + t.text} className="term px-2.5 text-[16px] text-dim/70">
              ▒▒▒ etiqueta cifrada · requiere permisos ≥ {Math.max(0, t.min - bonus)}
            </p>
          ))}
        </div>
      )}
      {done && !reading.revealed && (node.sourceTags?.length ?? 0) > 0 && (
        <p className="term text-[16px] text-dim/70">
          ▒ Hay subtexto bajo estas palabras.{' '}
          {game.stats.permisosAdmin < INSPECCION_MIN_PERMISOS
            ? `Con permisos ≥ ${INSPECCION_MIN_PERMISOS} podrías inspeccionarlo.`
            : 'Inspecciona el código para leerlo.'}
        </p>
      )}

      {registrando && <p className="pulse-soft term text-[18px] italic text-frialdad">◌ Ella está registrando este patrón de silencio.</p>}
      {leida && !registrando && (
        <p className="pulse-soft term text-[18px] italic text-fantasmas">◌ Ella nota que la estás mirando como a un caso.</p>
      )}

      {done && anchors.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" aria-label="Anclas sugeridas">
          <span className="label">Antes de decidir</span>
          {anchors.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => consumir(a.id)}
              className="term border border-singular/60 px-2 text-[16px] leading-6 text-singular hover:bg-singular/15"
            >
              Usar {ITEMS[a.id].name.replace(/^(Frecuencia|Decant): /, '')} · {a.reason}
            </button>
          ))}
        </div>
      )}

      {done && autopilot && forced && (
        <div className="border border-danger/70 bg-danger/10 px-3 py-2" role="alert">
          <p className="label text-danger">Automatismo 100% · piloto automático</p>
          <p className="term mt-1 text-[18px]">
            El sistema elegirá por ti en {left}…{' '}
            {hasFrecuencia
              ? 'Usa una Frecuencia de Aislamiento para recuperar el control.'
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
              insight={reading.revealed ? readInsight(game, v.choice) : undefined}
              onChoose={() => choose(v.choice.id)}
            />
          ))}
          {game.stats.permisosAdmin < GUION_VISIBLE_DESDE && !reading.revealed && (
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
  )
}
