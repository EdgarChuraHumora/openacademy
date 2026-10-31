import type { ShapeInfo } from './geometry'

export interface GeoboardChallenge {
  prompt: string
  hint?: string
  check: (s: ShapeInfo) => boolean
}

const near = (a: number, b: number) => Math.abs(a - b) < 1e-9

export const geoboardChallenges: GeoboardChallenge[] = [
  { prompt: 'Forma un rectángulo de área 6', check: (s) => s.isRectangle && s.area === 6 },
  { prompt: 'Forma un cuadrado de perímetro 12', check: (s) => s.isSquare && near(s.perimeter, 12) },
  { prompt: 'Forma un triángulo de área 3', check: (s) => s.sides === 3 && s.area === 3 },
  { prompt: 'Forma un triángulo rectángulo de área 4', check: (s) => s.isRightTriangle && s.area === 4 },
  {
    prompt: 'Forma un paralelogramo de área 6 que no sea rectángulo',
    hint: 'Inclina dos de sus lados.',
    check: (s) => s.isParallelogram && !s.isRectangle && s.area === 6,
  },
  {
    prompt: 'Forma un cuadrado de área 2',
    hint: 'No todos los cuadrados están "derechos".',
    check: (s) => s.isSquare && s.area === 2,
  },
  { prompt: 'Forma una figura de área 5 y perímetro 12', check: (s) => s.area === 5 && near(s.perimeter, 12) },
]
