interface WheelProps {
  labels: string[]
  rotation: number // grados acumulados; el puntero está arriba
  results: (boolean | undefined)[] // true = acertó, false = falló, undefined = sin jugar
  spinMs: number
}

const R = 100

// Punto del borde a "deg" grados, medidos en sentido horario desde arriba
function point(deg: number, r = R) {
  const a = (deg * Math.PI) / 180
  return `${(r * Math.sin(a)).toFixed(2)} ${(-r * Math.cos(a)).toFixed(2)}`
}

export default function Wheel({ labels, rotation, results, spinMs }: WheelProps) {
  const step = 360 / labels.length
  return (
    <svg className="wheel" viewBox="-112 -122 224 236" role="img" aria-label="Ruleta">
      <g
        className="wheel__spin"
        style={{ transform: `rotate(${rotation}deg)`, transition: `transform ${spinMs}ms cubic-bezier(0.17, 0.67, 0.21, 1)` }}
      >
        {labels.map((label, i) => {
          const from = i * step
          const to = from + step
          const mid = from + step / 2
          const result = results[i]
          return (
            <g key={i} className={`wheel__sector wheel__sector--${i % 6} ${result !== undefined ? 'wheel__sector--done' : ''}`}>
              <path d={`M0 0 L${point(from)} A${R} ${R} 0 0 1 ${point(to)} Z`} />
              {/* El texto va a lo largo del radio, donde hay más espacio que a lo ancho del sector */}
              <text
                transform={`rotate(${mid - 90}) translate(${R * 0.6} 0)`}
                textAnchor="middle"
                dominantBaseline="middle"
                className={label.length > 8 ? 'wheel__label--long' : undefined}
              >
                {result === undefined ? label : result ? '✓' : '✗'}
              </text>
            </g>
          )
        })}
      </g>
      <circle className="wheel__hub" r="16" />
      <path className="wheel__pointer" d="M-11 -118 L11 -118 L0 -94 Z" />
    </svg>
  )
}
