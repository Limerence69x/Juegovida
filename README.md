# Código Propio

RPG psicológico en cinco actos, en estética pixel-art / terminal retro. El protagonista funciona como un sistema programado por normas sociales, exigencias institucionales y patrones familiares heredados; el objetivo es pasar de actuar por inercia a obtener **permisos de administrador** sobre su propia mente sin caer en el **lado oscuro** (desapego, intelectualización, aislamiento defensivo).

La especificación completa está en [`CLAUDE.md`](./CLAUDE.md).

## Correr el proyecto

```bash
npm install
npm run dev        # servidor de desarrollo
npm test           # validación de contenido + motor + partidas completas simuladas
npm run build      # typecheck + build de producción en dist/
npm run lint       # oxlint
```

`/?galeria` abre una galería con todos los decorados pixel-art en sus tres estados anímicos (útil para trabajar el arte sin jugar).

## Arquitectura

```
src/
├── types/          Contratos: GameState (estado) y content.ts (escenas, nodos, condiciones, efectos)
├── data/
│   ├── acts/       acto1.ts … acto5.ts — la narrativa, como datos tipados
│   ├── dsl.ts      Atajos de autoría: auto(+8), calidez(10), has('flag'), adminMin(30)…
│   ├── items.ts    Anclas de Identidad (4 rarezas)
│   ├── dropTables.ts, statuses.ts, endings.ts
├── engine/         Motor narrativo PURO (GameState → GameState). Sin React.
│   ├── engine.ts   Decisiones, costos, coraza, drops, navegación, hooks de escena
│   ├── conditions.ts, vars.ts, endings.ts, text.ts, rng.ts, registry.ts
│   ├── validate.ts Validador estático del contenido
│   └── engine.test.ts
├── store/          Zustand + persist (localStorage seguro: nunca rompe si no hay almacenamiento)
├── theme/mood.ts   Estado anímico → paleta (frío / neutro / cálido) y recoloreo del pixel-art
└── components/     UI: 3 paneles, escena en canvas, máquina de escribir, pantallas
```

El motor no conoce el contenido y la UI no contiene reglas de juego: cada acción del store llama a una función pura de `engine/` y guarda el resultado. Por eso todo el juego se puede simular en tests sin navegador.

## Mecánicas implementadas

| Mecánica | Dónde vive |
|---|---|
| Barras `automatismo`, `permisosAdmin`, `energiaMental`, `ladoOscuro` (0–100) | `engine/vars.ts`, `engine.ts` |
| Automatismo 100 → opciones auténticas bloqueadas y cuenta regresiva que elige la respuesta vacía; una Frecuencia corta el piloto automático | `getChoiceViews`, `ScenePanel` |
| Etiquetas de código fuente (DEFENSA, MIEDO, MOTIVACIÓN, HISTORIA, PATRÓN) según permisos; +15 de lectura desde el Acto 3 | `visibleSourceTags` |
| Opciones ocultas (`visibleIf`) y bloqueadas con motivo (`requires` + `lockHint`) | `content.ts`, `ChoiceButton` |
| Coraza de Distancia: sólo en nodos `presion`; anula costos de energía y estrés, suma lado oscuro y enfría vínculos; quitarla cuesta energía; cae sola entre actos | `toggleCoraza`, `applyPassives` |
| Hija (`calidezAprendida` / `frialdadHeredada`) + aviso «Ella está registrando este patrón de silencio» | `hijaRegistrando`, `enterNode` |
| Pareja (`confianzaAcumulada` / `fantasmasInestabilidad`, contador de días, posible pausa en el Acto 3) | `acto3.ts → p4.nextIf` |
| Código Legacy: salir de la escena sin gastar permisos → Contagio de Frialdad (4 interacciones) | `exitScene` |
| Inventario con rarezas, equipables por ranura, consumibles y drops con semilla reproducible | `items.ts`, `dropTables.ts`, `rollDrop` |
| Estados alterados: Ruido Institucional, Ansiedad, Contagio de Frialdad, Sentidos Abiertos | `statuses.ts` |
| Paleta dinámica: >70 de automatismo o lado oscuro → monocromo frío y rígido; permisos y vínculo altos → cálido | `theme/mood.ts`, `index.css` |
| Jefe final dialéctico: la coherencia del Algoritmo baja con argumentos propios y sube si le respondes en su idioma | `acto5.ts` |
| Cuatro finales ponderados por todo el recorrido | `engine/endings.ts`, `data/endings.ts` |

## Escribir contenido

Una escena es un objeto `Scene` con nodos. Cada decisión declara sus costos y efectos:

```ts
{
  id: 'nombrar',
  text: 'Nombrar lo que nadie dice: «…»',
  cost: { energia: 12 },                 // bloquea si no alcanza; la coraza lo anula
  requires: adminMin(22),                // visible pero bloqueada con motivo
  effects: [admin(10), auto(-6), flag('mediacionReal'), drop('cuidado')],
  next: 'r6_real',                       // nodo, '@escena' o '#FIN'
}
```

`npm test` corre `validateContent()`, que **falla el build de pruebas** si:

- una decisión mueve menos de 2 variables, o no tiene **a la vez** un costo y una ganancia (regla §7: ninguna decisión es gratis);
- un nodo con 2+ opciones no tiene exactamente una de piloto automático, o ésta tiene requisitos/costos (evita bloqueos sin salida);
- hay destinos, ítems o tablas de drop inexistentes, o escenas inalcanzables.

Además, los tests simulan 60 partidas aleatorias completas y verifican que jugar siempre en piloto automático termina en el final NPC y que jugar con presencia auténtica puede alcanzar los permisos de administrador.
