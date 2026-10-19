import type { Condition, EndingDef } from '../types/content'
import type { EndingId } from '../types/game'
import { all, has, hasNot, not, txt } from './dsl'

const aprobado: Condition = { counter: 'maniobras', gte: 2 }
const reprobado: Condition = { counter: 'maniobras', lte: 1 }
const hijaCalida: Condition = { compare: ['calidezAprendida', 'frialdadHeredada'] }
const parejaFirme: Condition = { compare: ['confianzaAcumulada', 'fantasmasInestabilidad'] }

export const ENDINGS: Record<EndingId, EndingDef> = {
  administrador: {
    id: 'administrador',
    title: 'Permisos de Administrador',
    subtitle: 'El código viejo sigue instalado. Ya no conduce.',
    text: txt(
      'No eres otra persona. Sigues teniendo el código viejo: el impulso de analizar, de tomar distancia, de decir «no me importa» cuando sí importa. Pero ahora hay alguien con permisos de administrador mirando cómo se ejecuta. Alguien que puede decir: este proceso no. Hoy no.',
      'Esa noche llegas a casa y {hija} te muestra una tarea nueva, y {pareja} te cuenta algo de su día, y tú escuchas las dos cosas sin armar ningún caso. Te cansa. Es un cansancio limpio, el de un cuerpo que estuvo presente.',
      'No es una cura. Es un cambio de conductor.',
    ),
    extras: [
      { if: aprobado, text: 'El examinador firmó la hoja: aprobado. La licencia provisoria viaja en tu billetera, al lado del dibujo doblado en cuatro.' },
      { if: reprobado, text: 'Reprobaste el examen. Hay que volver a darlo en treinta días. Te sorprende lo poco que te avergüenza: vas a volver, y vas a girar la cabeza en el punto ciego.' },
      { if: has('cartaHija'), text: 'La carta de la montaña sigue en tu libreta. Se la vas a dar cuando cumpla quince. O antes, si un día te ve frío y no sabe por qué.' },
      { if: has('promesaMontana'), text: 'En el calendario de la cocina, en febrero, hay una fecha marcada con su letra: «MONTAÑA CON PAPÁ».' },
      { if: has('pausaPareja'), text: 'Con {pareja} volvieron a hablar. El contador partió de nuevo desde el día uno. Esta vez no lo estás mirando.' },
    ],
  },
  coraza: {
    id: 'coraza',
    title: 'Protocolo Legacy: Instalación Completa',
    subtitle: 'Ya no te duele nada.',
    text: txt(
      'Funciona. Eso hay que reconocérselo. Ya no te duele nada: ni los silencios en la mesa, ni los mensajes cortos, ni el «está distinto» de tu madre. Todo lo entiendes. Nada te toca.',
      'En el trabajo te admiran: siempre sereno, siempre lúcido, siempre un paso adelante de lo que sienten los demás. Te ascienden. Das una charla sobre gestión emocional en equipos de salud. Recibe muy buenas evaluaciones.',
      'Una tarde escuchas a {hija} hablando por teléfono con una amiga que llora. —Ya, pero no es para tanto —le dice, con tu entonación exacta—. No me importa.',
      'El código se instaló completo. Tres generaciones. Cuatro, ahora.',
    ),
    extras: [
      { if: not(parejaFirme), text: '{pareja} se fue en marzo, sin portazos. Dijo que contigo se sentía en una sala de espera. No supiste qué responder; ya lo habías previsto.' },
      { if: parejaFirme, text: '{pareja} sigue a tu lado, aunque cada vez pregunta menos. Aprendió a no esperar. Te aprendió.' },
      { if: has('trato'), text: 'El acuerdo compartimentado no duró: el muro cortafuegos tenía una sola puerta, y la llave la tenía el Algoritmo.' },
    ],
  },
  npc: {
    id: 'npc',
    title: 'Actualización Automática Completada',
    subtitle: 'Todo funciona. Ese era el problema.',
    text: txt(
      'Te levantas a las 06:40. Apagas la alarma sin escucharla. Respondes los correos en la micro. Dices «busquemos un punto de encuentro» en reuniones donde nadie se encuentra. Eres un excelente funcionario. Nadie tiene quejas de ti. Nadie tiene mucho de ti, tampoco.',
      'Los glitches dejaron de aparecer al poco tiempo. A veces, en la ducha, sientes que se te olvidó algo importante. Después se te olvida que lo sentiste.',
      'El script de fábrica se ejecuta sin errores. Nadie lo escribió. Todos lo cumplen.',
    ),
    extras: [
      { if: aprobado, text: 'Aprobaste el examen de manejo. Ahora el auto también va en piloto automático: casa, trabajo, casa.' },
      { if: reprobado, text: 'Reprobaste el examen de manejo. No volviste a inscribirte. Total, la micro también llega.' },
      { if: all(hijaCalida, parejaFirme), text: 'En casa todavía hay calor: {hija} y {pareja} lo sostienen por los dos. Por ahora alcanza. Por ahora.' },
      { if: not(hijaCalida), text: '{hija} dejó de mostrarte sus dibujos. No te diste cuenta de cuándo. Ella sí.' },
    ],
  },
  modoSeguro: {
    id: 'modoSeguro',
    title: 'Modo Seguro',
    subtitle: 'Funciones básicas. Sin todo el código viejo. Sin todos los permisos.',
    text: txt(
      'El sistema arrancó en modo seguro. No eres el mismo que apagaba la alarma sin escucharla, pero tampoco tienes el volante del todo. Hay días en que manejas tú y días en que maneja el Algoritmo, y a veces no sabes cuál es cuál hasta la noche.',
      'Quizás eso es lo que significa tener un código propio: no un estado final, sino una elección que se repite. Mañana vas a tener que elegir otra vez. Y pasado.',
    ),
    extras: [
      { if: has('intento'), text: 'Lo que sí sabes es esto: manejaste un tramo. Con las manos temblando, pero lo manejaste. El Algoritmo lo vio desde el asiento del copiloto, y no lo ha olvidado.' },
      { if: has('trato'), text: 'El trato sigue vigente: el trabajo es suyo, la casa es tuya. Cada tanto, el muro cortafuegos tiene filtraciones. Algunas noches llegas a casa con la voz de Hernán puesta.' },
      { if: hijaCalida, text: '{hija} te sigue buscando. Es la mejor señal que tiene el sistema: alguien que todavía cree que vale la pena hablarte.' },
      { if: not(hijaCalida), text: '{hija} te mira a veces como mirabas tú a tu padre: esperando algo que no sabe nombrar. Todavía hay tiempo. No tanto como crees.' },
      { if: all(parejaFirme, hasNot('pausaPareja')), text: '{pareja} sigue ahí. Día a día, sin contar. Eso también es un permiso que alguien te dio.' },
      { if: not(parejaFirme), text: 'Con {pareja} las cosas están en pausa. Ni rotas ni enteras. Como todo, en modo seguro.' },
    ],
  },
}
