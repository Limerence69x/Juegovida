// ACTO 5 — TOMA DE CONTROL MANUAL
// Examen práctico de conducir + jefe final: batalla dialéctica contra el Algoritmo de Inercia.
// La coherencia del Algoritmo (contador 'coherencia') baja con argumentos propios y sube
// cuando le respondes en su mismo idioma: piloto automático o intelectualización.

import type { ActMeta, Choice, Scene, TextExtra } from '../../types/content'
import {
  addStatus,
  admin,
  any,
  auto,
  calidez,
  confianza,
  counter,
  dia,
  energia,
  fantasmas,
  flag,
  has,
  item,
  log,
  oscuro,
  txt,
  varMin,
} from '../dsl'

export const ACTO_5: ActMeta = {
  number: 5,
  title: 'Toma de Control Manual',
  subtitle: 'Manos en el volante. Diez y diez.',
  epigraph: 'Nadie te puede enseñar a manejar desde el asiento del copiloto.',
  firstScene: 'a5_examen',
  onEnter: [energia(25), log('Sistema listo para transferencia de control. Esperando al usuario.', 'sistema')],
}

const ALGORITMO = 'ALGORITMO DE INERCIA'

/** Cómo se ve el Algoritmo según cuánto se ha agrietado su lógica. */
const estadoAlgoritmo: TextExtra[] = [
  { if: { counter: 'coherencia', gte: 95 }, text: 'El rostro de código brilla, más nítido que antes. Le hace bien que lo escuches.' },
  { if: { counter: 'coherencia', lte: 70 }, text: 'Una grieta fina recorre el rostro de código, de la frente a la boca.' },
  { if: { counter: 'coherencia', lte: 40 }, text: 'Las líneas del rostro tartamudean. Por momentos se ve, debajo, la cara de un niño.' },
]

const rendirse = (id: string, text: string, next: string): Choice => ({
  id,
  autopilot: true,
  text,
  effects: [counter('coherencia', 12), auto(6), energia(3)],
  next,
})

