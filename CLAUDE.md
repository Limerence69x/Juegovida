# CLAUDE.md - Especificación del Proyecto: "Código Propio" (RPG Psicológico)

## 1. Visión General del Proyecto
"Código Propio" es una aplicación web interactiva de rol y toma de decisiones en estética pixel-art/retro-terminal, estructurada en 5 actos. 
- **Premisa Filosófica:** El ser humano opera como un sistema programado por normas sociales, exigencias institucionales y patrones familiares heredados ("Código Legacy"). El objetivo del jugador es pasar de actuar por inercia (como un NPC) a obtener "Permisos de Administrador" sobre su propia mente, evitando caer en su "Lado Oscuro": el refugio del desapego, la intelectualización fría y el aislamiento defensivo.
- **El Protagonista:** Especialista en Desarrollo Organizacional en el sector de salud pública, preparándose para un magíster en psicología, aficionado al trekking de montaña, en proceso de sacar su licencia de conducir, padre de una niña de 10 años y en una relación de pareja que, tras mucho tiempo de intentos e inestabilidad, acaba de cumplir 1 semana de estabilidad real.

## 2. Stack Tecnológico Requerido
- **Framework:** React 18+ con TypeScript y Vite.
- **Estilos:** Tailwind CSS + CSS personalizado para estética Pixel-Art / CRT sutil (fuentes monoespaciadas/pixel como 'Press Start 2P' o 'VT323' combinadas con fuente limpia de lectura para textos largos).
- **Gestión de Estado:** Zustand (con persistencia en `localStorage`).
- **Arquitectura de Datos:** Motor narrativo desacoplado basado en archivos JSON/TypeScript tipados (escenas, nodos de diálogo, condiciones de visibilidad, modificadores de estado y drops de inventario).

## 3. Mecánicas Core y Variables de Estado (`GameState`)

### 3.1. Barras de Sistema (0 a 100)
1. **`automatismo` (Inercia):** Sube al responder en piloto automático, acatar burocracia sin cuestionar o usar máscaras sociales. Si llega a 100, el sistema bloquea las opciones auténticas y elige automáticamente la respuesta más vacía/políticamente correcta.
2. **`permisosAdmin` (Consciencia):** Sube al hacer "ingeniería inversa" de las dinámicas humanas y cuestionar el propio guion. Desbloquea opciones de diálogo ocultas y permite ver "etiquetas de código fuente" (miedos, defensas o motivaciones reales) en los diálogos de otros personajes.
3. **`energiaMental` (Batería):** Recurso que se gasta al filtrar el estrés laboral y sostener presencia emocional real.
4. **`ladoOscuro` (Coraza de Distancia / Protocolo Legacy):** Habilidad pasiva heredada de una familia fría. El jugador puede activarla en momentos de alta presión para no gastar `energiaMental` ni sufrir estrés, pero su uso congela los vínculos afectivos y aumenta el cinismo.

### 3.2. Nodos Relacionales (El Motor Emocional)
1. **Hija (10 años) - `EspejoGeneracional`:**
   - No usa una barra de afecto común, sino un registro de **`memoriaObservacion`** (`calidezAprendida` vs. `frialdadHeredada`).
   - En las escenas con ella, el jugador pasa de ser "usuario" a ser "programador". Si el jugador llega con la `Coraza de Distancia` activa o alto `automatismo`, la interfaz muestra una notificación sutil: *"Ella está registrando este patrón de silencio"*. Romper el ciclo requiere gastar `energiaMental` para estar genuinamente presente.
2. **Pareja - `SincronizacionFaseBeta` (Contador: Día 7 de Estabilidad):**
   - Tiene dos variables en tensión: **`confianzaAcumulada`** y **`fantasmasInestabilidad`**.
   - Ante roces cotidianos, el jugador debe elegir entre el *Impulso de Regresión* (tomar distancia preventiva, analizar la relación fríamente como un problema técnico) o el *Salto de Fe* (mostrarse vulnerable y proteger la estabilidad recién ganada).
3. **Familia de Origen - `CodigoLegacy`:**
   - Eventos de alta estática visual donde predomina la ambigüedad y la lejanía. Salir de estas escenas sin haber gastado `permisosAdmin` aplica el estado alterado *Contagio de Frialdad*, que penaliza las siguientes interacciones con la Hija y la Pareja.

