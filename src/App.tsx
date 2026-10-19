import { useEffect, useState } from 'react'
import { HelpModal } from './components/HelpModal'
import { Toasts } from './components/Toasts'
import { ActIntro } from './components/screens/ActIntro'
import { BootScreen } from './components/screens/BootScreen'
import { EndingScreen } from './components/screens/EndingScreen'
import { GameScreen } from './components/screens/GameScreen'
import { useGame } from './store/gameStore'
import { computeMood } from './theme/mood'

export default function App() {
  const game = useGame((s) => s.game)
  const atTitle = useGame((s) => s.atTitle)
  const crt = useGame((s) => s.settings.crt)
  const [help, setHelp] = useState(false)

  const active = game && !atTitle ? game : null
  const mood = computeMood(active)
  const act = active?.act ?? 0

  // Las variables de color viven en <html>: así también el fondo del documento cambia de clima.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.act = String(act)
    root.dataset.mood = mood
  }, [act, mood])

  let screen
  if (!active) screen = <BootScreen onHelp={() => setHelp(true)} />
  else if (active.phase === 'actIntro') screen = <ActIntro game={active} />
  else if (active.phase === 'ending') screen = <EndingScreen game={active} mood={mood} />
  else screen = <GameScreen game={active} mood={mood} onHelp={() => setHelp(true)} />

  return (
    <div className="app-shell scroll-thin h-full overflow-y-auto">
      {screen}
      <Toasts />
      {help && <HelpModal onClose={() => setHelp(false)} />}
      {crt && <div className="crt-layer" aria-hidden />}
    </div>
  )
}
