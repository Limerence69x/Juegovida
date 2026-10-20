// Decorados pixel-art de cada escena (160×90). Se dibujan con colores "naturales";
// la paleta del acto y el estado anímico los recolorean después vía Gfx.tint.

import type { SceneArt } from '../../types/content'
import { Gfx, H, seeded, W } from './gfx'

const P = {
  ink: '#0c0e10',
  wood: '#7a5638',
  wood2: '#5e4029',
  metal: '#8a9399',
  metal2: '#5c656b',
  white: '#e8ecea',
  paper: '#d9d4c3',
  skin: '#d9a77f',
  hair: '#2b2018',
  hair2: '#5a3a22',
  glass: '#9ab7c9',
  screen: '#9fe3d0',
  screenDark: '#1d3b36',
  lamp: '#ffd38a',
  green: '#39ff8a',
  greenDim: '#1f6b45',
  red: '#d9776b',
  snow: '#eef3f7',
  rock: '#8a8478',
  rock2: '#6b665c',
  star: '#ffffff',
}

type Painter = (g: Gfx) => void

const dormitorio: Painter = (g) => {
  g.rect(0, 0, W, H, '#1c2333')
  // mancha de humedad con forma de nada
  for (const [x, y, w] of [[38, 5, 9], [36, 6, 13], [37, 7, 10], [40, 8, 5]] as const) g.rect(x, y, w, 1, '#151b28')
  // ventana con persianas y amanecer
  g.bands(110, 12, 36, 40, ['#3a2f4f', '#a8645a', '#e08a5a', '#f2c27b'])
  for (let y = 12; y < 52; y += 4) g.rect(110, y, 36, 1, '#262b3a')
  g.rect(108, 10, 40, 2, '#2d3446')
  g.rect(108, 52, 40, 2, '#2d3446')
  g.alpha(0.25, () => {
    for (let i = 0; i < 6; i++) g.rect(60 + i * 6, 40 + i * 4, 46 - i * 6, 2, '#f2c27b')
  })
  // cama
  g.rect(8, 46, 4, 32, P.wood2)
  g.rect(12, 58, 90, 20, '#3d4a6b')
  g.rect(40, 54, 44, 5, '#45547a')
  g.rect(14, 53, 22, 6, '#cfd3dc')
  g.rect(22, 51, 6, 5, P.skin)
  g.rect(22, 50, 6, 2, P.hair)
  // velador y celular que vibra
  g.rect(102, 64, 16, 14, P.wood2)
  g.rect(106, 62, 8, 2, '#111418')
  const vibra = Math.floor(g.t * 2) % 3 === 0
  if (vibra) g.alpha(0.6, () => g.rect(103, 56, 14, 6, '#6fc7d8'))
  g.rect(107, 62, 6, 1, vibra ? '#9fe3f0' : '#2a3a44')
  g.rect(0, 78, W, 12, '#151924')
}

const oficina: Painter = (g) => {
  g.rect(0, 0, W, 62, '#5b6660')
  g.rect(0, 44, W, 18, '#4f5a55')
  // ventana con persianas
  g.rect(10, 10, 44, 30, '#9fb3c4')
  for (let y = 10; y < 40; y += 3) g.rect(10, y, 44, 1, '#6c7a85')
  g.rect(8, 8, 48, 2, '#3f4844')
  // tubo fluorescente que parpadea
  const falla = Math.floor(g.t * 9) % 17 === 0
  g.rect(70, 3, 40, 2, falla ? '#6f7a78' : '#eef6f4')
  if (!falla) g.alpha(0.12, () => g.rect(50, 5, 80, 30, '#eef6f4'))
  // escritorio
  g.rect(0, 62, W, 5, P.wood)
  g.rect(0, 67, W, 23, '#2e2a26')
  g.rect(6, 67, 4, 23, P.wood2)
  g.rect(150, 67, 4, 23, P.wood2)
  // monitor con el 61%
  g.rect(68, 32, 44, 28, '#1b1f22')
  g.rect(70, 34, 40, 22, P.screenDark)
  const bars = [6, 9, 7, 16, 8]
  bars.forEach((h, i) => g.rect(74 + i * 7, 54 - h, 5, h, i === 3 ? P.red : '#6fb39f'))
  if (Math.floor(g.t * 2) % 2) g.rect(106, 36, 2, 3, P.screen)
  g.rect(88, 60, 4, 2, '#1b1f22')
  g.rect(76, 60, 28, 2, '#c9cdc9')
  // carpetas y planta
  ;['#c9a86a', '#8fb3a1', '#d9d4c3', '#b98a6a'].forEach((c, i) => g.rect(122 - i, 58 - i * 4, 22, 4, c))
  g.rect(22, 54, 8, 8, '#8a5a3a')
  for (const [x, y] of [[24, 48], [21, 50], [28, 49], [26, 46], [30, 51], [23, 45]]) g.rect(x, y, 3, 3, '#4f8a4f')
  // respaldo de silla en primer plano
  g.rect(64, 74, 52, 16, '#202425')
}

