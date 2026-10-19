// ACTO 3 — INGENIERÍA INVERSA
// La UI muestra las defensas de los NPCs en tiempo real. El riesgo: volver a las personas casos clínicos.

import type { ActMeta, Scene } from '../../types/content'
import {
  addStatus,
  admin,
  adminMin,
  all,
  auto,
  calidez,
  confianza,
  dia,
  diaReset,
  drop,
  energia,
  fantasmas,
  flag,
  frialdad,
  give,
  has,
  log,
  oscuro,
  status,
  txt,
  varMax,
  varMin,
} from '../dsl'

export const ACTO_3: ActMeta = {
  number: 3,
  title: 'Ingeniería Inversa',
  subtitle: 'Ver el código de los demás es fácil. Lo difícil es no usarlo.',
  epigraph: 'Entender a alguien puede ser la forma más sofisticada de no tocarlo.',
  firstScene: 'a3_estudio',
  onEnter: [
    energia(20),
    flag('visionDefensas'),
    log('ACTUALIZACIÓN: Lector de Defensas v3.0 instalado. Las etiquetas de código fuente se leen con +15 de permisos.', 'sistema'),
    drop('pausa'),
  ],
}

const a3_estudio: Scene = {
  id: 'a3_estudio',
  act: 3,
  title: 'Carta de motivación',
  location: 'Escritorio, de noche',
  time: '23:40',
  day: 'Martes',
  art: 'estudio',
  entorno: 'interior',
  onEnter: [dia(7)],
  start: 'e1',
  nodes: {
    e1: {
      text: txt(
        'Tres semanas después. El traslado ocurrió. Fue tan caótico como esperabas y menos terrible de lo que temías.',
        'Son las 23:40. Sobre el escritorio: un libro de Anna Freud sobre los mecanismos de defensa, un manual de teoría del apego subrayado en tres colores, y la carta de motivación para el magíster en psicología, que vence el viernes.',
        'Algo cambió en tu forma de mirar. Desde hace unos días, cuando la gente habla, ves cosas debajo. Defensas. Miedos. Motivaciones. Como subtítulos que nadie más puede leer.',
        '> ACTUALIZACIÓN INSTALADA: Lector de Defensas v3.0',
        'Es fascinante. Es, también, un poco peligroso.',
      ),
      next: 'e2',
    },
    e2: {
      text: txt(
        'La carta tiene tres versiones abiertas en tres pestañas.',
        'La primera dice: «Mi experiencia en desarrollo organizacional me ha permitido observar…». Correcta. Intercambiable con la de cualquier otro postulante.',
        'La segunda dice: «Me interesa comprender los mecanismos que operan en los sistemas humanos…». Brillante. Distante. Escrita desde la galería.',
        'La tercera tiene una sola línea: «Quiero entender por qué en mi familia nadie decía lo que sentía. Y quiero que mi hija no tenga que preguntarse lo mismo.»',
      ),
      presion: true,
      choices: [
        {
          id: 'correcta',
          autopilot: true,
          text: 'Enviar la primera. Es segura. Es lo que escribe un postulante correcto.',
          effects: [auto(6), energia(4), flag('cartaCorrecta')],
          next: 'e3',
        },
        {
          id: 'analitica',
          tags: ['analisis'],
          text: 'Pulir la segunda hasta que brille. Que te admitan por tu cabeza; tu historia no es asunto de nadie.',
          effects: [admin(6), oscuro(6), flag('cartaAnalitica')],
          next: 'e3',
        },
        {
          id: 'verdadera',
          text: 'Escribir a partir de la tercera. Que la carta empiece donde empieza la pregunta real, aunque sea más difícil de defender ante un comité.',
          cost: { energia: 12 },
          effects: [admin(8), auto(-6), oscuro(-4), flag('cartaVerdadera'), drop('cuidado')],
          next: 'e3',
        },
      ],
    },
    e3: {
      text: txt(
        'A la 01:20 cierras el computador. En la pantalla negra ves tu reflejo, y por un segundo el Lector de Defensas se activa sobre tu propia cara:',
        '> DEFENSA DETECTADA: Intelectualización.\n> Función: convertir lo que duele en algo que se pueda estudiar.\n> Eficacia: alta. Costo: no especificado.',
        'Te ríes solo, en la oscuridad. Después ya no te ríes.',
      ),
      extras: [
        {
          if: has('cartaVerdadera'),
          text: 'La carta enviada termina con una frase que te costó una hora: «No vengo a aprender a analizar a otros. Vengo a aprender a estar con ellos sin esconderme detrás del análisis.»',
        },
      ],
      next: '@a3_oficina',
    },
  },
}

