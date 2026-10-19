// ACTO 1 — EL SCRIPT DE FÁBRICA
// Rutina en salud pública. Primer glitch. Primera ingeniería inversa. Contraste en casa.

import type { ActMeta, Scene } from '../../types/content'
import {
  addStatus,
  admin,
  adminMin,
  auto,
  calidez,
  confianza,
  drop,
  energia,
  fantasmas,
  flag,
  frialdad,
  give,
  has,
  log,
  oscuro,
  removeStatus,
  txt,
} from '../dsl'

export const ACTO_1: ActMeta = {
  number: 1,
  title: 'El Script de Fábrica',
  subtitle: 'Todo funciona. Ese es el problema.',
  epigraph: 'Hay días que se viven solos. Uno solo los firma al final.',
  firstScene: 'a1_alarma',
}

const a1_alarma: Scene = {
  id: 'a1_alarma',
  act: 1,
  title: 'Proceso de arranque',
  location: 'Dormitorio',
  time: '06:40',
  day: 'Lunes',
  art: 'dormitorio',
  entorno: 'hogar',
  start: 'inicio',
  nodes: {
    inicio: {
      relational: 'pareja',
      text: txt(
        'La alarma suena por tercera vez. No escuchaste las dos primeras: tu mano aprendió a apagarlas sin consultarte.',
        'En el techo hay una mancha de humedad con forma de nada. Antes de que alcances a pensar una sola frase propia, el pulgar ya desbloqueó el celular. Catorce correos. Tres grupos del trabajo. Un recordatorio: «Clase práctica de manejo — jueves 18:00».',
        'Y un mensaje de {pareja}, enviado anoche, que no abriste: «Día 7. No me lo esperaba, pero aquí estamos.»',
      ),
      choices: [
        {
          id: 'feed',
          autopilot: true,
          text: 'Deslizar el dedo por el feed hasta que el cuerpo se levante solo.',
          effects: [auto(6), energia(4)],
          next: 'ducha',
        },
        {
          id: 'minuto',
          text: 'Dejar el celular boca abajo. Quedarte un minuto registrando qué sientes antes de que el día te asigne un rol.',
          cost: { energia: 5 },
          effects: [admin(5), auto(-4), flag('minutoPropio')],
          next: 'ducha',
        },
        {
          id: 'responder',
          tags: ['salto'],
          text: 'Responderle a {pareja} algo que no sea logística: «Yo tampoco. Y me da un poco de miedo lo bien que se siente.»',
          cost: { energia: 6 },
          effects: [confianza(6), fantasmas(-3), flag('mensajeDia7')],
          next: 'ducha',
        },
        {
          id: 'visto',
          tags: ['regresion'],
          text: 'Dejarlo en visto un rato. Si respondes muy rápido, quizás se nota cuánto te importa.',
          effects: [fantasmas(5), confianza(-2), energia(3)],
          next: 'ducha',
        },
      ],
    },
    ducha: {
      text: txt(
        'Agua caliente. Por un segundo el cuerpo es solo cuerpo. Después vuelve la lista: informe de clima laboral, mediación en Urgencia a las 11:30, la colación de {hija}, la carta de motivación para el magíster que lleva tres semanas en «Borrador».',
        'Te pones el anillo sin mirarlo. El de plata liso, siempre primero. Es lo único de la mañana que eliges tú.',
      ),
      extras: [
        {
          if: has('minutoPropio'),
          text: 'Hoy notaste algo: el pecho apretado desde antes de abrir los ojos. No sabes todavía de qué es. Pero lo notaste, y eso ya es un dato que nadie te pidió.',
        },
        {
          if: has('mensajeDia7'),
          text: 'El celular vibra sobre el lavamanos. {pareja}: «Guardo eso.» Tres palabras. Las relees dos veces antes de salir.',
        },
      ],
      next: '@a1_oficina',
    },
  },
}