const reunion: Painter = (g) => {
  g.rect(0, 0, W, 50, '#5f6a66')
  g.rect(0, 50, W, 40, '#3a3633')
  // pizarra con flechas que nadie entiende
  g.rect(54, 8, 52, 24, '#e8ecea')
  g.rect(54, 32, 52, 2, '#8a9399')
  const rnd = seeded(7)
  for (let i = 0; i < 9; i++) {
    const x = 58 + rnd() * 40
    const y = 12 + rnd() * 16
    g.line(x, y, x + 4 + rnd() * 10, y + (rnd() - 0.5) * 6, i % 3 ? '#4a6fa5' : '#a55a4a')
  }
  // reloj de pared
  g.disc(24, 16, 7, '#e8ecea')
  g.ring(24, 16, 7, '#2a2f2c')
  const a = g.t * 0.6
  g.line(24, 16, 24 + Math.cos(a) * 5, 16 + Math.sin(a) * 5, '#1a1d1f')
  g.line(24, 16, 24 + Math.cos(a / 12) * 3, 16 + Math.sin(a / 12) * 3, '#1a1d1f')
  // personas: Marisol, tú, Patricio
  g.person(20, 36, { body: '#7fb6c9', hair: P.hair, sitting: true })
  g.person(78, 30, { body: '#556b5a', hair: P.hair2, sitting: true })
  g.person(134, 36, { body: '#3f5f8a', hair: '#4a4a4a', sitting: true })
  // mesa en perspectiva
  for (let y = 52; y < 82; y++) {
    const w = 70 + ((140 - 70) * (y - 52)) / 30
    g.rect(80 - w / 2, y, w, 1, y < 54 ? '#8c6644' : P.wood)
  }
  g.rect(60, 60, 8, 5, P.paper)
  g.rect(94, 64, 10, 6, P.paper)
  g.rect(40, 70, 3, 4, P.glass)
}

const micro: Painter = (g) => {
  g.rect(0, 0, W, H, '#1d2226')
  g.rect(0, 18, W, 34, '#0f1424')
  // ciudad que se derrite en luces
  const rnd = seeded(3)
  for (let i = 0; i < 14; i++) {
    const w = 10 + rnd() * 14
    const h = 8 + rnd() * 16
    const x = ((i * 23 - g.t * 18) % 200 + 200) % 200 - 30
    g.rect(x, 52 - h, w, h, '#182036')
  }
  for (let i = 0; i < 46; i++) {
    const x = ((i * 37 - g.t * 46) % 190 + 190) % 190 - 15
    const y = 30 + ((i * 13) % 20)
    g.rect(x, y, 2, 1, i % 4 === 0 ? '#ff6a5a' : i % 3 === 0 ? '#ffffff' : '#ffc46a')
  }
  for (let x = 0; x < W; x += 40) g.rect(x, 18, 3, 34, '#2c3237')
  g.rect(0, 16, W, 2, '#2c3237')
  g.rect(0, 52, W, 2, '#2c3237')
  // pasamanos amarillos
  g.rect(0, 7, W, 2, '#d8b25a')
  g.rect(30, 9, 2, 81, '#d8b25a')
  g.rect(122, 9, 2, 81, '#d8b25a')
  // asientos
  g.rect(0, 64, W, 26, '#2a3a52')
  for (let x = 4; x < W; x += 26) g.rect(x, 58, 20, 8, '#33476a')
  // tú, de pie, una mano en el pasamanos
  const sway = Math.round(Math.sin(g.t * 1.5))
  g.person(76 + sway, 30, { body: '#46524c', hair: P.hair2, armUp: true })
}

const hogar: Painter = (g) => {
  g.rect(0, 0, W, 66, '#6b4f3f')
  g.rect(0, 50, W, 16, '#5d4435')
  g.rect(0, 66, W, 24, '#4a3424')
  // ventana nocturna con luna
  g.rect(12, 10, 34, 30, '#141b33')
  g.disc(38, 18, 4, '#f0e6c8')
  const rnd = seeded(11)
  for (let i = 0; i < 10; i++) g.px(14 + rnd() * 30, 30 + rnd() * 8, '#ffd38a')
  g.rect(10, 8, 38, 2, '#3e2b20')
  g.rect(10, 40, 38, 2, '#3e2b20')
  g.rect(28, 10, 1, 30, '#3e2b20')
  // lámpara cálida
  const flick = 0.16 + Math.sin(g.t * 3) * 0.02
  g.alpha(flick, () => g.disc(134, 30, 26, P.lamp))
  g.rect(133, 30, 2, 40, P.metal2)
  g.rect(126, 22, 16, 8, '#e8c48a')
  g.rect(128, 70, 12, 2, P.metal2)
  // mesa con lápices y la hija
  g.person(68, 46, { body: '#c2b04a', hair: P.hair2, child: true, sitting: true })
  g.rect(48, 58, 64, 4, P.wood)
  g.rect(52, 62, 3, 12, P.wood2)
  g.rect(105, 62, 3, 12, P.wood2)
  ;['#d9776b', '#6fb3e0', '#9ccf8f', '#c58ae6'].forEach((c, i) => g.rect(84 + i * 4, 57, 3, 1, c))
  g.rect(78, 56, 8, 2, P.paper)
  // cocina con vapor
  g.rect(96, 56, 22, 20, '#8a8a80')
  g.rect(102, 52, 9, 4, '#3a3a3a')
  g.person(110, 36, { body: '#8f4f4f', hair: P.hair })
  for (let i = 0; i < 5; i++) {
    const ph = (g.t * 0.8 + i * 0.2) % 1
    g.alpha(1 - ph, () => g.px(104 + Math.sin(ph * 6 + i) * 2 + i, 50 - ph * 16, '#e8ecea'))
  }
  g.rect(30, 76, 100, 7, '#7a3f3f')
}

