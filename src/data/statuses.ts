import type { StatusId } from '../types/game'

export interface StatusDef {
  id: StatusId
  name: string
  polarity: 'negativo' | 'positivo'
  description: string
}

export const STATUSES: Record<StatusId, StatusDef> = {
  ruidoInstitucional: {
    id: 'ruidoInstitucional',
    name: 'Ruido Institucional',
    polarity: 'negativo',
    description: '+2 automatismo extra en cada decisión. Una Frecuencia de Aislamiento lo limpia.',
  },
  contagioFrialdad: {
    id: 'contagioFrialdad',
    name: 'Contagio de Frialdad',
    polarity: 'negativo',
    description:
      'Te llevaste el clima de tu familia de origen. Con tu hija y tu pareja: calidez y confianza ganadas ×0,5, y cada decisión suma frialdad o fantasmas.',
  },
  ansiedad: {
    id: 'ansiedad',
    name: 'Ansiedad',
    polarity: 'negativo',
    description: 'Cada decisión con costo de energía cuesta +5. Un decant de perfume la disuelve.',
  },
  sentidosAbiertos: {
    id: 'sentidosAbiertos',
    name: 'Sentidos Abiertos',
    polarity: 'positivo',
    description: 'La percepción se expande: habilita opciones creativas y empáticas.',
  },
}
