import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { FractionRow, StripPalette, WholeBar } from '../features/lab/fractions/FractionStrips'
import { DENOMINATORS, WHOLE, describe, fractionChallenges, simplify, total, units } from '../features/lab/fractions/fractions'

type Mode = 'retos' | 'explorar'

const NO_FIT = 'No cabe: te pasarías del entero. Quita una tira o elige una más pequeña.'

export default function FractionStripsPage() {
  const [mode, setMode] = useState<Mode>('retos')

  return (
    <section className="stack narrow">
      <div className="lab-head">
        <Link to="/laboratorio" className="quiz-close" aria-label="Volver al Laboratorio">✕</Link>
        <h1>Tiras de fracciones</h1>
      </div>
      <div className="filters">
        <button className={`filter ${mode === 'retos' ? 'filter--active' : ''}`} onClick={() => setMode('retos')}>
          🎯 Retos
        </button>
        <button className={`filter ${mode === 'explorar' ? 'filter--active' : ''}`} onClick={() => setMode('explorar')}>
          🔍 Explorar
        </button>
      </div>
      {mode === 'retos' ? <Challenges /> : <Explore />}
    </section>
  )
}

function Challenges() {
  const [index, setIndex] = useState(0)
  const [strips, setStrips] = useState<number[]>([])
  const [note, setNote] = useState('')
  const challenge = fractionChallenges[index]
  const sum = total(strips)
  const kinds = new Set(strips).size
  const solved = sum === challenge.target && (!challenge.mix || kinds >= 2)
  const isLast = index === fractionChallenges.length - 1

  function add(d: number) {
    if (sum + units(d) > WHOLE) return setNote(NO_FIT)
    setNote('')
    setStrips((s) => [...s, d])
  }

  function update(next: number[]) {
    setNote('')
    setStrips(next)
  }

  function next() {
    setIndex(isLast ? 0 : index + 1)
    update([])
  }

  return (
    <>
      <div className="quiz-top">
        <div className="progress">
          <div className="progress__bar" style={{ width: `${(index / fractionChallenges.length) * 100}%` }} />
        </div>
        <span className="quiz-count">{index + 1}/{fractionChallenges.length}</span>
      </div>
      <div className="frac-prompt">{challenge.prompt}</div>

      <div className="frac-board">
        <WholeBar />
        <FractionRow strips={strips} onRemove={(i) => update(strips.filter((_, j) => j !== i))} target={challenge.target} />
      </div>

      {solved ? (
        <div className="feedback feedback--ok">
          <Mascot size={64} mood="celebrate" />
          <div className="feedback__text">
            <strong>¡Muy bien! {describe(strips)} = {simplify(challenge.target)}</strong>
            <span>Usaste {strips.length} {strips.length === 1 ? 'tira' : 'tiras'}.</span>
          </div>
          <button className="btn btn--green" onClick={next}>
            {isLast ? 'Empezar de nuevo' : 'Siguiente reto'}
          </button>
        </div>
      ) : (
        <>
          <p className={`center ${note ? 'frac-note' : 'muted'}`}>
            {note ||
              (sum === challenge.target && challenge.mix
                ? '¡Llegaste! Pero usa al menos dos tipos de tira diferentes.'
                : `Llevas ${describe(strips)}. Toca una tira de abajo para agregarla; toca una de arriba para quitarla.`)}
          </p>
          <StripPalette denominators={challenge.allowed} onAdd={add} />
          <button className="btn btn--ghost" disabled={strips.length === 0} onClick={() => update([])}>
            Vaciar
          </button>
        </>
      )}
    </>
  )
}

function Explore() {
  const [rows, setRows] = useState<number[][]>([[], []])
  const [active, setActive] = useState(0)
  const [note, setNote] = useState('')
  const [a, b] = rows.map(total)

  function add(d: number) {
    if (total(rows[active]) + units(d) > WHOLE) return setNote(NO_FIT)
    setNote('')
    setRows(rows.map((r, i) => (i === active ? [...r, d] : r)))
  }

  function remove(row: number, index: number) {
    setNote('')
    setActive(row)
    setRows(rows.map((r, i) => (i === row ? r.filter((_, j) => j !== index) : r)))
  }

  let comparison = 'Arma una fracción en cada fila para compararlas.'
  if (rows[0].length && rows[1].length) {
    const sign = a === b ? '=' : a > b ? '>' : '<'
    comparison = `${describe(rows[0])} ${sign} ${describe(rows[1])}` + (a === b ? ' · ¡Son equivalentes!' : '')
  }

  return (
    <>
      <div className="frac-board">
        <WholeBar />
        {rows.map((strips, i) => (
          <FractionRow
            key={i}
            label={i === 0 ? 'A' : 'B'}
            strips={strips}
            active={active === i}
            onSelect={() => setActive(i)}
            onRemove={(j) => remove(i, j)}
          />
        ))}
      </div>
      <p className={`center ${note ? 'frac-note' : 'frac-compare'}`}>{note || comparison}</p>
      <p className="muted center">Las tiras se agregan a la fila {active === 0 ? 'A' : 'B'}. Toca la letra para cambiar de fila.</p>
      <StripPalette denominators={DENOMINATORS} onAdd={add} />
      <button
        className="btn btn--ghost"
        disabled={!rows[0].length && !rows[1].length}
        onClick={() => {
          setRows([[], []])
          setNote('')
        }}
      >
        Vaciar todo
      </button>
    </>
  )
}
