import { useEffect, useRef, useState } from 'react'
import { ITEMS, RARITY_LABEL } from '../../data/items'
import { useGame } from '../../store/gameStore'
import type { EquipSlot, GameState, ItemId, LogKind, Rarity } from '../../types/game'

const RARITY_TEXT: Record<Rarity, string> = {
  comun: 'text-comun',
  raro: 'text-raro',
  epico: 'text-epico',
  singular: 'text-singular',
}
const RARITY_BORDER: Record<Rarity, string> = {
  comun: 'border-comun/50',
  raro: 'border-raro/60',
  epico: 'border-epico/70',
  singular: 'border-singular/80',
}
const LOG_COLOR: Record<LogKind, string> = {
  sistema: 'text-dim',
  consciencia: 'text-admin',
  vinculo: 'text-calidez',
  loot: 'text-singular',
  alerta: 'text-danger',
  legacy: 'text-frialdad',
}
const SLOT_LABEL: Record<EquipSlot, string> = { muneca: 'Muñeca', manos: 'Manos', cuello: 'Cuello' }

function ItemRow({ id, qty, game }: { id: ItemId; qty: number; game: GameState }) {
  const [open, setOpen] = useState(false)
  const consumir = useGame((s) => s.consumeItem)
  const equip = useGame((s) => s.equip)
  const def = ITEMS[id]
  const playing = game.phase === 'playing'
  return (
    <li className={`border-l-2 bg-panel-2 ${RARITY_BORDER[def.rarity]}`}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-baseline justify-between gap-2 px-2.5 py-1.5 text-left">
        <span className={`text-[13.5px] leading-snug ${RARITY_TEXT[def.rarity]}`}>{def.name}</span>
        <span className="term shrink-0 text-[16px] text-dim">
          {qty > 1 ? `×${qty} · ` : ''}
          {RARITY_LABEL[def.rarity]}
        </span>
      </button>
      {open && (
        <div className="space-y-2 px-2.5 pb-2.5">
          <p className="term text-[16px] leading-tight text-fg">{def.effect}</p>
          <p className="text-[12.5px] italic leading-snug text-dim">{def.flavor}</p>
          {def.kind === 'consumible' && (
            <button
              type="button"
              disabled={!playing}
              onClick={() => consumir(id)}
              className="choice term border border-accent/70 px-2 text-[17px] text-accent hover:bg-accent hover:text-accent-ink disabled:opacity-40"
            >
              Usar
            </button>
          )}
          {def.kind === 'equipable' && (
            <button
              type="button"
              onClick={() => equip(id)}
              className="choice term border border-accent/70 px-2 text-[17px] text-accent hover:bg-accent hover:text-accent-ink"
            >
              Equipar ({SLOT_LABEL[def.slot!]})
            </button>
          )}
        </div>
      )}
    </li>
  )
}

function Slot({ slot, id }: { slot: EquipSlot; id: ItemId | null }) {
  const unequip = useGame((s) => s.unequip)
  const def = id ? ITEMS[id] : null
  return (
    <div className={`border px-2 py-1.5 ${def ? RARITY_BORDER[def.rarity] : 'border-dashed border-line'}`}>
      <p className="label">{SLOT_LABEL[slot]}</p>
      {def ? (
        <button type="button" onClick={() => unequip(id!)} title={`${def.effect}\n(clic para guardar)`} className={`mt-0.5 text-left text-[12.5px] leading-tight ${RARITY_TEXT[def.rarity]}`}>
          {def.name}
        </button>
      ) : (
        <p className="term mt-0.5 text-[16px] text-dim/60">vacío</p>
      )}
    </div>
  )
}

export function AnclasPanel({ game }: { game: GameState }) {
  const entries = Object.entries(game.inventory) as [ItemId, number][]
  const consumibles = entries.filter(([id]) => ITEMS[id].kind === 'consumible')
  const guardados = entries.filter(([id]) => ITEMS[id].kind === 'equipable')
  const reliquias = entries.filter(([id]) => ITEMS[id].kind === 'reliquia')
  const logRef = useRef<HTMLOListElement>(null)
  const recent = game.log.slice(-80)

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [game.log.length])

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <section className="panel space-y-3 p-3">
        <h3 className="label text-fg">Anclas de identidad</h3>
        <div className="grid grid-cols-2 gap-1.5">
          <Slot slot="muneca" id={game.equipped.muneca} />
          <Slot slot="cuello" id={game.equipped.cuello} />
          <Slot slot="manos" id={game.equipped.manos[0] ?? null} />
          <Slot slot="manos" id={game.equipped.manos[1] ?? null} />
        </div>

        {[
          ['Consumibles', consumibles],
          ['Guardados', guardados],
          ['Reliquias', reliquias],
        ].map(([title, list]) =>
          (list as [ItemId, number][]).length ? (
            <div key={title as string} className="space-y-1">
              <p className="label">{title as string}</p>
              <ul className="space-y-1">
                {(list as [ItemId, number][]).map(([id, qty]) => (
                  <ItemRow key={id} id={id} qty={qty} game={game} />
                ))}
              </ul>
            </div>
          ) : null,
        )}
        {!entries.length && <p className="term text-[16px] text-dim">Inventario vacío. Las anclas caen de decisiones y eventos.</p>}
      </section>

      <section className="panel flex min-h-[220px] flex-1 flex-col p-3">
        <h3 className="label mb-2 text-fg">Registro de consciencia</h3>
        <ol ref={logRef} className="scroll-thin min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-live="polite">
          {recent.map((e) => (
            <li key={e.id} className={`term text-[16px] leading-tight ${LOG_COLOR[e.kind]}`}>
              <span className="text-dim/50">{String(e.id).padStart(3, '0')} </span>
              {e.text}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