const a3_oficina: Scene = {
  id: 'a3_oficina',
  act: 3,
  title: 'Lector de defensas',
  location: 'Oficina nueva, edificio nuevo',
  time: '10:00',
  day: 'Miércoles',
  art: 'oficina',
  entorno: 'burocratico',
  onEnter: [dia(1), addStatus('ruidoInstitucional')],
  start: 'o1',
  nodes: {
    o1: {
      text: txt(
        'Oficina nueva, en el edificio nuevo. Ventana grande, vista a un estacionamiento. Javiera entra con los ojos rojos y una carpeta en la mano.',
        '—Perdón —dice—. Es que Hernán me devolvió el informe de Urgencia por tercera vez. Dice que tiene «mucho sentimiento». Que lo deje más técnico. —Se le quiebra la voz—. Yo solo puse lo que dijo la gente.',
        'Mientras habla, el Lector de Defensas se activa solo. Sobre ella, en tu campo visual, aparecen etiquetas.',
      ),
      sourceTags: [
        { kind: 'PATRÓN', min: 10, text: 'Necesidad de aprobación de figuras de autoridad. Pide perdón antes de hablar.' },
        { kind: 'MIEDO', min: 20, text: 'Que tener sentimientos la descalifique como profesional.' },
        { kind: 'HISTORIA', min: 40, text: 'Su padre le decía «no llores, que te pones fea». Tenía ocho años.' },
      ],
      presion: true,
      choices: [
        {
          id: 'caso',
          tags: ['analisis'],
          text: 'Leerla como un caso: rasgos ansiosos, búsqueda de validación, baja tolerancia a la crítica. Darle un consejo técnico preciso desde esa lectura.',
          effects: [admin(5), oscuro(6), flag('javieraCaso')],
          next: 'o2_caso',
        },
        {
          id: 'agua',
          text: 'Apagar el lector un momento. Cerrar la puerta, ofrecerle agua y decirle: «El informe estaba bien. El problema no es tu informe.»',
          cost: { energia: 10 },
          effects: [admin(4), oscuro(-5), flag('javieraSostenida')],
          next: 'o2_sostener',
        },
        {
          id: 'tecnico',
          autopilot: true,
          text: '«Hazle caso a Hernán. Déjalo más técnico y listo. No vale la pena la pelea.»',
          effects: [auto(6), energia(3)],
          next: 'o2_auto',
        },
      ],
    },
    o2_caso: {
      text: txt(
        'Le das un consejo impecable: cómo separar hallazgos de citas, cómo anticiparse a la objeción de Hernán. Javiera toma nota, asintiendo.',
        '—Gracias —dice. Y se va con la carpeta apretada contra el pecho, más sola de lo que llegó.',
        'Te das cuenta tarde: la trataste exactamente como Hernán trató su informe. Le quitaste el sentimiento para dejarla más técnica.',
      ),
      next: 'o3',
    },
    o2_sostener: {
      onEnter: [energia(4)],
      text: txt(
        'Javiera se sienta. Toma el agua. Llora un minuto entero, esta vez sin pedir perdón. Después se ríe, avergonzada.',
        '—Mi papá me decía que no llorara porque me ponía fea —dice, de la nada.',
        'La etiqueta ya te lo había dicho. Pero no es lo mismo leerlo que escucharlo. Leerlo es información. Escucharlo es un vínculo.',
      ),
      next: 'o3',
    },
    o2_auto: {
      text: 'Javiera asiente. Se va. A la semana siguiente entrega un informe perfectamente técnico, sin una sola cita textual. Es el mejor informe que ha hecho. Nunca más te pregunta si las cosas se van a hacer bien o rápido.',
      next: 'o3',
    },
    o3: {
      speaker: 'HERNÁN · Subdirector de Gestión de Personas',
      text: '«Te necesito en algo delicado. La directora quiere fusionar Urgencia con la Unidad de Pacientes Críticos en un solo equipo de enfermería. Marisol se va a oponer. Tú la conoces. Convéncela. Usa tus… técnicas.»',
      sourceTags: [
        { kind: 'DEFENSA', min: 20, text: 'Delegar la parte humana del problema para no tener que mirarla.' },
        { kind: 'MIEDO', min: 35, text: 'Marisol es la única persona del hospital que le dice que no en la cara. Le teme.' },
        { kind: 'MOTIVACIÓN', min: 50, text: 'Si la fusión sale, su nombre aparece en la cuenta pública.' },
      ],
      presion: true,
      choices: [
        {
          id: 'botones',
          tags: ['analisis'],
          text: 'Aceptar. Tienes el mapa completo de Marisol: su miedo a perder el control, su madre en paliativos, su cansancio. Sabes exactamente qué botones apretar.',
          effects: [admin(6), oscuro(8), flag('manipularMarisol')],
          next: 'o4_manipular',
        },
        {
          id: 'disenar',
          requires: adminMin(45),
          text: '«No voy a usar lo que sé de ella para convencerla. Pero puedo armar una conversación donde ella participe del diseño. Si la fusión es buena idea, va a sobrevivir a sus preguntas.»',
          cost: { energia: 12 },
          effects: [admin(7), auto(-5), flag('marisolRespetada'), drop('raro')],
          next: 'o4_respeto',
        },
        {
          id: 'vereque',
          autopilot: true,
          text: '«Veré qué puedo hacer.» Y hacer lo que se espera: una reunión, una presentación, un acta.',
          effects: [auto(6), energia(3)],
          next: 'o4_auto',
        },
        {
          id: 'variable',
          coraza: true,
          text: 'Aceptar el encargo como un problema técnico. Marisol es una variable. Las variables se gestionan.',
          effects: [energia(3), admin(3), flag('manipularMarisol')],
          next: 'o4_manipular',
        },
      ],
    },
    o4_manipular: {
      text: txt(
        'La reunión con Marisol dura veinte minutos. Usas cada etiqueta: le hablas de control para calmar su miedo a perderlo, mencionas «el bienestar de los que cuidan» sabiendo lo que eso le mueve. Funciona. Firma.',
        'Al salir, Marisol te mira con algo que no habías visto en ella desde aquella mediación en la sala del segundo piso: desconfianza.',
        '—Eres bueno —dice—. Ojalá supiera para quién trabajas.',
        'Ganaste. El Lector de Defensas te muestra tu propia etiqueta, sin que la pidas:',
        '> PATRÓN: Usar el entendimiento como palanca. Heredado. Eficaz.',
      ),
      next: '@a3_pareja',
    },
    o4_respeto: {
      onEnter: [energia(4)],
      text: txt(
        'Le cuentas la propuesta de frente, sin estrategia. Marisol hace once preguntas. Tres no tienen respuesta. Al final dice:',
        '—La fusión es mala idea así como está. Pero si me dejan diseñar el traspaso, la hago funcionar.',
        'Hernán va a estar molesto: no era un «sí». Era algo mejor y más incómodo: un «sí, pero en serio». Al salir, Marisol te da una palmada en el brazo. —Gracias por no hacerme el psicólogo.',
      ),
      next: '@a3_pareja',
    },
    o4_auto: {
      text: 'Haces la reunión, la presentación, el acta. Marisol dice que no. Hernán dice que insistas. La fusión entra a una mesa técnica, donde envejecerá en paz junto a todas las demás.',
      next: '@a3_pareja',
    },
  },
}

