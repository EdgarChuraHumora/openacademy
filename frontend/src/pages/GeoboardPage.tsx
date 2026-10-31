import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import Geoboard from '../features/lab/geoboard/Geoboard'
import { geoboardChallenges } from '../features/lab/geoboard/challenges'
import { analyze, crossesPath, formatNumber, samePoint, type Point, type ShapeInfo } from '../features/lab/geoboard/geometry'

type Mode = 'retos' | 'libre'

// Estado de la liga: los clavos por donde pasa y si ya está cerrada
function useBand() {
  const [points, setPoints] = useState<Point[]>([])
  const [closed, setClosed] = useState(false)
  const [note, setNote] = useState('')

  function close() {
    const last = points[points.length - 1]
    if (crossesPath(points, last, points[0], true)) return setNote('Al cerrar, las ligas se cruzarían.')
    if (analyze(points).area === 0) return setNote('Esa figura no tiene área: los clavos están en línea recta.')
    setNote('')
    setClosed(true)
  }

  function tap(p: Point) {
    if (closed) return setNote('La figura ya está cerrada. Toca "Deshacer" o "Nueva figura".')
    const last = points[points.length - 1]
    if (points.length >= 3 && samePoint(p, points[0])) return close()
    if (last && samePoint(p, last)) return
    if (points.some((q) => samePoint(p, q))) return setNote('Ese clavo ya está en la liga.')
    if (last) {
      const prev = points[points.length - 2]
      const back = prev && (p.x - last.x) * (last.y - prev.y) === (p.y - last.y) * (last.x - prev.x) &&
        (p.x - last.x) * (last.x - prev.x) + (p.y - last.y) * (last.y - prev.y) < 0
      if (back || crossesPath(points, last, p)) return setNote('Las ligas no pueden cruzarse ni regresar.')
    }
    setNote('')
    setPoints([...points, p])
  }

  function undo() {
    setNote('')
    if (closed) setClosed(false)
    else setPoints(points.slice(0, -1))
  }

  function clear() {
    setNote('')
    setClosed(false)
    setPoints([])
  }

  return { points, closed, note, tap, close, undo, clear, shape: closed ? analyze(points) : null }
}

export default function GeoboardPage() {
  const [mode, setMode] = useState<Mode>('retos')

  return (
    <section className="stack narrow">
      <div className="lab-head">
        <Link to="/laboratorio" className="quiz-close" aria-label="Volver al Laboratorio">✕</Link>
        <h1>Geoplano</h1>
      </div>
      <div className="filters">
        <button className={`filter ${mode === 'retos' ? 'filter--active' : ''}`} onClick={() => setMode('retos')}>
          🎯 Retos
        </button>
        <button className={`filter ${mode === 'libre' ? 'filter--active' : ''}`} onClick={() => setMode('libre')}>
          ✏️ Libre
        </button>
      </div>
      {mode === 'retos' ? <Challenges /> : <Free />}
    </section>
  )
}

function ShapeStats({ shape }: { shape: ShapeInfo }) {
  const exact = Number.isInteger(Math.round(shape.perimeter * 1e9) / 1e9)
  return (
    <div className="geo-stats">
      <div><span className="muted">Figura</span><strong>{shape.name}</strong></div>
      <div><span className="muted">Área</span><strong>{formatNumber(shape.area)} u²</strong></div>
      <div>
        <span className="muted">Perímetro</span>
        <strong>{shape.perimeterText} u{!exact && ` ≈ ${formatNumber(shape.perimeter)}`}</strong>
      </div>
    </div>
  )
}

function Actions({ band }: { band: ReturnType<typeof useBand> }) {
  return (
    <div className="lab-actions">
      {!band.closed && (
        <button className="btn btn--yellow lab-actions__wide" disabled={band.points.length < 3} onClick={band.close}>
          Cerrar figura
        </button>
      )}
      <button className="btn btn--ghost" disabled={band.points.length === 0} onClick={band.undo}>↩ Deshacer</button>
      <button className="btn btn--ghost" disabled={band.points.length === 0} onClick={band.clear}>Nueva figura</button>
    </div>
  )
}

const HELP = 'Toca los clavos para estirar la liga. Toca el primer clavo o "Cerrar figura" para terminar.'

function Challenges() {
  const [index, setIndex] = useState(0)
  const band = useBand()
  const challenge = geoboardChallenges[index]
  const solved = band.shape !== null && challenge.check(band.shape)
  const isLast = index === geoboardChallenges.length - 1

  return (
    <>
      <div className="quiz-top">
        <div className="progress">
          <div className="progress__bar" style={{ width: `${(index / geoboardChallenges.length) * 100}%` }} />
        </div>
        <span className="quiz-count">{index + 1}/{geoboardChallenges.length}</span>
      </div>
      <div className="frac-prompt">
        {challenge.prompt}
        {challenge.hint && <small className="geo-hint">Pista: {challenge.hint}</small>}
      </div>

      <div className="geo-box">
        <Geoboard points={band.points} closed={band.closed} onPeg={band.tap} />
      </div>

      {band.shape && <ShapeStats shape={band.shape} />}

      {solved ? (
        <div className="feedback feedback--ok">
          <Mascot size={64} mood="celebrate" />
          <div className="feedback__text">
            <strong>¡Reto cumplido!</strong>
            <span>{band.shape?.name} de área {formatNumber(band.shape?.area ?? 0)} u².</span>
          </div>
          <button
            className="btn btn--green"
            onClick={() => {
              setIndex(isLast ? 0 : index + 1)
              band.clear()
            }}
          >
            {isLast ? 'Empezar de nuevo' : 'Siguiente reto'}
          </button>
        </div>
      ) : (
        <>
          {band.shape ? (
            <div className="feedback feedback--bad">
              <Mascot size={56} mood="sad" />
              <div className="feedback__text">
                <strong>Aún no cumple el reto</strong>
                <span>Revisa la figura, el área y el perímetro. Puedes deshacer el último paso.</span>
              </div>
            </div>
          ) : (
            <p className={`center ${band.note ? 'frac-note' : 'muted'}`}>{band.note || HELP}</p>
          )}
          <Actions band={band} />
        </>
      )}
    </>
  )
}

function Free() {
  const band = useBand()
  return (
    <>
      <div className="geo-box">
        <Geoboard points={band.points} closed={band.closed} onPeg={band.tap} />
      </div>
      {band.shape ? (
        <ShapeStats shape={band.shape} />
      ) : (
        <p className={`center ${band.note ? 'frac-note' : 'muted'}`}>{band.note || HELP}</p>
      )}
      <Actions band={band} />
    </>
  )
}
