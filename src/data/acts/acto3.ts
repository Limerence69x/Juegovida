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
  hasNot,
  lector,
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
    lector(true),
    log('ACTUALIZACIÓN: Lector de Defensas v3.0 instalado. Muestra el subtexto de todos en tiempo real (+15 de lectura). En el trabajo es una herramienta; frente a quien quieres, tiene un costo.', 'sistema'),
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
  onEnter: [dia(14)],
  start: 'e1',
  nodes: {
    e1: {
      text: txt(
        'Dos semanas después del traslado. Fue tan caótico como esperabas y menos terrible de lo que temías.',
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
          subtext: 'GUION PRECARGADO · Ser admitido por ser intercambiable.',
          autopilot: true,
          text: 'Enviar la primera. Es segura. Es lo que escribe un postulante correcto.',
          effects: [auto(6), energia(4), flag('cartaCorrecta')],
          next: 'e3',
        },
        {
          id: 'analitica',
          subtext: 'INTELECTUALIZACIÓN · Una carta escrita desde la galería: brillante, intocable, sin nadie adentro.',
          tags: ['analisis'],
          text: 'Pulir la segunda hasta que brille. Que te admitan por tu cabeza; tu historia no es asunto de nadie.',
          effects: [admin(6), oscuro(6), flag('cartaAnalitica')],
          next: 'e3',
        },
        {
          id: 'verdadera',
          subtext: 'ELECCIÓN PROPIA · Empezar donde empieza la pregunta real. Más difícil de defender; imposible de fingir.',
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
          subtext: 'LADO OSCURO · El Lector convierte a Javiera en un diagnóstico. Acertado. Inútil para ella.',
          tags: ['analisis'],
          text: 'Leerla como un caso: rasgos ansiosos, búsqueda de validación, baja tolerancia a la crítica. Darle un consejo técnico preciso desde esa lectura.',
          effects: [admin(5), oscuro(6), flag('javieraCaso')],
          next: 'o2_caso',
        },
        {
          id: 'agua',
          subtext: 'PRESENCIA · Apagar la lectura para poder escuchar. Ves menos; ella se siente vista.',
          text: 'Apagar el lector un momento. Cerrar la puerta, ofrecerle agua y decirle: «El informe estaba bien. El problema no es tu informe.»',
          cost: { energia: 10 },
          effects: [admin(4), oscuro(-5), lector(false), flag('javieraSostenida')],
          next: 'o2_sostener',
        },
        {
          id: 'tecnico',
          subtext: 'GUION PRECARGADO · Enseñar a quitarles el sentimiento a los informes, y después a las personas.',
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
          subtext: 'LADO OSCURO · Usar lo que sabes de alguien como palanca. Funciona. Ese es el peligro.',
          tags: ['analisis'],
          text: 'Aceptar. Tienes el mapa completo de Marisol: su miedo a perder el control, su madre en paliativos, su cansancio. Sabes exactamente qué botones apretar.',
          effects: [admin(6), oscuro(8), flag('manipularMarisol')],
          next: 'o4_manipular',
        },
        {
          id: 'disenar',
          subtext: 'ELECCIÓN PROPIA · Que tu entendimiento la incluya en vez de manejarla.',
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
      next: '@a3_entrevista',
    },
    o4_respeto: {
      onEnter: [energia(4)],
      text: txt(
        'Le cuentas la propuesta de frente, sin estrategia. Marisol hace once preguntas. Tres no tienen respuesta. Al final dice:',
        '—La fusión es mala idea así como está. Pero si me dejan diseñar el traspaso, la hago funcionar.',
        'Hernán va a estar molesto: no era un «sí». Era algo mejor y más incómodo: un «sí, pero en serio». Al salir, Marisol te da una palmada en el brazo. —Gracias por no hacerme el psicólogo.',
      ),
      next: '@a3_entrevista',
    },
    o4_auto: {
      text: 'Haces la reunión, la presentación, el acta. Marisol dice que no. Hernán dice que insistas. La fusión entra a una mesa técnica, donde envejecerá en paz junto a todas las demás.',
      next: '@a3_entrevista',
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
  onEnter: [dia(1)],
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
          subtext: 'IMPULSO DE REGRESIÓN · Ganar la discusión sobre si estás presente, en vez de estar presente.',
          tags: ['regresion', 'analisis'],
          text: 'Defenderte con argumentos: «No te estoy estudiando, te estoy entendiendo. Es distinto.» Y explicar por qué es distinto.',
          effects: [admin(3), fantasmas(8), oscuro(4)],
          next: 'p3_defensa',
        },
        {
          id: 'admitir',
          subtext: 'SALTO DE FE · Reconocer el mecanismo delante de quien lo sufre.',
          tags: ['salto'],
          text: 'Admitirlo sin adornos: «Tienes razón. Es mi forma de estar cerca sin arriesgar nada. Si te entiendo, no me puedes sorprender. Perdón.»',
          cost: { energia: 12 },
          effects: [confianza(12), fantasmas(-8), oscuro(-5)],
          next: 'p3_salto',
        },
        {
          id: 'apagar',
          subtext: 'SALTO DE FE · Apagar el Lector delante de su cara. Ver menos para estar más.',
          tags: ['salto'],
          requires: adminMin(50),
          text: 'Apagar el lector delante de su cara, literal: cerrar los ojos, respirar, y decir: «Cuéntame de nuevo. Esta vez te escucho a ti, no al caso.»',
          cost: { energia: 12 },
          effects: [confianza(14), fantasmas(-10), admin(4), lector(false), flag('lectorApagado')],
          next: 'p3_salto',
        },
        {
          id: 'cansado',
          subtext: 'GUION PRECARGADO · Una frase que siempre funciona porque no significa nada.',
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
      next: '@a3_seminario',
    },
    p5_pausa: {
      onEnter: [diaReset(), flag('pausaPareja'), log('Sincronización Fase Beta en pausa. Día 0.', 'vinculo')],
      text: txt(
        'Al día siguiente llega un mensaje largo de {pareja}. Lo lees tres veces. La parte importante está al final:',
        '«No me estoy yendo. Pero necesito unos días. Siento que contigo siempre estoy a prueba, y yo ya pasé mucho tiempo a prueba en mi vida. Cuando puedas estar, no entender, avísame.»',
        'El contador del sistema parpadea y se reinicia.',
        '> SINCRONIZACIÓN FASE BETA: EN PAUSA. Día 0.',
      ),
      next: '@a3_seminario',
    },
  },
}