const recinto: Painter = (g) => {
  g.bands(0, 0, W, 80, ['#a9c2d6', '#c3d4e1', '#dfe8ee'])
  // edificio nuevo, demasiado blanco
  g.rect(18, 18, 112, 62, '#e3e6e4')
  g.rect(18, 18, 112, 3, '#c9cfcc')
  for (let j = 0; j < 5; j++)
    for (let i = 0; i < 8; i++) g.rect(24 + i * 13, 26 + j * 10, 8, 6, (i + j) % 5 === 0 ? '#5c6f7d' : P.glass)
  g.rect(64, 66, 20, 14, '#7f9fb3')
  g.rect(73, 66, 2, 14, '#c9cfcc')
  // grúa
  g.rect(140, 4, 3, 76, '#d8b25a')
  for (let y = 6; y < 78; y += 4) g.line(140, y, 142, y + 3, '#a8862f')
  g.rect(96, 6, 62, 2, '#d8b25a')
  const sway = Math.sin(g.t * 0.9) * 2
  g.line(112, 8, 112 + sway, 30, '#5c656b')
  g.rect(110 + sway, 30, 5, 3, '#5c656b')
  // estacionamiento y gente chiquita
  g.rect(0, 80, W, 10, '#6b6b66')
  for (let x = 4; x < W; x += 16) g.rect(x, 85, 8, 1, '#e8e2c8')
  g.person(52, 64, { body: '#7fb6c9', hair: P.hair })
  g.person(92, 64, { body: '#3f5f8a', hair: '#4a4a4a' })
  g.person(100, 66, { body: '#6b6b80', hair: '#9a9a9a' })
}

const relojeria: Painter = (g) => {
  g.rect(0, 0, W, H, '#3b2f28')
  for (let x = 0; x < W; x += 20) g.rect(x, 0, 1, 64, '#33281f')
  // relojes, cada uno con su propia hora
  const clocks: [number, number, number][] = [
    [44, 14, 7], [64, 12, 5], [82, 16, 6], [102, 12, 5], [122, 15, 7], [142, 13, 5],
    [52, 34, 5], [72, 36, 7], [94, 34, 5], [114, 36, 6], [136, 34, 5],
  ]
  clocks.forEach(([x, y, r], i) => {
    g.disc(x, y, r, '#e8dcc0')
    g.ring(x, y, r, i % 2 ? '#a8862f' : P.wood2)
    const a = g.t * (0.4 + (i % 4) * 0.35) + i
    g.line(x, y, x + Math.cos(a) * (r - 2), y + Math.sin(a) * (r - 2), '#1a1d1f')
    g.line(x, y, x + Math.cos(a / 8 + i) * (r - 3), y + Math.sin(a / 8 + i) * (r - 3), '#1a1d1f')
  })
  // reloj de péndulo
  g.rect(10, 6, 18, 56, P.wood2)
  g.disc(19, 14, 6, '#e8dcc0')
  const swing = Math.sin(g.t * 2.4) * 0.45
  g.line(19, 24, 19 + Math.sin(swing) * 20, 24 + Math.cos(swing) * 20, '#d8b25a')
  g.disc(19 + Math.sin(swing) * 20, 24 + Math.cos(swing) * 20, 2, '#d8b25a')
  // relojero con lupa
  g.person(112, 44, { body: '#5a5a62', hair: '#9a9a9a' })
  g.disc(114, 45, 1, '#1a1d1f')
  // mostrador
  g.rect(0, 62, W, 3, P.glass)
  g.rect(0, 65, W, 25, P.wood)
  g.rect(0, 65, W, 2, '#8c6644')
}

const legacy: Painter = (g) => {
  g.rect(0, 0, W, 64, '#5a5550')
  g.rect(0, 64, W, 26, '#3e3a35')
  // ventana gris y padre de espaldas
  g.rect(64, 10, 26, 30, '#a3a6a3')
  g.rect(76, 10, 1, 30, '#5a5550')
  g.person(72, 26, { body: '#4d4d52', hair: '#8a8a8a' })
  // televisor
  const tv = 0.7 + Math.sin(g.t * 13) * 0.15
  g.rect(12, 38, 32, 22, '#1c1c1c')
  g.alpha(tv, () => g.rect(14, 40, 28, 16, '#9fb8c8'))
  g.rect(24, 60, 8, 4, '#1c1c1c')
  // sillón con la madre, sola en un extremo
  g.rect(100, 54, 52, 12, '#6b5e57')
  g.rect(100, 48, 52, 6, '#5f534c')
  g.person(140, 40, { body: '#7a6a6a', hair: '#6a6a6a', sitting: true })
  // la hija en el suelo con el puzle
  g.person(40, 70, { body: '#c2b04a', hair: P.hair2, child: true, sitting: true })
  g.rect(50, 80, 10, 4, '#a89a7a')
  // estática alta (código legacy)
  const rnd = seeded(Math.floor(g.t * 12))
  for (let i = 0; i < 520; i++) {
    const v = rnd()
    g.alpha(0.45, () => g.px(rnd() * W, rnd() * H, v > 0.5 ? '#d0d0d0' : '#202020'))
  }
  const bar = (g.t * 26) % (H + 12) - 12
  g.alpha(0.1, () => g.rect(0, bar, W, 8, '#ffffff'))
}

