import type { DropTable, DropTableId } from '../types/content'

// Los pesos reflejan la rareza: lo común cae seguido, lo épico casi nunca.
export const DROP_TABLES: Record<DropTableId, DropTable> = {
  rutina: {
    id: 'rutina',
    chance: 0.45,
    entries: [
      { item: 'freq_reverb', weight: 34 },
      { item: 'freq_postpunk', weight: 34 },
      { item: 'anillo_liso', weight: 14 },
      { item: 'decant_vetiver', weight: 8 },
      { item: 'cadena_plata', weight: 5 },
      { item: 'anillo_sello', weight: 4 },
      { item: 'reloj_automatico', weight: 1 },
    ],
  },
  pausa: {
    id: 'pausa',
    chance: 0.65,
    entries: [
      { item: 'freq_reverb', weight: 28 },
      { item: 'freq_postpunk', weight: 28 },
      { item: 'freq_demo', weight: 14 },
      { item: 'freq_ladob', weight: 10 },
      { item: 'decant_higo', weight: 10 },
      { item: 'anillo_sello', weight: 6 },
      { item: 'reloj_automatico', weight: 2 },
    ],
  },
  cuidado: {
    id: 'cuidado',
    chance: 0.55,
    entries: [
      { item: 'decant_vetiver', weight: 22 },
      { item: 'decant_higo', weight: 22 },
      { item: 'decant_incienso', weight: 16 },
      { item: 'freq_ladob', weight: 18 },
      { item: 'freq_demo', weight: 14 },
      { item: 'cadena_plata', weight: 6 },
      { item: 'anillo_sello', weight: 6 },
    ],
  },
  montana: {
    id: 'montana',
    chance: 0.7,
    entries: [
      { item: 'freq_demo', weight: 30 },
      { item: 'freq_ladob', weight: 24 },
      { item: 'decant_incienso', weight: 24 },
      { item: 'decant_vetiver', weight: 18 },
      { item: 'reloj_automatico', weight: 4 },
    ],
  },
  raro: {
    id: 'raro',
    chance: 0.9,
    entries: [
      { item: 'anillo_sello', weight: 30 },
      { item: 'cadena_plata', weight: 30 },
      { item: 'decant_incienso', weight: 20 },
      { item: 'reloj_automatico', weight: 20 },
    ],
  },
}