const a3_hija: Scene = {
  id: 'a3_hija',
  act: 3,
  title: 'La emoción que cuesta',
  location: 'Plaza del barrio',
  time: '13:30',
  day: 'Sábado',
  art: 'plaza',
  entorno: 'hogar',
  relational: 'hija',
  start: 'j1',
  nodes: {
    j1: {
      text: txt(
        'Plaza del barrio, sábado pasado el mediodía. {hija} se columpia sin ganas, arrastrando los pies en la tierra. Tiene una tarea para el lunes: «Escribe sobre una emoción que te cuesta expresar». Lleva toda la mañana dándole vueltas.',
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
          subtext: 'INTELECTUALIZACIÓN · Contestarle como especialista le enseña que las emociones se explican, no se dicen.',
          tags: ['analisis'],
          text: 'Responder como especialista: «Bueno, las emociones difíciles suelen ser las que en la familia no se validaron…» y darle una pequeña clase.',
          effects: [admin(4), frialdad(7), oscuro(4)],
          next: 'j2_clase',
        },
        {
          id: 'tristeza',
          subtext: 'PRESENCIA · Si tú puedes decirlo, ella también.',
          tags: ['presencia'],
          text: 'Responder como su papá, con la verdad: «La tristeza. Me cuesta mostrarla. Aprendí que había que guardarla, y a veces se me olvida dónde la guardé.»',
          cost: { energia: 12 },
          effects: [calidez(14), frialdad(-8), oscuro(-4), give('dibujo_hija')],
          next: 'j2_verdad',
        },
        {
          id: 'tranquilo',
          subtext: 'GUION PRECARGADO · Negar la emoción con tono amable. Ella va a copiar el tono.',
          autopilot: true,
          text: '«Ninguna, yo soy bien tranquilo. ¿Y la tuya?»',
          effects: [auto(5), frialdad(6), energia(3)],
          next: 'j2_auto',
        },
        {
          id: 'columpio',
          subtext: 'PERCEPCIÓN ABIERTA · Ridículo y exacto: el cuerpo primero, la respuesta después.',
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
          subtext: 'PRESENCIA · Una promesa anotada es una promesa con fecha.',
          tags: ['presencia'],
          text: '«Primero voy a ir yo, este fin de semana, a conocer la ruta. Y en febrero vamos juntos. Te lo prometo, y esta vez lo anoto.»',
          cost: { energia: 6 },
          effects: [calidez(8), frialdad(-3), flag('promesaMontana')],
          next: '@a3_padre',
        },
        {
          id: 'depende',
          subtext: 'GUION PRECARGADO · La misma frase del verano pasado.',
          autopilot: true,
          text: '«Vamos a ver, depende del trabajo.»',
          effects: [auto(5), frialdad(5), energia(2)],
          next: '@a3_padre',
        },
        {
          id: 'solo',
          subtext: 'ELECCIÓN PROPIA · Necesitas la montaña. Ella escucha «solo».',
          text: '«Este fin de semana voy a ir solo. Necesito desconectarme de todo.» Es verdad. También suena a huida.',
          effects: [oscuro(4), energia(5), frialdad(2)],
          next: '@a3_padre',
        },
      ],
    },
  },
}

