// ACTO 2 — CHOQUE DE ARQUITECTURAS
// Traslado a un nuevo recinto hospitalario. Parches vs. cultura. Semana 1 en riesgo. Visita legacy.

import type { ActMeta, Scene } from '../../types/content'
import {
  addStatus,
  admin,
  adminMin,
  all,
  any,
  auto,
  calidez,
  confianza,
  dia,
  drop,
  energia,
  fantasmas,
  flag,
  frialdad,
  give,
  has,
  hasNot,
  item,
  oscuro,
  status,
  txt,
} from '../dsl'

export const ACTO_2: ActMeta = {
  number: 2,
  title: 'Choque de Arquitecturas',
  subtitle: 'Mudar un edificio es fácil. Mudar a la gente que lo habita, no.',
  epigraph: 'Ningún plan de gestión del cambio tiene una columna para el duelo.',
  firstScene: 'a2_traslado',
  onEnter: [energia(20), drop('pausa')],
}

const a2_traslado: Scene = {
  id: 'a2_traslado',
  act: 2,
  title: 'Cronograma adelantado',
  location: 'Unidad de Desarrollo Organizacional',
  time: '07:55',
  day: 'Martes',
  art: 'oficina',
  entorno: 'burocratico',
  presionTiempo: true,
  onEnter: [dia(1), addStatus('ruidoInstitucional'), addStatus('ansiedad')],
  start: 't1',
  nodes: {
    t1: {
      text: txt(
        'El correo llega a las 07:43, con copia a cuarenta personas y asunto en mayúsculas: «URGENTE: ADELANTO CRONOGRAMA TRASLADO NUEVO RECINTO».',
        'El traslado al hospital nuevo se adelanta tres semanas. Razón: «compromisos ministeriales». Lo que eran dos meses para preparar a ochocientos funcionarios a cambiar de edificio, de rutas, de vestidores y de compañeros de turno, ahora son cinco semanas.',
        'A las 07:55 Hernán ya está en tu puerta.',
      ),
      next: 't2',
    },
    t2: {
      speaker: 'HERNÁN · Subdirector de Gestión de Personas',
      text: '«Necesito el plan de gestión del cambio para el jueves. Algo concreto: charlas, afiches, un video motivacional, el logo del hospital nuevo en todas partes. La directora quiere que la gente sienta que esto es una oportunidad.»',
      extras: [
        { if: has('hernanAliado'), text: 'Baja la voz: «Y tú y yo sabemos que eso no alcanza. Pero dame algo que pueda mostrar.»' },
      ],
      sourceTags: [
        { kind: 'DEFENSA', min: 20, text: 'Gestión del cambio como decoración: si se ve bien, nadie pregunta si funciona.' },
        { kind: 'MIEDO', min: 35, text: 'Sabe que el traslado va a salir mal y quiere tener evidencia de que «se hizo todo lo posible».' },
        { kind: 'MOTIVACIÓN', min: 50, text: 'Ya no cree en nada de esto. Le quedan cuatro años para jubilar y los está contando.' },
      ],
      presion: true,
      choices: [
        {
          id: 'plantilla',
          subtext: 'GUION PRECARGADO · Reutilizar el plan anterior es reutilizar sus errores. Nadie te va a pedir cuentas: ese es el atractivo.',
          autopilot: true,
          text: '«Lo tienes el jueves.» Plantilla del traslado anterior, cambiar fechas y logo. Afiches con gente sonriendo en un hospital que todavía no existe.',
          effects: [auto(8), energia(4), flag('parcheBurocratico')],
          next: 't3',
        },
        {
          id: 'duelo',
          subtext: 'ELECCIÓN PROPIA · Defender lo que no se mide en un informe. Te va a costar crédito político.',
          text: '«Te propongo otra cosa: antes de los afiches, escuchar a los equipos. Qué pierden con el traslado, no solo qué ganan. Un plan que no escucha el duelo se rompe en la primera semana.»',
          cost: { energia: 10 },
          effects: [admin(7), auto(-6), flag('protegerCultura')],
          next: 't3',
        },
        {
          id: 'dobleplan',
          subtext: 'INGENIERÍA INVERSA · Darle a su miedo lo que necesita para que tu plan real pueda existir.',
          requires: adminMin(30),
          text: 'Negociar con su miedo, no con su pedido: «Te armo las dos cosas. Los afiches para el Ministerio y un plan real para la gente. Si sale mal, vas a tener evidencia de que lo previmos.»',
          cost: { energia: 10 },
          effects: [admin(8), auto(-4), flag('protegerCultura'), flag('dobleplan'), drop('rutina')],
          next: 't3',
        },
        {
          id: 'maquina',
          coraza: true,
          text: 'Aceptar sin pestañear. Producir el plan como una máquina: eficiente, impecable, sin preguntarte a quién le duele.',
          effects: [admin(2), auto(4)],
          next: 't3',
        },
      ],
    },
    t3: {
      text: txt(
        'Tu equipo es pequeño: tú y Javiera, analista, veintisiete años, dos en el Servicio. Lee el correo del traslado con la cara de alguien que todavía cree que los correos describen la realidad.',
        '—¿Esto lo vamos a hacer bien o lo vamos a hacer rápido? —te pregunta.',
        'No es una pregunta retórica. Te está preguntando qué tipo de profesional va a ser ella. Y la respuesta la va a aprender de lo que hagas, no de lo que digas.',
      ),
      sourceTags: [
        { kind: 'MIEDO', min: 20, text: 'Que este trabajo la convierta en alguien que hace afiches para tapar renuncias.' },
        { kind: 'MOTIVACIÓN', min: 35, text: 'Eligió salud pública porque su abuela murió esperando en un pasillo.' },
      ],
      presion: true,
      choices: [
        {
          id: 'rapido',
          subtext: 'GUION PRECARGADO · Enseñarle a Javiera lo que a ti te enseñaron. La primera lección es la que más dura.',
          autopilot: true,
          text: '«Rápido. Así funciona esto. Ya vas a aprender.»',
          effects: [auto(6), energia(3), flag('javieraDesilusion')],
          next: '@a2_almuerzo',
        },
        {
          id: 'bien',
          subtext: 'ELECCIÓN PROPIA · Mostrarle con hechos qué clase de profesional se puede ser aquí.',
          text: '«Las dos cosas no siempre se pueden. Esta vez vamos a intentar hacerlo bien, y te voy a necesitar para eso.»',
          cost: { energia: 8 },
          effects: [admin(5), auto(-3), flag('javieraAliada')],
          next: 't4_javiera',
        },
        {
          id: 'kotter',
          subtext: 'INTELECTUALIZACIÓN · Una respuesta impecable a una pregunta que no hizo.',
          tags: ['analisis'],
          text: 'Responderle con un marco teórico: Kotter, Lewin, la curva del duelo. Que aprenda la teoría; la pregunta de fondo no la contestas.',
          effects: [admin(4), oscuro(4)],
          next: '@a2_almuerzo',
        },
      ],
    },
    t4_javiera: {
      onEnter: [energia(3)],
      text: txt(
        'Javiera sonríe, un poco sorprendida. —Bueno —dice—. Entonces partamos por Urgencia. Ahí es donde más va a doler.',
        'Le pasas el informe de clima. Ella ve el 61% y no dice nada. Después abre un documento nuevo y escribe un título: «Lo que se pierde». Lo deja ahí, en blanco, como una pregunta.',
      ),
      extras: [
        {
          if: has('informeMaquillado'),
          text: 'Antes de cerrar, mira el informe que enviaste ayer, con su gráfico de torta. No dice nada. No hace falta.',
        },
      ],
      next: '@a2_almuerzo',
    },
  },
}