const a3_pareja: Scene = {
  id: 'a3_pareja',
  act: 3,
  title: '«Me estás estudiando»',
  location: 'Departamento, sillón',
  time: '22:00',
  day: 'Viernes',
  art: 'hogar',
  entorno: 'hogar',
  relational: 'pareja',
  onEnter: [dia(2)],
  start: 'p1',
  nodes: {
    p1: {
      text: txt(
        'Viernes. Día {dia}. {pareja} tiene la cabeza apoyada en tus piernas, en el sillón, y te cuenta algo que nunca te había contado: que cuando tenía nueve años sus padres se separaron y nadie le explicó nada. Un día su papá simplemente ya no vivía ahí, y en la casa se hablaba de él como de un mueble que se vendió.',
        'Mientras habla, el Lector de Defensas se enciende. Sobre {pareja} aparecen etiquetas, una tras otra, como notificaciones.',
      ),
      sourceTags: [
        { kind: 'HISTORIA', min: 10, text: 'Abandono no explicado en la infancia.' },
        { kind: 'PATRÓN', min: 20, text: 'Hiperalerta ante los silencios: los lee como despedidas.' },
        { kind: 'DEFENSA', min: 30, text: 'Humor para pasar rápido por lo que duele.' },
      ],
      next: 'p2',
    },
    p2: {
      text: txt(
        'Y tú, sin querer, empiezas a armar el caso: apego ansioso, sensibilidad al abandono; eso explica las rupturas anteriores, eso explica el «después te explico» de aquel jueves…',
        '{pareja} se calla. Te mira desde abajo.',
        '—Estás haciendo eso otra vez.\n—¿Qué cosa?\n—Me estás estudiando. Te estoy contando algo de cuando tenía nueve años y tú tienes la cara que pones en el trabajo.',
      ),
      sourceTags: [
        { kind: 'MIEDO', min: 15, text: 'Que lo que acaba de contar se use como dato, no como confianza.' },
        { kind: 'MOTIVACIÓN', min: 35, text: 'Te lo dice porque quiere quedarse. Si no le importara, se habría callado.' },
      ],
      presion: true,
      choices: [
        {
          id: 'defender',
          tags: ['regresion', 'analisis'],
          text: 'Defenderte con argumentos: «No te estoy estudiando, te estoy entendiendo. Es distinto.» Y explicar por qué es distinto.',
          effects: [admin(3), fantasmas(8), oscuro(4)],
          next: 'p3_defensa',
        },
        {
          id: 'admitir',
          tags: ['salto'],
          text: 'Admitirlo sin adornos: «Tienes razón. Es mi forma de estar cerca sin arriesgar nada. Si te entiendo, no me puedes sorprender. Perdón.»',
          cost: { energia: 12 },
          effects: [confianza(12), fantasmas(-8), oscuro(-5)],
          next: 'p3_salto',
        },
        {
          id: 'apagar',
          tags: ['salto'],
          requires: adminMin(50),
          text: 'Apagar el lector delante de su cara, literal: cerrar los ojos, respirar, y decir: «Cuéntame de nuevo. Esta vez te escucho a ti, no al caso.»',
          cost: { energia: 12 },
          effects: [confianza(14), fantasmas(-10), admin(4), flag('lectorApagado')],
          next: 'p3_salto',
        },
        {
          id: 'cansado',
          autopilot: true,
          text: '«Perdón, estoy cansado.» Es una frase que siempre funciona, porque no significa nada.',
          effects: [auto(5), fantasmas(5), energia(3)],
          next: 'p3_auto',
        },
      ],
    },
    p3_defensa: {
      text: txt(
        'Hablas cuatro minutos. Es un buen argumento: entender no es estudiar, el conocimiento acerca, etcétera. {pareja} escucha sin interrumpir. Al final se sienta, lejos de tus piernas.',
        '—Ganaste —dice—. No sé qué, pero ganaste.',
        'Se va a acostar. Tú te quedas en el sillón, con la razón intacta y las piernas frías.',
      ),
      next: 'p4',
    },
    p3_salto: {
      onEnter: [energia(7)],
      text: txt(
        '{pareja} no se mueve por un rato. Después te toma la mano y la pone sobre su pecho, donde el corazón va rápido.',
        '—Esto no se entiende —dice—. Esto se siente. ¿Puedes con eso?',
        'No sabes. Pero te quedas. Y {pareja} termina de contar la historia: el papá que se fue, la mamá que no explicó, los años esperando que alguien dijera algo. Esta vez no armas ningún caso. Solo escuchas a alguien que quieres.',
      ),
      next: 'p4',
    },
    p3_auto: {
      text: '—Ya —dice {pareja}. Se incorpora y se sienta en el otro extremo del sillón. Ponen una película. Ninguno de los dos la ve.',
      next: 'p4',
    },
    p4: {
      text: 'Medianoche. Día {dia}. El contador sigue corriendo, pero ya no es un contador: es una casa que se construye o se desarma, ladrillo por ladrillo, en conversaciones como esta.',
      nextIf: [
        { if: all(varMin('fantasmasInestabilidad', 75), varMax('confianzaAcumulada', 35)), next: 'p5_pausa' },
      ],
      next: '@a3_hija',
    },
    p5_pausa: {
      onEnter: [diaReset(), flag('pausaPareja'), log('Sincronización Fase Beta en pausa. Día 0.', 'vinculo')],
      text: txt(
        'Al día siguiente llega un mensaje largo de {pareja}. Lo lees tres veces. La parte importante está al final:',
        '«No me estoy yendo. Pero necesito unos días. Siento que contigo siempre estoy a prueba, y yo ya pasé mucho tiempo a prueba en mi vida. Cuando puedas estar, no entender, avísame.»',
        'El contador del sistema parpadea y se reinicia.',
        '> SINCRONIZACIÓN FASE BETA: EN PAUSA. Día 0.',
      ),
      next: '@a3_hija',
    },
  },
}