const a3_entrevista: Scene = {
  id: 'a3_entrevista',
  act: 3,
  title: 'Entrevista de admisión',
  location: 'Facultad de Psicología, tercer piso',
  time: '18:30',
  day: 'Jueves',
  art: 'despacho',
  entorno: 'interior',
  onEnter: [dia(1)],
  start: 'en1',
  nodes: {
    en1: {
      text: txt(
        'Jueves, 18:30. Facultad de Psicología, tercer piso: un pasillo con olor a café recalentado y diarios murales de congresos que ya pasaron.',
        'La entrevista de admisión es en el despacho de la doctora Ximena Ruiz, coordinadora del magíster. Estantes hasta el techo, una planta que alguien riega con disciplina, dos sillas iguales frente a frente. Ninguna detrás de un escritorio.',
        'Ella tiene tu carta impresa sobre las rodillas, con anotaciones en lápiz grafito.',
      ),
      extras: [
        { if: has('cartaVerdadera'), text: 'Subrayó una sola frase: la de tu hija.' },
        { if: has('cartaAnalitica'), text: 'Hay un signo de interrogación al margen de tu párrafo más brillante.' },
        { if: has('cartaCorrecta'), text: 'No subrayó nada. Eso te inquieta más que cualquier corrección.' },
      ],
      next: 'en2',
    },
    en2: {
      speaker: 'DRA. XIMENA RUIZ · Coordinadora del magíster',
      text: '«Su carta está bien escrita. Eso no me dice mucho: todas están bien escritas. Le voy a hacer una sola pregunta y quiero que la conteste sin preparar la respuesta. ¿Qué hace usted con lo que entiende de las personas?»',
      sourceTags: [
        { kind: 'MOTIVACIÓN', min: 25, text: 'Busca alumnos capaces de tolerar no entender. Los brillantes le preocupan más que los mediocres.' },
        { kind: 'DEFENSA', min: 40, text: 'Hace preguntas abiertas para no mostrar qué respuesta quiere. Es una técnica; también es una forma de esconderse.' },
        { kind: 'HISTORIA', min: 55, text: 'Dejó la clínica después de perder a un paciente. Nunca supo si lo había entendido demasiado o demasiado poco.' },
      ],
      presion: true,
      choices: [
        {
          id: 'competencias',
          autopilot: true,
          text: 'Responder con el lenguaje de las competencias: «Lo transformo en intervenciones organizacionales que mejoran el clima y la productividad de los equipos.»',
          subtext: 'GUION PRECARGADO · La respuesta de tu cargo, no la tuya.',
          effects: [auto(6), energia(3)],
          next: 'en3_plano',
        },
        {
          id: 'mapa',
          tags: ['analisis'],
          text: 'Mostrarle lo bien que lees: describir con precisión su técnica de entrevista, por qué no hay escritorio, qué busca con la pregunta.',
          subtext: 'INTELECTUALIZACIÓN · Lucirte leyéndola es contestar exactamente lo que preguntó, sin darte cuenta.',
          effects: [admin(5), oscuro(6)],
          next: 'en3_mapa',
        },
        {
          id: 'confesar',
          text: 'Contestar la verdad incómoda: «A veces lo uso para acercarme. Y a veces, para no tener que acercarme. Todavía no sé distinguir cuándo es cuál. Por eso estoy aquí.»',
          subtext: 'ELECCIÓN PROPIA · Mostrar el mecanismo en vez de lucirlo. Es lo único que no se puede preparar.',
          cost: { energia: 12 },
          effects: [admin(8), oscuro(-6), auto(-3), flag('confesoEntrevista')],
          next: 'en3_verdad',
        },
        {
          id: 'devolver',
          requires: adminMin(55),
          text: 'Notar que la pregunta también es suya, y devolverla con cuidado: «¿Y usted? ¿Qué hizo con lo que entendió de sus pacientes?»',
          subtext: 'INGENIERÍA INVERSA · Usar lo que viste para encontrarla, no para ganarle. La línea es delgada.',
          cost: { energia: 10 },
          effects: [admin(10), oscuro(-3), flag('devolvioPregunta')],
          next: 'en3_devolver',
        },
      ],
    },
    en3_plano: {
      onEnter: [flag('admisionCondicional')],
      text: txt(
        'La doctora Ruiz anota algo. Una sola palabra, corta. Te agradece. La entrevista dura once minutos más, todos correctos.',
        'En el ascensor te das cuenta de que contestaste como Hernán habría querido que contestaras. Ella no buscaba a Hernán. Tu admisión queda «en evaluación».',
      ),
      next: '@a3_pareja',
    },
    en3_mapa: {
      onEnter: [flag('admitido')],
      text: txt(
        'Hablas cuatro minutos. Es un análisis preciso, casi elegante. Cuando terminas, ella sonríe con algo parecido a la tristeza.',
        '—Muy bien visto —dice—. Ahora dígame qué sintió mientras me analizaba.',
        'No sabes qué contestar. Ella anota algo y cierra la carpeta. —Lo vamos a admitir —dice—. Pero le voy a pedir algo: el primer año, intente equivocarse más.',
      ),
      next: '@a3_pareja',
    },
    en3_verdad: {
      onEnter: [flag('admitido'), energia(6)],
      text: txt(
        'La doctora Ruiz deja el lápiz. Te mira largo rato, sin anotar nada.',
        '—Esa es la única respuesta que me importa este año —dice—. La mayoría viene a aprender a entender a otros. Usted viene a aprender a no esconderse detrás de lo que entiende. Eso no se enseña. Pero se puede acompañar.',
        'En la puerta agrega, casi para sí misma: —El sábado hay un caso en la jornada de inducción. Le va a costar. Venga igual.',
      ),
      next: '@a3_pareja',
    },
    en3_devolver: {
      onEnter: [flag('admitido')],
      text: txt(
        'Hay un silencio largo. Por un momento ves la etiqueta temblar sobre su cara, como si el Lector también dudara.',
        '—Me fui —dice al fin—. Dejé la clínica. Entendí todo de un paciente y no me sirvió de nada. —Se acomoda los lentes—. Es usted la primera persona que me lo pregunta en una entrevista de admisión. No sé si es un mérito o un problema.',
        'Cierra la carpeta. —Admitido. Los dos vamos a tener que tener cuidado.',
      ),
      next: '@a3_pareja',
    },
  },
}