const a1_oficina: Scene = {
  id: 'a1_oficina',
  act: 1,
  title: 'Métricas',
  location: 'Unidad de Desarrollo Organizacional',
  time: '08:17',
  day: 'Lunes',
  art: 'oficina',
  entorno: 'burocratico',
  presionTiempo: true,
  onEnter: [addStatus('ruidoInstitucional')],
  start: 'o1',
  nodes: {
    o1: {
      text: txt(
        'La Unidad de Desarrollo Organizacional ocupa una sala que antes fue bodega de insumos. Todavía huele a cartón. En tu pantalla, la encuesta de clima laboral del Servicio de Urgencia: 61% de los funcionarios declara agotamiento emocional alto. El año pasado era 44%.',
        'Hernán aparece en la puerta sin golpear. Siempre parece venir de otra reunión y llegar tarde a la siguiente.',
      ),
      next: 'o2',
    },
    o2: {
      speaker: 'HERNÁN · Subdirector de Gestión de Personas',
      text: '«Necesito el informe de clima para las doce. La directora lo presenta mañana en la visita del Ministerio. Con gráficos, ¿ya? Algo que se vea bien. No le pongamos dramatismo: estamos todos cansados, eso no es noticia.»',
      sourceTags: [
        { kind: 'DEFENSA', min: 20, text: 'Prisa como anestesia: si todo es urgente, nada es discutible.' },
        { kind: 'MIEDO', min: 35, text: 'Su cargo es de exclusiva confianza. Una mala cifra frente al Ministerio puede costarle el puesto en una llamada.' },
        { kind: 'HISTORIA', min: 50, text: 'Hace once años fue el funcionario que denunció. Lo trasladaron dos veces. Aprendió.' },
      ],
      presion: true,
      choices: [
        {
          id: 'presentable',
          autopilot: true,
          text: '«Sin problema. Lo dejo listo y presentable.»',
          effects: [auto(8), energia(4), flag('informeMaquillado')],
          next: 'o3_maquillar',
        },
        {
          id: 'contexto',
          text: '«Puedo hacerlo presentable. Pero el 61% va a estar, con contexto. Si lo escondemos, mañana nadie va a entender por qué renuncian.»',
          cost: { energia: 10 },
          effects: [admin(6), auto(-5), flag('informeHonesto'), drop('rutina')],
          next: 'o3_honesto',
        },
        {
          id: 'inversa',
          visibleIf: adminMin(15),
          text: 'Hacer ingeniería inversa antes de responder: ¿de qué tiene miedo Hernán, en realidad?',
          cost: { energia: 8 },
          effects: [admin(8), auto(-3), flag('hernanLeido')],
          next: 'o3_inversa',
        },
        {
          id: 'excel',
          coraza: true,
          text: 'Hacerlo rápido y sin sentir nada. Es un Excel; las personas detrás del 61% no caben en una celda.',
          effects: [energia(3), auto(3)],
          next: 'o3_coraza',
        },
      ],
    },
    o3_maquillar: {
      text: txt(
        'Cambias el gráfico de barras por uno de torta: en una torta los porcentajes se ven más chicos. Agregas una lámina titulada «Fortalezas», con la frase «Alto compromiso con el usuario». Es verdad, técnicamente. Las personas que se están rompiendo están muy comprometidas.',
        'A las 11:52 lo envías. Hernán responde con un pulgar arriba. Sientes algo parecido al alivio, y también algo parecido a haber firmado un documento sin leerlo.',
      ),
      next: '@a1_reunion',
    },
    o3_honesto: {
      text: txt(
        'Hernán se queda un segundo en silencio. —Ya. Ponlo con contexto, entonces. Pero que el contexto sea corto.',
        'Se va. No sabes si ganaste algo o si acabas de gastar un crédito que vas a necesitar después. Armas el informe: el 61% en la primera lámina, sin torta, con tres citas textuales de la encuesta. Una dice: «Ya no lloro en el baño. No sé si eso es bueno.»',
      ),
      next: '@a1_reunion',
    },
    o3_inversa: {
      text: txt(
        'Lo miras de verdad, por primera vez en meses. La mandíbula apretada. El celular boca abajo en la mano, como si quemara. Hernán no te está pidiendo que mientas: te está pidiendo que lo protejas.',
        'Hay otra opción, una que tu cargo no contempla: protegerlo y no mentir.',
      ),
      presion: true,
      choices: [
        {
          id: 'doslaminas',
          text: '«Hernán, te armo dos láminas: la cifra real y un plan de acción ya en marcha. Que la directora llegue con la mala noticia y la respuesta al mismo tiempo. Así nadie queda expuesto.»',
          cost: { energia: 6 },
          effects: [admin(5), auto(-4), flag('informeHonesto'), flag('hernanAliado'), drop('rutina')],
          next: 'o4_aliado',
        },
        {
          id: 'plazo',
          autopilot: true,
          text: 'Entender su miedo no cambia el plazo. Hacer el informe como lo pidió.',
          effects: [auto(6), energia(3), flag('informeMaquillado')],
          next: 'o3_maquillar',
        },
        {
          id: 'archivar',
          tags: ['analisis'],
          text: 'Archivar el dato para después: «Hernán: evitación por miedo a represalias.» Algún día te puede servir.',
          effects: [admin(4), oscuro(5), flag('hernanArchivado'), flag('informeHonesto')],
          next: 'o3_honesto',
        },
      ],
    },
    o4_aliado: {
      onEnter: [energia(3)],
      text: txt(
        '—…Eso me sirve —dice Hernán. Se queda un segundo más en la puerta, como si fuera a agregar algo. No lo hace.',
        'Pero a las 11:58, cuando envías el informe, te responde: «Gracias. En serio.» Es la primera vez en dos años que usa la palabra «en serio» contigo.',
      ),
      next: '@a1_reunion',
    },
    o3_coraza: {
      text: txt(
        'Abres el Excel y algo se apaga, con una eficiencia casi elegante. Los números dejan de ser personas. Terminas a las 10:40, una hora antes. Nadie te felicita. Tampoco te duele nada.',
        'Esa es la oferta del Protocolo Legacy: no te duele nada. Lo que el contrato no dice es qué más deja de sentirse.',
      ),
      next: '@a1_reunion',
    },
  },
}

