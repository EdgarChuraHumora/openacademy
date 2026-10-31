import type { KeyboardEvent } from 'react'
import type { Side } from './equations'

type Kind = 'x' | 'n'
type SideName = 'left' | 'right'

interface BalanceScaleProps {
  left: Side
  right: Side
  tilt: number // grados; positivo = el lado derecho baja
  onRemove: (side: SideName, kind: Kind) => void
  disabled?: boolean
}

const PIVOT_X = 200
const PIVOT_Y = 200
const HALF = 130 // mitad del brazo de la balanza
const PAN_TOP = 180
const SIZE = 26 // tamaño de cada ficha
const STEP = SIZE + 3
const PER_ROW = 5

const sideLabel = { left: 'izquierdo', right: 'derecho' }

export default function BalanceScale({ left, right, tilt, onRemove, disabled }: BalanceScaleProps) {
  const lift = HALF * Math.sin((tilt * Math.PI) / 180)

  function pan(name: SideName, side: Side, cx: number, dy: number) {
    const items: Kind[] = [...Array(side.x).fill('x'), ...Array(side.n).fill('n')]
    return (
      <g className="bal-pan" style={{ transform: `translateY(${dy}px)` }}>
        <line className="bal-metal" x1={cx} y1={PAN_TOP + 8} x2={cx} y2={PIVOT_Y} strokeWidth="6" />
        <rect className="bal-plate" x={cx - 70} y={PAN_TOP} width="140" height="10" rx="5" />
        {items.map((kind, i) => {
          const row = Math.floor(i / PER_ROW)
          const inRow = Math.min(PER_ROW, items.length - row * PER_ROW)
          const x = cx - (inRow * STEP - (STEP - SIZE)) / 2 + (i % PER_ROW) * STEP
          const y = PAN_TOP - STEP * (row + 1) + 2
          const label = `Quitar ${kind === 'x' ? 'una x' : 'una pesa de 1'} del lado ${sideLabel[name]}`
          const remove = () => !disabled && onRemove(name, kind)
          const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              remove()
            }
          }
          return (
            <g
              key={i}
              className={`bal-item bal-item--${kind}`}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label={label}
              onClick={remove}
              onKeyDown={onKey}
            >
              <rect x={x} y={y} width={SIZE} height={SIZE} rx={kind === 'x' ? 8 : 5} />
              <text x={x + SIZE / 2} y={y + SIZE / 2 + 6} textAnchor="middle">{kind === 'x' ? 'x' : '1'}</text>
            </g>
          )
        })}
      </g>
    )
  }

  return (
    <svg className="balance" viewBox="0 28 400 258" role="img" aria-label="Balanza de ecuaciones">
      <rect className="bal-base" x="140" y="262" width="120" height="14" rx="7" />
      <line className="bal-metal" x1={PIVOT_X} y1={PIVOT_Y} x2={PIVOT_X} y2="264" strokeWidth="10" />
      <g
        className="bal-beam"
        style={{ transform: `rotate(${tilt}deg)`, transformOrigin: `${PIVOT_X}px ${PIVOT_Y}px` }}
      >
        <rect x={PIVOT_X - HALF - 6} y={PIVOT_Y - 5} width={HALF * 2 + 12} height="10" rx="5" />
      </g>
      {pan('left', left, PIVOT_X - HALF, -lift)}
      {pan('right', right, PIVOT_X + HALF, lift)}
      <circle className="bal-pivot" cx={PIVOT_X} cy={PIVOT_Y} r="9" />
    </svg>
  )
}
