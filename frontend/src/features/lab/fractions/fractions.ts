// Tiras disponibles: 1/2, 1/3, 1/4…
export const DENOMINATORS = [2, 3, 4, 5, 6, 8, 10, 12]

// Trabajamos en "partes de 120" (múltiplo común de todos los denominadores) para que las sumas sean exactas
export const WHOLE = 120

export function units(denominator: number) {
  return WHOLE / denominator
}

export function total(strips: number[]) {
  return strips.reduce((sum, d) => sum + units(d), 0)
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

// 90 partes de 120 → "3/4"
export function simplify(parts: number) {
  if (parts === 0) return '0'
  const g = gcd(parts, WHOLE)
  return parts === WHOLE ? '1' : `${parts / g}/${WHOLE / g}`
}

// Si todas las tiras son iguales muestra "2/4" (sin simplificar), si no la suma simplificada
export function describe(strips: number[]) {
  if (strips.length === 0) return '0'
  const same = strips.every((d) => d === strips[0])
  return same ? `${strips.length}/${strips[0]}` : simplify(total(strips))
}

export interface FractionChallenge {
  prompt: string
  target: number // en partes de 120
  allowed: number[]
  mix?: boolean // exige usar al menos dos tipos de tira
}

export const fractionChallenges: FractionChallenge[] = [
  { prompt: 'Forma 1/2 usando solo tiras de 1/4', target: 60, allowed: [4] },
  { prompt: 'Forma 1 entero usando tiras de 1/3', target: 120, allowed: [3] },
  { prompt: 'Forma 2/3 usando tiras de 1/6', target: 80, allowed: [6] },
  { prompt: 'Forma 3/4 usando tiras de 1/8', target: 90, allowed: [8] },
  { prompt: 'Forma 3/5 usando tiras de 1/10', target: 72, allowed: [10] },
  { prompt: 'Suma 1/2 + 1/3 usando tiras de 1/6', target: 100, allowed: [6] },
  { prompt: 'Forma 1 entero mezclando tiras de 1/2, 1/3 y 1/6', target: 120, allowed: [2, 3, 6], mix: true },
]
