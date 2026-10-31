import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import BalanceScale from '../features/lab/balance/BalanceScale'
import { balanceEquations, formatSide, weight, type Side } from '../features/lab/balance/equations'

interface State {
  left: Side
  right: Side
}

function onlyX(s: Side) {
  return s.x >= 2 && s.n === 0
}

export default function BalancePage() {
  const [index, setIndex] = useState(0)
  const equation = balanceEquations[index]
  const [history, setHistory] = useState<State[]>([{ left: equation.left, right: equation.right }])

  const { left, right } = history[history.length - 1]
  const xValue = equation.solution
  const diff = weight(right, xValue) - weight(left, xValue)
  const balanced = diff === 0
  const tilt = balanced ? 0 : Math.sign(diff) * Math.min(14, 5 + Math.abs(diff))
  const solved =
    balanced &&
    ((left.x === 1 && left.n === 0 && right.x === 0) || (right.x === 1 && right.n === 0 && left.x === 0))

  // Se puede dividir si un lado solo tiene x y el otro solo pesas (y la división es exacta)
  const divisor =
    onlyX(left) && right.x === 0 && right.n % left.x === 0 ? left.x
    : onlyX(right) && left.x === 0 && left.n % right.x === 0 ? right.x
    : 0

  function push(next: State) {
    setHistory((h) => [...h, next])
  }

  function load(i: number) {
    const eq = balanceEquations[i]
    setIndex(i)
    setHistory([{ left: eq.left, right: eq.right }])
  }

  function removeOne(side: 'left' | 'right', kind: 'x' | 'n') {
    const s = side === 'left' ? left : right
    if (s[kind] === 0) return
    const changed = { ...s, [kind]: s[kind] - 1 }
    push(side === 'left' ? { left: changed, right } : { left, right: changed })
  }

  function removeBoth(kind: 'x' | 'n') {
    push({ left: { ...left, [kind]: left[kind] - 1 }, right: { ...right, [kind]: right[kind] - 1 } })
  }

  function divide() {
    const d = (s: Side) => ({ x: s.x / divisor, n: s.n / divisor })
    push({ left: d(left), right: d(right) })
  }

  // Pasos en equilibrio, para que el alumno vea cómo fue transformando la ecuación
  const steps = history
    .filter((s) => weight(s.left, xValue) === weight(s.right, xValue))
    .map((s) => `${formatSide(s.left)} = ${formatSide(s.right)}`)
    .filter((text, i, all) => i === 0 || text !== all[i - 1])

  const isLast = index === balanceEquations.length - 1

  return (
    <section className="stack narrow">
      <div className="quiz-top">
        <Link to="/laboratorio" className="quiz-close" aria-label="Salir de la balanza">✕</Link>
        <div className="progress">
          <div className="progress__bar" style={{ width: `${(index / balanceEquations.length) * 100}%` }} />
        </div>
        <span className="quiz-count">{index + 1}/{balanceEquations.length}</span>
      </div>

      <div className={`equation ${balanced ? '' : 'equation--off'}`}>
        {formatSide(left)} <span className="equation__sign">{balanced ? '=' : '≠'}</span> {formatSide(right)}
      </div>

      <div className="balance-box">
        <BalanceScale left={left} right={right} tilt={tilt} onRemove={removeOne} disabled={solved} />
      </div>

      {solved ? (
        <div className="feedback feedback--ok">
          <Mascot size={64} mood="celebrate" />
          <div className="feedback__text">
            <strong>¡Lo lograste! x = {xValue}</strong>
            <span>Resolviste {formatSide(equation.left)} = {formatSide(equation.right)} en {steps.length - 1} {steps.length === 2 ? 'paso' : 'pasos'}.</span>
          </div>
          <button className="btn btn--green" onClick={() => load(isLast ? 0 : index + 1)}>
            {isLast ? 'Empezar de nuevo' : 'Siguiente ecuación'}
          </button>
        </div>
      ) : !balanced ? (
        <div className="feedback feedback--bad">
          <Mascot size={64} mood="sad" />
          <div className="feedback__text">
            <strong>¡La balanza se inclinó!</strong>
            <span>Lo que quitas de un lado, quítalo también del otro.</span>
          </div>
        </div>
      ) : (
        <p className="muted center">
          Toca una <b>pesa</b> o una <b>bolsita x</b> para quitarla. Deja una sola x en un lado.
        </p>
      )}

      {!solved && (
        <div className="lab-actions">
          <button className="btn btn--ghost" disabled={!balanced || !left.n || !right.n} onClick={() => removeBoth('n')}>
            −1 en ambos lados
          </button>
          <button className="btn btn--ghost" disabled={!balanced || !left.x || !right.x} onClick={() => removeBoth('x')}>
            −x en ambos lados
          </button>
          {balanced && divisor > 0 && (
            <button className="btn btn--yellow lab-actions__wide" onClick={divide}>
              ÷{divisor} en ambos lados
            </button>
          )}
          <button
            className="btn lab-actions__wide"
            disabled={history.length === 1}
            onClick={() => setHistory((h) => h.slice(0, -1))}
          >
            ↩ Deshacer
          </button>
        </div>
      )}

      {steps.length > 1 && (
        <div className="card">
          <strong>Tus pasos</strong>
          <ol className="steps">
            {steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      )}
    </section>
  )
}