const a1_reunion: Scene = {
  id: 'a1_reunion',
  act: 1,
  title: 'Mediación',
  location: 'Sala de reuniones, segundo piso',
  time: '11:30',
  day: 'Lunes',
  art: 'reunion',
  entorno: 'burocratico',
  start: 'r1',
  nodes: {
    r1: {
      text: txt(
        'Sala de reuniones del segundo piso. Una mesa demasiado grande para cuatro personas. En un extremo, Marisol, enfermera supervisora de Urgencia, con los brazos cruzados y el uniforme todavía puesto. En el otro, Patricio, TENS y dirigente gremial, con una carpeta llena de firmas.',
        'El conflicto es simple en el papel: el nuevo sistema de turnos que Marisol implementó hace un mes. Seis renuncias en cuatro semanas. Tú estás al medio porque tu cargo dice «mediación». Tu cargo no dice qué hacer cuando la gente se odia con educación.',
      ),
      next: 'r2',
    },
    r2: {
      speaker: 'MARISOL · Enfermera supervisora',
      text: '«Yo no voy a cambiar el sistema porque algunos se quejen. Si no les acomoda, la puerta es ancha. Hay lista de espera para trabajar aquí.»',
      sourceTags: [
        { kind: 'DEFENSA', min: 15, text: 'Dureza como prueba de competencia: ceder sería admitir que no puede sola.' },
        { kind: 'MIEDO', min: 30, text: 'Si cede, la Subdirección dirá que perdió el control de su equipo. Es la primera mujer en ese cargo en veinte años.' },
        { kind: 'HISTORIA', min: 45, text: 'Lleva tres años sin vacaciones completas. Su madre está en cuidados paliativos en este mismo hospital.' },
      ],
      next: 'r3',
    },
    r3: {
      speaker: 'PATRICIO · TENS, dirigente gremial',
      text: '«Eso mismo dijeron el año pasado, y se fueron seis. La gente no se queja: la gente se está yendo. Y usted lo sabe, señora Marisol, porque usted también está reventada.»',
      sourceTags: [
        { kind: 'DEFENSA', min: 15, text: 'Indignación colectiva: hablar por todos para no tener que hablar de sí mismo.' },
        { kind: 'MOTIVACIÓN', min: 30, text: 'Teme que el liderazgo gremial sea lo único que todavía le da sentido al trabajo.' },
        { kind: 'HISTORIA', min: 45, text: 'Una de las seis renuncias fue su sobrina. La había recomendado él.' },
      ],
      presion: true,
      choices: [
        {
          id: 'puntoencuentro',
          autopilot: true,
          text: '«Entiendo perfectamente ambas posturas. Busquemos un punto de encuentro.»',
          effects: [auto(8), energia(3)],
          next: 'r4_guion',
        },
        {
          id: 'callar',
          text: 'Callar tres segundos más de lo cómodo. Mirar qué hace Marisol con las manos mientras Patricio habla.',
          cost: { energia: 8 },
          effects: [admin(8), auto(-5)],
          next: 'r4_glitch',
        },
        {
          id: 'moderador',
          coraza: true,
          tags: ['analisis'],
          text: 'Activar el modo moderador: tiempos, actas, acuerdos. Observar la escena como un caso clínico, desde arriba.',
          effects: [admin(4), auto(2)],
          next: 'r4_coraza',
        },
      ],
    },
    r4_guion: {
      text: txt(
        'Las palabras salen solas. «Punto de encuentro.» Las has dicho tantas veces que ya no tienen bordes.',
        'Y entonces ocurre algo raro. Por medio segundo escuchas tu propia voz como si viniera de un parlante. Grabada. La misma entonación de la mediación de marzo, de la de octubre del año pasado, de la de hace cuatro años. Marisol y Patricio asienten con la misma cara de cansancio. Nadie te cree. Nadie te creyó nunca. Solo cumplen el rito.',
        'La imagen de la sala parpadea. Un glitch. Como un monitor viejo cuando alguien mueve el cable.',
      ),
      next: 'r5',
    },
    r4_glitch: {
      text: txt(
        'Mientras Patricio habla, Marisol se frota el pulgar contra el índice, una y otra vez, hasta dejarse la piel roja. No está enojada. Está sosteniendo algo que pesa demasiado.',
        'Y en ese instante la sala parpadea. Un glitch: por medio segundo ves la reunión como un programa corriendo. Marisol ejecuta «dureza.exe». Patricio ejecuta «indignación.exe». Y tú, sentado al medio, tenías cargado «mediador_neutral.exe», listo para decir «busquemos un punto de encuentro» con la entonación de siempre.',
        'No lo dijiste. Por primera vez en años hay un silencio que no está en el guion.',
      ),
      next: 'r5',
    },
    r4_coraza: {
      text: txt(
        'Tomas distancia y la escena se ordena sola, como un diagrama: ella defiende territorio, él defiende tribu. Todo es tan claro desde arriba. Tan limpio.',
        'Pero algo falla. La sala parpadea —un glitch— y por medio segundo te ves a ti mismo desde la misma altura: un hombre que analiza para no estar. El modelo lo explica todo, menos por qué tienes las manos frías.',
      ),
      next: 'r5',
    },
    r5: {
      text: txt(
        '> SISTEMA: Se detectó una discrepancia entre el guion y la realidad.',
        'Hay algo debajo de lo que se está diciendo. Puedes intentar leerlo —hacer ingeniería inversa de lo que sienten— o cerrar la ventana del error y seguir.',
      ),
      presion: true,
      choices: [
        {
          id: 'nombrar',
          text: 'Nombrar lo que nadie dice: «Me parece que aquí hay mucho cansancio, y nadie lo está pudiendo decir en voz alta. Empezando por mí.»',
          cost: { energia: 12 },
          effects: [admin(10), auto(-6), flag('mediacionReal')],
          next: 'r6_real',
        },
        {
          id: 'persona',
          requires: adminMin(22),
          text: 'Hablarle a la persona, no al cargo: «Marisol, ¿cuándo fue la última vez que tú pudiste cambiar un turno?»',
          cost: { energia: 10 },
          effects: [admin(12), auto(-8), flag('mediacionReal'), flag('marisolVista'), drop('cuidado')],
          next: 'r6_marisol',
        },
        {
          id: 'mesatecnica',
          autopilot: true,
          text: 'Cerrar la ventana del error. Proponer una mesa técnica en treinta días y levantar el acta.',
          effects: [auto(7), energia(4)],
          next: 'r6_mesa',
        },
        {
          id: 'diagnostico',
          tags: ['analisis'],
          text: 'Anotar el patrón en tu libreta: «M: hiperresponsabilidad defensiva. P: duelo proyectado en lo colectivo.» Diagnóstico perfecto. Intervención: ninguna.',
          effects: [admin(5), oscuro(6), flag('diagnosticoFrio')],
          next: 'r6_mesa',
        },
      ],
    },
    r6_real: {
      onEnter: [energia(4), log('Primer acceso de administrador: leíste lo que había debajo del guion.')],
      text: txt(
        'Silencio. Patricio abre la boca para responder y la cierra. Marisol descruza los brazos, despacio, como si le costara recordar cómo se hace.',
        '—Yo no he dormido una noche entera desde agosto —dice ella, mirando la mesa.',
        'No se resuelve nada del sistema de turnos. Pero por primera vez la reunión es entre personas. Patricio, al salir, te da la mano un segundo más de lo protocolar.',
        'Usaste por primera vez la ingeniería inversa emocional. Cuesta; se nota en el cuerpo. Pero algo en el sistema acaba de registrar un permiso nuevo.',
      ),
      next: '@a1_micro',
    },
    r6_marisol: {
      onEnter: [energia(4), log('Primer acceso de administrador: le hablaste a una persona, no a un cargo.')],
      text: txt(
        'Marisol se queda quieta. Después se ríe, una risa corta y sin alegría. —Nunca. Yo armo los turnos de todos. Los míos no los mira nadie.',
        'Patricio la mira como si la viera por primera vez. —Mi sobrina decía que usted era la única que se quedaba hasta tarde —dice, más bajo.',
        'Algo se desarma sobre la mesa. No es un acuerdo todavía; es algo previo a cualquier acuerdo: dos personas que dejan de ser roles. Marisol propone revisar el sistema con dos representantes del equipo. Patricio acepta.',
        'En el pasillo, Marisol te detiene. —¿Cómo supiste? —No supe —le dices—. Miré.',
      ),
      next: '@a1_micro',
    },
    r6_mesa: {
      text: txt(
        'Se levanta el acta. «Se acuerda conformar mesa técnica.» Todos firman. Todos saben que la mesa técnica es el lugar donde los conflictos van a envejecer en paz.',
        'Al salir, el glitch vuelve un instante: el pasillo se pixela y se recompone. Lo atribuyes al cansancio. Es más cómodo atribuirlo al cansancio.',
      ),
      extras: [
        {
          if: has('diagnosticoFrio'),
          text: 'En tu libreta quedan dos diagnósticos impecables. Los relees en el ascensor y sientes una satisfacción pequeña y helada: entendiste todo. No ayudaste en nada.',
        },
      ],
      next: '@a1_micro',
    },
  },
}