const a3_hija: Scene = {
  id: 'a3_hija',
  act: 3,
  title: 'La emoción que cuesta',
  location: 'Plaza del barrio',
  time: '10:30',
  day: 'Sábado',
  art: 'plaza',
  entorno: 'hogar',
  relational: 'hija',
  onEnter: [dia(1)],
  start: 'j1',
  nodes: {
    j1: {
      text: txt(
        'Plaza del barrio, sábado en la mañana. {hija} se columpia sin ganas, arrastrando los pies en la tierra. Tiene una tarea para el lunes: «Escribe sobre una emoción que te cuesta expresar». Lleva toda la mañana dándole vueltas.',
        '—¿Cuál es la tuya? —te pregunta de pronto—. La emoción que te cuesta.',
        'El Lector de Defensas se activa sobre ella, servicial. Y entonces lo ves: podrías analizar a tu hija. Tienes las herramientas. Sería tan fácil.',
      ),
      sourceTags: [
        { kind: 'PATRÓN', min: 10, text: 'Pregunta por ti para no tener que responder ella primero.' },
        { kind: 'MIEDO', min: 25, text: 'Que su emoción difícil sea la misma que la tuya, y que no tenga arreglo.' },
        { kind: 'MOTIVACIÓN', min: 40, text: 'Quiere permiso. Si tú puedes decirlo, ella también.' },
      ],
      presion: true,
      choices: [
        {
          id: 'clase',
          tags: ['analisis'],
          text: 'Responder como especialista: «Bueno, las emociones difíciles suelen ser las que en la familia no se validaron…» y darle una pequeña clase.',
          effects: [admin(4), frialdad(7), oscuro(4)],
          next: 'j2_clase',
        },
        {
          id: 'tristeza',
          tags: ['presencia'],
          text: 'Responder como su papá, con la verdad: «La tristeza. Me cuesta mostrarla. Aprendí que había que guardarla, y a veces se me olvida dónde la guardé.»',
          cost: { energia: 12 },
          effects: [calidez(14), frialdad(-8), oscuro(-4), give('dibujo_hija')],
          next: 'j2_verdad',
        },
        {
          id: 'tranquilo',
          autopilot: true,
          text: '«Ninguna, yo soy bien tranquilo. ¿Y la tuya?»',
          effects: [auto(5), frialdad(6), energia(3)],
          next: 'j2_auto',
        },
        {
          id: 'columpio',
          tags: ['presencia'],
          visibleIf: status('sentidosAbiertos'),
          text: 'Sentarte en el columpio de al lado y columpiarte tú también, alto, ridículo, hasta que ella se ría. Después contestar, sin aire: «La tristeza. ¿Y la tuya?»',
          cost: { energia: 10 },
          effects: [calidez(16), frialdad(-8), auto(-4), give('dibujo_hija')],
          next: 'j2_verdad',
        },
      ],
    },
    j2_clase: {
      text: txt(
        '{hija} escucha con atención. Al final asiente y dice:',
        '—Ya. Voy a poner que la mía es la rabia. —Pausa—. Igual no te voy a contar por qué.',
        'Y sigue columpiándose, sola, con la tarea resuelta y la puerta cerrada. Igual a como cerrabas tú.',
      ),
      next: 'j3',
    },
    j2_verdad: {
      onEnter: [energia(7)],
      text: txt(
        '{hija} deja de columpiarse. Te mira con los ojos muy abiertos, como si le hubieras mostrado algo prohibido.',
        '—La mía es la misma —dice, muy bajito—. Cuando estoy triste digo que tengo sueño.',
        'Se ríen los dos, porque es ridículo y porque es verdad. Después ella hace la tarea en tu libreta, ahí mismo. La titula «La tristeza que se esconde». En la última línea escribe: «Mi papá también la esconde, pero la está buscando.» En el reverso dibuja dos figuras en una montaña de crayón, dobla la hoja en cuatro y te la pasa.',
      ),
      next: 'j3',
    },
    j2_auto: {
      text: txt(
        '—La mía tampoco —dice ella. Y se baja del columpio.',
        'Lo dijo igual que tú. Exactamente igual. Con la misma entonación.',
      ),
      next: 'j3',
    },
    j3: {
      text: txt(
        'De vuelta a casa, {hija} camina adelante, saltándose las líneas de la vereda. De pronto se da vuelta:',
        '—¿Me vas a llevar a la montaña algún día? Dijiste que este verano.',
        'Lo dijiste, sí. El verano pasado también.',
      ),
      choices: [
        {
          id: 'prometo',
          tags: ['presencia'],
          text: '«Primero voy a ir yo, este fin de semana, a conocer la ruta. Y en febrero vamos juntos. Te lo prometo, y esta vez lo anoto.»',
          cost: { energia: 6 },
          effects: [calidez(8), frialdad(-3), flag('promesaMontana')],
          next: '@a4_sendero',
        },
        {
          id: 'depende',
          autopilot: true,
          text: '«Vamos a ver, depende del trabajo.»',
          effects: [auto(5), frialdad(5), energia(2)],
          next: '@a4_sendero',
        },
        {
          id: 'solo',
          text: '«Este fin de semana voy a ir solo. Necesito desconectarme de todo.» Es verdad. También suena a huida.',
          effects: [oscuro(4), energia(5), frialdad(2)],
          next: '@a4_sendero',
        },
      ],
    },
  },
}

export const ESCENAS_ACTO_3: Scene[] = [a3_estudio, a3_oficina, a3_pareja, a3_hija]