const a3_seminario: Scene = {
  id: 'a3_seminario',
  act: 3,
  title: 'Caso M.',
  location: 'Sala 304, jornada de inducción',
  time: '09:00',
  day: 'Sábado',
  art: 'aula',
  entorno: 'interior',
  onEnter: [dia(1)],
  start: 's1',
  nodes: {
    s1: {
      text: txt(
        'Sábado, 09:00. Jornada de inducción del magíster: veintidós personas en sillas universitarias de brazo abatible, casi todas con la cara de quien trabajó la semana entera. Una psicóloga de CESFAM, dos profesores de colegio, una trabajadora social que se presenta como Rocío y se sienta a tu lado con un termo de té.',
        'La doctora Ruiz reparte una hoja:',
        '> CASO M. Hombre adulto. Consulta por «cansancio».\n> Padre emocionalmente ausente. Madre controladora.\n> Pareja con rupturas recurrentes. Una hija.\n> Refiere que «funciona bien».',
        'Lo lees dos veces. Te arde la cara.',
      ),
      extras: [
        {
          if: has('admisionCondicional'),
          text: 'Vienes como oyente: tu admisión sigue «en evaluación». Te sientas en la última fila, por si acaso.',
        },
      ],
      next: 's2',
    },
    s2: {
      speaker: 'DRA. XIMENA RUIZ',
      text: '«Quiero hipótesis. ¿Qué le pasa a M.? ¿Por qué funciona tan bien?»',
      sourceTags: [
        { kind: 'PATRÓN', min: 20, text: 'Elige un caso así cada año, para ver quién se reconoce y qué hace con eso.' },
        { kind: 'MOTIVACIÓN', min: 35, text: 'No le interesa la mejor hipótesis. Quiere ver quién habla del caso como si M. estuviera en la sala.' },
      ],
      presion: true,
      choices: [
        {
          id: 'brillar',
          tags: ['analisis'],
          text: 'Levantar la mano primero y desarmar el caso entero: apego evitativo, parentificación, intelectualización como defensa principal. Diez minutos sin pausa.',
          subtext: 'INTELECTUALIZACIÓN · Hablar de M. con tanta precisión que nadie note que hablas de ti. Ni tú.',
          effects: [admin(7), oscuro(8), flag('brilloSeminario')],
          next: 's3_brillo',
        },
        {
          id: 'apuntes',
          autopilot: true,
          text: 'Quedarte callado. Tomar apuntes. Que hablen los demás; tú ya lo sabes todo.',
          subtext: 'GUION PRECARGADO · Observar desde la última fila, como siempre.',
          effects: [auto(5), energia(3)],
          next: 's3_callar',
        },
        {
          id: 'me_pasa',
          text: 'Levantar la mano y decir lo que te pasa, no lo que sabes: «Me cuesta analizarlo. Se parece demasiado a alguien que conozco.»',
          subtext: 'ELECCIÓN PROPIA · Entrar al caso por la puerta de adentro. Es exactamente lo que esta sala vino a aprender.',
          cost: { energia: 12 },
          effects: [admin(6), oscuro(-7), auto(-3), flag('sintioSeminario')],
          next: 's3_sentir',
        },
        {
          id: 'la_hija',
          tags: ['presencia'],
          visibleIf: status('sentidosAbiertos'),
          text: 'Notar lo que nadie en la sala nota: el caso dice «una hija» y nadie la ha mencionado. Preguntar por ella.',
          subtext: 'PERCEPCIÓN ABIERTA · Ver al personaje que el caso usa de decorado.',
          cost: { energia: 8 },
          effects: [admin(7), calidez(4), oscuro(-4)],
          next: 's3_hija',
        },
      ],
    },
    s3_brillo: {
      text: txt(
        'Cuando terminas hay un silencio admirado. Un profesor de colegio anota tus palabras. La doctora Ruiz asiente despacio.',
        '—Impecable —dice—. Una pregunta, nada más: ¿y M. qué siente?',
        'Abres la boca. No hay nada ahí. Tienes el mapa entero y ningún territorio.',
        'Rocío, a tu lado, murmura sin mirarte: —Hablaste de él como si fuera una máquina.',
      ),
      next: 's4',
    },
    s3_callar: {
      text: txt(
        'Los demás hablan. Rocío dice que M. le recuerda a su padre. La psicóloga del CESFAM dice que «funciona bien» es la frase más triste del caso. Tú anotas todo, con buena letra.',
        'Al final de la hoja, sin darte cuenta, escribiste otra cosa: «M. no está cansado. M. está solo.» La tachas antes de que alguien la vea.',
      ),
      next: 's4',
    },
    s3_sentir: {
      onEnter: [energia(6)],
      text: txt(
        'La sala se queda en silencio. No es el silencio admirado de cuando alguien brilla; es otro, más tibio. Rocío deja el termo en el suelo.',
        '—A mí también —dice—. Por eso estudié trabajo social. Para entender a mi papá sin tener que hablarle.',
        'La doctora Ruiz no comenta nada. Pero el resto de la mañana, cada vez que alguien empieza a hablar de M. como un caso, pregunta: «¿Y qué le pasa a usted con eso?». Lo hace con todos. Empezó contigo.',
      ),
      next: 's4',
    },
    s3_hija: {
      text: txt(
        '—La hija —repite la doctora Ruiz—. Tiene razón. Nadie la nombró. —Mira a la sala—. Llevamos cuarenta minutos hablando de un hombre que funciona bien y nadie preguntó qué está aprendiendo la niña de mirarlo funcionar.',
        'Rocío te mira con algo parecido al respeto. Tú miras la hoja. «Una hija.» Dos palabras. Diez años.',
      ),
      next: 's4',
    },
    s4: {
      speaker: 'ROCÍO · Trabajadora social',
      text: 'En el recreo, Rocío te ofrece té de su termo. «¿Puedo decirte algo? Tienes cara de estar leyendo a todo el mundo. Es agotador mirarte. Debe ser más agotador ser tú.»',
      sourceTags: [
        { kind: 'DEFENSA', min: 15, text: 'Dice las cosas de frente para que nadie alcance a leerla primero.' },
        { kind: 'HISTORIA', min: 35, text: 'Su padre era carabinero. Aprendió a leer el humor de la casa por el ruido de las botas en la entrada.' },
      ],
      presion: true,
      choices: [
        {
          id: 'sonreir',
          autopilot: true,
          text: 'Sonreír, agradecerle el té y desviar la conversación hacia los horarios del magíster.',
          subtext: 'GUION PRECARGADO · Amabilidad como cortina: nadie puede reclamarle nada a quien sonríe.',
          effects: [auto(5), energia(3)],
          next: 's5',
        },
        {
          id: 'reconocer',
          tags: ['salto'],
          text: 'Reconocerlo: «Sí. Me cuesta apagarlo.» Y apagar el Lector ahí mismo, con ella mirando.',
          subtext: 'SALTO DE FE · Mostrarle a una desconocida el mecanismo, y desconectarlo delante de ella.',
          cost: { energia: 8 },
          effects: [admin(4), oscuro(-6), lector(false), flag('rocioAmiga')],
          next: 's5',
        },
        {
          id: 'leerla',
          tags: ['analisis'],
          text: 'Devolverle la lectura: decirle lo que el Lector dice de ella. Es justo, después de todo.',
          subtext: 'LADO OSCURO · Convertir la intimidad en un duelo de diagnósticos. Ganas. Te quedas sin compañera.',
          effects: [admin(4), oscuro(7)],
          next: 's5_leerla',
        },
      ],
    },
    s5_leerla: {
      text: txt(
        'Se lo dices: su padre, las botas, la manera de hablar rápido para no ser leída. Aciertas en todo. Lo sabes porque se le borra la cara.',
        '—Ya —dice Rocío, y guarda el termo—. Qué bueno eres.',
        'El resto de la jornada se sienta en otra fila.',
      ),
      next: 's5',
    },
    s5: {
      text: 'La jornada termina a las 13:00. En la reja de la facultad tienes un mensaje de {hija}: «¿Me pasas a buscar a la plaza? La mamá de la Antonia se tiene que ir.»',
      extras: [
        {
          if: has('rocioAmiga'),
          text: 'Rocío te alcanza en la salida y te pasa un papel con su número. —Para cuando necesites a alguien que no te lea —dice—. Yo tampoco sé apagarlo, pero lo intento.',
        },
      ],
      next: '@a3_hija',
    },
  },
}