const a5_examen: Scene = {
  id: 'a5_examen',
  act: 5,
  title: 'Examen práctico',
  location: 'Auto de la escuela de conductores',
  time: '18:00',
  day: 'Jueves',
  art: 'auto',
  entorno: 'transito',
  presionTiempo: true,
  onEnter: [dia(3), addStatus('ansiedad')],
  start: 'x1',
  nodes: {
    x1: {
      text: txt(
        'Jueves, 18:00. Examen práctico de conducir. El auto de la escuela huele a ambientador de pino y a nervios ajenos. A tu lado, el examinador: un hombre de bigote gris, con una tablilla y cero interés en tu historia personal.',
        '—Cuando quiera —dice.',
        'Pones las manos en el volante. Diez y diez, como te enseñaron. Te transpiran.',
        'Hay algo extraño: en el tablero, donde debería estar la radio, una pantalla pequeña muestra un cursor parpadeando. Nadie más parece verla.',
      ),
      extras: [
        {
          if: has('acompanaStent'),
          text: 'Esta mañana estuviste en la sala de recuperación mientras a tu padre le ponían el stent. Al despedirse te dijo: «Anda, que vas a llegar tarde al examen.» Nunca le contaste que tenías examen. Lo sabía igual.',
        },
      ],
      next: 'x2',
    },
    x2: {
      text: txt(
        'Primera maniobra: salir del estacionamiento. Antes de mover el auto, el protocolo exige revisar los espejos.',
        'En el retrovisor ves la calle. Y por un segundo ves también otra cosa: la cocina de tus padres, el camión de tu abuelo, el arroz «distinto».',
      ),
      presion: true,
      choices: [
        {
          id: 'espejos',
          text: 'Mirar los espejos de verdad: lo que viene de atrás existe y hay que tenerlo en cuenta. Pero se mira para avanzar, no para quedarse.',
          cost: { energia: 5 },
          effects: [admin(5), auto(-4), counter('maniobras', 1)],
          next: 'x3',
        },
        {
          id: 'tramite',
          autopilot: true,
          text: 'Mirar los espejos como trámite, rápido, porque el examinador está anotando. Ver sin ver.',
          effects: [auto(5), energia(3)],
          next: 'x3',
        },
        {
          id: 'retrovisor',
          tags: ['analisis'],
          text: 'Quedarte mirando el retrovisor demasiado rato. El pasado es más nítido que la calle.',
          effects: [oscuro(5), admin(2)],
          next: 'x3',
        },
      ],
    },
    x3: {
      text: txt(
        'Avanzas. El examinador anota algo. En la esquina, la maniobra que más te asusta: virar a la izquierda en una avenida con tráfico. Hay un punto ciego: el pilar del parabrisas tapa justo el lugar por donde vienen las motos.',
        '—El punto ciego no se ve con los espejos —dice el examinador, sin emoción—. Se ve girando la cabeza. Mucha gente se olvida.',
      ),
      sourceTags: [
        { kind: 'PATRÓN', min: 30, text: 'Lo que no ves de ti mismo no aparece en ningún espejo. Hay que girar la cabeza.' },
      ],
      presion: true,
      choices: [
        {
          id: 'girar',
          text: 'Girar la cabeza. Mirar el punto ciego, aunque eso signifique perder de vista por un segundo lo que tienes enfrente.',
          cost: { energia: 6 },
          effects: [admin(6), auto(-5), counter('maniobras', 1)],
          next: 'x4',
        },
        {
          id: 'confiar',
          autopilot: true,
          text: 'Confiar en los espejos. Siempre te han bastado. Lo que no se ve, no existe.',
          effects: [auto(6), energia(3)],
          next: 'x4',
        },
        {
          id: 'mecanico',
          coraza: true,
          text: 'Virar con precisión mecánica, sin sentir el miedo. La coraza maneja bien: no tiembla.',
          effects: [energia(4), auto(3), counter('maniobras', 1)],
          next: 'x4',
        },
      ],
    },
    x4: {
      text: txt(
        'En una luz roja, la pantalla del tablero se enciende sola. Texto verde sobre negro:',
        '> Hola.\n> Soy el que maneja cuando tú no estás.\n> ¿De verdad crees que puedes tomar el volante?',
        'El examinador mira al frente, inmóvil. Los autos alrededor se congelan. El semáforo se queda en rojo. Todo se pixela, se rompe en cuadrados, y el mundo se apaga como una pantalla vieja.',
      ),
      next: '@a5_jefe',
    },
  },
}

