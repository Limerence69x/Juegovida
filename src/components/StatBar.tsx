interface Props {
  label: string
  value: number
  /** Clase de color Tailwind para la barra (p. ej. `bg-energia`). */
  color: string
  hint?: string
  /** Umbral a marcar sobre la barra (p. ej. 70 para el modo frío). */
  threshold?: number
  /** Último delta aplicado: se muestra un instante. */
  delta?: number
  deltaKey?: number
  compact?: boolean
}

const SEGMENTS = 20

export function StatBar({ label, value, color, hint, threshold, delta, deltaKey, compact }: Props) {
  // El delta se re-monta con cada decisión (key) y se desvanece solo por CSS.
  const flash = delta ? { key: deltaKey ?? 0, delta } : null
  const filled = Math.round((value / 100) * SEGMENTS)
  return (
    <div title={hint} className={compact ? 'space-y-0.5' : 'space-y-1'}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="label">{label}</span>
        <span className="term flex items-baseline gap-1.5 text-[19px] text-fg">
          {flash && (
            <span key={flash.key} className={`delta-fade text-[16px] ${flash.delta > 0 ? 'text-accent' : 'text-danger'}`}>
              {flash.delta > 0 ? '+' : '−'}
              {Math.abs(flash.delta)}
            </span>
          )}
          {value}
        </span>
      </div>
      <div
        key={flash?.key}
        className={`relative flex gap-[2px] ${flash ? 'flash' : ''}`}
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span key={i} className={`h-2 flex-1 ${i < filled ? color : 'bg-line/60'}`} />
        ))}
        {threshold !== undefined && (
          <span className="absolute -top-1 h-4 w-px bg-danger/80" style={{ left: `${threshold}%` }} aria-hidden />
        )}
      </div>
    </div>
  )
}