## 4. Sistema de Inventario y Loot ("Anclas de Identidad")
Los objetos tienen 4 niveles de rareza (`Común`, `Raro`, `Épico`, `Singular`) y se obtienen mediante decisiones o eventos aleatorios (sistema de drop con probabilidades). Sirven para anclar la identidad del protagonista frente a la homogeneización del entorno:
- **Frecuencias de Aislamiento (Música Indie/Alt-Rock):** Consumibles/Activables que funcionan como cortafuegos auditivo; limpian el estado de *Ruido Institucional* y reducen `automatismo`.
- **Reloj Mecánico Automático (Rareza Épica):** Equipable. Otorga resistencia pasiva contra eventos de presión de tiempo administrativa.
- **Decants de Perfumes Nicho (Rareza Rara):** Consumibles antes de escenas clave. Alteran la percepción sensorial, reduciendo la ansiedad y habilitando opciones creativas o empáticas.
- **Anillos de Plata y Joyería (Rareza Común/Rara):** Equipables. Reducen la ganancia de `automatismo` en entornos burocráticos.

## 5. Estructura de los 5 Actos
- **Acto 1: El Script de Fábrica.** Paleta de colores desaturada. Rutina en salud pública (métricas, reportes, mediaciones). El jugador descubre el primer *glitch* en una reunión tensa y usa por primera vez la ingeniería inversa emocional, para luego llegar a casa y enfrentar el contraste con su hija y su pareja.
- **Acto 2: Choque de Arquitecturas.** Alta presión por la transición hacia un nuevo recinto hospitalario. Dilema entre aplicar parches burocráticos o proteger la cultura del equipo, mientras en paralelo intenta que el agotamiento no sabotee la "Semana 1" de estabilidad con su pareja ni una visita ambigua de su familia de origen.
- **Acto 3: Ingeniería Inversa.** Preparación del posgrado en psicología. La UI se actualiza mostrando las defensas psicológicas de los NPCs en tiempo real. El riesgo principal es caer en el `ladoOscuro` (volver a las personas objetos de análisis clínico, enfriando el vínculo en casa).
- **Acto 4: Desconexión de la Red.** Cambio de escenario a una ruta de trekking en la montaña. Mecánica de gestión de ritmo, soledad y vaciado de "memoria caché". En el campamento nocturno, sin máscaras sociales ni cargos que imitar, el protagonista enfrenta sus propios miedos sobre la paternidad y el apego.
- **Acto 5: Toma de Control Manual.** Metáfora de conducción (examen práctico/tomar el volante) combinada con el Jefe Final: una batalla dialéctica contra su propio **Algoritmo de Inercia**, que intenta convencerlo con lógica impecable de que el desapego frío es más seguro que amar y arriesgarse a perder.

## 6. Requisitos de Interfaz (UI/UX)
- **Layout:** Vista dividida en 3 paneles en escritorio (Panel Izquierdo: Estado del Sistema, Reloj y Nodos Relacionales; Panel Central: Escena visual en Pixel-Art/ASCII estilizado, texto narrativo con efecto máquina de escribir y opciones de diálogo; Panel Derecho: Inventario de Anclas y Registro de Consciencia/Logs).
- **Feedback Visual Dinámico:** Cuando `automatismo` o `ladoOscuro` superan el 70%, la interfaz se vuelve monocromática, fría y rígida. Cuando `permisosAdmin` y la conexión con la Hija/Pareja son altos, la paleta incorpora tonos cálidos y orgánicos.
- **Etiquetas de Subtexto:** Las opciones de diálogo deben mostrar indicadores claros cuando requieren `permisosAdmin`, cuando activan la `Coraza de Distancia` o cuando implican un gasto de `energiaMental`.

## 7. Reglas de Desarrollo para Claude Code
- Construye el código de forma modular (`src/types`, `src/store`, `src/data/acts`, `src/components`).
- No uses placeholders vacíos en la narrativa: redacta diálogos con peso psicológico real, tono introspectivo, maduro y sin clichés infantiles.
- Asegúrate de que todas las decisiones modifiquen al menos dos variables en tensión (ninguna decisión debe ser "gratis").
