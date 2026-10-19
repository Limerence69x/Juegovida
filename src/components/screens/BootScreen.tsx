import { useEffect, useState, type FormEvent } from 'react'
import { useGame } from '../../store/gameStore'
import { PixelScene } from '../scene/PixelScene'

const BOOT_LINES = [
  'CÓDIGO PROPIO · BIOS v1.0',
  'Iniciando sistema heredado…',
  'Cargando normas sociales ................ OK',
  'Cargando exigencias institucionales ...... OK',
  'Cargando patrones familiares (legacy) .... OK',
  'Verificando permisos de administrador .... DENEGADO',
  'Modo de operación: PILOTO AUTOMÁTICO',
]

export function BootScreen({ onHelp }: { onHelp: () => void }) {
  const game = useGame((s) => s.game)
  const newGame = useGame((s) => s.newGame)
  const resume = useGame((s) => s.resume)
  const [lines, setLines] = useState(0)
  const [hija, setHija] = useState('Emilia')
  const [pareja, setPareja] = useState('Dani')
  const [confirmNew, setConfirmNew] = useState(false)
  const saved = game && game.phase !== 'boot'

  useEffect(() => {
    if (lines >= BOOT_LINES.length) return
    const id = setTimeout(() => setLines((n) => n + 1), lines === 0 ? 250 : 320)
    return () => clearTimeout(id)
  }, [lines])

  const start = (e: FormEvent) => {
    e.preventDefault()
    if (saved && !confirmNew) {
      setConfirmNew(true)
      return
    }
    newGame({ hija: hija.trim() || 'Emilia', pareja: pareja.trim() || 'Dani' })
  }

  return (
    <main className="mx-auto flex min-h-full max-w-[880px] flex-col justify-center gap-6 px-4 py-10">
      <div className="space-y-3">
        <h1 className="font-pixel text-[22px] leading-tight text-accent sm:text-[30px]">Código Propio</h1>
        <p className="term text-[22px] text-dim">Un RPG psicológico en cinco actos. De NPC a administrador de tu propio sistema.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
        <pre className="term panel min-h-[208px] whitespace-pre-wrap p-4 text-[18px] leading-snug text-accent" aria-live="polite">
          {BOOT_LINES.slice(0, lines).map((l, i) => (
            <span key={l} className={l.includes('DENEGADO') ? 'text-danger' : i === 0 ? 'text-fg' : ''}>
              {'> '}
              {l}
              {'\n'}
            </span>
          ))}
          {lines < BOOT_LINES.length && <span className="caret" />}
        </pre>
        <div className="panel overflow-hidden">
          <PixelScene art="dormitorio" act={1} mood="neutro" />
        </div>
      </div>

      <form onSubmit={start} className="panel grid gap-4 p-4 sm:grid-cols-2">
        <p className="text-[14px] leading-relaxed text-dim sm:col-span-2">
          Eres especialista en Desarrollo Organizacional en salud pública. Te preparas para un magíster en psicología, subes cerros, estás
          sacando la licencia de conducir. Tienes una hija de diez años y una relación que, después de mucho intentarlo, acaba de cumplir
          una semana de estabilidad real. Los nombres se guardan sólo en este navegador.
        </p>
        <label className="space-y-1">
          <span className="label">Nombre de tu hija</span>
          <input
            value={hija}
            onChange={(e) => setHija(e.target.value)}
            maxLength={18}
            className="term w-full border border-line bg-panel-2 px-2 py-1 text-[22px] text-fg outline-none focus:border-accent"
          />
        </label>
        <label className="space-y-1">
          <span className="label">Nombre de tu pareja</span>
          <input
            value={pareja}
            onChange={(e) => setPareja(e.target.value)}
            maxLength={18}
            className="term w-full border border-line bg-panel-2 px-2 py-1 text-[22px] text-fg outline-none focus:border-accent"
          />
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          {saved && (
            <button
              type="button"
              onClick={resume}
              className="choice term border border-accent bg-accent px-4 py-1.5 text-[22px] text-accent-ink hover:brightness-110"
            >
              Continuar sesión
            </button>
          )}
          <button
            type="submit"
            className={`choice term border px-4 py-1.5 text-[22px] ${
              saved ? 'border-line text-fg hover:border-accent' : 'border-accent bg-accent text-accent-ink hover:brightness-110'
            }`}
          >
            {confirmNew ? '¿Sobrescribir la partida guardada? Sí' : 'Iniciar sesión nueva'}
          </button>
          <button type="button" onClick={onHelp} className="choice term border border-line px-4 py-1.5 text-[22px] text-dim hover:border-accent hover:text-fg">
            Cómo se juega
          </button>
        </div>
      </form>
    </main>
  )
}
