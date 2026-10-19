import type { ActMeta, Scene } from '../../types/content'
import { ACTO_1, ESCENAS_ACTO_1 } from './acto1'
import { ACTO_2, ESCENAS_ACTO_2 } from './acto2'
import { ACTO_3, ESCENAS_ACTO_3 } from './acto3'
import { ACTO_4, ESCENAS_ACTO_4 } from './acto4'
import { ACTO_5, ESCENAS_ACTO_5 } from './acto5'

export const ACTS: ActMeta[] = [ACTO_1, ACTO_2, ACTO_3, ACTO_4, ACTO_5]

export const SCENES: Record<string, Scene> = Object.fromEntries(
  [...ESCENAS_ACTO_1, ...ESCENAS_ACTO_2, ...ESCENAS_ACTO_3, ...ESCENAS_ACTO_4, ...ESCENAS_ACTO_5].map((s) => [s.id, s]),
)
