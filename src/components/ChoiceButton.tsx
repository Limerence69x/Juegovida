import type { BadgeId, ChoiceView } from '../engine/engine'
import type { ChoiceInsight } from '../engine/insight'
import { VAR_LABEL } from '../engine/vars'

const BADGE_STYLE: Record<BadgeId, string> = {
  energia: 'border-energia/60 text-energia',
  filtrada: 'border-coraza/60 text-coraza',
  admin: 'border-admin/60 text-admin',
  adminCosto: 'border-admin/60 text-admin',
  coraza: 'border-coraza/70 bg-coraza/10 text-coraza',
  oculta: 'border-accent/60 text-accent',
  guion: 'border-dim/60 text-dim',
  salto: 'border-calidez/60 text-calidez',
  regresion: 'border-frialdad/60 text-frialdad',
  presencia: 'border-calidez/60 text-calidez',
  analisis: 'border-fantasmas/60 text-fantasmas',
  sentidos: 'border-epico/60 text-epico',
  ancla: 'border-singular/60 text-singular',
}

interface Props {
  view: ChoiceView
  index: number
  text: string
  lockReason?: string
  /** Subtexto revelado por la ingeniería inversa. */
  insight?: ChoiceInsight
  onChoose: () => void
}

export function ChoiceButton({ view, index, text, lockReason, insight, onChoose }: Props) {
  const { locked, badges } = view
  return (
    <button
      type="button"
      disabled={locked}
      onClick={onChoose}
      className={`choice group w-full border px-3 py-2.5 text-left transition-colors ${
        locked
          ? 'cursor-not-allowed border-line/60 bg-panel/40 text-dim/70'
          : 'border-line bg-panel-2 hover:border-accent hover:bg-panel focus-visible:border-accent focus-visible:outline-none'
      }`}
    >
      <div className="flex gap-3">
        <span className={`term shrink-0 text-[20px] leading-6 ${locked ? 'text-dim/50' : 'text-accent'}`}>{index + 1}</span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className={`text-[14.5px] leading-snug ${locked ? 'line-through decoration-dim/40' : ''}`}>{text}</p>
          {(badges.length > 0 || lockReason) && (
            <div className="flex flex-wrap gap-1.5">
              {badges.map((b) => (
                <span key={b.id + b.label} className={`term border px-1.5 text-[15px] leading-5 ${BADGE_STYLE[b.id]}`}>
                  {b.label}
                </span>
              ))}
              {lockReason && <span className="term px-1 text-[15px] leading-5 text-danger/90">⊘ {lockReason}</span>}
            </div>
          )}
          {insight && (
            <div className="toast-in space-y-1 border-l-2 border-admin/50 pl-2">
              <p className="term text-[16px] leading-tight text-admin/90">⌕ {insight.subtext}</p>
              {insight.diff && insight.diff.length > 0 && (
                <p className="term flex flex-wrap gap-x-2.5 text-[15px] leading-tight text-dim" aria-label="Variables que mueve">
                  {insight.diff.map((d) => (
                    <span key={d.key}>
                      {d.dir > 0 ? '▲' : '▼'} {VAR_LABEL[d.key]}
                    </span>
                  ))}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