const a2_almuerzo: Scene = {
  id: 'a2_almuerzo',
  act: 2,
  title: 'Hora de colación',
  location: 'Relojería de calle San Diego',
  time: '13:10',
  day: 'Martes',
  art: 'relojeria',
  entorno: 'transito',
  presionTiempo: true,
  start: 'al1',
  nodes: {
    al1: {
      relational: 'pareja',
      text: txt(
        'Hora de almuerzo. En tu escritorio hay un táper con arroz frío y treinta correos nuevos sobre el traslado. En tu celular, dos cosas: un aviso de la relojería —«Su reloj está listo para retiro»— y un mensaje de {pareja}: «¿Te puedo llamar un ratito? Nada grave.»',
        'Hace tres semanas dejaste tu reloj automático en mantención. Fue lo único que compraste con tu primer sueldo de profesional. Nadie te lo regaló; en tu familia nadie regalaba cosas que significaran algo.',
      ),
      presion: true,
      choices: [
        {
          id: 'pantalla',
          subtext: 'GUION PRECARGADO · Lo urgente desplaza lo importante en silencio, sin que tengas que decidirlo.',
          autopilot: true,
          text: 'Almorzar frente a la pantalla y responder correos. El reloj puede esperar; {pareja} también.',
          effects: [auto(6), energia(2), fantasmas(3)],
          next: 'al2_escritorio',
        },
        {
          id: 'reloj',
          subtext: 'ANCLA · Recuperar algo que marca tu hora y no la del sistema.',
          tags: ['ancla'],
          text: 'Caminar las cuatro cuadras hasta la relojería. Recuperar algo que marca tu hora y no la del sistema.',
          cost: { energia: 6 },
          effects: [auto(-5), admin(3), give('reloj_automatico')],
          next: 'al2_reloj',
        },
        {
          id: 'llamar',
          subtext: 'SALTO DE FE · «Nada grave» casi nunca significa nada. Llegar antes de que tenga que pedirlo.',
          tags: ['salto'],
          text: 'Llamar a {pareja} antes que nada. «Nada grave» también puede ser algo.',
          cost: { energia: 8 },
          effects: [confianza(7), fantasmas(-4), flag('llamadaAlmuerzo')],
          next: 'al2_llamada',
        },
      ],
    },
    al2_escritorio: {
      text: 'Arroz frío, correos tibios. A las 13:45 te das cuenta de que no recuerdas haber comido. {pareja} no vuelve a escribir. Eso, de alguna forma, es peor que si hubiera insistido.',
      next: '@a2_recinto',
    },
    al2_reloj: {
      onEnter: [energia(3)],
      text: txt(
        'La relojería es un local angosto, con un señor de lupa en el ojo y cuarenta relojes marcando horas levemente distintas. Te entrega el tuyo envuelto en una franela.',
        '—Estaba bien —dice—. Solo necesitaba que alguien lo moviera. Los automáticos se paran si nadie los usa.',
        'Te lo pones. El segundero arranca, empujado por el movimiento de tu propia muñeca. Afuera, en la vereda, le escribes a {pareja}: «Te llamo a las seis. Prometido.»',
      ),
      next: '@a2_recinto',
    },
    al2_llamada: {
      onEnter: [energia(6)],
      relational: 'pareja',
      text: txt(
        '{pareja} contesta al primer tono.',
        '—Nada grave, de verdad —dice—. Es que hoy desperté con miedo. Sin razón. Pensé que si te escuchaba un rato se me pasaba.',
        'Hablan siete minutos. De nada importante: un perro que vio en la calle, el olor del metro a esta hora. Cuando cortas, el arroz sigue frío y los correos siguen ahí. Pero el día cambió de temperatura.',
        'El reloj tendrá que esperar.',
      ),
      next: '@a2_recinto',
    },
  },
}

const a2_recinto: Scene = {
  id: 'a2_recinto',
  act: 2,
  title: 'Edificio nuevo, gente vieja',
  location: 'Nuevo recinto hospitalario, piso de Urgencia',
  time: '16:00',
  day: 'Miércoles',
  art: 'recinto',
  entorno: 'burocratico',
  presionTiempo: true,
  onEnter: [dia(1)],
  start: 're1',
  nodes: {
    re1: {
      text: txt(
        'El nuevo recinto huele a pintura y a silicona. Pasillos anchos, luz blanca, puertas que se abren solas. Es objetivamente mejor que el edificio viejo. Nadie que va a trabajar aquí parece contento.',
        'Recorres el piso de Urgencia con Marisol y Patricio. Detrás, arrastrando los pies, viene don Ramón, auxiliar de servicio, treinta y ocho años en el hospital viejo. Se detiene frente a una pared blanca, enorme, sin nada.',
      ),
      extras: [{ if: has('marisolVista'), text: 'Marisol camina a tu lado, no adelante. Es una diferencia mínima. La notas.' }],
      next: 're2',
    },
    re2: {
      speaker: 'DON RAMÓN · Auxiliar de servicio',
      text: '«Allá en el viejo sabíamos dónde llorar. Había una escalera de emergencia que nadie usaba, la del ala norte. Ahí llorábamos todos, los doctores también. Aquí no hay dónde. Todo es de vidrio.»',
      sourceTags: [
        { kind: 'HISTORIA', min: 15, text: 'En esa escalera se enteró de la muerte de su esposa, por teléfono, en medio de un turno.' },
        { kind: 'MOTIVACIÓN', min: 30, text: 'No está pidiendo una escalera. Está pidiendo que alguien reconozca que lo que se pierde es real.' },
      ],
      presion: true,
      choices: [
        {
          id: 'salapausa',
          subtext: 'GUION PRECARGADO · Responder a una pérdida con mobiliario.',
          autopilot: true,
          text: '«Don Ramón, el edificio nuevo tiene una sala de pausa saludable con sillones ergonómicos. Está en el plan.»',
          effects: [auto(7), energia(3), flag('ramonIgnorado')],
          next: 're3',
        },
        {
          id: 'escalera',
          subtext: 'PRESENCIA · Dejar que el cronograma se atrase por una historia que nadie más va a escuchar.',
          text: 'Quedarte frente a la pared con él. Preguntarle por la escalera. Escuchar la historia entera, aunque el recorrido se atrase.',
          cost: { energia: 10 },
          effects: [admin(6), auto(-5), flag('ramonEscuchado'), drop('cuidado')],
          next: 're3_escucha',
        },
        {
          id: 'ritual',
          requires: adminMin(28),
          text: 'Proponer en voz alta un ritual de cierre: que cada equipo se despida del edificio viejo, con tiempo protegido y sin afiches. Que el duelo tenga lugar antes que la mudanza.',
          cost: { energia: 12 },
          effects: [admin(9), auto(-6), flag('ritualCierre'), drop('cuidado')],
          next: 're3_ritual',
        },
        {
          id: 'objetos',
          visibleIf: status('sentidosAbiertos'),
          text: 'Notar el olor del lugar —pintura, plástico, nada vivido— y proponer algo absurdo y exacto: que cada funcionario traiga un objeto del hospital viejo para dejarlo aquí.',
          cost: { energia: 8 },
          effects: [admin(7), auto(-7), flag('ritualCierre'), flag('objetosViejos')],
          next: 're3_ritual',
        },
        {
          id: 'seguir',
          coraza: true,
          text: 'Recordar que tu trabajo es el plan, no las lágrimas de un auxiliar. Mirar el reloj de la pared y seguir el recorrido.',
          effects: [energia(3), auto(3)],
          next: 're3',
        },
      ],
    },
    re3: {
      text: txt(
        'El recorrido sigue. Don Ramón se queda atrás, mirando la pared blanca. Marisol anota algo sobre la ubicación de los carros de paro. Patricio pregunta por los lockers.',
        'Al salir, sin querer, te encuentras buscando con la mirada una escalera de emergencia. Hay una. Tiene cámaras.',
      ),
      next: '@a2_mensaje',
    },
    re3_escucha: {
      onEnter: [energia(4)],
      text: txt(
        'Don Ramón habla doce minutos. De su esposa, de la escalera, de un doctor joven que una vez se sentó a llorar con él y que ahora es jefe de servicio y ya no lo saluda. Marisol y Patricio se quedan. Nadie mira el celular.',
        'Al final, don Ramón se seca la cara con la manga, sin vergüenza. —Gracias, mijo. Nadie pregunta por las escaleras.',
        'En tu libreta, en el plan de gestión del cambio, escribes una línea que no estaba: «Identificar lugares de refugio informal. No se pueden mudar, pero se pueden reconocer.»',
      ),
      next: '@a2_mensaje',
    },
    re3_ritual: {
      onEnter: [energia(4)],
      text: txt(
        'Hay un silencio incómodo. Patricio es el primero: —Yo me sumo. Mis cabros necesitan despedirse. Marisol duda, mira a don Ramón y asiente.',
        'Hernán va a preguntar cuánto cuesta. Cuesta tiempo, que en el Servicio es lo único más caro que la plata. Vas a tener que pelearlo. Pero hoy, en un pasillo que huele a pintura, el plan de gestión del cambio tiene por primera vez algo que no se puede imprimir en un afiche.',
      ),
      extras: [
        {
          if: has('objetosViejos'),
          text: 'Don Ramón ya sabe qué va a traer: el pasamanos de madera de la escalera norte. Dice que lo va a desatornillar él mismo, con permiso o sin permiso.',
        },
      ],
      next: '@a2_mensaje',
    },
  },
}