const estudio: Painter = (g) => {
  g.rect(0, 0, W, H, '#151726')
  // ventana nocturna
  g.rect(110, 8, 40, 30, '#0b0f1f')
  const rnd = seeded(5)
  for (let i = 0; i < 16; i++) {
    const on = (Math.floor(g.t * 2) + i) % 5 !== 0
    if (on) g.px(112 + rnd() * 36, 10 + rnd() * 26, P.star)
  }
  g.rect(108, 6, 44, 2, '#262a40')
  g.rect(108, 38, 44, 2, '#262a40')
  // lámpara con cono de luz
  g.alpha(0.18, () => {
    for (let y = 34; y < 62; y++) {
      const w = 6 + (y - 34) * 1.6
      g.rect(30 - w / 2 + 4, y, w, 1, P.lamp)
    }
  })
  g.rect(14, 56, 10, 4, P.metal2)
  g.line(18, 56, 26, 36, P.metal2)
  g.rect(26, 30, 10, 5, '#c9a86a')
  // libros
  ;['#8f4f4f', '#4f6d8f', '#c2b04a', '#5f8f6f', '#8a6fa8'].forEach((c, i) => g.rect(10 + (i % 2), 58 - (i + 1) * 4, 18, 4, c))
  ;['#4f6d8f', '#d9776b', '#e8ecea'].forEach((c, i) => g.rect(128, 58 - (i + 1) * 5, 20, 5, c))
  // laptop con la carta
  g.rect(58, 34, 38, 24, '#2a2d30')
  g.rect(60, 36, 34, 20, '#1d2a3a')
  for (let i = 0; i < 5; i++) g.rect(63, 39 + i * 3, 10 + ((i * 7) % 18), 1, '#8fa6c8')
  if (Math.floor(g.t * 2) % 2) g.rect(63 + 22, 51, 2, 2, '#e8ecea')
  g.rect(54, 58, 46, 2, '#3a3d40')
  g.rect(104, 52, 6, 6, '#d9d4c3')
  g.rect(0, 60, W, 30, '#2a2018')
  g.rect(0, 60, W, 2, '#3a2d22')
}

const plaza: Painter = (g) => {
  g.bands(0, 0, W, 64, ['#8fb9dc', '#a9cbe5', '#cfe3ef'])
  for (const [cx, cy] of [[30, 12], [100, 8], [140, 18]]) {
    const x = ((cx + g.t * 2) % 190) - 15
    g.rect(x, cy, 16, 3, '#f4f8fa')
    g.rect(x + 3, cy - 2, 9, 2, '#f4f8fa')
  }
  g.rect(0, 42, 50, 22, '#c9c3b5')
  g.rect(118, 46, 42, 18, '#bdb6a6')
  g.rect(0, 64, W, 26, '#7fa05a')
  g.rect(70, 70, 54, 12, '#a8875a')
  // árbol
  g.rect(20, 34, 5, 32, '#5e4029')
  g.disc(22, 30, 12, '#4f7a3f')
  g.disc(14, 34, 7, '#5f8f48')
  g.disc(30, 34, 8, '#5f8f48')
  // columpios
  g.line(70, 64, 76, 26, '#c0504d')
  g.line(82, 64, 76, 26, '#c0504d')
  g.line(116, 64, 122, 26, '#c0504d')
  g.line(128, 64, 122, 26, '#c0504d')
  g.rect(76, 25, 47, 2, '#c0504d')
  const a = Math.sin(g.t * 1.8) * 0.5
  const sx = 90 + Math.sin(a) * 26
  const sy = 27 + Math.cos(a) * 26
  g.line(88, 27, sx - 2, sy, '#8a9399')
  g.line(92, 27, sx + 2, sy, '#8a9399')
  g.person(sx - 1, sy - 12, { body: '#c2b04a', hair: P.hair2, child: true, sitting: true })
  g.line(106, 27, 106, 52, '#8a9399')
  g.line(110, 27, 110, 52, '#8a9399')
  g.rect(105, 52, 7, 2, P.wood)
  g.rect(132, 60, 22, 3, P.wood)
  g.rect(134, 63, 2, 5, P.wood2)
  g.rect(150, 63, 2, 5, P.wood2)
}

