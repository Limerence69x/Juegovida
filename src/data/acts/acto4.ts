// ACTO 4 — DESCONEXIÓN DE LA RED
// Trekking. Gestión de ritmo, soledad y vaciado de memoria caché. El campamento nocturno.

import type { ActMeta, Scene } from '../../types/content'
import {
  admin,
  adminMin,
  any,
  auto,
  calidez,
  confianza,
  counter,
  dia,
  drop,
  energia,
  fantasmas,
  flag,
  give,
  has,
  log,
  oscuro,
  removeStatus,
  txt,
} from '../dsl'

export const ACTO_4: ActMeta = {
  number: 4,
  title: 'Desconexión de la Red',
  subtitle: 'Sin señal. Sin cargo. Sin nadie a quien imitar.',
  epigraph: 'Arriba no hay a quién demostrarle nada. Por eso cuesta tanto subir.',
  firstScene: 'a4_sendero',
  onEnter: [
    energia(20),
    auto(-10),
    removeStatus('ruidoInstitucional'),
    removeStatus('ansiedad'),
    log('SIN SEÑAL. Conexión con la red: 0%. Conexión con el sistema: en evaluación.', 'sistema'),
  ],
}

const a4_sendero: Scene = {
  id: 'a4_sendero',
  act: 4,
  title: 'Sin servicio',
  location: 'Inicio del sendero, cajón cordillerano',
  time: '06:30',
  day: 'Domingo',
  art: 'sendero',
  entorno: 'montana',
  onEnter: [dia(4)],
  start: 's1',
  nodes: {
    s1: {
      text: txt(
        'Cajón cordillerano, 06:30. Un amigo te dejó en el inicio del sendero —todavía no puedes manejar hasta aquí— y se fue levantando polvo.',
        'Frío seco. El estero suena como estática, pero es la estática más limpia que has escuchado en meses. Revisas el celular por costumbre: SIN SERVICIO.',
        'Tu pulgar se queda un segundo sobre la pantalla, buscando algo que actualizar. No hay nada. Por primera vez en años, nadie te puede necesitar.',
        'Por delante, once kilómetros y mil cien metros de desnivel hasta el portezuelo. Lo primero es decidir el ritmo.',
      ),
      choices: [
        {
          id: 'kpi',
          autopilot: true,
          text: 'Ritmo de rendimiento: GPS en la muñeca, velocidad promedio, comparar con tu tiempo del año pasado. La montaña como indicador de gestión.',
          effects: [auto(6), energia(4)],
          next: 's2',
        },
        {
          id: 'sostenido',
          text: 'Ritmo sostenido: el que permite conversar, aunque no haya con quién. Respirar por la nariz. Mirar.',
          cost: { energia: 5 },
          effects: [admin(5), auto(-5)],
          next: 's2',
        },
        {
          id: 'lento',
          text: 'Ritmo lento, casi contemplativo: detenerte cada vez que algo te llame la atención, aunque llegues de noche al campamento.',
          cost: { energia: 8 },
          effects: [admin(7), auto(-6), oscuro(-2), drop('montana'), flag('ritmoLento')],
          next: 's2',
        },
        {
          id: 'huida',
          text: 'Ritmo de huida: rápido, sin mirar atrás, como si algo te persiguiera desde la ciudad.',
          effects: [oscuro(5), energia(3), auto(-2)],
          next: 's2',
        },
      ],
    },
    s2: {
      text: txt(
        'Kilómetro cuatro. El sendero sube entre litres y quillayes y después se abre a una ladera de pasto amarillo. Tu cuerpo encuentra su propia cadencia.',
        'Y entonces empieza algo extraño: tu mente, sin estímulos nuevos, empieza a escupir archivos viejos. Fragmentos de conversaciones. Frases. Como un computador que, al desconectarse de la red, por fin tiene tiempo de mostrar lo que guardaba en caché.',
        '> VACIADO DE MEMORIA CACHÉ INICIADO\n> 3 archivos encontrados.',
      ),
      extras: [
        {
          if: has('ritmoLento'),
          text: 'Te detuviste once veces. Una lagartija, un cóndor muy alto, el olor del boldo cuando lo rozas. Ninguna parada fue productiva. Todas fueron tuyas.',
        },
      ],
      next: '@a4_acarreo',
    },
  },
}

