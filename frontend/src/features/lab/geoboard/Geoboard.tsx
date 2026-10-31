import type { KeyboardEvent } from 'react'
import { samePoint, type Point } from './geometry'

export const PEGS = 7 // clavos por lado (6 × 6 cuadraditos)
const GAP = 46
const MARGIN = 20
const SIZE = MARGIN * 2 + GAP * (PEGS - 1)

const px = (p: Point) => ({ x: MARGIN + p.x * GAP, y: MARGIN + p.y * GAP })

interface GeoboardProps {
  points: Point[]
  closed: boolean
  onPeg: (p: Point) => void
}

export default function Geoboard({ points, closed, onPeg }: GeoboardProps) {
  const coords = points.map((p) => `${px(p).x},${px(p).y}`).join(' ')
  const pegs: Point[] = []
  for (let y = 0; y < PEGS; y++) for (let x = 0; x < PEGS; x++) pegs.push({ x, y })
  const last = points[points.length - 1]

  return (
    <svg className="geoboard" viewBox={`0 0 ${SIZE} ${SIZE}`} role="group" aria-label="Geoplano">
      {Array.from({ length: PEGS }, (_, i) => (
        <g key={i} className="geo-grid">
          <line x1={MARGIN} y1={MARGIN + i * GAP} x2={SIZE - MARGIN} y2={MARGIN + i * GAP} />
          <line x1={MARGIN + i * GAP} y1={MARGIN} x2={MARGIN + i * GAP} y2={SIZE - MARGIN} />
        </g>
      ))}

      {closed ? (
        <polygon className="geo-band geo-band--closed" points={coords} />
      ) : (
        points.length > 1 && <polyline className="geo-band" points={coords} />
      )}

      {pegs.map((p) => {
        const { x, y } = px(p)
        const used = points.some((q) => samePoint(p, q))
        const isStart = points.length > 0 && samePoint(p, points[0])
        const isLast = last && samePoint(p, last) && !closed
        const onKey = (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onPeg(p)
          }
        }
        return (
          <g
            key={`${p.x}-${p.y}`}
            className={`geo-peg ${used ? 'geo-peg--used' : ''} ${isStart && !closed ? 'geo-peg--start' : ''} ${isLast ? 'geo-peg--last' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={`Clavo columna ${p.x + 1}, fila ${p.y + 1}`}
            onClick={() => onPeg(p)}
            onKeyDown={onKey}
          >
            <circle className="geo-peg__hit" cx={x} cy={y} r={GAP / 2} />
            <circle className="geo-peg__dot" cx={x} cy={y} r={6} />
          </g>
        )
      })}
    </svg>
  )
}