const sendero: Painter = (g) => {
  g.bands(0, 0, W, 60, ['#5d84b8', '#86a8cc', '#a9c6e0', '#f2d3a0'])
  g.disc(128, 34, 6, '#ffe9b0')
  const far: [number, number][] = [[0, 34], [18, 22], [34, 30], [56, 14], [78, 28], [96, 18], [118, 32], [140, 20], [160, 30]]
  g.ridge(far, '#7d93b8', 70)
  g.snowcaps(far, 24, P.snow)
  g.ridge([[0, 46], [30, 36], [60, 44], [90, 34], [120, 42], [160, 36]], '#56708f', 70)
  g.ridge([[0, 58], [40, 50], [80, 56], [120, 48], [160, 56]], '#6b7d4f', H)
  g.rect(0, 64, W, 26, '#a8a35a')
  // estero con brillo
  for (let x = 0; x < W; x++) {
    const y = 76 + Math.round(Math.sin(x / 9) * 2)
    g.px(x, y, (x + Math.floor(g.t * 6)) % 7 === 0 ? '#e8f6ff' : '#8fc6e0')
    g.px(x, y + 1, '#6fa8c6')
  }
  // sendero en zigzag
  const trail: [number, number][] = [[80, 90], [70, 82], [96, 72], [74, 64], [92, 58]]
  for (let i = 0; i < trail.length - 1; i++) g.line(...trail[i], ...trail[i + 1], '#d8c8a0')
  const rnd = seeded(9)
  for (let i = 0; i < 14; i++) g.disc(rnd() * W, 66 + rnd() * 22, 1 + Math.round(rnd() * 2), '#4c6b3c')
}

const acarreo: Painter = (g) => {
  g.bands(0, 0, W, H, ['#3f78bd', '#5f92cf', '#9cc4e4'])
  g.ridge([[0, 90], [160, 18]], '#9b9384')
  const rnd = seeded(21)
  for (let i = 0; i < 260; i++) {
    const x = rnd() * W
    const top = 90 - (x / W) * 72
    const y = top + rnd() * (H - top)
    g.px(x, y, rnd() > 0.5 ? '#7d776a' : '#b5ad9c')
  }
  for (let i = 0; i < 7; i++) {
    const x = 10 + i * 22
    const y = 90 - (x / W) * 72 + 6 + (i % 3) * 8
    g.rect(x, y, 6, 4, P.rock2)
    g.rect(x + 1, y - 1, 4, 1, P.rock)
  }
  // tú, inclinado contra la pendiente
  g.rect(66, 52, 6, 7, '#d4683a')
  g.person(70, 48, { body: '#46524c', hair: P.hair2 })
  // piedra que rueda de vez en cuando
  const ph = (g.t % 6) / 6
  if (ph < 0.5) {
    const x = 90 - ph * 160
    g.rect(x, 90 - (x / W) * 72 - 3, 3, 3, P.rock2)
  }
  // viento
  for (let i = 0; i < 8; i++) {
    const x = ((i * 47 + g.t * 90) % 220) - 30
    g.alpha(0.5, () => g.rect(x, 8 + i * 7, 12, 1, '#ffffff'))
  }
}

const portezuelo: Painter = (g) => {
  g.bands(0, 0, W, 64, ['#22508f', '#2f5fa8', '#5d8cc8', '#8fb8e0'])
  const ranges: [string, [number, number][]][] = [
    ['#a7bfdc', [[0, 46], [24, 38], [50, 44], [80, 34], [110, 42], [140, 36], [160, 40]]],
    ['#86a2c6', [[0, 52], [30, 44], [62, 50], [94, 40], [126, 48], [160, 44]]],
    ['#6a86ad', [[0, 58], [36, 50], [70, 56], [104, 48], [136, 54], [160, 50]]],
  ]
  for (const [c, pts] of ranges) {
    g.ridge(pts, c, 72)
    g.snowcaps(pts, pts.reduce((m, p) => Math.min(m, p[1]), 99) + 4, P.snow)
  }
  g.ridge([[0, 72], [40, 66], [80, 70], [120, 64], [160, 70]], '#7d776a')
  const rnd = seeded(4)
  for (let i = 0; i < 90; i++) g.px(rnd() * W, 70 + rnd() * 20, rnd() > 0.5 ? '#6b665c' : '#9b9384')
  // pirca
  ;[[100, 60, 8], [101, 57, 6], [102, 54, 4]].forEach(([x, y, w]) => g.rect(x, y, w, 3, P.rock))
  // tú, sin nadie mirando
  g.person(60, 50, { body: '#46524c', hair: P.hair2 })
  // cóndor
  const cx = ((g.t * 6) % 200) - 20
  g.line(cx, 16, cx + 3, 18, '#1a1d1f')
  g.line(cx + 3, 18, cx + 6, 16, '#1a1d1f')
  for (let i = 0; i < 6; i++) {
    const x = ((i * 53 + g.t * 70) % 220) - 30
    g.alpha(0.45, () => g.rect(x, 20 + i * 8, 10, 1, '#ffffff'))
  }
}

