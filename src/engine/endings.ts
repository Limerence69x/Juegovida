import type { EndingId, GameState } from '../types/game'

/**
 * El final se decide por el resultado del jefe (las flags que deja la última decisión)
 * pesado contra todo el recorrido: barras de sistema y estado de los vínculos.
 */
export function computeEnding(s: GameState): EndingId {
  const { automatismo, ladoOscuro } = s.stats
  const hijaCalida = s.hija.calidezAprendida >= s.hija.frialdadHeredada
  const parejaFirme = s.pareja.confianzaAcumulada >= s.pareja.fantasmasInestabilidad

  // Soltar el volante al final pesa, pero no borra el recorrido entero.
  if (s.flags.entrego) {
    if (ladoOscuro >= 60) return 'coraza'
    return automatismo >= 50 ? 'npc' : 'modoSeguro'
  }
  if (automatismo >= 85) return 'npc'
  if (ladoOscuro >= 75) return 'coraza'
  if (s.flags.trato) return ladoOscuro >= 50 ? 'coraza' : 'modoSeguro'
  if (s.flags.controlManual && hijaCalida && parejaFirme && automatismo < 70 && ladoOscuro < 70) return 'administrador'
  return 'modoSeguro'
}
