import type { ReactNode } from 'react'
import { STATUSES } from '../../data/statuses'
import {
  AUTOMATISMO_HIJA_UMBRAL,
  CORAZA_DESACTIVAR_COSTO,
  canActivateCoraza,
  hijaRegistrando,
} from '../../engine/engine'
import { isEquipped } from '../../engine/conditions'
import { currentScene } from '../../engine/registry'
import { useGame } from '../../store/gameStore'
import { UMBRAL_FRIO } from '../../theme/mood'
import type { GameState } from '../../types/game'
import { StatBar } from '../StatBar'

function Card({ title, code, children }: { title: string; code?: string; children: ReactNode }) {
  return (
    <section className="panel space-y-3 p-3">
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="label text-fg">{title}</h3>
        {code && <span className="term text-[15px] whitespace-nowrap text-dim">{code}</span>}
      </header>
      {children}
    </section>
  )
}

export function SystemPanel({ game }: { game: GameState }) {
  const toggleCoraza = useGame((s) => s.toggleCoraza)
  const { id: deltaKey, deltas } = useGame((s) => s.lastDeltas)
  const scene = currentScene(game)
  const { stats, hija, pareja } = game
  const puedeActivar = canActivateCoraza(game)
  const registrando = hijaRegistrando(game)
  const contagio = game.statuses.find((s) => s.id === 'contagioFrialdad')
  const conReloj = isEquipped(game, 'reloj_automatico')
  const balanceHija = hija.calidezAprendida - hija.frialdadHeredada

  return (
    <div className="space-y-3 p-3">
      <Card title="Reloj" code={scene.presionTiempo ? 'PRESIÓN DE TIEMPO' : undefined}>
        <span className="term block text-[44px] leading-none text-fg">{scene.time}</span>
        <div className="flex items-baseline justify-between gap-2">
          <p className="term text-[17px] text-dim">{scene.day}</p>
          <p className="term text-right text-[17px] text-confianza">
            {game.flags.pausaPareja ? 'Pausa · ' : ''}Día {pareja.diaEstabilidad} de estabilidad
          </p>
        </div>
        {conReloj && (
          <p className="term flex items-center gap-2 text-[16px] text-epico">
            <span className="inline-block h-2 w-2 animate-spin bg-epico" aria-hidden /> Reloj automático en marcha: tu hora, no la del sistema
          </p>
        )}
      </Card>

      <Card title="Estado del sistema">
        <StatBar
          label="Automatismo"
          value={stats.automatismo}
          color="bg-coraza"
          threshold={UMBRAL_FRIO}
          hint="Inercia. Sube al responder en piloto automático. En 100, el sistema elige por ti."
          delta={deltas.automatismo}
          deltaKey={deltaKey}
        />
        <StatBar
          label="Permisos admin"
          value={stats.permisosAdmin}
          color="bg-admin"
          hint="Consciencia. Desbloquea opciones ocultas y etiquetas de código fuente."
          delta={deltas.permisosAdmin}
          deltaKey={deltaKey}
        />
        <StatBar
          label="Energía mental"
          value={stats.energiaMental}
          color="bg-energia"
          hint="Batería. Se gasta al sostener presencia real y filtrar el estrés."
          delta={deltas.energiaMental}
          deltaKey={deltaKey}
        />
        <StatBar
          label="Lado oscuro"
          value={stats.ladoOscuro}
          color="bg-fantasmas"
          threshold={UMBRAL_FRIO}
          hint="Coraza de Distancia heredada. Ahorra energía, congela los vínculos."
          delta={deltas.ladoOscuro}
          deltaKey={deltaKey}
        />
      </Card>

      <Card title="Coraza de distancia" code={game.corazaActiva ? 'ACTIVA' : 'INACTIVA'}>
        <p className="text-[13px] leading-snug text-dim">
          {game.corazaActiva
            ? 'No gastas energía ni sufres estrés. Cada decisión suma lado oscuro y enfría a quien tengas cerca.'
            : 'Protocolo Legacy. Disponible sólo en momentos de alta presión.'}
        </p>
        <button
          type="button"
          onClick={toggleCoraza}
          disabled={!game.corazaActiva && !puedeActivar}
          className={`choice term w-full border px-2 py-1 text-[18px] ${
            game.corazaActiva
              ? 'border-coraza bg-coraza/15 text-coraza hover:bg-coraza/25'
              : puedeActivar
                ? 'border-coraza/70 text-coraza hover:bg-coraza/15'
                : 'cursor-not-allowed border-line text-dim/60'
          }`}
        >
          {game.corazaActiva ? `Bajar la coraza (energía −${CORAZA_DESACTIVAR_COSTO})` : puedeActivar ? 'Activar coraza' : 'Sin presión suficiente'}
        </button>
      </Card>

      {game.statuses.length > 0 && (
        <Card title="Estados alterados">
          <ul className="space-y-2">
            {game.statuses.map((s) => {
              const def = STATUSES[s.id]
              return (
                <li key={s.id} title={def.description}>
                  <p className={`term text-[18px] ${def.polarity === 'negativo' ? 'text-danger' : 'text-epico'}`}>
                    {def.name}
                    {s.charges !== undefined && <span className="text-dim"> · {s.charges}</span>}
                  </p>
                  <p className="text-[12.5px] leading-snug text-dim">{def.description}</p>
                </li>
              )
            })}
          </ul>
        </Card>
      )}

      <Card title="Espejo generacional" code="HIJA · 10">
        <StatBar label="Calidez aprendida" value={hija.calidezAprendida} color="bg-calidez" compact delta={deltas.calidezAprendida} deltaKey={deltaKey} />
        <StatBar label="Frialdad heredada" value={hija.frialdadHeredada} color="bg-frialdad" compact delta={deltas.frialdadHeredada} deltaKey={deltaKey} />
        <p className="term text-[17px] text-dim">
          {registrando ? (
            <span className="text-frialdad">● registrando un patrón de silencio</span>
          ) : balanceHija >= 10 ? (
            `${game.nombres.hija} está aprendiendo calidez.`
          ) : balanceHija <= -10 ? (
            `${game.nombres.hija} está aprendiendo distancia.`
          ) : (
            `${game.nombres.hija} observa. Todavía no decide.`
          )}
        </p>
        {stats.automatismo >= AUTOMATISMO_HIJA_UMBRAL - 10 && !registrando && (
          <p className="text-[12px] text-dim">Con automatismo ≥ {AUTOMATISMO_HIJA_UMBRAL} o la coraza activa, ella lo nota.</p>
        )}
      </Card>

      <Card title="Sincronización fase beta" code={game.flags.pausaPareja ? 'EN PAUSA' : `DÍA ${pareja.diaEstabilidad}`}>
        <StatBar label="Confianza acumulada" value={pareja.confianzaAcumulada} color="bg-confianza" compact delta={deltas.confianzaAcumulada} deltaKey={deltaKey} />
        <StatBar label="Fantasmas de inestabilidad" value={pareja.fantasmasInestabilidad} color="bg-fantasmas" compact delta={deltas.fantasmasInestabilidad} deltaKey={deltaKey} />
      </Card>

      <Card title="Código legacy" code="FAMILIA DE ORIGEN">
        {contagio ? (
          <p className="term text-[18px] text-danger">Contagio de frialdad activo · {contagio.charges ?? '∞'} interacciones</p>
        ) : (
          <p className="term text-[18px] text-dim">Sin contagio activo.</p>
        )}
        <p className="text-[12.5px] leading-snug text-dim">
          Salir de una escena con tu familia de origen sin gastar permisos de administrador te contagia su frío.
        </p>
      </Card>
    </div>
  )
}
