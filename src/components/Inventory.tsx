// Inventario de Anclas de Identidad: equipamiento con pasivas en vivo, filtros por
// rareza y consumibles con consejo contextual. Las reglas viven en src/engine.

import { useState } from 'react'
import { ITEMS, RARITY_LABEL } from '../data/items'
import { burocraciaShieldTotal, itemAdvice, passiveReport, type PassiveStatus } from '../engine/anchors'
import { useGame } from '../store/gameStore'
import type { EquipSlot, GameState, ItemId, Rarity } from '../types/game'

const RARITIES: Rarity[] = ['singular', 'epico', 'raro', 'comun']
const RARITY_RANK: Record<Rarity, number> = { singular: 0, epico: 1, raro: 2, comun: 3 }

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
const SLOT_LABEL: Record<EquipSlot, string> = { muneca: 'Muñeca', manos: 'Manos', cuello: 'Cuello' }

type Filter = Rarity | 'todas'

function PassiveDot({ status }: { status?: PassiveStatus }) {
  if (!status) return null
  return (
    <span className={`term whitespace-nowrap text-[15px] ${status.active ? 'text-confianza' : 'text-dim/70'}`} title={status.note}>
      {status.active ? '● activa' : '○ pausa'}
    </span>
  )
}

function Slot({ slot, id, status }: { slot: EquipSlot; id: ItemId | null; status?: PassiveStatus }) {
  const unequip = useGame((s) => s.unequip)
  const def = id ? ITEMS[id] : null
  return (
    <div className={`min-w-0 border px-2 py-1.5 ${def ? RARITY_BORDER[def.rarity] : 'border-dashed border-line'}`}>
      <div className="flex items-baseline justify-between gap-1">
        <p className="label">{SLOT_LABEL[slot]}</p>
        <PassiveDot status={status} />
      </div>
      {def ? (
        <button
          type="button"
          onClick={() => unequip(id!)}
          title={`${status?.note ?? def.effect}\n(clic para guardar)`}
          className={`mt-0.5 block text-left text-[12.5px] leading-tight ${RARITY_TEXT[def.rarity]} hover:underline`}
        >
          {def.name}
        </button>
      ) : (
        <p className="term mt-0.5 text-[16px] text-dim/60">vacío</p>
      )}
    </div>
  )
}

function ItemRow({ id, qty, game, status }: { id: ItemId; qty: number; game: GameState; status?: PassiveStatus }) {
  const [open, setOpen] = useState(false)
  const consumir = useGame((s) => s.consumeItem)
  const equip = useGame((s) => s.equip)
  const def = ITEMS[id]
  const advice = def.kind === 'consumible' ? itemAdvice(game, id) : null
  const playing = game.phase === 'playing'
  return (
    <li className={`border-l-2 bg-panel-2 ${RARITY_BORDER[def.rarity]}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-baseline justify-between gap-2 px-2.5 py-1.5 text-left"
      >
        <span className={`min-w-0 text-[13.5px] leading-snug ${RARITY_TEXT[def.rarity]}`}>
          {advice && <span className="mr-1 text-energia" aria-label="Recomendado ahora">◆</span>}
          {def.name}
        </span>
        <span className="term shrink-0 text-[16px] text-dim">
          {qty > 1 ? `×${qty} · ` : ''}
          {RARITY_LABEL[def.rarity]}
        </span>
      </button>
      {open && (
        <div className="space-y-2 px-2.5 pb-2.5">
          <p className="term text-[16px] leading-tight text-fg">{def.effect}</p>
          {advice && <p className="term text-[16px] leading-tight text-energia">◆ {advice}</p>}
          {status && <p className="term text-[16px] leading-tight text-dim">{status.note}</p>}
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
              Equipar en {SLOT_LABEL[def.slot!].toLowerCase()}
            </button>
          )}
        </div>
      )}
    </li>
  )
}

export function Inventory({ game }: { game: GameState }) {
  const [filter, setFilter] = useState<Filter>('todas')
  const passives = passiveReport(game)
  const statusOf = (id: ItemId | null) => (id ? passives.find((p) => p.id === id) : undefined)
  const shield = burocraciaShieldTotal(game)
  const { muneca, cuello, manos } = game.equipped

  const entries = (Object.entries(game.inventory) as [ItemId, number][]).sort(
    ([a], [b]) => RARITY_RANK[ITEMS[a].rarity] - RARITY_RANK[ITEMS[b].rarity] || ITEMS[a].name.localeCompare(ITEMS[b].name),
  )
  const owned = [...entries.map(([id]) => id), muneca, cuello, ...manos].filter((x): x is ItemId => Boolean(x))
  const countBy = (r: Rarity) => owned.filter((id) => ITEMS[id].rarity === r).length
  const shown = entries.filter(([id]) => filter === 'todas' || ITEMS[id].rarity === filter)
  const groups: [string, [ItemId, number][]][] = [
    ['Consumibles', shown.filter(([id]) => ITEMS[id].kind === 'consumible')],
    ['Equipables guardados', shown.filter(([id]) => ITEMS[id].kind === 'equipable')],
    ['Reliquias', shown.filter(([id]) => ITEMS[id].kind === 'reliquia')],
  ]

  return (
    <section className="panel space-y-3 p-3" aria-label="Inventario de anclas">
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="label text-fg">Anclas de identidad</h3>
        <span className="term text-[15px] text-dim">{owned.length} anclas</span>
      </header>

      <div className="grid grid-cols-2 gap-1.5">
        <Slot slot="muneca" id={muneca} status={statusOf(muneca)} />
        <Slot slot="cuello" id={cuello} status={statusOf(cuello)} />
        <Slot slot="manos" id={manos[0] ?? null} status={statusOf(manos[0] ?? null)} />
        <Slot slot="manos" id={manos[1] ?? null} status={statusOf(manos[1] ?? null)} />
      </div>
      {shield > 0 && (
        <p className="term text-[15px] leading-tight text-dim">
          Joyería equipada: −{shield} automatismo por decisión en entornos burocráticos (mínimo 1).
        </p>
      )}

      <div className="flex flex-wrap gap-1" role="group" aria-label="Filtrar por rareza">
        <button
          type="button"
          onClick={() => setFilter('todas')}
          aria-pressed={filter === 'todas'}
          className={`term border px-1.5 text-[15px] leading-5 ${filter === 'todas' ? 'border-accent text-accent' : 'border-line text-dim'}`}
        >
          Todas
        </button>
        {RARITIES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setFilter(filter === r ? 'todas' : r)}
            aria-pressed={filter === r}
            disabled={countBy(r) === 0}
            className={`term border px-1.5 text-[15px] leading-5 disabled:opacity-35 ${RARITY_TEXT[r]} ${
              filter === r ? `${RARITY_BORDER[r]} bg-panel-2` : 'border-line'
            }`}
          >
            {RARITY_LABEL[r]} {countBy(r)}
          </button>
        ))}
      </div>

      {groups.map(([title, list]) =>
        list.length ? (
          <div key={title} className="space-y-1">
            <p className="label">{title}</p>
            <ul className="space-y-1">
              {list.map(([id, qty]) => (
                <ItemRow key={id} id={id} qty={qty} game={game} status={ITEMS[id].kind === 'reliquia' ? statusOf(id) : undefined} />
              ))}
            </ul>
          </div>
        ) : null,
      )}
      {!shown.length && (
        <p className="term text-[16px] text-dim">
          {entries.length ? 'Nada guardado de esta rareza.' : 'Nada guardado. Las anclas caen de decisiones y eventos.'}
        </p>
      )}
    </section>
  )
}