const a1_micro: Scene = {
  id: 'a1_micro',
  act: 1,
  title: 'Veinte minutos de nadie',
  location: 'Micro de vuelta a casa',
  time: '19:05',
  day: 'Lunes',
  art: 'micro',
  entorno: 'transito',
  start: 'm1',
  nodes: {
    m1: {
      text: txt(
        'Micro de vuelta, de pie, una mano en el pasamanos. Afuera la ciudad se derrite en luces de freno. Tu cuerpo todavía está en la sala de reuniones; tu cabeza ya está calculando la noche: la tarea de {hija}, la cena, {pareja} que dijo que pasaría a las ocho.',
        'Tienes veinte minutos de nadie. Veinte minutos en que nadie te necesita en ningún rol.',
      ),
      choices: [
        {
          id: 'correo',
          autopilot: true,
          text: 'Revisar el correo en el celular. Si respondes ahora, mañana llegas con la bandeja limpia.',
          effects: [auto(6), energia(3)],
          next: 'm2',
        },
        {
          id: 'audifonos',
          tags: ['ancla'],
          text: 'Ponerte los audífonos. Un muro de guitarras entre tú y el mundo, hasta que el cuerpo vuelva a ser tuyo.',
          effects: [auto(-6), energia(5), oscuro(2), removeStatus('ruidoInstitucional'), drop('pausa')],
          next: 'm2_musica',
        },
        {
          id: 'ventana',
          text: 'Mirar por la ventana sin estímulo. Dejar que el día se asiente, aunque lo que se asiente no sea agradable.',
          cost: { energia: 4 },
          effects: [admin(5), auto(-4), removeStatus('ruidoInstitucional')],
          next: 'm2',
        },
      ],
    },
    m2_musica: {
      text: txt(
        'Pista tres. Una guitarra que no termina de afinar y una voz que no le pide permiso a nadie. Durante cuatro minutos no eres especialista, ni mediador, ni padre, ni nada. Solo alguien a quien le gusta una canción que nadie más en esta micro conoce.',
        'Es un cortafuegos. También es, si lo dejas, una puerta que se cierra desde adentro. Por hoy es lo primero.',
      ),
      next: 'm2',
    },
    m2: {
      text: 'La micro frena en tu paradero. Subes las escaleras del edificio contando los peldaños, una costumbre de infancia que nunca supiste de dónde venía. Detrás de la puerta se escucha la voz de {hija} y la risa de {pareja}.',
      extras: [
        {
          if: has('mediacionReal'),
          text: 'Llevas algo distinto en el pecho. No es cansancio, exactamente. Es como cuando se abre una ventana en una pieza cerrada y entra un aire que no sabías que te faltaba.',
        },
      ],
      next: '@a1_casa',
    },
  },
}