const campamento: Painter = (g) => {
  g.bands(0, 0, W, 64, ['#070b18', '#0b1020', '#111a33', '#1a2340'])
  const rnd = seeded(13)
  for (let i = 0; i < 80; i++) {
    const x = rnd() * W
    const y = rnd() * 52
    const blink = (Math.floor(g.t * 3) + i) % 11 === 0
    if (!blink) g.px(x, y, i % 9 === 0 ? '#ffe9b0' : P.star)
  }
  g.alpha(0.12, () => g.dither(20, 0, 60, 52, '#c9d6ff', 3))
  // estrella fugaz
  const ph = g.t % 14
  if (ph < 0.6) g.line(120 - ph * 60, 6 + ph * 20, 126 - ph * 60, 4 + ph * 20, P.star)
  g.ridge([[0, 50], [30, 40], [60, 48], [100, 34], [130, 46], [160, 40]], '#0f1628', 70)
  g.ridge([[0, 60], [50, 54], [90, 60], [160, 52]], '#141d33', 72)
  g.rect(0, 70, W, 20, '#14201a')
  // carpa
  for (let y = 0; y < 18; y++) g.rect(100 - y * 1.2, 52 + y, y * 2.4 + 1, 1, '#d4683a')
  g.rect(99, 62, 3, 8, '#7a3519')
  // fogata
  const glow = 0.18 + Math.sin(g.t * 9) * 0.04
  g.alpha(glow, () => g.disc(64, 74, 18, '#ffb347'))
  g.rect(58, 76, 12, 2, P.wood2)
  for (let i = 0; i < 6; i++) {
    const h = 3 + Math.round(Math.abs(Math.sin(g.t * 8 + i * 1.7)) * 6)
    g.rect(60 + i * 1.6, 76 - h, 2, h, i % 2 ? '#ff6a2b' : '#ffb347')
  }
  g.rect(63, 70, 2, 3, '#ffe08a')
  // tú, sentado junto al fuego
  g.person(44, 62, { body: '#3a4a44', hair: P.hair2, sitting: true, skin: '#b9825d' })
}

const auto: Painter = (g) => {
  g.bands(0, 0, W, 52, ['#5d6f9a', '#a37a8c', '#e8a070'])
  // ciudad a los lados
  const rnd = seeded(8)
  for (let i = 0; i < 9; i++) {
    const h = 10 + rnd() * 20
    g.rect(i * 9, 52 - h, 8, h, '#2a2d3e')
    g.rect(160 - (i + 1) * 9, 52 - h * 0.9, 8, h * 0.9, '#2a2d3e')
  }
  // camino en perspectiva
  for (let y = 26; y < 52; y++) {
    const k = (y - 26) / 26
    const w = 4 + k * 140
    g.rect(80 - w / 2, y, w, 1, '#3b3e40')
  }
  for (let i = 0; i < 4; i++) {
    const ph = ((g.t * 0.6 + i / 4) % 1) ** 2
    const y = 26 + ph * 26
    g.rect(79, y, 2, 1 + ph * 3, '#e8e2c8')
  }
  // semáforo en rojo
  g.rect(130, 10, 4, 10, '#1a1a1a')
  g.rect(131, 11, 2, 2, '#ff4a3a')
  g.rect(131, 20, 2, 12, '#1a1a1a')
  // espejo retrovisor
  g.rect(64, 2, 32, 9, '#1a1c1e')
  g.rect(66, 4, 28, 5, '#4a4f5c')
  // tablero y pantalla del Algoritmo
  g.rect(0, 52, W, 38, '#1c1e20')
  g.rect(0, 52, W, 2, '#2a2d30')
  g.rect(70, 60, 22, 11, '#050807')
  if (Math.floor(g.t * 2) % 2) g.rect(73, 64, 3, 4, P.green)
  g.rect(78, 66, 8, 1, P.greenDim)
  // volante, diez y diez
  g.ring(48, 88, 24, '#2a2d30', 3)
  g.rect(28, 70, 6, 5, P.skin)
  g.rect(62, 70, 6, 5, P.skin)
}

const algoritmo: Painter = (g) => {
  const coh = Math.max(0, Math.min(100, g.params.coherencia ?? 100))
  g.rect(0, 0, W, H, '#050807')
  // cuadrícula en perspectiva
  for (let i = 0; i < 9; i++) {
    const y = 50 + (i * i * 40) / 64
    g.rect(0, y, W, 1, '#0f3a24')
  }
  for (let i = -10; i <= 10; i++) g.line(80, 50, 80 + i * 16, 90, '#0f3a24')
  // rostro de código
  const shake = coh < 40 ? Math.round(Math.sin(g.t * 37) * 2) : 0
  const rnd = seeded(Math.floor(g.t * 8))
  for (let y = -26; y <= 26; y++) {
    const half = Math.round(Math.sqrt(1 - (y / 27) ** 2) * 20)
    const off = coh < 60 && rnd() < (60 - coh) / 120 ? Math.round((rnd() - 0.5) * 8) : 0
    for (let x = -half; x <= half; x += 2) {
      if (rnd() < 0.55) g.px(80 + x + off + shake, 38 + y, rnd() < 0.15 ? P.green : P.greenDim)
    }
    g.px(80 - half + off + shake, 38 + y, P.green)
    g.px(80 + half + off + shake, 38 + y, P.green)
  }
  g.rect(70 + shake, 30, 6, 3, P.green)
  g.rect(84 + shake, 30, 6, 3, P.green)
  g.rect(72 + shake, 50, 16, 1, P.green)
  // grietas: más grietas cuanto menos coherente
  const cracks = Math.floor((100 - coh) / 12)
  const cr = seeded(99)
  for (let k = 0; k < cracks; k++) {
    let x = 64 + cr() * 32
    let y = 14
    for (let s = 0; s < 14; s++) {
      const nx = x + (cr() - 0.5) * 8
      const ny = y + 3 + cr() * 2
      g.line(x, y, nx, ny, '#000000')
      x = nx
      y = ny
    }
  }
  // barrido de lectura
  const scan = (g.t * 30) % H
  g.alpha(0.18, () => g.rect(0, scan, W, 2, P.green))
}


