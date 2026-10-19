// Estado global. Zustand sólo orquesta: cada acción delega en una función pura del motor.

import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import * as engine from '../engine/engine'
import { SCENES } from '../data/acts'
import { freshSeed } from '../engine/rng'
import type { GameState, ItemId, VarKey } from '../types/game'

export type TextSpeed = 'lenta' | 'normal' | 'instantanea'

export interface Settings {
  velocidad: TextSpeed
  crt: boolean
}

export interface Toast extends engine.Notice {
  id: number
}

interface GameStore {
  game: GameState | null
  settings: Settings
  /** Transitorios (no se persisten). */
  atTitle: boolean
  toasts: Toast[]
  lastDeltas: { id: number; deltas: Partial<Record<VarKey, number>> }

  newGame: (nombres: GameState['nombres']) => void
  resume: () => void
  continueAct: () => void
  choose: (choiceId: string) => void
  advance: () => void
  consumeItem: (id: ItemId) => void
  equip: (id: ItemId) => void
  unequip: (id: ItemId) => void
  toggleCoraza: () => void
  reset: () => void
  dismissToast: (id: number) => void
  setSettings: (patch: Partial<Settings>) => void
}

/** localStorage puede no existir o lanzar (modo privado, iframes, previews): nunca rompe el juego. */
const safeStorage: StateStorage = {
  getItem: (k) => {
    try {
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  setItem: (k, v) => {
    try {
      localStorage.setItem(k, v)
    } catch {
      /* sin persistencia: se juega igual */
    }
  },
  removeItem: (k) => {
    try {
      localStorage.removeItem(k)
    } catch {
      /* nada que limpiar */
    }
  },
}

let toastSeq = 0
const TOAST_MAX = 4

export const useGame = create<GameStore>()(
  persist(
    (set, get) => {
      const apply = (r: engine.StepResult) => {
        if (r.state === get().game && !r.notices.length) return
        const toasts = [...get().toasts, ...r.notices.map((n) => ({ ...n, id: ++toastSeq }))].slice(-TOAST_MAX)
        set({ game: r.state, toasts, lastDeltas: { id: toastSeq + Math.random(), deltas: r.deltas } })
      }
      const withGame = (fn: (g: GameState) => engine.StepResult) => {
        const g = get().game
        if (g) apply(fn(g))
      }

      return {
        game: null,
        settings: { velocidad: 'normal', crt: true },
        atTitle: true,
        toasts: [],
        lastDeltas: { id: 0, deltas: {} },

        newGame: (nombres) => set({ game: engine.startGame(nombres, freshSeed()).state, toasts: [], atTitle: false }),
        resume: () => set({ atTitle: false }),
        continueAct: () => {
          const g = get().game
          if (g?.phase === 'actIntro') set({ game: engine.beginAct(g) })
        },
        choose: (id) => withGame((g) => engine.choose(g, id)),
        advance: () => withGame((g) => engine.advance(g)),
        consumeItem: (id) => withGame((g) => engine.consumeItem(g, id)),
        equip: (id) => withGame((g) => engine.equipItem(g, id)),
        unequip: (id) => withGame((g) => engine.unequipItem(g, id)),
        toggleCoraza: () => withGame((g) => engine.toggleCoraza(g)),
        reset: () => set({ game: null, toasts: [], lastDeltas: { id: 0, deltas: {} }, atTitle: true }),
        dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
        setSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      }
    },
    {
      name: 'codigo-propio:save',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ game: s.game, settings: s.settings }),
      // Una partida guardada que apunta a contenido que ya no existe se descarta.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<GameStore>
        const valid = p.game && SCENES[p.game.position.sceneId]?.nodes[p.game.position.nodeId]
        return { ...current, settings: { ...current.settings, ...p.settings }, game: valid ? p.game! : null }
      },
      migrate: () => ({ game: null }),
    },
  ),
)