const a1_casa: Scene = {
  id: 'a1_casa',
  act: 1,
  title: 'Contraste',
  location: 'Departamento',
  time: '20:10',
  day: 'Lunes',
  art: 'hogar',
  entorno: 'hogar',
  relational: 'ambos',
  start: 'h1',
  nodes: {
    h1: {
      relational: 'hija',
      text: txt(
        '{hija} está en la mesa del living, rodeada de lápices. Tiene diez años y una forma de concentrarse que te da un poco de vértigo, porque es la tuya: el mundo entero puede caerse alrededor y ella no levanta la vista.',
        '{pareja} cocina algo que huele a ajo y a domingo, aunque sea lunes, y te saluda desde la cocina con la cuchara en alto. Es el día siete. Hace un año, el día siete era un número imposible.',
        '—Hola —dice {hija}, sin levantar la vista. Y después, todavía sin mirarte—: Hoy la Antonia dijo que mi dibujo era feo. Pero no me importa.',
      ),
      sourceTags: [
        { kind: 'PATRÓN', min: 10, text: '«No me importa» con voz plana: el mismo tono que usas tú para cerrar un tema.' },
        { kind: 'MIEDO', min: 25, text: 'Si muestra que le dolió, teme que tú también lo despaches rápido.' },
        { kind: 'HISTORIA', min: 40, text: 'Aprendió esa frase mirándote. No te la escuchó: te la vio hacer.' },
      ],
      choices: [
        {
          id: 'tareas',
          autopilot: true,
          text: '«Bien, no le hagas caso. ¿Hiciste las tareas?»',
          effects: [auto(5), energia(3), frialdad(6)],
          next: 'h2_cierre',
        },
        {
          id: 'suelo',
          tags: ['presencia'],
          text: 'Sentarte en el suelo, a su altura. No arreglar nada. Preguntar: «¿Y qué sentiste cuando lo dijo?»',
          cost: { energia: 10 },
          effects: [calidez(10), frialdad(-4), admin(3), drop('cuidado')],
          next: 'h2_presencia',
        },
        {
          id: 'espejo',
          tags: ['presencia'],
          requires: adminMin(20),
          text: 'Reconocer el patrón y nombrarlo con cuidado: «Yo también digo que no me importa cuando sí me importa. Es un truco que aprendí de chico. No funciona muy bien.»',
          cost: { energia: 10 },
          effects: [calidez(14), frialdad(-8), admin(5), flag('patronNombradoHija')],
          next: 'h2_espejo',
        },
        {
          id: 'explicar',
          tags: ['analisis'],
          text: 'Explicarle, con lógica impecable, por qué los niños de su edad dicen esas cosas: jerarquías, pertenencia, estatus.',
          effects: [admin(3), frialdad(5), energia(2)],
          next: 'h2_analisis',
        },
      ],
    },
    h2_cierre: {
      relational: 'hija',
      text: txt(
        '—Sí —dice ella. Y sigue dibujando.',
        'La conversación termina ahí, limpia, sin heridas visibles. Exactamente como terminaban las tuyas a su edad. Ella guarda el dibujo en la mochila, doblado, sin mostrártelo.',
      ),
      next: 'h3',
    },
    h2_presencia: {
      onEnter: [energia(5)],
      relational: 'hija',
      text: txt(
        'Ella levanta la vista, sorprendida de encontrarte a su altura.',
        '—Rabia —dice. Y después, más bajo—: Y como vergüenza. Porque a mí me había gustado.',
        'No le dices que el dibujo es lindo. No le dices que la Antonia es una pesada. Solo te quedas ahí, en el suelo, con las rodillas crujiendo, mientras ella te explica que el árbol es morado a propósito. Diez minutos. Te cuestan como una jornada entera. Valen más.',
      ),
      next: 'h3',
    },
    h2_espejo: {
      relational: 'hija',
      onEnter: [energia(5), give('dibujo_hija'), log('{hija} te regaló el dibujo que iba a botar.', 'vinculo')],
      text: txt(
        '{hija} te mira largo rato, con esa seriedad de los niños cuando descubren que los adultos también tienen trucos.',
        '—¿Y qué haces en vez de eso? —pregunta.',
        '—Estoy aprendiendo —le dices. Es la respuesta más honesta que has dado en todo el día.',
        'Ella lo piensa. Después te pasa el dibujo: un árbol morado, una montaña, dos figuras con la boca abierta. Lo dobla en cuatro antes de dártelo. —Era para ti. Lo iba a botar.',
      ),
      next: 'h3',
    },
    h2_analisis: {
      relational: 'hija',
      text: txt(
        'Le explicas la dinámica de los grupos, la necesidad de pertenencia, cómo algunos niños bajan a otros para subir ellos. Es una buena explicación. Podrías darla en un seminario.',
        '{hija} asiente con cortesía, como asiente Marisol en las reuniones. —Ya —dice—. Entonces no importa.',
        'Es exactamente lo que había dicho al principio. Solo que ahora tiene argumentos.',
      ),
      next: 'h3',
    },
    h3: {
      relational: 'pareja',
      text: txt(
        'Más tarde. {hija} duerme. La cocina todavía huele a ajo. {pareja} seca los platos y tú los guardas, una coreografía doméstica que hace un año habría parecido un milagro.',
        '—Te noté lejos en la cena —dice {pareja}, sin dejar de secar—. No es reclamo. Solo lo noté.',
      ),
      sourceTags: [
        { kind: 'MIEDO', min: 15, text: 'Que tu lejanía de hoy sea el primer síntoma de otra ruptura.' },
        { kind: 'DEFENSA', min: 30, text: '«No es reclamo»: se adelanta a tu defensa para que no te vayas.' },
        { kind: 'HISTORIA', min: 45, text: 'Las últimas tres veces que se separaron empezó así: una cena en silencio que nadie nombró.' },
      ],
      presion: true,
      choices: [
        {
          id: 'cansado',
          tags: ['regresion'],
          text: '«Estoy cansado, nada más.» Y por dentro, empezar a revisar si esta semana fue real o un espejismo estadístico.',
          effects: [fantasmas(8), confianza(-3), energia(4)],
          next: 'h4_regresion',
        },
        {
          id: 'guionpropio',
          tags: ['salto'],
          text: '«Hoy, en una reunión, me escuché repitiendo frases que no eran mías. Y me asustó un poco. Creo que llevo años hablando en piloto automático.»',
          cost: { energia: 10 },
          effects: [confianza(10), fantasmas(-6), admin(3)],
          next: 'h4_salto',
        },
        {
          id: 'tudia',
          autopilot: true,
          text: 'Cambiar de tema con la pregunta correcta en el momento incorrecto: «¿Y a ti cómo te fue hoy?»',
          effects: [auto(5), confianza(2), fantasmas(3)],
          next: 'h4_auto',
        },
        {
          id: 'gestion',
          coraza: true,
          tags: ['analisis'],
          text: 'Explicar tu agotamiento como un problema de gestión: carga laboral, causas, plan de acción. Ordenado. Sin temblor.',
          effects: [admin(2), fantasmas(4)],
          next: 'h4_coraza',
        },
      ],
    },
    h4_regresion: {
      relational: 'pareja',
      text: txt(
        '—Ya —dice {pareja}. Deja el paño doblado sobre la mesa, exactamente en la mitad.',
        'Mientras se lava los dientes, tú haces lo de siempre: un inventario frío. Siete días. Probabilidad de que dure, dados los antecedentes: baja. Costo de apostar: alto. Es un análisis impecable. Te deja solo con él en la cocina.',
      ),
      next: 'h5',
    },
    h4_salto: {
      onEnter: [energia(6)],
      relational: 'pareja',
      text: txt(
        '{pareja} deja de secar. Se te queda mirando con el paño en la mano, como si hubieras dicho algo en otro idioma, uno que llevaba tiempo esperando escuchar.',
        '—Gracias por decírmelo —dice—. Yo también hablo en automático cuando tengo miedo. Contigo, sobre todo. Al principio.',
        'No arreglan nada. No hay plan de acción. Pero esa noche el silencio del departamento no es un silencio que mide distancias.',
      ),
      next: 'h5',
    },
    h4_auto: {
      relational: 'pareja',
      text: txt(
        '{pareja} te cuenta su día. Escuchas a medias, asintiendo en los lugares correctos. Es una conversación funcional, como un formulario bien llenado.',
        'Al final, {pareja} dice «bueno» de una forma que significa varias cosas a la vez. No preguntas cuáles.',
      ),
      next: 'h5',
    },
    h4_coraza: {
      relational: 'pareja',
      text: txt(
        'Lo explicas con claridad: sobrecarga, falta de límites, un plan en tres pasos. {pareja} escucha con atención y al final asiente.',
        '—Suena muy ordenado —dice—. ¿Y cómo te sientes tú? Porque eso no lo dijiste.',
        'No tienes respuesta. La coraza no tiene un campo para eso.',
      ),
      next: 'h5',
    },
    h5: {
      text: txt(
        'Antes de dormir, el celular brilla en la oscuridad. No es un correo. Es una notificación que no reconoces, en una tipografía que parece de otra época:',
        '> SISTEMA: Se detectaron procesos ejecutándose sin autorización del usuario.\n> ¿Desea revisar el código fuente?',
        'La pantalla se apaga sola. Te quedas mirando el techo. La mancha de humedad sigue ahí, con forma de nada. O quizás no. Quizás tiene forma de algo y nunca la miraste lo suficiente.',
      ),
      next: '@a2_traslado',
    },
  },
}

export const ESCENAS_ACTO_1: Scene[] = [a1_alarma, a1_oficina, a1_reunion, a1_micro, a1_casa]