const restaurante: Painter = (g) => {
  g.rect(0, 0, W, 66, '#7a3f2e')
  g.rect(0, 46, W, 20, '#6a3526')
  // ventana a la calle de noche, con autos que pasan
  g.rect(96, 8, 56, 34, '#121a2c')
  for (let i = 0; i < 3; i++) {
    const x = ((i * 70 + g.t * 30) % 140) + 60
    if (x > 96 && x < 148) g.rect(x, 34, 4, 1, i % 2 ? '#ff5a4a' : '#fff1c8')
  }
  g.rect(94, 6, 60, 2, '#3e1f16')
  g.rect(94, 42, 60, 2, '#3e1f16')
  g.rect(123, 8, 1, 34, '#3e1f16')
  // guirnalda de ampolletas
  for (let x = 4; x < 92; x += 8) {
    const y = 6 + Math.round(Math.sin(x / 14) * 3)
    const on = (Math.floor(g.t * 2) + x) % 5 !== 0
    g.rect(x, y, 2, 2, on ? '#ffd38a' : '#8a6a3a')
  }
  // cuadros
  g.rect(14, 18, 16, 12, '#c2b04a')
  g.rect(16, 20, 12, 8, '#4f6d8f')
  g.rect(40, 16, 12, 16, '#d9d4c3')
  g.rect(42, 18, 8, 12, '#8f4f4f')
  // mesa para dos
  g.rect(40, 60, 80, 4, '#d9d4c3')
  g.rect(78, 64, 4, 16, P.wood2)
  g.person(100, 42, { body: '#5a6b8a', hair: P.hair, sitting: true })
  g.rect(52, 50, 10, 10, '#3a2b24')
  // dos pisco sour: uno con espuma, otro sin
  g.rect(70, 54, 4, 6, '#e8e2a0')
  g.rect(70, 53, 4, 1, '#ffffff')
  g.rect(88, 54, 4, 6, '#d8d290')
  // velas
  for (const x of [62, 96]) {
    g.rect(x, 56, 2, 4, '#efe6d0')
    const h = 1 + Math.round(Math.abs(Math.sin(g.t * 7 + x)) * 2)
    g.rect(x, 56 - h, 2, h, '#ffb347')
  }
  g.alpha(0.12, () => g.disc(80, 56, 20, '#ffd38a'))
  g.rect(0, 80, W, 10, '#3a2418')
}

const llamada: Painter = (g) => {
  g.rect(0, 0, W, H, '#151820')
  // ventana con la ciudad
  g.rect(16, 10, 50, 36, '#0c1020')
  const rnd = seeded(31)
  for (let i = 0; i < 24; i++) g.px(18 + rnd() * 46, 26 + rnd() * 18, rnd() > 0.7 ? '#ffd38a' : '#7a8aa8')
  g.rect(14, 8, 54, 2, '#262a36')
  g.rect(14, 46, 54, 2, '#262a36')
  // refrigerador y mesón
  g.rect(124, 14, 26, 66, '#3a3e48')
  g.rect(126, 40, 22, 1, '#2a2e36')
  g.rect(70, 60, 54, 4, '#4a4e58')
  g.rect(70, 64, 54, 26, '#2a2d34')
  // tú, de pie, con el celular al oído
  g.person(86, 34, { body: '#3a4450', hair: P.hair2, armUp: true })
  g.alpha(0.5 + Math.sin(g.t * 3) * 0.2, () => g.rect(92, 32, 3, 4, '#6fc7d8'))
  // la otra línea: una ventana de estática
  g.rect(100, 6, 20, 14, '#0a0a0a')
  const st = seeded(Math.floor(g.t * 14))
  for (let i = 0; i < 90; i++) g.px(101 + st() * 18, 7 + st() * 12, st() > 0.5 ? '#cfcfcf' : '#3a3a3a')
  // onda de voz entrecortada
  for (let x = 0; x < W; x += 2) {
    const amp = Math.sin(x / 6 + g.t * 5) * Math.sin(g.t * 1.3 + x / 40) * 3
    g.alpha(0.35, () => g.px(x, 84 + amp, '#9fb8c8'))
  }
  const ns = seeded(Math.floor(g.t * 10) + 7)
  for (let i = 0; i < 160; i++) g.alpha(0.25, () => g.px(ns() * W, ns() * H, ns() > 0.5 ? '#bfbfbf' : '#202020'))
}

