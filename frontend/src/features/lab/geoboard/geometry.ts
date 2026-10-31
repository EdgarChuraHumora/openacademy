export interface Point {
  x: number
  y: number
}

export interface ShapeInfo {
  sides: number
  area: number
  perimeter: number
  perimeterText: string
  name: string
  isRectangle: boolean
  isSquare: boolean
  isParallelogram: boolean
  isRightTriangle: boolean
}

const sub = (a: Point, b: Point) => ({ x: a.x - b.x, y: a.y - b.y })
const cross = (a: Point, b: Point) => a.x * b.y - a.y * b.x
const dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y
const len2 = (v: Point) => v.x * v.x + v.y * v.y

export const samePoint = (a: Point, b: Point) => a.x === b.x && a.y === b.y

// ¿Se cruzan los segmentos ab y cd? (tocarse en un extremo compartido no cuenta)
export function segmentsCross(a: Point, b: Point, c: Point, d: Point) {
  const d1 = cross(sub(b, a), sub(c, a))
  const d2 = cross(sub(b, a), sub(d, a))
  const d3 = cross(sub(d, c), sub(a, c))
  const d4 = cross(sub(d, c), sub(b, c))
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true
  // Segmentos sobre la misma recta que se enciman
  const onSegment = (p: Point, q: Point, r: Point) =>
    cross(sub(q, p), sub(r, p)) === 0 && dot(sub(r, p), sub(r, q)) < 0
  return onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b)
}

// ¿El nuevo tramo from→to cruza algún tramo de la liga (sin contar el que termina en from)?
export function crossesPath(path: Point[], from: Point, to: Point, closing = false) {
  for (let i = 0; i < path.length - 2; i++) {
    if (closing && i === 0) continue // el tramo de cierre comparte el primer clavo
    if (segmentsCross(path[i], path[i + 1], from, to)) return true
  }
  return false
}

// Quita los clavos que están en medio de un lado recto
function corners(points: Point[]) {
  return points.filter((p, i) => {
    const prev = points[(i - 1 + points.length) % points.length]
    const next = points[(i + 1) % points.length]
    return cross(sub(p, prev), sub(next, p)) !== 0
  })
}

// √8 → [2, 2] (2√2)
function simplifyRoot(n: number): [number, number] {
  let outside = 1
  let inside = n
  for (let k = 2; k * k <= inside; k++) {
    while (inside % (k * k) === 0) {
      inside /= k * k
      outside *= k
    }
  }
  return [outside, inside]
}

export function formatNumber(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '').replace('.', ',')
}

// Suma exacta de lados: "4 + 2√2"
function perimeterText(edges: Point[]) {
  const byRoot = new Map<number, number>()
  for (const e of edges) {
    const [k, root] = simplifyRoot(len2(e))
    byRoot.set(root, (byRoot.get(root) ?? 0) + k)
  }
  return [...byRoot.entries()]
    .sort(([a], [b]) => a - b)
    .map(([root, k]) => (root === 1 ? String(k) : `${k === 1 ? '' : k}√${root}`))
    .join(' + ')
}

function triangleName(edges: Point[], right: boolean) {
  const l = edges.map(len2)
  const isosceles = l[0] === l[1] || l[1] === l[2] || l[0] === l[2]
  if (right) return isosceles ? 'Triángulo rectángulo isósceles' : 'Triángulo rectángulo'
  return isosceles ? 'Triángulo isósceles' : 'Triángulo escaleno'
}

export function analyze(points: Point[]): ShapeInfo {
  const v = corners(points)
  const n = v.length
  const edges = v.map((p, i) => sub(v[(i + 1) % n], p))
  const area = Math.abs(v.reduce((s, p, i) => s + cross(p, v[(i + 1) % n]), 0)) / 2
  const perimeter = edges.reduce((s, e) => s + Math.sqrt(len2(e)), 0)
  const rightAngles = edges.map((e, i) => dot(e, edges[(i + 1) % n]) === 0)
  const equalSides = edges.every((e) => len2(e) === len2(edges[0]))

  const isRectangle = n === 4 && rightAngles.every(Boolean)
  const isSquare = isRectangle && equalSides
  const isParallelogram = n === 4 && cross(edges[0], edges[2]) === 0 && cross(edges[1], edges[3]) === 0
  const isRightTriangle = n === 3 && rightAngles.some(Boolean)

  let name = `Polígono de ${n} lados`
  if (n === 3) name = triangleName(edges, isRightTriangle)
  else if (isSquare) name = 'Cuadrado'
  else if (isRectangle) name = 'Rectángulo'
  else if (isParallelogram && equalSides) name = 'Rombo'
  else if (isParallelogram) name = 'Paralelogramo'
  else if (n === 4 && (cross(edges[0], edges[2]) === 0 || cross(edges[1], edges[3]) === 0)) name = 'Trapecio'
  else if (n === 4) name = 'Cuadrilátero'
  else if (n === 5) name = 'Pentágono'
  else if (n === 6) name = 'Hexágono'

  return {
    sides: n,
    area,
    perimeter,
    perimeterText: perimeterText(edges),
    name,
    isRectangle,
    isSquare,
    isParallelogram,
    isRightTriangle,
  }
}
