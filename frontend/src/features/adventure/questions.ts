import { shuffle } from '../games/shuffle'
import type { Area, Tier } from './data'

// Ejercicios generados al azar: cada combate es distinto
export interface BattleQuestion {
  text: string // admite fórmulas KaTeX entre $
  options: string[]
  answerIndex: number
  explanation: string
}

const rand = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]

// Arma 4 opciones: la correcta y 3 errores creíbles (sin repetir)
function build(text: string, answer: number, wrong: number[], explanation: string, unit = ''): BattleQuestion {
  const values = [answer]
  for (const w of [...wrong, answer + 1, answer - 1, answer + 2, answer + 10, answer - 10]) {
    if (values.length === 4) break
    if (w !== answer && !values.includes(w) && (answer < 0 || w >= 0)) values.push(w)
  }
  const order = shuffle(values.length)
  const options = order.map((i) => `${values[i]}${unit}`)
  return { text, options, answerIndex: order.indexOf(0), explanation }
}

function arithmetic(tier: Tier): BattleQuestion {
  if (tier === 1) {
    const a = rand(12, 60)
    const b = rand(8, 40)
    if (Math.random() < 0.5) return build(`$${a} + ${b}$`, a + b, [a + b + 10, a + b - 1], `${a} + ${b} = ${a + b}`)
    const [x, y] = a > b ? [a, b] : [b, a]
    return build(`$${x} - ${y}$`, x - y, [x + y, x - y + 10], `${x} − ${y} = ${x - y}`)
  }
  if (tier === 2) {
    const a = rand(3, 12)
    const b = rand(3, 12)
    if (Math.random() < 0.5) return build(`$${a} \\times ${b}$`, a * b, [a * b + a, a * b - b, a + b], `${a} × ${b} = ${a * b}`)
    return build(`$${a * b} \\div ${a}$`, b, [b + 1, a, b * 2], `${a * b} ÷ ${a} = ${b}, porque ${a} × ${b} = ${a * b}`)
  }
  const a = rand(2, 20)
  const b = rand(2, 9)
  const c = rand(2, 9)
  if (Math.random() < 0.5) {
    // Error típico: sumar antes de multiplicar
    return build(`$${a} + ${b} \\times ${c}$`, a + b * c, [(a + b) * c], `Primero la multiplicación: ${b} × ${c} = ${b * c}; luego ${a} + ${b * c} = ${a + b * c}`)
  }
  const n = rand(5, 30)
  const m = rand(2, 25)
  return build(`$(-${n}) + ${m}$`, m - n, [n + m, n - m, -(n + m)], `Signos distintos: se restan ${Math.max(n, m)} − ${Math.min(n, m)} y queda el signo del número más grande: ${m - n}`)
}

function algebra(tier: Tier): BattleQuestion {
  const x = tier === 3 ? rand(-6, 9) : rand(1, 12)
  if (tier === 1) {
    const a = rand(2, 20)
    if (Math.random() < 0.5) return build(`Halla $x$: $x + ${a} = ${x + a}$`, x, [x + 2 * a, x + a], `Resta ${a} a ambos lados: x = ${x + a} − ${a} = ${x}`)
    return build(`Halla $x$: $x - ${a} = ${x}$`, x + a, [x - a, x], `Suma ${a} a ambos lados: x = ${x} + ${a} = ${x + a}`)
  }
  const a = rand(2, 7)
  const b = rand(1, 15)
  if (tier === 2) {
    if (Math.random() < 0.4) return build(`Halla $x$: $${a}x = ${a * x}$`, x, [a * x - a, x + a], `Divide entre ${a}: x = ${a * x} ÷ ${a} = ${x}`)
    return build(
      `Halla $x$: $${a}x + ${b} = ${a * x + b}$`,
      x,
      [x + b, Math.round((a * x + 2 * b) / a)],
      `Resta ${b}: ${a}x = ${a * x}. Divide entre ${a}: x = ${x}`,
    )
  }
  // Tier 3: x a ambos lados
  const c = rand(1, a - 1 || 1)
  const d = (a - c) * x + b
  const sign = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`)
  return build(
    `Halla $x$: $${a}x ${sign(b)} = ${c === 1 ? '' : c}x ${sign(d)}$`,
    x,
    [-x, x + 1 === 0 ? 2 : x + 1, d - b],
    `Pasa las x a la izquierda: ${a - c}x = ${d - b}. Entonces x = ${x}`,
  )
}

function geometry(tier: Tier): BattleQuestion {
  if (tier === 1) {
    const a = rand(3, 15)
    const b = rand(2, 12)
    if (Math.random() < 0.5) return build(`Perímetro de un rectángulo de ${a} cm por ${b} cm`, 2 * (a + b), [a + b, a * b], `P = 2 × (${a} + ${b}) = ${2 * (a + b)} cm`, ' cm')
    return build(`Perímetro de un cuadrado de lado ${a} cm`, 4 * a, [a * a, 2 * a], `P = 4 × ${a} = ${4 * a} cm`, ' cm')
  }
  const kind = pick(['rect', 'tri', 'angle'] as const)
  if (kind === 'rect') {
    const a = rand(3, 15)
    const b = rand(2, 12)
    return build(`Área de un rectángulo de ${a} cm por ${b} cm`, a * b, [2 * (a + b), a * b + a], `A = ${a} × ${b} = ${a * b} cm²`, ' cm²')
  }
  if (kind === 'tri') {
    const base = rand(2, 10) * 2
    const h = rand(3, 12)
    return build(`Área de un triángulo de base ${base} cm y altura ${h} cm`, (base * h) / 2, [base * h, base + h], `A = (${base} × ${h}) ÷ 2 = ${(base * h) / 2} cm²`, ' cm²')
  }
  const a = rand(30, 90)
  const b = rand(20, 150 - a)
  return build(
    `Un triángulo tiene ángulos de ${a}° y ${b}°. ¿Cuánto mide el tercero?`,
    180 - a - b,
    [360 - a - b, 90 - Math.min(a, b) > 0 ? 90 - Math.min(a, b) : 200 - a - b],
    `Los ángulos de un triángulo suman 180°: 180 − ${a} − ${b} = ${180 - a - b}°`,
    '°',
  )
}

export function makeQuestion(area: Area | 'mixta', tier: Tier): BattleQuestion {
  const real: Area = area === 'mixta' ? pick(['aritmetica', 'algebra', 'geometria']) : area
  if (real === 'aritmetica') return arithmetic(tier)
  if (real === 'algebra') return algebra(tier)
  return geometry(tier)
}