const a2_mensaje: Scene = {
  id: 'a2_mensaje',
  act: 2,
  title: '«Después te explico»',
  location: 'Departamento',
  time: '21:30',
  day: 'Jueves',
  art: 'hogar',
  entorno: 'hogar',
  relational: 'pareja',
  onEnter: [dia(1)],
  start: 'me1',
  nodes: {
    me1: {
      text: txt(
        'Jueves. El plan de gestión del cambio se entregó a las 18:02. Llegas a casa con la sensación de haber corrido una maratón sentado.',
        'Tenían planes para mañana: la primera salida «oficial» desde que volvieron. Un restorán peruano, nada especial, especial justamente por eso.',
        'El celular vibra. {pareja}: «Mañana no puedo. Después te explico.»',
        'Nada más. Ni un emoji. Ni un «perdón».',
      ),
      sourceTags: [
        { kind: 'MIEDO', min: 25, text: 'Lo que estás leyendo no es este mensaje: es tu archivo histórico de mensajes parecidos.' },
        { kind: 'PATRÓN', min: 40, text: 'Tu sistema ya está calculando la ruptura. Lo aprendiste para que nada te tome por sorpresa.' },
      ],
      presion: true,
      choices: [
        {
          id: 'historial',
          tags: ['regresion'],
          text: 'Abrir el historial del chat y empezar a buscar señales. Preparar, por si acaso, una versión tuya que no necesite a nadie.',
          effects: [fantasmas(10), confianza(-4), energia(2), addStatus('ansiedad')],
          next: 'me2_regresion',
        },
        {
          id: 'ok',
          subtext: 'GUION PRECARGADO · Un pulgar arriba es un portazo con buena educación.',
          autopilot: true,
          text: 'Responder «Ok 👍» y poner una serie. La forma más rápida de no sentir algo es fingir que no hay nada que sentir.',
          effects: [auto(6), fantasmas(5), energia(3)],
          next: 'me2_ok',
        },
        {
          id: 'verdad',
          subtext: 'SALTO DE FE · Nombrar tu miedo antes de que se convierta en una teoría.',
          tags: ['salto'],
          text: 'Escribir la verdad: «Está bien. Me activó un poco, por lo que hemos vivido. No te pido explicación ahora; solo te lo cuento para no guardármelo.»',
          cost: { energia: 12 },
          effects: [confianza(10), fantasmas(-7), admin(3)],
          next: 'me2_salto',
        },
        {
          id: 'cortesia',
          coraza: true,
          text: 'Responder con perfecta cortesía y desconectarte. Si no esperas nada, nada te puede faltar.',
          effects: [energia(3), fantasmas(4)],
          next: 'me2_coraza',
        },
      ],
    },
    me2_regresion: {
      text: txt(
        'A la una de la mañana tienes una teoría completa. Tres patrones, dos indicios, una conclusión: se está alejando. Es una teoría elegante. Se parece mucho a las que tenías antes de cada ruptura anterior.',
        'A la 01:14 llega otro mensaje: «Perdón por lo seco. Mi mamá tuvo una crisis y estoy en urgencias con ella. No quería preocuparte.»',
        'Te quedas mirando la pantalla. Tu teoría no contemplaba que la otra persona también tuviera miedo.',
      ),
      next: 'me3',
    },
    me2_ok: {
      text: txt(
        'La serie corre. No sabes de qué trata. A la 01:14 llega otro mensaje: «Perdón por lo seco. Mi mamá tuvo una crisis y estoy en urgencias con ella. No quería preocuparte.»',
        'Tu «Ok 👍» queda ahí arriba, como un portazo pequeño.',
      ),
      next: 'me3',
    },
    me2_salto: {
      onEnter: [energia(6)],
      text: txt(
        'Lo envías. Te arrepientes durante cuatro minutos. Al quinto llega la respuesta:',
        '«Gracias por decírmelo así. Perdón por lo seco: mi mamá tuvo una crisis y estoy en urgencias con ella. Me quedé sin palabras y escribí lo mínimo. No es contigo. De verdad.»',
        'Y después, otro: «Me ayudó mucho que me dijeras lo que te pasaba. Yo también tenía miedo de que lo leyeras mal.»',
      ),
      next: 'me3',
    },
    me2_coraza: {
      text: txt(
        '«Ningún problema. Que estés bien.» Perfecto. Inobjetable. Frío como un oficio.',
        'A la 01:14 llega otro mensaje: «Mi mamá tuvo una crisis y estoy en urgencias. Perdón por lo seco.» Respondes con la misma temperatura: «Ánimo. Cualquier cosa, avisa.» Lo que no dices queda flotando en la pieza oscura, sin dueño.',
      ),
      next: 'me3',
    },
    me3: {
      text: txt(
        'Urgencias. A esta hora. Conoces ese lugar mejor que nadie: el pasillo, las sillas atornilladas, la máquina de café que se traga las monedas. {pareja} está ahí, en una de esas sillas, con su madre y con el miedo.',
        'Es casi la una y media. Mañana tienes reunión a las ocho con la directora.',
      ),
      presion: true,
      choices: [
        {
          id: 'ir',
          subtext: 'SALTO DE FE · Estar sin que te lo pidan. Mañana vas a estar cansado; esta noche se va a recordar.',
          tags: ['salto'],
          text: 'Ir. Tomar un taxi, llegar con dos cafés de máquina y no decir nada importante. Solo estar.',
          cost: { energia: 12 },
          effects: [confianza(12), fantasmas(-6), flag('urgenciasPareja')],
          next: 'me4_ir',
        },
        {
          id: 'avisame',
          subtext: 'GUION PRECARGADO · Lo razonable como forma elegante de no ir.',
          autopilot: true,
          text: '«Avísame cualquier cosa. Mañana tengo reunión temprano.» Es razonable. Es lo que haría cualquiera.',
          effects: [auto(5), energia(4), fantasmas(4)],
          next: '@a2_visita',
        },
        {
          id: 'enlinea',
          subtext: 'PRESENCIA · Acompañar a distancia. No es lo mismo; tampoco es nada.',
          text: 'Llamar y quedarte en línea mientras espera. No es estar allá, pero tampoco es soltar.',
          cost: { energia: 8 },
          effects: [confianza(6), fantasmas(-3)],
          next: 'me4_llamada',
        },
      ],
    },
    me4_ir: {
      onEnter: [energia(5)],
      text: txt(
        'Llegas a las 02:10. {pareja} te ve entrar y se le desarma la cara: no de pena, de alivio. No dicen mucho. Tomas un café horrible. Su madre duerme, estabilizada.',
        'A las 05:00, en la sala de espera, {pareja} apoya la cabeza en tu hombro y se duerme. Te quedas quieto una hora, con el hombro entumecido y algo despierto en el pecho. Día diez. El primero en que no estás midiendo nada.',
      ),
      next: '@a2_visita',
    },
    me4_llamada: {
      onEnter: [energia(4)],
      text: 'Hablan en susurros cuarenta minutos. A ratos solo se escucha el monitor de fondo y su respiración. No hace falta llenar el silencio. Antes de cortar, {pareja} dice: «Gracias por no colgar.»',
      next: '@a2_visita',
    },
  },
}