const a4_acarreo: Scene = {
  id: 'a4_acarreo',
  act: 4,
  title: 'Vaciado de caché',
  location: 'Pendiente de acarreo, 3.100 m',
  time: '11:15',
  day: 'Domingo',
  art: 'acarreo',
  entorno: 'montana',
  start: 'c1',
  nodes: {
    c1: {
      text: txt(
        'Pendiente de acarreo. Cada paso hacia arriba se desliza medio paso hacia abajo. Es la parte más dura del ascenso y la más silenciosa: no queda aire para pensar en palabras.',
        'Y en ese silencio aparece el primer archivo:',
        '> cache/trabajo/punto_de_encuentro.wav\n> «Entiendo perfectamente ambas posturas. Busquemos un punto de encuentro.»\n> Reproducciones: 1.204',
      ),
      choices: [
        {
          id: 'borrar1',
          text: 'Borrarlo. No la frase —puede ser útil— sino el reflejo automático de decirla. Que la próxima vez sea una elección.',
          cost: { energia: 8 },
          effects: [auto(-10), admin(5), counter('cache', 1)],
          next: 'c2',
        },
        {
          id: 'conservar1',
          autopilot: true,
          text: 'Conservarlo. Funciona. Te ha sacado de cien reuniones. Un buen profesional no borra sus herramientas.',
          effects: [auto(5), energia(4)],
          next: 'c2',
        },
        {
          id: 'clasificar1',
          tags: ['analisis'],
          text: 'Analizar el archivo en vez de borrarlo: origen, función, utilidad. Clasificarlo con cuidado y devolverlo a su carpeta.',
          effects: [admin(4), oscuro(4)],
          next: 'c2',
        },
      ],
    },
    c2: {
      text: txt(
        'Una piedra se suelta bajo tu bota y rueda cuesta abajo durante un rato largo. Te quedas quieto, con el corazón en la garganta. Cuando se calma, aparece el segundo archivo:',
        '> cache/legacy/no_llores.wav\n> «No llores, que no es para tanto.»\n> Voz: tu padre. Fecha: desconocida. Reproducciones: incontables.\n> Última reproducción: cuando Javiera lloró en tu oficina.',
      ),
      presion: true,
      choices: [
        {
          id: 'borrar2',
          text: 'Borrarlo. Cuesta: el archivo está enganchado a cosas que sostienen otras cosas. Borrarlo igual.',
          cost: { energia: 12 },
          effects: [oscuro(-8), auto(-6), counter('cache', 1), flag('borroNoLlores')],
          next: 'c3',
        },
        {
          id: 'reescribir2',
          requires: adminMin(40),
          text: 'No borrarlo: reescribirlo. Reemplazar la línea por la que te habría gustado escuchar —«Llora lo que necesites. Aquí estoy.»— y guardarla con tu voz.',
          cost: { energia: 12 },
          effects: [oscuro(-10), calidez(6), admin(4), counter('cache', 1), flag('reescribioNoLlores')],
          next: 'c3',
        },
        {
          id: 'saltar2',
          autopilot: true,
          text: 'Saltarlo. Hay archivos que es mejor no abrir a tres mil metros.',
          effects: [auto(4), oscuro(4), energia(3)],
          next: 'c3',
        },
      ],
    },
    c3: {
      text: txt(
        'Casi en el filo, el tercer archivo. Este no tiene voz. Es un archivo de texto, corto, que no recuerdas haber escrito:',
        '> cache/propio/si_no_espero_nada.txt\n> «Si no espero nada de nadie, nadie me puede fallar.»\n> Autor: tú. Edad al escribirlo: aproximadamente once años.',
        'Once. Un año más que {hija}.',
      ),
      presion: true,
      choices: [
        {
          id: 'desinstalar3',
          text: 'Leerlo con la ternura que habrías querido para ese niño de once años. No borrarlo de golpe: agradecerle que te protegió y desinstalarlo despacio.',
          cost: { energia: 12 },
          effects: [oscuro(-10), admin(6), counter('cache', 1), flag('miedoNombrado')],
          next: '@a4_portezuelo',
        },
        {
          id: 'base3',
          autopilot: true,
          text: 'Dejarlo donde está. Es la base del sistema; si lo sacas, quizás se cae todo.',
          effects: [auto(4), oscuro(5), energia(4)],
          next: '@a4_portezuelo',
        },
        {
          id: 'ejecutar3',
          coraza: true,
          text: 'Dejarlo, y además ejecutarlo: seguir subiendo sin esperar nada, ni la cumbre. Es tan liviano no esperar.',
          effects: [energia(5), auto(2)],
          next: '@a4_portezuelo',
        },
      ],
    },
  },
}