const a5_jefe: Scene = {
  id: 'a5_jefe',
  act: 5,
  title: 'Algoritmo de Inercia',
  location: 'Interior del sistema',
  time: '--:--',
  day: 'Fuera del tiempo',
  art: 'algoritmo',
  entorno: 'interior',
  meter: { counter: 'coherencia', label: 'Coherencia del Algoritmo', max: 100 },
  onEnter: [counter('coherencia', 100)],
  start: 'b0',
  nodes: {
    b0: {
      text: txt(
        'Un lugar sin lugar. Fondo negro, cuadrícula verde, el zumbido de un monitor viejo. Frente a ti, flotando, un rostro hecho de líneas de código que se reescriben solas. Tiene tu cara. Un poco más vieja. Un poco más cansada. Muy tranquila.',
        '> ALGORITMO DE INERCIA v.legacy\n> Instalado: hace tres generaciones.\n> Autor original: desconocido. Mantenedores: tu abuelo, tu padre, tú.',
        '—No vengo a pelear —dice, con tu voz—. Vengo a explicarte por qué tengo razón.',
      ),
      next: 'b1',
    },
    b1: {
      speaker: ALGORITMO,
      text: '«Primero, los hechos. Te protegí toda la vida. Cuando tu padre no llegó a tu acto del colegio, yo te enseñé a no esperar. Cuando tu madre no dijo que algo le gustaba, yo te enseñé a no necesitar que lo dijera. ¿Y te fue mal? Tienes trabajo, un título, un posgrado en camino, cumbres. Todo lo que tienes lo construiste sin necesitar a nadie. Gracias a mí.»',
      extras: estadoAlgoritmo,
      presion: true,
      choices: [
        rendirse('b1_razon', '«…Tienes razón. Funcionó.»', 'b2'),
        {
          id: 'b1_sobrevivir',
          text: '«Funcionó para sobrevivir. Pero sobrevivir no es lo mismo que vivir, y estoy cansado de que me confundas las dos cosas.»',
          cost: { energia: 6 },
          effects: [counter('coherencia', -18), admin(4), oscuro(-3)],
          next: 'b2',
        },
        {
          id: 'b1_nino',
          requires: any(has('miedoNombrado'), has('lloro')),
          lockHint: 'haber mirado tu miedo de frente en la montaña',
          text: '«Lo que llamas protección era miedo con buena ortografía. Lo vi en la montaña. Tenía once años y nadie le explicó nada. Tú no eres un logro: eres un niño asustado que se quedó a cargo.»',
          cost: { energia: 6 },
          effects: [counter('coherencia', -28), admin(6), oscuro(-5)],
          next: 'b2',
        },
        {
          id: 'b1_teoria',
          tags: ['analisis'],
          text: 'Refutarlo con teoría: la evitación es adaptativa en contextos de baja disponibilidad parental, pero desadaptativa en la adultez, según la literatura…',
          effects: [counter('coherencia', 8), admin(4), oscuro(5)],
          next: 'b2',
        },
      ],
    },
    b2: {
      speaker: ALGORITMO,
      text: '«Segundo: probabilidades. Llevan {dia} días. Tú mismo hiciste el cálculo, en la cocina, el día siete: las relaciones con historial de rupturas tienden a romperse de nuevo. Retírate antes y ahórrate el dolor. No es frialdad. Es estadística. Te lo calculé con cariño.»',
      extras: [
        { if: has('pausaPareja'), text: '«Y mira: ya te pidió distancia una vez. Solo te estoy dando la razón antes de que llegue el final.»' },
        ...estadoAlgoritmo,
      ],
      presion: true,
      choices: [
        rendirse('b2_numeros', '«…Los números no mienten.»', 'b3'),
        {
          id: 'b2_muestra',
          tags: ['salto'],
          requires: { compare: ['confianzaAcumulada', 'fantasmasInestabilidad'] },
          text: '«Las estadísticas describen a gente que no se habló. Nosotros nos estamos hablando. Eso no estaba en tu muestra.»',
          cost: { energia: 6 },
          effects: [counter('coherencia', -22), confianza(5), fantasmas(-4)],
          next: 'b3',
        },
        {
          id: 'b2_perder',
          tags: ['salto'],
          text: '«Puede que se rompa. Prefiero perderlo habiéndolo tenido, que conservarlo sin haber estado nunca.»',
          cost: { energia: 8 },
          effects: [counter('coherencia', -15), fantasmas(-3), admin(3)],
          next: 'b3',
        },
        {
          id: 'b2_distancia',
          tags: ['regresion'],
          text: 'Asentir por dentro. Quizás deberías tomar distancia, por si acaso. Solo un poco.',
          effects: [counter('coherencia', 12), fantasmas(6), energia(4)],
          next: 'b3',
        },
      ],
    },
    b3: {
      speaker: ALGORITMO,
      text: '«Tercero: herencia. Ella va a heredar mi código de todas formas. Ya lo tiene: "no me importa", "tengo sueño". Mejor que aprenda bien a no necesitar a nadie: así nadie la va a poder herir. Es lo más amoroso que puedes hacer por ella. Enseñarle a no amar tanto.»',
      extras: estadoAlgoritmo,
      presion: true,
      choices: [
        rendirse('b3_seguro', '«…Quizás sea lo más seguro para ella.»', 'b4'),
        {
          id: 'b3_dibujo',
          tags: ['presencia', 'ancla'],
          requires: item('dibujo_hija'),
          text: 'Sacar el dibujo doblado en cuatro y mostrárselo: dos figuras en una montaña, con la boca abierta, conversando. «Ella ya está aprendiendo otra cosa. Y la está aprendiendo de mí.»',
          cost: { energia: 5 },
          effects: [counter('coherencia', -28), calidez(6), oscuro(-4)],
          next: 'b4',
        },
        {
          id: 'b3_carta',
          tags: ['presencia'],
          requires: has('cartaHija'),
          lockHint: 'haber escrito la carta en el campamento',
          text: '«Le escribí una carta. Le pedí que, si me ve frío, me lo recuerde. Tu código tiene un parche ahora, y lo va a mantener ella.»',
          cost: { energia: 5 },
          effects: [counter('coherencia', -25), calidez(5), oscuro(-4)],
          next: 'b4',
        },
        {
          id: 'b3_volver',
          tags: ['presencia'],
          requires: varMin('calidezAprendida', 55),
          text: '«No quiero que nadie la hiera; eso no lo puedo controlar. Quiero que cuando la hieran, sepa volver a alguien. Eso no se enseña con distancia.»',
          cost: { energia: 6 },
          effects: [counter('coherencia', -20), calidez(4), admin(3)],
          next: 'b4',
        },
        {
          id: 'b3_evidencia',
          tags: ['analisis'],
          text: '«Hay evidencia de que los patrones de apego pueden modificarse mediante experiencias relacionales correctivas…»',
          effects: [counter('coherencia', 8), admin(3), oscuro(5)],
          next: 'b4',
        },
      ],
    },
    b4: {
      speaker: ALGORITMO,
      text: '«Cuarto: identidad. Sin mí, ¿quién eres? Un cargo en un organigrama. Un perfil de usuario. Tus anillos, tu reloj, tus perfumes, tu música rara: cosmética. Adornos para un sistema que soy yo. Te los permito porque no cambian nada.»',
      extras: estadoAlgoritmo,
      presion: true,
      choices: [
        rendirse('b4_cosas', '«…Son solo cosas.»', 'b5'),
        {
          id: 'b4_reloj',
          tags: ['ancla'],
          requires: { equipped: 'reloj_automatico' },
          text: 'Mostrarle la muñeca. «Este reloj se mueve con mi pulso, no con tu batería. Marca mi hora, no la tuya.»',
          cost: { energia: 4 },
          effects: [counter('coherencia', -20), auto(-6), admin(3)],
          next: 'b5',
        },
        {
          id: 'b4_piedra',
          tags: ['ancla'],
          requires: item('piedra_portezuelo'),
          text: 'Abrir la mano: la piedra gris con la veta blanca. «Esto no vale nada. Lo elegí yo, arriba, donde nadie me miraba. Tú nunca has estado ahí.»',
          cost: { energia: 4 },
          effects: [counter('coherencia', -24), admin(4), oscuro(-4)],
          next: 'b5',
        },
        {
          id: 'b4_chico',
          text: '«No son adornos. Son la evidencia de que aquí hay alguien que elige, aunque sea en lo chico. Y lo chico es donde empieza el control.»',
          cost: { energia: 6 },
          effects: [counter('coherencia', -15), admin(4), auto(-4)],
          next: 'b5',
        },
      ],
    },
    b5: {
      speaker: ALGORITMO,
      text: '«Última oferta. Si me apagas, vas a sentirlo todo. Cada silencio de tu padre. Cada vez que {pareja} tarde en contestar. Cada vez que {hija} crezca un poco y te necesite un poco menos. Todo, sin filtro. ¿Estás seguro de que puedes con eso? Yo no te pido nada. Solo que me dejes manejar.»',
      extras: [
        {
          if: { counter: 'coherencia', lte: 35 },
          text: 'El rostro está lleno de grietas. La voz sigue tranquila, pero algo en ella tiembla. Está asustado. Siempre lo estuvo.',
        },
        {
          if: { counter: 'coherencia', gte: 70 },
          text: 'El rostro está intacto, nítido, casi amable. Nunca habías visto algo tan razonable.',
        },
      ],
      presion: true,
      choices: [
        {
          id: 'b5_soltar',
          autopilot: true,
          text: 'Soltar el volante. «Maneja tú.»',
          effects: [counter('coherencia', 20), auto(10), energia(5), flag('entrego')],
          next: 'b6_entrega',
        },
        {
          id: 'b5_control',
          requires: { counter: 'coherencia', lte: 35 },
          lockHint: 'Coherencia del Algoritmo ≤ 35',
          text: 'Tomar el volante. «No te voy a borrar. Me protegiste cuando nadie más lo hizo, y te lo agradezco. Pero desde hoy eres una herramienta, no el conductor. Yo manejo.»',
          cost: { energia: 8 },
          effects: [counter('coherencia', -35), admin(10), auto(-10), flag('controlManual')],
          next: 'b6_control',
        },
        {
          id: 'b5_trato',
          coraza: true,
          text: 'Aceptar un trato a medias: «Maneja tú en el trabajo. En casa manejo yo.» Un acuerdo limpio. Compartimentado.',
          effects: [energia(4), admin(2), flag('trato')],
          next: 'b6_trato',
        },
        {
          id: 'b5_intento',
          text: 'Tomar el volante igual, aunque el Algoritmo siga entero. Con las manos temblando.',
          cost: { energia: 6 },
          effects: [counter('coherencia', -15), admin(5), oscuro(-3), flag('intento')],
          next: 'b6_intento',
        },
      ],
    },
    b6_control: {
      text: txt(
        'El rostro de código te mira largo rato. Después, despacio, sonríe. No es la sonrisa tranquila de antes. Es más pequeña. Más humana.',
        '—Está bien —dice—. Pero voy a estar aquí. Por si acaso.',
        '—Lo sé —le dices—. Ese es el punto. Que estés, sin manejar.',
        '> PERMISOS DE ADMINISTRADOR: CONCEDIDOS\n> ALGORITMO_DE_INERCIA.exe → modo consultivo',
        'El mundo se recompone en píxeles. El semáforo cambia a verde.',
      ),
      next: 'b7',
    },
    b6_entrega: {
      text: txt(
        'Sueltas el volante. Se siente bien. Como dejarse caer en una cama tibia. El rostro de código asiente, satisfecho, y el mundo se recompone en píxeles ordenados, eficientes, grises.',
        'El semáforo cambia a verde. El auto avanza solo.',
      ),
      next: 'b7',
    },
    b6_trato: {
      text: txt(
        '—Trato —dice el Algoritmo. Demasiado rápido.',
        'El mundo se recompone en dos mitades limpias, como un edificio con un muro cortafuegos al medio. Una mitad tibia. Una mitad fría. Tú, en el pasillo entre las dos.',
      ),
      next: 'b7',
    },
    b6_intento: {
      text: txt(
        'Agarras el volante. El Algoritmo no se resiste: solo sigue hablando, tranquilo, dentro de tu cabeza. Las manos te tiemblan. El auto avanza a tirones, como un aprendiz. Porque eso eres.',
        'No ganaste. Pero manejaste un tramo. Y el Algoritmo, por primera vez, tuvo que mirar desde el asiento del copiloto.',
      ),
      next: 'b7',
    },
    b7: {
      text: txt(
        'El examinador tose. El tráfico vuelve a moverse. Afuera, la tarde del jueves sigue como si nada.',
        '—Estaciónese ahí, por favor —dice—. Terminamos.',
      ),
      next: '#FIN',
    },
  },
}

export const ESCENAS_ACTO_5: Scene[] = [a5_examen, a5_jefe]