const a2_visita: Scene = {
  id: 'a2_visita',
  act: 2,
  title: 'Visita ambigua',
  location: 'Departamento · Código Legacy',
  time: '12:00',
  day: 'Sábado',
  art: 'legacy',
  entorno: 'legacy',
  relational: 'legacy',
  onEnter: [dia(2)],
  start: 'v1',
  nodes: {
    v1: {
      text: txt(
        'Sábado. Tu madre llamó el jueves: «Vamos a pasar el sábado con tu papá. Un rato nomás.» No preguntó si podías. Nunca pregunta. Tampoco avisa si se van a quedar a almorzar; eso se sabe a las dos de la tarde, cuando no se van.',
        'Llegan a las doce en punto. Tu padre trae una bolsa de supermercado con fruta, sin tarjeta, sin decir que es para ustedes. Tu madre recorre el departamento con la mirada, como un inspector municipal.',
        '{hija} sale de su pieza. Tu madre le toca el pelo, un gesto rápido, casi administrativo. —Estás más alta. —Y después, a ti—: ¿Y la… persona esa? ¿Sigue?',
      ),
      sourceTags: [
        { kind: 'PATRÓN', min: 10, text: '«La persona esa»: nombrar a medias para no tener que preguntar de verdad.' },
        { kind: 'DEFENSA', min: 25, text: 'La crítica es su forma de cercanía. No conoce otra que no la asuste.' },
        { kind: 'HISTORIA', min: 45, text: 'Su madre la dejó con una tía a los seis años. Nunca habló de eso. Nunca habló de nada.' },
      ],
      presion: true,
      choices: [
        {
          id: 'idioma',
          subtext: 'GUION PRECARGADO · Hablar el idioma de la casa: nada que pueda doler, nada que pueda acercar.',
          autopilot: true,
          text: 'Responder en su mismo idioma: «Sí, sigue.» Datos, logística, el clima, la fruta. Nada que pueda doler.',
          effects: [auto(6), oscuro(4), energia(3)],
          next: 'v2',
        },
        {
          id: 'verpatron',
          subtext: 'GASTAR PERMISOS · Ver el código mientras se ejecuta. No cambia a tu madre; cambia lo que te llevas puesto.',
          text: 'Ver el patrón mientras ocurre: tu madre pregunta por todo menos por cómo estás. No es desprecio. Es el único idioma que le enseñaron.',
          cost: { permisos: 8 },
          effects: [oscuro(-5), energia(-4)],
          next: 'v2_visto',
        },
        {
          id: 'nombrar',
          subtext: 'GASTAR PERMISOS · Dar nombre completo a lo que tu familia nombra a medias.',
          requires: adminMin(25),
          text: 'Nombrar a {pareja} con su nombre, despacio, delante de ellos: «Se llama {pareja}. Y sí, sigue. Estamos bien.»',
          cost: { energia: 10, permisos: 5 },
          effects: [confianza(6), oscuro(-4), flag('nombroPareja')],
          next: 'v2_visto',
        },
        {
          id: 'temperatura',
          coraza: true,
          text: 'Adoptar la temperatura de la casa: amable, eficiente, impermeable. Sobrevivir el almuerzo como un trámite.',
          effects: [energia(4), frialdad(3)],
          next: 'v2',
        },
      ],
    },
    v2: {
      text: 'El almuerzo transcurre como un noticiero sin volumen. Tu padre habla del precio de la bencina y de un vecino que se cambió de auto. Tu madre comenta que el arroz está «distinto». {hija} come en silencio, mirando a cada adulto como si estuviera aprendiendo las reglas de un juego que nadie le explicó.',
      next: 'v3',
    },
    v2_visto: {
      onEnter: [energia(3)],
      text: txt(
        'Algo se desplaza. Sigues sentado a la misma mesa, con el mismo arroz «distinto», pero ahora ves el código correr: cada pregunta de tu madre es una inspección, porque inspeccionar es más seguro que abrazar. Cada silencio de tu padre es una puerta que él tampoco sabe abrir.',
        'No los perdonas, todavía. Pero dejas de tomártelo como un veredicto sobre ti. Es legacy: código viejo, escrito por gente asustada, ejecutándose en máquinas nuevas.',
      ),
      extras: [
        {
          if: has('nombroPareja'),
          text: 'Tu madre parpadea al escuchar el nombre. —Ah —dice—. Qué nombre más bonito. Es lo más cálido que le has escuchado en años. Quizás estaba ahí, esperando que alguien le diera permiso.',
        },
      ],
      next: 'v3',
    },
    v3: {
      relational: 'hija',
      text: txt(
        'Después del almuerzo, tu padre mira por la ventana. Sin darse vuelta, dice:',
        '—Y tú, a esta edad, todavía sin licencia. Yo a los dieciocho ya manejaba el camión de tu abuelo.',
        '{hija} está a dos metros, armando un puzle. Deja de buscar piezas.',
      ),
      sourceTags: [
        { kind: 'PATRÓN', min: 15, text: 'La comparación es la única forma de interés que conoce.' },
        { kind: 'MIEDO', min: 35, text: 'Que su hijo lo necesite tan poco que ya no le quede nada que enseñarle.' },
        { kind: 'HISTORIA', min: 50, text: 'Su padre nunca le enseñó a manejar. Lo bajó del camión el día que se equivocó de cambio. Tenía doce años.' },
      ],
      presion: true,
      choices: [
        {
          id: 'reir',
          subtext: 'GUION PRECARGADO · La risa como amortiguador. {hija} está mirando cómo se hace.',
          autopilot: true,
          text: 'Reírte un poco y cambiar de tema. Como siempre. Que el comentario se disuelva solo.',
          effects: [auto(5), frialdad(5), energia(2)],
          next: 'v4',
        },
        {
          id: 'quienteenseno',
          subtext: 'GASTAR PERMISOS · Responder a la herida de él, no a su frase.',
          tags: ['presencia'],
          text: 'Ver lo que hay debajo y responder desde ahí: «¿Quién te enseñó a ti, papá?»',
          cost: { permisos: 10, energia: 10 },
          effects: [calidez(6), oscuro(-6), flag('preguntaPadre')],
          next: 'v4_padre',
        },
        {
          id: 'paraella',
          subtext: 'PRESENCIA · Que {hija} vea que aprender tarde no es fracasar.',
          tags: ['presencia'],
          text: 'Mirar a {hija}, que está registrando todo, y decir en voz alta: «Me está costando y lo estoy haciendo igual. El jueves tengo clase.» Que ella vea que aprender tarde no es fracasar.',
          cost: { permisos: 6, energia: 8 },
          effects: [calidez(10), frialdad(-5)],
          next: 'v4_hija',
        },
        {
          id: 'datos',
          coraza: true,
          tags: ['analisis'],
          text: 'Responder con datos: edad promedio de obtención de licencia, costo de un auto, eficiencia del transporte público. Ganar la discusión sin estar en ella.',
          effects: [admin(3), frialdad(4)],
          next: 'v4',
        },
      ],
    },
    v4: {
      text: txt(
        'A las cuatro se van. Tu madre deja dicho que la fruta es «para la niña». Tu padre te da la mano en la puerta. La mano, no un abrazo. Nunca un abrazo.',
        'Cuando la puerta se cierra, el departamento queda en ese silencio especial que dejan siempre: no vacío, sino frío. Como una pieza donde estuvo abierto el refrigerador.',
      ),
      next: '@a2_cena',
    },
    v4_padre: {
      onEnter: [energia(4)],
      text: txt(
        'Tu padre se queda quieto. Pasa tanto rato que piensas que no va a contestar.',
        '—Nadie —dice al fin—. Mi papá me bajó del camión porque metí mal un cambio. Aprendí mirando. Solo.',
        'No dice nada más. Tú tampoco. Pero cuando se va, en la puerta, la mano que te da dura un segundo más que siempre. Un segundo. En el idioma de tu familia, es casi un discurso.',
      ),
      next: '@a2_cena',
    },
    v4_hija: {
      onEnter: [energia(5)],
      text: txt(
        '{hija} te mira con atención. Tu padre resopla, pero no dice nada más.',
        'Más tarde, cuando tus padres ya se fueron, ella te pregunta: —¿Te da vergüenza no saber manejar? —Un poco —le dices—. Pero me daría más vergüenza no intentarlo.',
        'Ella asiente, seria. Lo está guardando en algún lugar. Esta vez es algo que vale la pena guardar.',
      ),
      next: '@a2_cena',
    },
  },
}