const a4_portezuelo: Scene = {
  id: 'a4_portezuelo',
  act: 4,
  title: 'Nadie mirando',
  location: 'Portezuelo, 3.480 m',
  time: '15:40',
  day: 'Domingo',
  art: 'portezuelo',
  entorno: 'montana',
  start: 'pz1',
  nodes: {
    pz1: {
      text: txt(
        'El portezuelo. Viento que corta, un cielo tan azul que parece falso, y al otro lado otro valle, y otro, y la cordillera repitiéndose hacia el este como un pensamiento que no termina.',
        'Nadie te ve. No hay cargo que cumplir, ni hija que te observe, ni pareja que te lea, ni padres que te inspeccionen. Por primera vez en mucho tiempo, no estás actuando para nadie.',
        '¿Quién eres cuando nadie te está mirando?',
      ),
      extras: [
        {
          if: { counter: 'cache', gte: 2 },
          text: 'Te sientes liviano. No feliz, exactamente: liviano. Como un disco duro después de una limpieza.',
        },
      ],
      choices: [
        {
          id: 'piedra',
          tags: ['ancla'],
          text: 'Recoger una piedra del portezuelo, una cualquiera, gris con una veta blanca. Algo que no vale nada y que nadie te puede quitar.',
          cost: { energia: 4 },
          effects: [admin(4), auto(-3), give('piedra_portezuelo')],
          next: 'pz2',
        },
        {
          id: 'foto',
          autopilot: true,
          text: 'Sacar la foto de cumbre, la misma de siempre, para cuando vuelva la señal. Pose, sonrisa, horizonte.',
          effects: [auto(5), energia(3)],
          next: 'pz2',
        },
        {
          id: 'existir',
          text: 'Sentarte en el viento y no hacer nada. Ni foto, ni piedra, ni pensamiento útil. Diez minutos de existir sin función.',
          cost: { energia: 6 },
          effects: [admin(6), auto(-6), oscuro(-3), drop('montana')],
          next: 'pz2',
        },
      ],
    },
    pz2: {
      onEnter: [energia(3)],
      text: 'Bajas hacia el campamento con la luz de la tarde a la espalda. Tu sombra va adelante, larga, como si supiera el camino mejor que tú.',
      next: '@a4_campamento',
    },
  },
}

