import { useEffect } from 'react'
import { RARITY_LABEL } from '../data/items'
import { useGame, type Toast } from '../store/gameStore'

const KIND_STYLE: Record<Toast['kind'], string> = {
  loot: 'border-singular/70',
  alerta: 'border-danger/70 text-danger',
  vinculo: 'border-calidez/70 text-calidez',
  sistema: 'border-admin/70 text-admin',
  legacy: 'border-frialdad/70 text-frialdad',
}
const RARITY_TEXT = { comun: 'text-comun', raro: 'text-raro', epico: 'text-epico', singular: 'text-singular' } as const

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useGame((s) => s.dismissToast)
  useEffect(() => {
    const id = setTimeout(() => dismiss(toast.id), 3800)
    return () => clearTimeout(id)
  }, [toast.id, dismiss])
  return (
    <li className={`toast-in panel border-l-4 px-3 py-2 shadow-lg ${KIND_STYLE[toast.kind]}`}>
      {toast.kind === 'loot' && toast.rarity ? (
        <p className="term text-[18px] leading-tight">
          <span className="text-dim">ANCLA · </span>
          <span className={RARITY_TEXT[toast.rarity]}>
            [{RARITY_LABEL[toast.rarity]}] {toast.text}
          </span>
        </p>
      ) : (
        <p className="term text-[18px] leading-tight">{toast.text}</p>
      )}
    </li>
  )
}

export function Toasts() {
  const toasts = useGame((s) => s.toasts)
  return (
    <ol className="pointer-events-none fixed right-[calc(12px+env(safe-area-inset-right,0px))] bottom-[calc(64px+env(safe-area-inset-bottom,0px))] z-40 flex w-[min(340px,calc(100vw-24px))] flex-col gap-2 lg:bottom-[calc(16px+env(safe-area-inset-bottom,0px))]" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </ol>
  )
}