const a2_cena: Scene = {
  id: 'a2_cena',
  act: 2,
  title: 'Lo que se hereda',
  location: 'Departamento',
  time: '20:30',
  day: 'Sábado',
  art: 'hogar',
  entorno: 'hogar',
  relational: 'ambos',
  start: 'c1',
  nodes: {
    c1: {
      relational: 'hija',
      text: txt(
        'Esa noche {pareja} llega con su madre ya dada de alta y con ganas de no hablar de hospitales. Cocinan juntos. {hija} pone la mesa sin que nadie se lo pida, lo que en ella es una señal: quiere decir algo.',
        'A mitad de la cena, sin levantar la vista del plato:',
        '—¿Por qué la abuela nunca dice que algo le gustó?',
      ),
      extras: [
        {
          if: status('contagioFrialdad'),
          text: 'Todavía tienes el frío de la tarde en las manos. Lo notas en cómo sostienes el tenedor: con precisión, sin ganas. El Contagio de Frialdad no se ve, pero {hija} lo está leyendo igual.',
        },
      ],
      sourceTags: [
        { kind: 'MOTIVACIÓN', min: 15, text: 'No está preguntando por la abuela. Está preguntando si eso se hereda.' },
        { kind: 'MIEDO', min: 30, text: 'Teme parecerse. Ya se escuchó a sí misma diciendo «no me importa».' },
      ],
      choices: [
        {
          id: 'asies',
          subtext: 'GUION PRECARGADO · Explicar la frialdad como carácter es la forma más eficaz de heredarla.',
          autopilot: true,
          text: '«Así es la abuela, no más. Cada uno es como es.»',
          effects: [auto(5), frialdad(6), energia(2)],
          next: 'c2',
        },
        {
          id: 'nadiele',
          subtext: 'PRESENCIA · Romper el patrón en la misma frase en que lo describes.',
          tags: ['presencia'],
          text: '«No sé, la verdad. Creo que a ella nadie le dijo nunca que algo suyo le gustaba. Y uno aprende a decir lo que escuchó.» Y después, mirándola: «A mí me gusta mucho cómo pusiste la mesa.»',
          cost: { energia: 12 },
          effects: [calidez(12), frialdad(-6), admin(3)],
          next: 'c2_calidez',
        },
        {
          id: 'truco',
          subtext: 'PRESENCIA · Volver a algo que ya se dijeron: el lenguaje privado que están construyendo.',
          tags: ['presencia'],
          requires: any(item('dibujo_hija'), has('patronNombradoHija')),
          lockHint: 'haber hablado antes con {hija} de su «no me importa»',
          text: '«¿Te acuerdas de lo que hablamos del "no me importa"? Esto es parecido. La abuela tiene su propio truco. Nosotros estamos aprendiendo otro.»',
          cost: { energia: 8 },
          effects: [calidez(14), frialdad(-8)],
          next: 'c2_calidez',
        },
        {
          id: 'transmision',
          subtext: 'INTELECTUALIZACIÓN · Le das un concepto a una niña que preguntaba si la iban a querer.',
          tags: ['analisis'],
          text: 'Explicarle el concepto de transmisión intergeneracional de patrones de apego. Es inteligente: va a entender.',
          effects: [admin(4), frialdad(5)],
          next: 'c2_analisis',
        },
      ],
    },
    c2: {
      relational: 'hija',
      text: '{hija} asiente y sigue comiendo. {pareja} te mira desde el otro lado de la mesa, con una pregunta en los ojos que no hace. La cena termina. Nadie dice que algo le gustó.',
      next: 'c3',
    },
    c2_calidez: {
      onEnter: [energia(6)],
      relational: 'hija',
      text: txt(
        '{hija} se pone roja y le sonríe al plato, intentando que no se note. {pareja} te mira desde el otro lado de la mesa con algo que parece orgullo, o ternura, o las dos cosas mezcladas.',
        '—A mí me gustó el arroz —dice {hija} de pronto, a nadie en particular. Y se ríe sola. Es un chiste privado con la abuela ausente. Es también, quizás, una línea de código nueva.',
      ),
      next: 'c3',
    },
    c2_analisis: {
      relational: 'hija',
      text: txt(
        'Lo explicas bien. Patrones, transmisión, apego evitativo. {hija} escucha con la cara de concentración que pone en las pruebas.',
        '—O sea que yo voy a ser así —dice al final. No es pregunta.',
        '{pareja} deja el tenedor sobre el plato. Tú no tienes una respuesta que no sea teórica.',
      ),
      next: 'c3',
    },
    c3: {
      relational: 'pareja',
      text: txt(
        'Más tarde, en la cocina, {pareja} te abraza por la espalda mientras lavas. Día {dia}. Te dice al oído:',
        '—Hoy te vi a tus papás en la cara. Todavía los tienes puestos.',
        'Es verdad. Lo sabes por cómo se tensó tu espalda al sentir el abrazo.',
      ),
      extras: [
        {
          if: status('contagioFrialdad'),
          text: 'El frío de la tarde quiere que te sueltes. Que digas «estoy bien» y sigas lavando.',
        },
      ],
      presion: true,
      choices: [
        {
          id: 'ayudame',
          subtext: 'SALTO DE FE · Pedir ayuda con algo que en tu familia se cargaba solo.',
          tags: ['salto'],
          text: 'Dejar los platos. Darte vuelta. «Sí. Me cuesta sacármelos. ¿Me ayudas?»',
          cost: { energia: 10 },
          effects: [confianza(10), fantasmas(-6), oscuro(-3), give('decant_higo'), flag('regaloDecant')],
          next: 'c4',
        },
        {
          id: 'estoybien',
          subtext: 'IMPULSO DE REGRESIÓN · La espalda tensa dice más que la frase.',
          tags: ['regresion'],
          text: '«Estoy bien.» Y seguir lavando. La espalda tensa, la vista en el plato, la distancia en su lugar.',
          effects: [fantasmas(7), confianza(-3), energia(3)],
          next: 'c4',
        },
        {
          id: 'broma',
          subtext: 'GUION PRECARGADO · Reírse juntos de algo para no tener que tocarlo.',
          autopilot: true,
          text: 'Hacer una broma sobre tus papás. Reírse juntos es casi lo mismo que hablarlo. Casi.',
          effects: [auto(4), confianza(2), fantasmas(2)],
          next: 'c4',
        },
      ],
    },
    c4: {
      text: txt(
        'Esa noche, otra notificación:',
        '> SISTEMA: Transferencia de arquitectura en curso.\n> Edificio viejo → edificio nuevo: 64%.\n> Código legacy → código propio: [CALCULANDO]',
        'Afuera, en la ciudad, un hospital entero se está mudando. Adentro, algo en ti también.',
      ),
      extras: [
        {
          if: has('regaloDecant'),
          text: 'Sobre tu velador, {pareja} dejó un frasquito de vidrio con una etiqueta escrita a mano: «Higo, leche y madera. Para cuando necesites acordarte de que hay alguien en la cocina.»',
        },
      ],
      next: '@a2_presupuesto',
    },
  },
}

const a2_presupuesto: Scene = {
  id: 'a2_presupuesto',
  act: 2,
  title: 'Ajustar a recursos disponibles',
  location: 'Unidad de Desarrollo Organizacional',
  time: '09:10',
  day: 'Lunes',
  art: 'oficina',
  entorno: 'burocratico',
  presionTiempo: true,
  onEnter: [dia(2)],
  start: 'p1',
  nodes: {
    p1: {
      text: txt(
        'Lunes. La directora devolvió el plan de gestión del cambio con un post-it amarillo en la portada: «Ajustar a recursos disponibles.»',
        'En el Servicio, «ajustar» es un verbo que siempre significa lo mismo: sacar a las personas del plan y dejar los afiches.',
      ),
      extras: [
        {
          if: has('ritualCierre'),
          text: 'El ritual de cierre está subrayado con lápiz rojo. Al margen, con la letra apretada de la directora: «¿Horas protegidas? ¿Quién cubre los turnos?»',
        },
        {
          if: has('parcheBurocratico'),
          text: 'Tu plan —la plantilla del traslado anterior, con fechas nuevas— volvió aprobado sin una sola observación. Debería tranquilizarte. Pero en el mismo correo viene adjunta otra cosa: dos renuncias más en Urgencia, con fecha de hoy.',
        },
      ],
      next: 'p2',
    },
    p2: {
      speaker: 'HERNÁN · Subdirector de Gestión de Personas',
      text: '«Mira, yo te apoyé hasta donde pude. Pero la directora quiere los afiches impresos el viernes y cero horas extra. Si insistes con las despedidas y las escaleras, el que queda mal soy yo. Y después tú. Elige qué pelea quieres dar, porque las dos no te las van a aprobar.»',
      extras: [{ if: has('hernanAliado'), text: 'Lo dice bajando la vista. Te está pidiendo permiso para rendirse.' }],
      sourceTags: [
        { kind: 'DEFENSA', min: 20, text: 'Te presenta un dilema cerrado para no tener que decidir él.' },
        { kind: 'MIEDO', min: 35, text: 'La directora le dijo la semana pasada que «no está alineado». En el Servicio, esa frase precede a un traslado.' },
        { kind: 'MOTIVACIÓN', min: 50, text: 'Una parte de él quiere que ganes la pelea que él dejó de dar hace once años.' },
      ],
      presion: true,
      choices: [
        {
          id: 'afiches',
          autopilot: true,
          text: '«Tienes razón. Imprimimos los afiches y dejamos lo demás para después del traslado.»',
          subtext: 'GUION PRECARGADO · «Después del traslado» es el lugar donde los planes humanos se mueren sin acta.',
          effects: [auto(8), energia(4), flag('culturaRecortada')],
          next: 'p3',
        },
        {
          id: 'una_pelea',
          text: 'Elegir una sola pelea y darla bien: un cierre de diez minutos en el cambio de turno de las 07:00, cuando las dos jornadas ya están en el hospital. Sin horas extra.',
          subtext: 'ELECCIÓN PROPIA · Renunciar a casi todo para proteger lo único que no se puede imprimir.',
          cost: { energia: 12 },
          effects: [admin(6), auto(-5), flag('ritualCierre'), flag('ritualNegociado')],
          next: 'p3_pelea',
        },
        {
          id: 'cifra',
          requires: adminMin(35),
          text: 'Darle a Hernán el argumento que le falta: reemplazar a cada enfermera que renuncia cuesta cuatro meses de sueldo. Despedirse sale más barato que irse.',
          subtext: 'INGENIERÍA INVERSA · Le das a su miedo un idioma que la directora entiende. Proteges la cultura con las armas del sistema.',
          cost: { energia: 10 },
          effects: [admin(8), auto(-4), flag('ritualCierre'), flag('hernanArmado'), drop('rutina')],
          next: 'p3_cifra',
        },
        {
          id: 'documentar',
          coraza: true,
          text: 'Retirarte de la pelea con elegancia técnica: dejarlo todo documentado, mandar un correo con copia a la directora y no volver a pensar en eso.',
          effects: [energia(3), admin(2), flag('culturaRecortada')],
          next: 'p3',
        },
      ],
    },
    p3: {
      text: txt(
        'Los afiches llegan el jueves: fotos de banco de imágenes con gente sonriendo en pasillos que no son los del hospital. Antes del mediodía, alguien de Urgencia le dibuja bigotes al médico de la foto.',
        'Javiera los pega sin decir nada.',
      ),
      extras: [
        {
          if: has('javieraAliada'),
          text: 'Cuando termina, deja el rollo de cinta sobre tu escritorio un poco más fuerte de lo necesario. —Dijiste que esta vez íbamos a intentar hacerlo bien —dice, sin mirarte. No es un reproche. Es peor: es una constatación.',
        },
        { if: has('javieraDesilusion'), text: 'Ya no te pregunta nada. Aprendió rápido.' },
      ],
      next: '@a2_peruano',
    },
    p3_pelea: {
      onEnter: [energia(3)],
      text: txt(
        'Hernán se queda mirando el post-it. —¿A las siete? ¿En el cambio de turno?',
        '—Diez minutos —le dices—. Los que salen se despiden del edificio; los que entran lo cierran. Nadie cobra horas extra. Nadie se va sin decir adiós.',
        'Hernán suspira como alguien que acaba de perder una discusión que quería perder. —Escríbelo en una página. Una. Y si la directora pregunta, la idea fue de los equipos.',
      ),
      extras: [{ if: has('javieraAliada'), text: 'Javiera, que escuchó todo desde el pasillo, ya está escribiendo la página.' }],
      next: '@a2_peruano',
    },
    p3_cifra: {
      text: txt(
        'Hernán lee la cifra dos veces. Después saca el celular y le toma una foto a tu pantalla, como si fuera un documento robado.',
        '—Esto sí lo entiende la directora —dice. Y, por primera vez en mucho tiempo, sonríe con algo parecido al entusiasmo—. Déjame presentarlo a mí.',
        'Va a presentar tu argumento como suyo. Lo sabes. Te importa menos de lo que esperabas: el cierre va a ocurrir, y eso era lo que importaba.',
      ),
      next: '@a2_peruano',
    },
  },
}