const a4_campamento: Scene = {
  id: 'a4_campamento',
  act: 4,
  title: 'Campamento nocturno',
  location: 'Vega alta, 2.900 m',
  time: '21:40',
  day: 'Domingo',
  art: 'campamento',
  entorno: 'montana',
  start: 'k1',
  nodes: {
    k1: {
      text: txt(
        'Campamento junto a una vega, a 2.900 metros. La carpa armada, la cocinilla ronroneando, las estrellas apareciendo de a una y después de a mil.',
        'Sin máscaras sociales. Sin cargos que imitar. Solo tú, el frío, y lo que estaba esperando suficiente silencio para hablar.',
        'Viene sin aviso, como vienen las cosas importantes. Una imagen: {hija} a los tres años, con fiebre, dormida sobre tu pecho. Y el pensamiento que tuviste esa noche y que nunca le contaste a nadie: «Si la quiero así, la puedo perder así.»',
      ),
      next: 'k2',
    },
    k2: {
      text: txt(
        'Y entonces el miedo se presenta completo, con su lógica impecable:',
        '> Si te acercas, ella va a ver tus fallas.\n> Si ve tus fallas, va a aprender a necesitarte menos.\n> Si te necesita menos, la vas a perder.\n> Mejor no acercarse tanto. Así, cuando se vaya, no va a doler.',
        'Es la misma lógica que usaste con {pareja}. Es la que usó tu padre contigo. Es un algoritmo, y lleva tres generaciones ejecutándose.',
      ),
      presion: true,
      choices: [
        {
          id: 'llorar',
          text: 'Dejar que el miedo esté, sin discutirle. Llorar, si viene. Viene.',
          cost: { energia: 12 },
          effects: [oscuro(-10), admin(6), flag('lloro')],
          next: 'k3_llanto',
        },
        {
          id: 'carta',
          tags: ['presencia'],
          text: 'Sacar la libreta y escribirle una carta a {hija}, para cuando tenga edad de entenderla. Decirle lo que tu padre nunca te dijo.',
          cost: { energia: 12 },
          effects: [calidez(10), oscuro(-6), flag('cartaHija')],
          next: 'k3_carta',
        },
        {
          id: 'teoria',
          tags: ['analisis'],
          text: 'Desarmar el miedo con teoría: apego evitativo, transmisión intergeneracional, sesgo de anticipación. Entenderlo tan bien que ya no haga falta sentirlo.',
          effects: [admin(5), oscuro(8)],
          next: 'k3_teoria',
        },
        {
          id: 'saco',
          autopilot: true,
          text: 'Meterte al saco de dormir y pensar en el trabajo del lunes. Es un dolor conocido. Se maneja.',
          effects: [auto(6), energia(4)],
          next: 'k3_auto',
        },
      ],
    },
    k3_llanto: {
      onEnter: [energia(8)],
      text: txt(
        'Lloras como no llorabas desde… no sabes desde cuándo. Con ruido, con el cuerpo entero. Las estrellas no hacen nada al respecto. Eso es lo mejor de las estrellas.',
        'Cuando termina, estás vacío y tibio. El miedo sigue ahí, pero más chico. Ya no es un algoritmo. Es solo un miedo: algo que sientes, no algo que eres.',
      ),
      next: 'k4',
    },
    k3_carta: {
      onEnter: [energia(6)],
      text: txt(
        'Escribes con la linterna frontal y los dedos entumecidos:',
        '«Hija: tengo miedo de quererte tanto. Mi papá también lo tenía, creo, y por eso se quedó lejos. Yo no quiero quedarme lejos. Si alguna vez me ves frío, no es porque no te quiera. Es porque me asusté y se me olvidó. Recuérdamelo.»',
        'Doblas la hoja en cuatro. Igual que ella dobla sus dibujos.',
      ),
      next: 'k4',
    },
    k3_teoria: {
      text: txt(
        'Armas el modelo completo. Es brillante. Explica tu infancia, la de tu padre, la de {hija}, la de {pareja}. Todo encaja.',
        'Lo terminas a las once de la noche y te das cuenta de que estás temblando. No de frío. Entendiste todo y no sentiste nada, y el miedo sigue exactamente del mismo tamaño; solo que ahora tiene bibliografía.',
      ),
      next: 'k4',
    },
    k3_auto: {
      text: 'Piensas en la planilla del lunes, en el correo de Hernán, en la reunión de las nueve. El miedo se retira, educado, a esperar su próxima oportunidad. Siempre tiene otra.',
      next: 'k4',
    },
    k4: {
      text: txt(
        'Antes de dormir, por la ranura de la carpa, ves pasar una estrella fugaz. No pides nada. O sí, pero no con palabras.',
        '> SISTEMA: Proceso de fondo detectado.\n> Nombre: ALGORITMO_DE_INERCIA.exe\n> Estado: consciente de ser observado.',
      ),
      next: '@a4_descenso',
    },
  },
}

