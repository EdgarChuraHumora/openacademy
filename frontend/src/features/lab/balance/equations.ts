// Un lado de la balanza: x = bolsitas (valen x), n = pesas de 1
export interface Side {
  x: number
  n: number
}

export interface BalanceEquation {
  left: Side
  right: Side
  solution: number
}

// Ordenadas de más fácil a más difícil; todos los números son positivos
export const balanceEquations: BalanceEquation[] = [
  { left: { x: 1, n: 3 }, right: { x: 0, n: 7 }, solution: 4 },
  { left: { x: 2, n: 0 }, right: { x: 0, n: 10 }, solution: 5 },
  { left: { x: 2, n: 3 }, right: { x: 0, n: 11 }, solution: 4 },
  { left: { x: 3, n: 2 }, right: { x: 1, n: 8 }, solution: 3 },
  { left: { x: 5, n: 0 }, right: { x: 2, n: 12 }, solution: 4 },
  { left: { x: 4, n: 1 }, right: { x: 2, n: 9 }, solution: 4 },
  { left: { x: 3, n: 4 }, right: { x: 0, n: 19 }, solution: 5 },
]

export function weight(side: Side, xValue: number) {
  return side.x * xValue + side.n
}

export function formatSide({ x, n }: Side) {
  const xs = x === 0 ? '' : x === 1 ? 'x' : `${x}x`
  if (!xs) return String(n)
  return n === 0 ? xs : `${xs} + ${n}`
}