const a2_peruano: Scene = {
  id: 'a2_peruano',
  act: 2,
  title: 'La cita postergada',
  location: 'Restorán peruano, barrio Italia',
  time: '21:05',
  day: 'Miércoles',
  art: 'restaurante',
  entorno: 'hogar',
  relational: 'pareja',
  onEnter: [dia(2)],
  start: 'r1',
  nodes: {
    r1: {
      text: txt(
        'El restorán peruano, por fin. Lo postergaron dos veces: primero por la madre de {pareja}, después por tu plan de gestión del cambio. Llegas cuarenta minutos tarde, con el celular todavía caliente en la mano y la cabeza en una planilla.',
        '{pareja} te espera con un pisco sour a medio tomar y otro intacto, ya sin espuma, frente a tu silla vacía. Día {dia}. No te dice nada por el atraso. Eso es lo que más te pesa.',
      ),
      extras: [
        {
          if: has('urgenciasPareja'),
          text: 'Hace unos días estuviste en una sala de urgencias a las dos de la mañana con dos cafés de máquina. Se nota en cómo te mira llegar: con paciencia, como quien ya sabe que vas a llegar.',
        },
      ],
      sourceTags: [
        { kind: 'DEFENSA', min: 15, text: 'No reclama el atraso para no parecerse a la persona que reclama.' },
        { kind: 'MIEDO', min: 30, text: 'Que el trabajo vuelva a ser el lugar donde te vas sin irte.' },
        { kind: 'HISTORIA', min: 45, text: 'En la segunda ruptura, el último mensaje fue tuyo: «Llego tarde, empiecen sin mí.» Nunca llegaste.' },
      ],
      presion: true,
      choices: [
        {
          id: 'perdon',
          autopilot: true,
          text: '«Perdón, perdón, fue un día imposible.» Y empezar a contar el día imposible, con detalles, hasta que el día imposible ocupe la mesa.',
          subtext: 'GUION PRECARGADO · Disculparse con un relato largo para no tener que estar en la mesa.',
          effects: [auto(5), energia(3), fantasmas(4)],
          next: 'r2_trabajo',
        },
        {
          id: 'llegar',
          tags: ['salto'],
          text: 'Dejar el celular boca abajo, mirar a {pareja} y decir la verdad: «Llegué tarde y vine con la cabeza en otra parte. Dame dos minutos para llegar de verdad.»',
          subtext: 'SALTO DE FE · Admitir que no estás todavía es la única forma de empezar a estar.',
          cost: { energia: 10 },
          effects: [confianza(9), fantasmas(-5), auto(-3)],
          next: 'r2_llegar',
        },
        {
          id: 'medir',
          tags: ['regresion'],
          text: 'Quedarte en silencio y medir: si no reclama, ¿es porque no le importa? Probar cuánto aguanta tu ausencia antes de decir algo.',
          subtext: 'IMPULSO DE REGRESIÓN · Fabricar la evidencia de que te van a dejar, para no tener que esperar el golpe.',
          effects: [fantasmas(8), confianza(-4), energia(2)],
          next: 'r2_prueba',
        },
        {
          id: 'reunion',
          coraza: true,
          text: 'Pedir rápido, comer rápido, conversar de logística. Cumplir la cita como se cumple una reunión: puntual en todo menos en estar.',
          effects: [energia(4), confianza(1)],
          next: 'r2_trabajo',
        },
      ],
    },
    r2_llegar: {
      onEnter: [energia(5)],
      text: txt(
        '{pareja} se ríe, suave. —Ya. Te espero. Llevo {dia} días esperándote y no me ha ido mal.',
        'Respiras. Pruebas el pisco sin espuma: tibio y un poco triste, y aun así lo mejor que has tomado en la semana. Por un rato la cena es sólo eso, una cena. Hablan de un viaje que todavía no van a hacer, de la madre de {pareja}, que ya camina sin bastón, de cómo se llamaría un perro si algún día tuvieran uno.',
      ),
      next: 'r3',
    },
    r2_trabajo: {
      text: txt(
        'Hablas del traslado, de Hernán, del post-it amarillo. {pareja} escucha, asiente, hace las preguntas correctas. Pide la cuenta antes del postre.',
        'En la vereda, mientras esperan el auto, te das cuenta de que no le preguntaste nada. Ni una cosa.',
      ),
      next: 'r3',
    },
    r2_prueba: {
      text: txt(
        'Comen casi en silencio. {pareja} intenta dos temas; los dejas morir. Tu experimento funciona: al tercero, deja de intentar.',
        'Ya tienes tu dato. No te sirve de nada. Sólo confirma lo que tú mismo provocaste.',
      ),
      next: 'r3',
    },
    r3: {
      text: 'Antes del postre, el celular vibra sobre la mesa. Hernán. Una vez. Dos. El nombre se queda brillando entre los dos platos.',
      presion: true,
      choices: [
        {
          id: 'contestar',
          autopilot: true,
          text: 'Contestar. «Un segundo, es del trabajo.» Siempre es un segundo.',
          subtext: 'GUION PRECARGADO · El trabajo como la urgencia que siempre gana, porque nunca pide permiso.',
          effects: [auto(6), fantasmas(5), energia(2)],
          next: 'r4_contesto',
        },
        {
          id: 'apagar',
          tags: ['salto'],
          text: 'Apagar el celular delante de {pareja}. No ponerlo en silencio: apagarlo.',
          subtext: 'SALTO DE FE · Un gesto chico y visible. Lo que no dices queda dicho.',
          cost: { energia: 6 },
          effects: [confianza(7), fantasmas(-4), auto(-4), flag('apagoCelular')],
          next: 'r4_apagado',
        },
        {
          id: 'preguntar',
          tags: ['salto'],
          requires: adminMin(30),
          text: 'Mirar a {pareja} y devolverle la decisión: «¿Contesto? Tú decides. Hoy me importa más esta mesa.»',
          subtext: 'SALTO DE FE · Compartir el poder sobre tu tiempo es una forma de decir que confías.',
          cost: { energia: 8 },
          effects: [confianza(9), fantasmas(-6), admin(3)],
          next: 'r4_pregunta',
        },
      ],
    },
    r4_contesto: {
      text: txt(
        'Era una pregunta sobre un Excel. Dos minutos. Cuando vuelves, {pareja} está mirando por la ventana, con el postre servido para los dos.',
        '—No pasa nada —dice. Y es verdad que no pasa nada. Ese es el problema: no pasa nada, una y otra vez, hasta que pasa.',
      ),
      next: '@a2_llamada',
    },
    r4_apagado: {
      text: txt(
        'La pantalla se pone negra. {pareja} no dice nada, pero estira la mano por encima de la mesa y te toca los dedos, el anillo de plata, la muñeca.',
        'El postre es suspiro limeño. Demasiado dulce. Se lo comen entero.',
      ),
      next: '@a2_llamada',
    },
    r4_pregunta: {
      onEnter: [energia(3)],
      text: txt(
        '{pareja} te mira con sorpresa, como si le hubieras devuelto algo que no sabía que había prestado. —Contesta —dice—. Pero después vuelve.',
        'Contestas. Treinta segundos: «Mañana a primera hora, Hernán.» Cortas. Vuelves. {pareja} se ríe por encima de la copa.',
        '—Eso fue muy atractivo, no te voy a mentir.',
      ),
      next: '@a2_llamada',
    },
  },
}