const a4_descenso: Scene = {
  id: 'a4_descenso',
  act: 4,
  title: 'Vuelve la señal',
  location: 'Última curva antes del camino',
  time: '13:00',
  day: 'Lunes',
  art: 'sendero',
  entorno: 'montana',
  onEnter: [dia(1)],
  start: 'd1',
  nodes: {
    d1: {
      text: txt(
        'Bajada. A las 13:00, en la última curva antes del camino, el celular vuelve a la vida con un temblor histérico: 47 correos, 112 mensajes, 6 llamadas perdidas.',
        'Y en medio del alud, tres cosas: un audio de {hija}, de cuarenta segundos. Un mensaje de {pareja}. Un correo de Hernán con asunto «URGENTE (2)».',
      ),
      extras: [
        { if: has('pausaPareja'), text: 'El mensaje de {pareja} es el primero en días. Dice solo: «¿Cómo estuvo la montaña?»' },
      ],
      choices: [
        {
          id: 'audio',
          tags: ['presencia'],
          text: 'El audio de {hija} primero. Sentado en una piedra, con el volumen al máximo.',
          cost: { energia: 4 },
          effects: [calidez(6), auto(-3)],
          next: 'd2_hija',
        },
        {
          id: 'mensaje',
          tags: ['salto'],
          text: 'El mensaje de {pareja} primero, y responder antes de leer nada más: «Volví. Pensé mucho en ti allá arriba.»',
          cost: { energia: 6 },
          effects: [confianza(8), fantasmas(-5)],
          next: 'd2_pareja',
        },
        {
          id: 'urgente',
          autopilot: true,
          text: 'El correo de Hernán. Es urgente. Lo urgente siempre gana.',
          effects: [auto(7), energia(2)],
          next: 'd2_trabajo',
        },
      ],
    },
    d2_hija: {
      onEnter: [energia(6)],
      text: txt(
        '«Papá, ¿llegaste a la cumbre? Yo hice la tarea de la emoción y la profesora me puso un siete y una carita. Ya, chao. Ah, y la Antonia ahora es mi amiga. Chao.»',
        'Lo escuchas cuatro veces. La cuarta vez te ríes en el mismo lugar que la primera.',
      ),
      extras: [
        {
          if: any(has('promesaMontana'), has('cartaHija')),
          text: 'Antes de guardar el celular, le respondes con un audio propio. Te tiembla un poco la voz. La dejas temblar.',
        },
      ],
      next: '@a5_examen',
    },
    d2_pareja: {
      onEnter: [energia(6)],
      text: '{pareja} responde en menos de un minuto, porque también estaba esperando con el celular en la mano: «Qué bueno que volviste. Yo también pensé en ti. ¿Comemos hoy? Te tengo que contar algo bueno.»',
      extras: [
        { if: has('pausaPareja'), text: 'Y después, otro: «Creo que ya puedo hablar. ¿Tú?»' },
      ],
      next: '@a5_examen',
    },
    d2_trabajo: {
      text: '«URGENTE (2): Se requiere actualizar indicadores de traslado antes del miércoles.» Lo lees en la última curva de la montaña, con el portezuelo todavía a la espalda. Respondes antes de llegar al camino. El sistema te recibe de vuelta con los brazos abiertos. Es lo único que siempre los tiene abiertos.',
      next: '@a5_examen',
    },
  },
}

export const ESCENAS_ACTO_4: Scene[] = [a4_sendero, a4_acarreo, a4_portezuelo, a4_campamento, a4_descenso]