const pasillo: Painter = (g) => {
  // perspectiva de un pasillo largo hacia una puerta de escalera
  g.rect(0, 0, W, H, '#cfc7ae')
  for (let y = 0; y < H; y++) {
    const k = Math.abs(y - 40) / 50
    const half = 14 + k * 70
    g.rect(80 - half, y, half * 2, 1, y < 40 ? '#e2dbc6' : '#8a8a78')
  }
  // azulejo verde en la mitad baja de los muros
  for (let y = 46; y < H; y++) {
    const half = 14 + ((y - 40) / 50) * 70
    g.rect(0, y, 80 - half, 1, '#6f9a86')
    g.rect(80 + half, y, 80 - half, 1, '#6f9a86')
  }
  // puerta del fondo y letrero de salida
  g.rect(72, 26, 16, 22, '#5c656b')
  g.rect(74, 20, 12, 4, '#2f9a5a')
  g.rect(76, 21, 8, 2, '#d8f2e0')
  // tubos fluorescentes, uno fallando
  for (let i = 0; i < 4; i++) {
    const w = 8 + i * 8
    const y = 10 - i * 3
    const falla = i === 2 && Math.floor(g.t * 8) % 7 === 0
    g.rect(80 - w / 2, y + 6, w, 1, falla ? '#9a9a8a' : '#fbfbf2')
  }
  // cajas apiladas y una camilla
  ;[[10, 70, 18, 12], [14, 60, 14, 10], [130, 72, 22, 10], [134, 64, 16, 8]].forEach(([x, y, w, h]) => {
    g.rect(x, y, w, h, '#b08a5a')
    g.rect(x, y + Math.floor(h / 2), w, 1, '#8a6a3a')
  })
  g.rect(40, 66, 24, 4, '#e8ecea')
  g.rect(42, 70, 2, 8, P.metal2)
  g.rect(60, 70, 2, 8, P.metal2)
  g.person(104, 50, { body: '#7fb6c9', hair: P.hair })
  g.person(92, 54, { body: '#d8b25a', hair: '#9a9a9a' })
}

const aula: Painter = (g) => {
  g.rect(0, 0, W, 60, '#d6d2c4')
  g.rect(0, 60, W, 30, '#7a6a58')
  // pizarra con el caso
  g.rect(30, 8, 100, 30, '#f1f2ee')
  g.rect(30, 38, 100, 2, '#9a9a90')
  g.rect(36, 12, 24, 3, '#2a3a5a')
  for (let i = 0; i < 5; i++) g.rect(36, 19 + i * 3, 30 + ((i * 13) % 40), 1, '#5a6a8a')
  g.line(96, 14, 120, 30, '#a55a4a')
  g.ring(110, 22, 6, '#a55a4a')
  // ventana con luz de mañana
  g.rect(138, 8, 18, 40, '#bcd6ea')
  g.alpha(0.2, () => g.rect(100, 40, 60, 30, '#fff6d8'))
  // profesora frente a la pizarra
  g.person(18, 30, { body: '#5a4a6a', hair: '#8a8a8a' })
  // filas de sillas universitarias, de espaldas
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < 6; i++) {
      const x = 12 + i * 24 + row * 6
      const y = 56 + row * 14
      g.rect(x, y + 6, 16, 3, '#4a4a52')
      g.rect(x + 12, y + 2, 6, 2, '#c2b49a')
      const colors = ['#4f6d8f', '#8f4f4f', '#5f8f6f', '#c2b04a', '#6b6b80', '#8a6fa8']
      if ((i + row) % 3 !== 2) g.person(x + 4, y - 8, { body: colors[(i + row * 2) % 6], hair: i % 2 ? P.hair : P.hair2, sitting: true })
    }
  }
}

const despacho: Painter = (g) => {
  g.rect(0, 0, W, H, '#5a4a3e')
  // estantes hasta el techo
  for (let shelf = 0; shelf < 5; shelf++) {
    const y = 6 + shelf * 13
    g.rect(4, y + 11, 64, 2, P.wood2)
    const rnd = seeded(shelf + 40)
    let x = 6
    while (x < 64) {
      const w = 2 + Math.floor(rnd() * 3)
      const h = 7 + Math.floor(rnd() * 4)
      g.rect(x, y + 11 - h, w, h, ['#8f4f4f', '#4f6d8f', '#c2b04a', '#5f8f6f', '#d9d4c3', '#6b5e8a'][Math.floor(rnd() * 6)])
      x += w + (rnd() > 0.8 ? 2 : 0)
    }
  }
  // ventana con luz de tarde
  g.bands(96, 10, 48, 34, ['#e8a070', '#f2c27b', '#f6dcae'])
  g.rect(94, 8, 52, 2, '#3e3028')
  g.rect(119, 10, 1, 34, '#3e3028')
  g.alpha(0.18, () => g.rect(84, 44, 70, 40, '#f2c27b'))
  // planta regada con disciplina
  g.rect(144, 62, 10, 12, '#8a5a3a')
  for (const [x, y] of [[146, 54], [150, 50], [143, 57], [152, 56], [148, 46]]) g.rect(x, y, 3, 5, '#5f8f48')
  // dos sillas iguales frente a frente
  g.rect(78, 66, 16, 4, '#2f3a44')
  g.rect(78, 56, 3, 10, '#2f3a44')
  g.rect(118, 66, 16, 4, '#2f3a44')
  g.rect(131, 56, 3, 10, '#2f3a44')
  g.person(84, 46, { body: '#46524c', hair: P.hair2, sitting: true })
  g.person(122, 46, { body: '#6a5a7a', hair: '#9a9a9a', sitting: true })
  g.rect(118, 58, 6, 2, P.paper)
  g.rect(0, 80, W, 10, '#3e3028')
}

export const PAINTERS: Record<SceneArt, Painter> = {
  dormitorio,
  oficina,
  reunion,
  micro,
  hogar,
  recinto,
  relojeria,
  legacy,
  estudio,
  plaza,
  sendero,
  acarreo,
  portezuelo,
  campamento,
  auto,
  algoritmo,
  restaurante,
  llamada,
  pasillo,
  aula,
  despacho,
}