const a2_llamada: Scene = {
  id: 'a2_llamada',
  act: 2,
  title: 'Llamada de larga distancia',
  location: 'Cocina, de noche · Código Legacy',
  time: '22:40',
  day: 'Jueves',
  art: 'llamada',
  entorno: 'legacy',
  relational: 'legacy',
  onEnter: [dia(1)],
  start: 'l1',
  nodes: {
    l1: {
      text: txt(
        'Jueves, casi las once. {hija} duerme. El celular suena con el nombre que tienes guardado como «Mamá» desde hace veinte años, aunque ella nunca te llama a esta hora.',
        '—Hola —dice, sin preguntar si estás ocupado—. Tu papá tiene un examen el martes 3. Una angiografía, en tu hospital. Tú conoces a la gente ahí.',
        'Una pausa con estática. La línea suena como si llamara desde muy lejos, aunque vive a veinte minutos.',
        '—Y no le digas que te llamé. No quiere molestar.',
      ),
      sourceTags: [
        { kind: 'PATRÓN', min: 10, text: 'Pide sin pedir: un dato, una fecha, y que tú adivines el resto.' },
        { kind: 'MIEDO', min: 25, text: 'Tiene miedo de que el examen salga mal. No lo va a decir; lo está diciendo con la hora de la llamada.' },
        { kind: 'HISTORIA', min: 45, text: 'Tu abuelo murió de un infarto a los sesenta y dos. Tu padre cumple sesenta y dos en marzo.' },
      ],
      presion: true,
      choices: [
        {
          id: 'tramite',
          autopilot: true,
          text: '«Ya, le aviso a alguien de cardiología.» Resolverlo como un trámite: datos, horarios, un contacto. Nada de preguntas.',
          subtext: 'GUION PRECARGADO · Ser útil es la forma de cariño que tu familia sabe aceptar sin incomodarse.',
          effects: [auto(6), oscuro(4), energia(3), flag('tramitePadre')],
          next: 'l2',
        },
        {
          id: 'asustada',
          text: 'Escuchar lo que la llamada dice sin decirlo: «Mamá, ¿tú estás asustada?»',
          subtext: 'GASTAR PERMISOS · Ver el código mientras se ejecuta, y nombrarlo en voz baja.',
          cost: { permisos: 8, energia: 8 },
          effects: [oscuro(-6), flag('preguntaMiedo')],
          next: 'l2_miedo',
        },
        {
          id: 'acompano',
          text: 'Ofrecer lo que nadie en tu familia ofrece: «Yo lo acompaño. Aunque ese día sea el traslado.»',
          subtext: 'ELECCIÓN PROPIA · Elegir a tu padre el día en que el sistema más te va a necesitar. Lo vas a pagar en el trabajo.',
          cost: { permisos: 5, energia: 10 },
          effects: [oscuro(-4), auto(-3), flag('acompanaPadre')],
          next: 'l2_acompanar',
        },
        {
          id: 'whatsapp',
          coraza: true,
          text: 'Responder con la temperatura de la casa: «Ok. Mándame la orden por WhatsApp.» Y cortar antes de que la línea se ponga incómoda.',
          effects: [energia(4), frialdad(3), flag('tramitePadre')],
          next: 'l2',
        },
      ],
    },
    l2: {
      text: txt(
        '—Ya —dice tu madre—. Bueno. Chao. Corta primero. Siempre corta primero.',
        'Te quedas con el celular en la mano en la cocina oscura. La estática sigue sonando un rato en tu oído, aunque ya no hay nadie al otro lado.',
      ),
      extras: [
        {
          if: has('tramitePadre'),
          text: 'Le escribes a un cardiólogo que conoces. Te responde en cinco minutos: «Sin problema, yo lo veo.» Resuelto. Nadie preguntó cómo estaba nadie.',
        },
      ],
      next: '@a2_ultimo_turno',
    },
    l2_miedo: {
      text: txt(
        'Silencio. Tanto silencio que piensas que se cortó.',
        '—Tu papá no duerme —dice al fin, en un tono que no le conocías—. Se levanta a las cuatro y se sienta en la cocina. No me deja prenderle la luz.',
        'No te dice que ella tampoco duerme. No hace falta. Por primera vez en años, una llamada con tu madre dura más de tres minutos.',
      ),
      next: '@a2_ultimo_turno',
    },
    l2_acompanar: {
      text: txt(
        '—¿El día del traslado? —Tu madre suena descolocada, como si le hubieras contestado en otro idioma—. No, si no es para tanto. Puede ir solo.',
        '—Ya sé que puede —le dices—. Igual voy.',
        'Otra pausa. Después, muy rápido, antes de cortar: —Bueno. Le voy a decir que fue idea tuya.',
      ),
      next: '@a2_ultimo_turno',
    },
  },
}

