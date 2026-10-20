import { useEffect } from 'react'

const SECCIONES: [string, string][] = [
  [
    'La premisa',
    'Funcionas como un sistema programado por normas sociales, exigencias institucionales y patrones familiares heredados. El objetivo es pasar de actuar por inercia a obtener permisos de administrador sobre tu propia mente, sin refugiarte en el desapego frío.',
  ],
  [
    'Barras de sistema',
    'AUTOMATISMO sube cuando respondes en piloto automático; en 100 el sistema bloquea tus opciones auténticas y elige por ti. PERMISOS ADMIN sube al cuestionar el guion: desbloquea opciones ocultas y etiquetas de código fuente (miedos, defensas, historias). ENERGÍA MENTAL se gasta al sostener presencia real; los vínculos genuinos la recargan. LADO OSCURO crece con la coraza y la intelectualización.',
  ],
  [
    'Ingeniería inversa',
    'Con permisos ≥ 15, el botón «Inspeccionar código» (o la tecla I) revela por 3 de energía el subtexto de quien habla: su miedo, su defensa, su historia. También muestra qué protege cada una de tus respuestas y, con permisos ≥ 45, qué variables mueve. Desde el Acto 3 tienes además el Lector de Defensas: lo ve todo gratis y con +15 de lectura. En el trabajo no cuesta nada; frente a tu hija, tu pareja o tu familia, cada decisión con el Lector encendido suma lado oscuro y enfría el vínculo. Puedes apagarlo.',
  ],
  [
    'Coraza de distancia',
    'En momentos de alta presión puedes activarla (panel Sistema): dejas de gastar energía y de sufrir estrés, pero cada decisión suma lado oscuro y enfría a tu hija y a tu pareja. Quitártela cuesta energía. Se cae sola al dormir, entre actos.',
  ],
  [
    'Nodos relacionales',
    'Tu HIJA no tiene barra de afecto: registra lo que observa (calidez aprendida vs. frialdad heredada). Si llegas con la coraza o con automatismo alto, lo nota. Con tu PAREJA, cada roce te ofrece un Impulso de Regresión o un Salto de Fe. En las escenas con tu FAMILIA DE ORIGEN, si sales sin gastar permisos te llevas un Contagio de Frialdad.',
  ],
  [
    'Anclas de identidad',
    'Frecuencias de Aislamiento (música) limpian el Ruido Institucional y bajan el automatismo: úsalas para cortar el piloto automático. Los decants de perfume disuelven la ansiedad y abren opciones creativas. Anillos y joyería reducen la inercia burocrática. El reloj automático resiste la presión de tiempo. Las reliquias singulares sirven al final.',
  ],
  [
    'Etiquetas en las opciones',
    'ENERGÍA −N: cuesta batería. ADMIN ≥ N: exige consciencia. GASTA PERMISOS: consume consciencia (clave con tu familia). ACTIVA CORAZA: entra en Protocolo Legacy. SALTO DE FE / IMPULSO DE REGRESIÓN / PRESENCIA / INTELECTUALIZACIÓN describen el subtexto. Con permisos ≥ 30 verás cuál es el GUION PRECARGADO.',
  ],
  ['Controles', 'Teclas 1–9 para elegir. Enter o Espacio para completar el texto o continuar. I para inspeccionar el código. La partida se guarda sola en este navegador.'],
]

export function HelpModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Cómo se juega" onClick={onClose}>
      <div className="panel scroll-thin max-h-[86vh] w-full max-w-[640px] space-y-4 overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-pixel text-[13px] text-accent">Manual del sistema</h2>
          <button type="button" onClick={onClose} className="term text-[22px] text-dim hover:text-fg" aria-label="Cerrar">
            ✕
          </button>
        </div>
        {SECCIONES.map(([t, d]) => (
          <section key={t} className="space-y-1">
            <h3 className="label text-fg">{t}</h3>
            <p className="text-[14px] leading-relaxed text-dim">{d}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
