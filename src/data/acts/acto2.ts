// ACTO 2 — CHOQUE DE ARQUITECTURAS
// Traslado a un nuevo recinto hospitalario. Parches vs. cultura. Semana 1 en riesgo. Visita legacy.

import type { ActMeta, Scene } from '../../types/content'
import {
  addStatus,
  admin,
  adminMin,
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
          autopilot: true,
          text: '«Lo tienes el jueves.» Plantilla del traslado anterior, cambiar fechas y logo. Afiches con gente sonriendo en un hospital que todavía no existe.',
          effects: [auto(8), energia(4), flag('parcheBurocratico')],
          next: 't3',
        },
        {
          id: 'duelo',
          text: '«Te propongo otra cosa: antes de los afiches, escuchar a los equipos. Qué pierden con el traslado, no solo qué ganan. Un plan que no escucha el duelo se rompe en la primera semana.»',
          cost: { energia: 10 },
          effects: [admin(7), auto(-6), flag('protegerCultura')],
          next: 't3',
        },
        {
          id: 'dobleplan',
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
          autopilot: true,
          text: '«Rápido. Así funciona esto. Ya vas a aprender.»',
          effects: [auto(6), energia(3), flag('javieraDesilusion')],
          next: '@a2_almuerzo',
        },
        {
          id: 'bien',
          text: '«Las dos cosas no siempre se pueden. Esta vez vamos a intentar hacerlo bien, y te voy a necesitar para eso.»',
          cost: { energia: 8 },
          effects: [admin(5), auto(-3), flag('javieraAliada')],
          next: 't4_javiera',
        },
        {
          id: 'kotter',
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
          autopilot: true,
          text: 'Almorzar frente a la pantalla y responder correos. El reloj puede esperar; {pareja} también.',
          effects: [auto(6), energia(2), fantasmas(3)],
          next: 'al2_escritorio',
        },
        {
          id: 'reloj',
          tags: ['ancla'],
          text: 'Caminar las cuatro cuadras hasta la relojería. Recuperar algo que marca tu hora y no la del sistema.',
          cost: { energia: 6 },
          effects: [auto(-5), admin(3), give('reloj_automatico')],
          next: 'al2_reloj',
        },
        {
          id: 'llamar',
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
          autopilot: true,
          text: '«Don Ramón, el edificio nuevo tiene una sala de pausa saludable con sillones ergonómicos. Está en el plan.»',
          effects: [auto(7), energia(3), flag('ramonIgnorado')],
          next: 're3',
        },
        {
          id: 'escalera',
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
          autopilot: true,
          text: 'Responder «Ok 👍» y poner una serie. La forma más rápida de no sentir algo es fingir que no hay nada que sentir.',
          effects: [auto(6), fantasmas(5), energia(3)],
          next: 'me2_ok',
        },
        {
          id: 'verdad',
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
          tags: ['salto'],
          text: 'Ir. Tomar un taxi, llegar con dos cafés de máquina y no decir nada importante. Solo estar.',
          cost: { energia: 12 },
          effects: [confianza(12), fantasmas(-6), flag('urgenciasPareja')],
          next: 'me4_ir',
        },
        {
          id: 'avisame',
          autopilot: true,
          text: '«Avísame cualquier cosa. Mañana tengo reunión temprano.» Es razonable. Es lo que haría cualquiera.',
          effects: [auto(5), energia(4), fantasmas(4)],
          next: '@a2_visita',
        },
        {
          id: 'enlinea',
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
          autopilot: true,
          text: 'Responder en su mismo idioma: «Sí, sigue.» Datos, logística, el clima, la fruta. Nada que pueda doler.',
          effects: [auto(6), oscuro(4), energia(3)],
          next: 'v2',
        },
        {
          id: 'verpatron',
          text: 'Ver el patrón mientras ocurre: tu madre pregunta por todo menos por cómo estás. No es desprecio. Es el único idioma que le enseñaron.',
          cost: { permisos: 8 },
          effects: [oscuro(-5), energia(-4)],
          next: 'v2_visto',
        },
        {
          id: 'nombrar',
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
          autopilot: true,
          text: 'Reírte un poco y cambiar de tema. Como siempre. Que el comentario se disuelva solo.',
          effects: [auto(5), frialdad(5), energia(2)],
          next: 'v4',
        },
        {
          id: 'quienteenseno',
          tags: ['presencia'],
          text: 'Ver lo que hay debajo y responder desde ahí: «¿Quién te enseñó a ti, papá?»',
          cost: { permisos: 10, energia: 10 },
          effects: [calidez(6), oscuro(-6), flag('preguntaPadre')],
          next: 'v4_padre',
        },
        {
          id: 'paraella',
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
          autopilot: true,
          text: '«Así es la abuela, no más. Cada uno es como es.»',
          effects: [auto(5), frialdad(6), energia(2)],
          next: 'c2',
        },
        {
          id: 'nadiele',
          tags: ['presencia'],
          text: '«No sé, la verdad. Creo que a ella nadie le dijo nunca que algo suyo le gustaba. Y uno aprende a decir lo que escuchó.» Y después, mirándola: «A mí me gusta mucho cómo pusiste la mesa.»',
          cost: { energia: 12 },
          effects: [calidez(12), frialdad(-6), admin(3)],
          next: 'c2_calidez',
        },
        {
          id: 'truco',
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
          tags: ['salto'],
          text: 'Dejar los platos. Darte vuelta. «Sí. Me cuesta sacármelos. ¿Me ayudas?»',
          cost: { energia: 10 },
          effects: [confianza(10), fantasmas(-6), oscuro(-3), give('decant_higo'), flag('regaloDecant')],
          next: 'c4',
        },
        {
          id: 'estoybien',
          tags: ['regresion'],
          text: '«Estoy bien.» Y seguir lavando. La espalda tensa, la vista en el plato, la distancia en su lugar.',
          effects: [fantasmas(7), confianza(-3), energia(3)],
          next: 'c4',
        },
        {
          id: 'broma',
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
      next: '@a3_estudio',
    },
  },
}

export const ESCENAS_ACTO_2: Scene[] = [a2_traslado, a2_almuerzo, a2_recinto, a2_mensaje, a2_visita, a2_cena]
