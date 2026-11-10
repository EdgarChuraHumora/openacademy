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

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
const frac = (n: number, d: number) => {
  const g = gcd(n, d)
  return d / g === 1 ? `$${n / g}$` : `$\\frac{${n / g}}{${d / g}}$`
}

// Opciones que no son números (fracciones): la primera de "all" es la correcta
function buildText(text: string, all: string[], explanation: string): BattleQuestion {
  const values = [...new Set(all)].slice(0, 4)
  const order = shuffle(values.length)
  return { text, options: order.map((i) => values[i]), answerIndex: order.indexOf(0), explanation }
}

const list = (nums: number[]) => nums.join(', ')

function statistics(tier: Tier): BattleQuestion {
  const kind = tier === 1 ? pick(['mean', 'mode', 'range'] as const) : pick(['mean', 'median', 'dice', 'bag'] as const)
  if (kind === 'mean') {
    const n = tier === 1 ? rand(3, 4) : 5
    const mean = rand(4, 18)
    let nums: number[] = []
    // Números al azar cuyo promedio sea exacto
    do {
      nums = Array.from({ length: n - 1 }, () => rand(1, 25))
      nums.push(mean * n - nums.reduce((a, b) => a + b, 0))
    } while (nums[n - 1] < 1 || nums[n - 1] > 30)
    const sum = mean * n
    return build(`Promedio de: ${list(nums)}`, mean, [sum, mean + 2, Math.round(sum / (n - 1))], `Suma = ${sum}; ${sum} ÷ ${n} = ${mean}`)
  }
  if (kind === 'mode') {
    const mode = rand(2, 15)
    const others = new Set<number>()
    while (others.size < 3) {
      const v = rand(1, 20)
      if (v !== mode) others.add(v)
    }
    const values = [mode, mode, ...others]
    const nums = shuffle(5).map((i) => values[i])
    const o = [...others]
    return build(`Moda de: ${list(nums)}`, mode, [o[0], o[1], Math.max(...nums)], `La moda es el dato que más se repite: ${mode} aparece 2 veces`)
  }
  if (kind === 'range') {
    const nums = Array.from({ length: 5 }, () => rand(2, 40))
    if (Math.max(...nums) === Math.min(...nums)) nums[0] += 5
    const max = Math.max(...nums)
    const min = Math.min(...nums)
    return build(`Rango de: ${list(nums)}`, max - min, [max, max - min + 1, max + min], `Rango = mayor − menor = ${max} − ${min} = ${max - min}`)
  }
  if (kind === 'median') {
    const nums = Array.from({ length: 5 }, () => rand(1, 30))
    const sorted = [...nums].sort((a, b) => a - b)
    const med = sorted[2]
    return build(`Mediana de: ${list(nums)}`, med, [nums[2], sorted[1], sorted[3]], `Ordenados: ${list(sorted)}. El del medio es ${med}`)
  }
  if (kind === 'dice') {
    const c = pick([
      { text: 'un número par', n: 3, why: '2, 4 y 6' },
      { text: 'un número mayor que 4', n: 2, why: '5 y 6' },
      { text: 'el número 6', n: 1, why: 'solo el 6' },
      { text: 'un número menor que 3', n: 2, why: '1 y 2' },
      { text: 'un múltiplo de 3', n: 2, why: '3 y 6' },
    ])
    return buildText(
      `Al lanzar un dado, ¿qué probabilidad hay de sacar ${c.text}?`,
      [frac(c.n, 6), frac(1, 6), frac(6 - c.n, 6), frac(c.n + 1, 6), frac(5, 6), frac(1, 2), frac(2, 3)],
      `Casos favorables: ${c.why}, son ${c.n} de 6. Probabilidad = $\\frac{${c.n}}{6}$${c.n === 1 ? '' : ` = ${frac(c.n, 6)}`}`,
    )
  }
  const red = rand(1, 7)
  const blue = rand(1, 7)
  return buildText(
    `En una bolsa hay ${red} bolas rojas y ${blue} azules. ¿Qué probabilidad hay de sacar una roja?`,
    [frac(red, red + blue), frac(blue, red + blue), `$\\frac{${red}}{${blue}}$`, frac(1, red + blue), frac(red + 1, red + blue + 1), frac(red, red + blue + 1)],
    `Hay ${red + blue} bolas y ${red} son rojas: probabilidad = ${frac(red, red + blue)}`,
  )
}

export function makeQuestion(area: Area | 'mixta', tier: Tier): BattleQuestion {
  const real: Area = area === 'mixta' ? pick(['aritmetica', 'algebra', 'geometria', 'estadistica']) : area
  if (real === 'aritmetica') return arithmetic(tier)
  if (real === 'algebra') return algebra(tier)
  if (real === 'estadistica') return statistics(tier)
  return geometry(tier)
}
