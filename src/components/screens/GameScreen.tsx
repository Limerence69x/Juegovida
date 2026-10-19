import { useState } from 'react'
import { getAct } from '../../engine/registry'
import { useGame, type TextSpeed } from '../../store/gameStore'
import type { Mood } from '../../theme/mood'
import type { GameState } from '../../types/game'
import { AnclasPanel } from '../panels/AnclasPanel'
import { ScenePanel } from '../panels/ScenePanel'
import { SystemPanel } from '../panels/SystemPanel'

type Tab = 'sistema' | 'escena' | 'anclas'

const TABS: [Tab, string][] = [
  ['sistema', 'Sistema'],
  ['escena', 'Escena'],
  ['anclas', 'Anclas'],
]

const SPEEDS: [TextSpeed, string][] = [
  ['lenta', 'Lenta'],
  ['normal', 'Normal'],
  ['instantanea', 'Instantánea'],
]

function SettingsMenu({ onClose }: { onClose: () => void }) {
  const settings = useGame((s) => s.settings)
  const setSettings = useGame((s) => s.setSettings)
  const reset = useGame((s) => s.reset)
  const [confirm, setConfirm] = useState(false)
  return (
    <div className="panel absolute top-full right-0 z-30 mt-1 w-64 space-y-3 p-3 shadow-xl">
      <div className="space-y-1">
        <p className="label">Velocidad del texto</p>
        <div className="flex gap-1">
          {SPEEDS.map(([v, l]) => (
            <button
              key={v}
              type="button"
              onClick={() => setSettings({ velocidad: v })}
              className={`term flex-1 border px-1 text-[16px] ${settings.velocidad === v ? 'border-accent text-accent' : 'border-line text-dim hover:text-fg'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <label className="term flex items-center justify-between text-[18px]">
        Filtro CRT
        <input type="checkbox" checked={settings.crt} onChange={(e) => setSettings({ crt: e.target.checked })} className="accent-[var(--accent)]" />
      </label>
      <button
        type="button"
        onClick={() => {
          useGame.setState({ atTitle: true })
          onClose()
        }}
        className="term w-full border border-line px-2 text-left text-[18px] text-dim hover:border-accent hover:text-fg"
      >
        Volver al título (se guarda)
      </button>
      <button
        type="button"
        onClick={() => (confirm ? reset() : setConfirm(true))}
        className="term w-full border border-danger/60 px-2 text-left text-[18px] text-danger hover:bg-danger/10"
      >
        {confirm ? '¿Seguro? Se borra la partida' : 'Borrar partida'}
      </button>
    </div>
  )
}

export function GameScreen({ game, mood, onHelp }: { game: GameState; mood: Mood; onHelp: () => void }) {
  const [tab, setTab] = useState<Tab>('escena')
  const [menu, setMenu] = useState(false)
  const act = getAct(game.act)
  const show = (t: Tab) => (tab === t ? 'flex' : 'hidden') + ' lg:flex'

  return (
    <div className="flex h-full flex-col">
      <header className="relative flex items-center justify-between gap-3 border-b border-line bg-panel px-4 py-2">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="font-pixel text-[11px] whitespace-nowrap text-accent">Código Propio</span>
          <span className="term hidden truncate text-[18px] text-dim sm:inline">
            Acto {act.number} · {act.title}
            {mood === 'frio' && <span className="ml-2 text-coraza">· modo frío</span>}
            {mood === 'calido' && <span className="ml-2 text-calidez">· conexión cálida</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onHelp} className="term border border-line px-2 text-[18px] text-dim hover:border-accent hover:text-fg">
            ? manual
          </button>
          <button
            type="button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            className="term border border-line px-2 text-[18px] text-dim hover:border-accent hover:text-fg"
          >
            ⚙ ajustes
          </button>
        </div>
        {menu && <SettingsMenu onClose={() => setMenu(false)} />}
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 pb-12 lg:grid-cols-[300px_minmax(0,1fr)_320px] lg:pb-0">
        <aside className={`${show('sistema')} scroll-thin min-h-0 flex-col overflow-y-auto border-line lg:border-r`} aria-label="Estado del sistema">
          <SystemPanel game={game} />
        </aside>
        <div className={`${show('escena')} min-h-0 flex-col`}>
          <ScenePanel game={game} mood={mood} />
        </div>
        <aside className={`${show('anclas')} min-h-0 flex-col overflow-y-auto border-line lg:border-l`} aria-label="Anclas y registro">
          <AnclasPanel game={game} />
        </aside>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-line bg-panel pb-[env(safe-area-inset-bottom,0px)] lg:hidden" aria-label="Paneles">
        {TABS.map(([t, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t}
            className={`term py-2.5 text-[19px] ${tab === t ? 'bg-panel-2 text-accent' : 'text-dim'}`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
