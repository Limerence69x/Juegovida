// Galería de decorados para revisar el pixel-art sin jugar (abrir con ?galeria).

import { useState } from 'react'
import type { Mood } from '../../theme/mood'
import type { SceneArt } from '../../types/content'
import { PAINTERS } from '../scene/painters'
import { PixelScene } from '../scene/PixelScene'

const ART_ACT: Record<SceneArt, number> = {
  dormitorio: 1,
  oficina: 1,
  reunion: 1,
  micro: 1,
  hogar: 1,
  recinto: 2,
  relojeria: 2,
  legacy: 2,
  estudio: 3,
  plaza: 3,
  sendero: 4,
  acarreo: 4,
  portezuelo: 4,
  campamento: 4,
  auto: 5,
  algoritmo: 5,
  restaurante: 2,
  llamada: 2,
  pasillo: 2,
  aula: 3,
  despacho: 3,
}

export function ArtGallery() {
  const [mood, setMood] = useState<Mood>('neutro')
  return (
    <main className="space-y-4 p-4">
      <div className="flex gap-2">
        {(['neutro', 'frio', 'calido'] as Mood[]).map((m) => (
          <button key={m} type="button" onClick={() => setMood(m)} className={`term border px-3 text-[18px] ${mood === m ? 'border-accent text-accent' : 'border-line text-dim'}`}>
            {m}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(Object.keys(PAINTERS) as SceneArt[]).map((art) => (
          <figure key={art} className="panel overflow-hidden">
            <PixelScene art={art} act={ART_ACT[art]} mood={mood} params={{ coherencia: 40 }} />
            <figcaption className="term px-2 py-1 text-[16px] text-dim">
              {art} · acto {ART_ACT[art]}
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  )
}