const a2_ultimo_turno: Scene = {
  id: 'a2_ultimo_turno',
  act: 2,
  title: 'Último turno',
  location: 'Hospital viejo, pasillo de Urgencia',
  time: '05:40',
  day: 'Martes 3',
  art: 'pasillo',
  entorno: 'interior',
  presionTiempo: true,
  onEnter: [dia(26), addStatus('ansiedad')],
  start: 'u1',
  nodes: {
    u1: {
      text: txt(
        'Martes 3. Cinco semanas después, el día llega como llegan los días que uno teme: sin ceremonia, a las 05:40, con olor a cloro y cajas de cartón apiladas en los pasillos.',
        'El hospital viejo se vacía por pisos. A las 06:00 sale la primera ambulancia con pacientes hacia el recinto nuevo; a las 14:00 se apaga la última luz de Urgencia. Tú estás en el centro de coordinación, con un chaleco reflectante que dice «APOYO» y una radio que no se calla.',
      ),
      extras: [
        { if: has('ritualCierre'), text: 'A las 07:00 en punto, en el cambio de turno, está programado el cierre. Diez minutos. Una página. Lo que pudiste salvar.' },
        {
          if: all(has('culturaRecortada'), hasNot('ritualCierre')),
          text: 'No hay nada programado para despedirse. En la puerta de Urgencia hay un afiche con el logo del hospital nuevo y la palabra «¡Vamos!», con signo de exclamación.',
        },
        {
          if: has('acompanaPadre'),
          text: 'Y a las 10:00, en el tercer piso de este mismo edificio —el último servicio en mudarse—, tu padre tiene su angiografía. Prometiste estar.',
        },
      ],
      nextIf: [{ if: has('ritualCierre'), next: 'u2_ritual' }],
      next: 'u2_sin',
    },
    u2_ritual: {
      text: txt(
        'A las 07:00 el pasillo de Urgencia está lleno: los del turno de noche con la cara gris de cansancio, los del día con el café en la mano. Nadie sabe bien qué hacer. Eso es lo bueno.',
        'Marisol habla primero. Dice tres frases y se le corta la voz en la cuarta. Patricio lee los nombres de los seis que renunciaron, de los que se jubilaron, de los que murieron en servicio. Nadie lo había pedido. Nadie lo interrumpe.',
      ),
      extras: [
        {
          if: has('objetosViejos'),
          text: 'Don Ramón llega con el pasamanos de madera de la escalera norte bajo el brazo, envuelto en una sábana del hospital. Lo apoya contra la pared y se queda al lado, firme, como quien custodia algo.',
        },
        { if: has('ramonEscuchado'), text: 'Don Ramón te busca con la mirada y te hace un gesto con la cabeza. No sonríe. Es más que eso.' },
        { if: has('javieraAliada'), text: 'Javiera graba con el celular, para el informe. Después deja de grabar y simplemente mira.' },
      ],
      presion: true,
      choices: [
        {
          id: 'discurso',
          autopilot: true,
          text: 'Tomar la palabra como coordinador: agradecer el compromiso de todos y anunciar los próximos hitos del traslado.',
          subtext: 'GUION PRECARGADO · Convertir un adiós en un acta. Los cronogramas son más fáciles de sostener que las caras.',
          effects: [auto(6), energia(3)],
          next: 'u3',
        },
        {
          id: 'uno_mas',
          tags: ['presencia'],
          text: 'No decir nada. Quedarte atrás, entre los TENS del turno de noche, y despedirte del edificio como uno más.',
          subtext: 'PRESENCIA · Quien diseñó el cierre no lo dirige: lo vive.',
          cost: { energia: 8 },
          effects: [admin(5), auto(-6), flag('unoMas'), drop('cuidado')],
          next: 'u3',
        },
        {
          id: 'escalera_norte',
          requires: has('ramonEscuchado'),
          lockHint: 'haber escuchado la historia de don Ramón',
          text: 'Subir con don Ramón a la escalera norte una última vez.',
          subtext: 'PRESENCIA · Tres minutos que el cronograma no tiene, en el único lugar donde aquí se podía llorar.',
          cost: { energia: 10 },
          effects: [admin(6), oscuro(-6)],
          next: 'u3_escalera',
        },
        {
          id: 'cronometro',
          coraza: true,
          text: 'Mirar el reloj. Diez minutos son diez minutos. Cortar a los nueve y medio para que la ambulancia de las 07:15 salga a tiempo.',
          effects: [energia(4), auto(3)],
          next: 'u3',
        },
      ],
    },
    u3_escalera: {
      onEnter: [energia(4)],
      text: txt(
        'La escalera norte huele a polvo y a humedad. Don Ramón sube despacio, apoyándose en la pared donde antes estaba el pasamanos. En el descanso del tercer piso se detiene.',
        '—Aquí —dice—. Aquí me llamaron.',
        'Se sienta en el escalón. Tú te sientas al lado. No dicen nada durante tres minutos que el cronograma no tiene. Después él se levanta, se sacude el pantalón y dice: —Ya. Vamos al nuevo, mijo.',
      ),
      next: 'u3',
    },
    u2_sin: {
      text: txt(
        'A las 07:00 hay cambio de turno, como todos los días. Los de la noche entregan pacientes a los del día y se van. Algunos se quedan un minuto de más en la puerta, mirando el pasillo, sin saber qué hacer con ese minuto. No hay nada programado para ellos.',
        'Ves a Marisol sola en la estación de enfermería, guardando en una caja de cartón un tazón con su nombre. Lo envuelve en una hoja del informe de clima laboral. Tu informe.',
      ),
      extras: [{ if: has('informeMaquillado'), text: 'Es la lámina del gráfico de torta.' }],
      presion: true,
      choices: [
        {
          id: 'radio',
          autopilot: true,
          text: 'Volver a la radio. Hay una ambulancia esperando autorización y eso, al menos, tiene solución.',
          subtext: 'GUION PRECARGADO · Refugiarse en el problema que sí se puede resolver.',
          effects: [auto(6), energia(3)],
          next: 'u3',
        },
        {
          id: 'caja',
          tags: ['presencia'],
          text: 'Acercarte a Marisol y ayudarle con la caja. No decir nada sobre el plan. Sólo cargar la caja.',
          subtext: 'PRESENCIA · Llegar tarde a la despedida que no defendiste, y aun así llegar.',
          cost: { energia: 8 },
          effects: [admin(5), auto(-5), flag('marisolCaja')],
          next: 'u3',
        },
        {
          id: 'pronostico',
          tags: ['analisis'],
          text: 'Anotar mentalmente: «Duelo no elaborado en jefatura intermedia. Riesgo de licencia médica en sesenta días.» Es un buen pronóstico. Lo vas a acertar.',
          subtext: 'INTELECTUALIZACIÓN · Predecir el daño con precisión, desde lejos, sin tocarlo.',
          effects: [admin(4), oscuro(5)],
          next: 'u3',
        },
      ],
    },
    u3: {
      text: 'A las 09:40 la radio estalla: el ascensor del ala sur se trabó con un paciente crítico adentro y dos camillas esperando. El jefe del traslado grita tu nombre por el pasillo. Te necesitan en el centro de coordinación. Ahora.',
      nextIf: [{ if: has('acompanaPadre'), next: 'u3_padre' }],
      next: 'u4',
    },
    u3_padre: {
      text: txt(
        'Son las 09:52. La angiografía de tu padre es a las 10:00, tres pisos más arriba. Tu madre ya te escribió dos veces: «Llegamos.» Y un minuto después: «Está nervioso. No le digas que te dije.»',
        'El jefe del traslado vuelve a gritar tu nombre.',
      ),
      presion: true,
      choices: [
        {
          id: 'coordinacion',
          autopilot: true,
          text: 'Ir a coordinación. Escribirle a tu madre: «Me surgió una emergencia, después paso.» Es una emergencia de verdad. Eso lo hace más fácil.',
          subtext: 'GUION PRECARGADO · Una razón irreprochable para repetir exactamente lo que hicieron contigo.',
          effects: [auto(6), oscuro(5), energia(2), flag('faltoPadre')],
          next: 'u4_padre_no',
        },
        {
          id: 'subir',
          text: 'Subir. Pasarle la radio a Javiera, decirle al jefe del traslado que vuelves en veinte minutos y subir las escaleras de dos en dos.',
          subtext: 'ELECCIÓN PROPIA · Confiar en tu equipo para poder estar con tu padre. Alguien va a decir que fue irresponsable.',
          cost: { energia: 12 },
          effects: [oscuro(-8), auto(-4), flag('subioPadre')],
          next: 'u4_padre_si',
        },
        {
          id: 'desde_ninguna',
          coraza: true,
          text: 'Hacer las dos cosas desde ninguna: coordinar por radio desde el pasillo del tercer piso, con un ojo en tu padre y otro en el ascensor.',
          effects: [energia(4), admin(2), flag('subioPadre'), flag('padreRadio')],
          next: 'u4_padre_medio',
        },
      ],
    },
    u4_padre_si: {
      onEnter: [energia(5)],
      text: txt(
        'Llegas a las 10:03. Tu padre está sentado en una silla de ruedas que no necesita, con la bata del hospital mal amarrada y los zapatos puestos. Te ve llegar y frunce el ceño.',
        '—¿Y tú qué haces aquí? ¿No tenías la mudanza?',
        '—Vine a verte —le dices. Es una frase que nunca le habías dicho.',
        'Él mira hacia otro lado. Detrás, tu madre se tapa la boca. Antes de que se lo lleven, tu padre te pasa su reloj —un Casio viejo, de plástico— para que no se lo pierdan. Lo tienes en la mano los cuarenta minutos que dura el examen.',
      ),
      extras: [
        { if: has('javieraAliada'), text: 'Javiera manejó la radio como si lo hubiera hecho siempre. El paciente del ascensor salió a las 10:11, estable.' },
        {
          if: hasNot('javieraAliada'),
          text: 'El paciente del ascensor salió a las 10:25, estable. Javiera te lo informa con un mensaje seco: «Listo. Lo resolví sola.»',
        },
      ],
      next: 'u5',
    },
    u4_padre_no: {
      text: txt(
        'A las 10:31 el ascensor vuelve a funcionar. El paciente llega estable al recinto nuevo. Hiciste bien tu trabajo.',
        'A las 11:15 tu madre te escribe: «Salió bien. Ya nos vamos.» Nada más. Ni un reproche. En tu familia no se reprocha: se archiva.',
      ),
      next: 'u5',
    },
    u4_padre_medio: {
      text: txt(
        'Coordinas el rescate del ascensor por radio desde una silla de plástico del tercer piso, a cuatro metros de tu padre. Él te mira hablar por la radio todo el rato. Tu madre también.',
        'Cuando lo llaman, se levanta solo. —Sigue trabajando —te dice—. Tú eres igual que yo.',
        'No sabes si fue un elogio.',
      ),
      next: 'u5',
    },
    u4: {
      text: 'Bajas al centro de coordinación. Durante cuatro horas eres exactamente lo que el sistema necesita: rápido, claro, sin emociones que estorben. El ascensor se destraba a las 10:20. El paciente llega estable. Nadie se entera de lo cerca que estuvo.',
      next: 'u5',
    },
    u5: {
      text: txt(
        'A las 14:00 se apaga la última luz de Urgencia. Alguien —nunca se sabe quién— deja abierta la puerta del pasillo, como si el edificio todavía necesitara ventilarse.',
        'Esa noche, en la cama, el celular se ilumina una última vez:',
        '> SISTEMA: Transferencia de arquitectura completada.\n> Edificio viejo → edificio nuevo: 100%.\n> Código legacy → código propio: [CALCULANDO]',
        'Afuera, un hospital entero amaneció en otra parte. Adentro, algo en ti también se mudó, aunque todavía no sabes adónde.',
      ),
      extras: [
        {
          if: all(has('subioPadre'), hasNot('padreRadio')),
          text: 'El resultado de la angiografía llega en la tarde: dos arterias estrechas, nada que no se pueda tratar. Tu padre no te llama para contártelo; te lo cuenta tu madre, en un mensaje que termina con algo nuevo: «Gracias por subir.»',
        },
        {
          if: any(has('faltoPadre'), has('padreRadio')),
          text: 'El resultado de la angiografía llega en la tarde, reenviado por tu madre sin comentarios: dos arterias estrechas, tratamiento ambulatorio. Lo lees dos veces. Le pones un pulgar arriba. Te desprecias un poco por el pulgar.',
        },
        { if: has('marisolCaja'), text: 'Marisol te manda una foto: el tazón con su nombre, ya en la estación de enfermería nueva. Sin texto. No hace falta.' },
      ],
      next: '@a3_estudio',
    },
  },
}

export const ESCENAS_ACTO_2: Scene[] = [
  a2_traslado,
  a2_almuerzo,
  a2_recinto,
  a2_mensaje,
  a2_visita,
  a2_cena,
  a2_presupuesto,
  a2_peruano,
  a2_llamada,
  a2_ultimo_turno,
]