const a3_padre: Scene = {
  id: 'a3_padre',
  act: 3,
  title: 'Papá llama',
  location: 'Cocina, de noche · Código Legacy',
  time: '21:30',
  day: 'Sábado',
  art: 'llamada',
  entorno: 'legacy',
  relational: 'legacy',
  start: 'pa1',
  nodes: {
    pa1: {
      text: txt(
        'Sábado, 21:30. El celular suena con un nombre que casi nunca aparece en tu pantalla: «Papá». No recuerdas la última vez que tu padre te llamó por iniciativa propia. Quizás nunca.',
        '—Aló —dice, como si fuera él quien contesta—. Era para avisarte. Me van a poner un stent el jueves. Nada grave. Tu mamá dice que te avise.',
      ),
      extras: [
        {
          if: all(has('subioPadre'), hasNot('padreRadio')),
          text: 'El día del traslado subiste tres pisos para verlo antes de su examen. Ninguno de los dos lo ha mencionado. Quizás por eso llama él.',
        },
        {
          if: has('faltoPadre'),
          text: 'El día del traslado no subiste. Ninguno de los dos lo ha mencionado. Quizás por eso llama él, y no tu madre.',
        },
      ],
      sourceTags: [
        { kind: 'PATRÓN', min: 10, text: '«Tu mamá dice que te avise»: pedir sin hacerse cargo del pedido.' },
        { kind: 'MIEDO', min: 25, text: 'Es la primera vez que le van a meter algo en el corazón. Tiene miedo y no tiene palabras para el miedo.' },
        { kind: 'HISTORIA', min: 45, text: 'Su padre murió a los sesenta y dos. A él le faltan cuatro meses para cumplirlos.' },
      ],
      presion: true,
      choices: [
        {
          id: 'datos_stent',
          autopilot: true,
          text: 'Preguntar los datos: hora, médico, si necesita que lo lleven. Ser útil. Ser rápido.',
          subtext: 'GUION PRECARGADO · La logística como forma de cariño que no expone a nadie.',
          effects: [auto(5), oscuro(4), energia(3)],
          next: 'pa2',
        },
        {
          id: 'clinico',
          tags: ['analisis'],
          text: 'Escucharlo con el Lector: ansiedad desplazada, identificación con el padre muerto, negación. Darle, con mucha calma, la información médica que necesita para tranquilizarse.',
          subtext: 'INTELECTUALIZACIÓN · Atender a tu padre como a un paciente. Es lo más cerca que has estado de él, y aun así es lejos.',
          effects: [admin(4), oscuro(7)],
          next: 'pa2_clinico',
        },
        {
          id: 'tienes_miedo',
          text: 'Apagar el Lector y preguntarle lo único que importa: «Papá, ¿tienes miedo?»',
          subtext: 'GASTAR PERMISOS · Dejar de leerlo para poder escucharlo.',
          cost: { permisos: 10, energia: 10 },
          effects: [oscuro(-8), lector(false), flag('preguntoMiedoPadre')],
          next: 'pa2_miedo',
        },
        {
          id: 'voy_jueves',
          text: '«El jueves voy contigo. No te estoy preguntando.»',
          subtext: 'GASTAR PERMISOS · Responder al pedido que no hizo, con el idioma de los hechos, que es el único que él habla.',
          cost: { permisos: 6, energia: 8 },
          effects: [oscuro(-5), auto(-3), flag('acompanaStent')],
          next: 'pa2_jueves',
        },
      ],
    },
    pa2: {
      text: txt(
        'Te da los datos. Anotas. Él dice «bueno» tres veces, que en su idioma significa que la conversación terminó.',
        '—Bueno, eso era —dice—. Saludos a la niña.',
        'Corta. La llamada duró un minuto cuarenta. Fue la más larga del año.',
      ),
      next: '@a4_sendero',
    },
    pa2_clinico: {
      text: txt(
        'Le explicas el procedimiento con calma profesional: anestesia local, una noche en observación, tasas de complicación bajísimas. Él escucha en silencio.',
        '—Hablas como doctor —dice al final. No sabes si es orgullo o distancia. Probablemente él tampoco.',
      ),
      next: '@a4_sendero',
    },
    pa2_miedo: {
      onEnter: [energia(4)],
      text: txt(
        'La línea se queda en silencio tanto rato que miras la pantalla para ver si se cortó. No se cortó.',
        '—Un poco —dice tu padre. Y después, más bajo—: Mi papá no llegó a los sesenta y tres.',
        'Es la frase más larga que te ha dicho sobre su padre en toda tu vida. No la arreglas. No le das estadísticas. Te quedas en la línea, escuchándolo respirar, hasta que dice «bueno» y corta. Esta vez el «bueno» suena distinto.',
      ),
      next: '@a4_sendero',
    },
    pa2_jueves: {
      text: txt(
        '—No es necesario —dice tu padre, rápido.',
        '—Ya sé —le dices—. Voy igual.',
        'Una pausa. Del otro lado se escucha la tele encendida y a tu madre preguntando algo. Tu padre le contesta tapando el teléfono, pero lo oyes igual: —Que va a ir. Que no me está preguntando.',
        'Lo dice con algo que, en otro hombre, sería orgullo.',
      ),
      next: '@a4_sendero',
    },
  },
}

export const ESCENAS_ACTO_3: Scene[] = [a3_estudio, a3_oficina, a3_entrevista, a3_pareja, a3_seminario, a3_hija, a3_padre]
