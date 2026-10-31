import { WHOLE, simplify } from './fractions'

interface FractionRowProps {
  strips: number[]
  onRemove: (index: number) => void
  target?: number // marca punteada, en partes de 120
  active?: boolean
  onSelect?: () => void
  label?: string
}

// Una fila del ancho de 1 entero donde se van colocando las tiras
export function FractionRow({ strips, onRemove, target, active, onSelect, label }: FractionRowProps) {
  return (
    <div className={`frac-row ${active ? 'frac-row--active' : ''}`}>
      {label && (
        <button className="frac-row__label" aria-pressed={active} onClick={onSelect}>
          {label}
        </button>
      )}
      <div className="frac-track">
        {strips.map((d, i) => (
          <button
            key={i}
            className={`strip strip--${d}`}
            style={{ width: `${100 / d}%` }}
            aria-label={`Quitar la tira de 1/${d}`}
            onClick={() => onRemove(i)}
          >
            1/{d}
          </button>
        ))}
        {target !== undefined && (
          <span className="frac-target" style={{ left: `${(target / WHOLE) * 100}%` }}>
            <span className="frac-target__label">{simplify(target)}</span>
          </span>
        )}
      </div>
    </div>
  )
}

export function WholeBar() {
  return <div className="frac-whole">1 entero</div>
}

interface StripPaletteProps {
  denominators: number[]
  onAdd: (denominator: number) => void
}

export function StripPalette({ denominators, onAdd }: StripPaletteProps) {
  return (
    <div className="strip-palette">
      {denominators.map((d) => (
        <button key={d} className={`strip strip--${d} strip-palette__item`} onClick={() => onAdd(d)}>
          + 1/{d}
        </button>
      ))}
    </div>
  )
}
