import { useState } from 'react'
import type { TrueFalseStatement } from '../games/truefalse/types'
import type { DbGame } from '../../lib/userGames'
import { EditorHeader, FormulaHelp, ItemTools, MathPreview, MetaFields, SaveBar, moveItem, unclosedMath, useGameSaver } from './editorShared'

const MIN = 3
const MAX = 30
const times = [30, 45, 60, 90, 120, 180]
const empty = (): TrueFalseStatement => ({ text: '', answer: true, why: '' })

function problem(statements: TrueFalseStatement[]) {
  if (statements.length < MIN) return `Agrega al menos ${MIN} afirmaciones.`
  for (const [i, s] of statements.entries()) {
    if (!s.text.trim()) return `Falta escribir la afirmación ${i + 1}.`
    if (unclosedMath([s.text, s.why ?? ''])) return `En la afirmación ${i + 1} falta cerrar una fórmula: los signos $ van de dos en dos.`
  }
  return ''
}

export default function TrueFalseEditor({ initial }: { initial?: DbGame }) {
  const saver = useGameSaver('truefalse', initial)
  const [seconds, setSeconds] = useState<number>((initial?.content.seconds as number | undefined) ?? 60)
  const [statements, setStatements] = useState<TrueFalseStatement[]>(
    ((initial?.content.statements as TrueFalseStatement[] | undefined) ?? [empty(), empty(), empty()]).map((s) => ({
      ...s,
      why: s.why ?? '',
    })),
  )

  function update(i: number, change: Partial<TrueFalseStatement>) {
    setStatements(statements.map((s, j) => (j === i ? { ...s, ...change } : s)))
    saver.setNotice('')
  }

  function content() {
    return {
      seconds,
      statements: statements.map((s) => ({
        text: s.text.trim(),
        answer: s.answer,
        ...(s.why?.trim() ? { why: s.why.trim() } : {}),
      })),
    }
  }

  return (
    <section className="stack narrow">
      <EditorHeader title={saver.id ? 'Editar Verdadero o falso' : 'Nuevo Verdadero o falso'} />
      <p className="muted">
        Escribe afirmaciones y marca si son verdaderas o falsas. El alumno responde contra el reloj y al final repasa las que
        falló, con tu explicación.
      </p>
      <MetaFields meta={saver.meta} onChange={saver.setMeta} />

      <div className="card">
        <label className="field">
          Tiempo para responder todas
          <select value={seconds} onChange={(e) => setSeconds(Number(e.target.value))}>
            {times.map((t) => <option key={t} value={t}>{t} segundos</option>)}
          </select>
        </label>
      </div>

      <FormulaHelp />

      {statements.map((s, i) => (
        <div key={i} className="card editor-question">
          <div className="editor-question__head">
            <strong>Afirmación {i + 1}</strong>
            <ItemTools
              index={i}
              count={statements.length}
              min={MIN}
              onMove={(dir) => setStatements(moveItem(statements, i, dir))}
              onRemove={() => setStatements(statements.filter((_, j) => j !== i))}
            />
          </div>
          <label className="field">
            Afirmación
            <input value={s.text} onChange={(e) => update(i, { text: e.target.value })} placeholder="Ej. $2^3 = 6$" />
          </label>
          <MathPreview text={s.text} />
          <div className="tf-choice" role="radiogroup" aria-label={`Respuesta de la afirmación ${i + 1}`}>
            <button
              type="button"
              role="radio"
              aria-checked={s.answer}
              className={`tf-choice__btn ${s.answer ? 'tf-choice__btn--true' : ''}`}
              onClick={() => update(i, { answer: true })}
            >
              ✓ Verdadero
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={!s.answer}
              className={`tf-choice__btn ${!s.answer ? 'tf-choice__btn--false' : ''}`}
              onClick={() => update(i, { answer: false })}
            >
              ✗ Falso
            </button>
          </div>
          <label className="field">
            ¿Por qué? (opcional, se muestra en el repaso)
            <input value={s.why} onChange={(e) => update(i, { why: e.target.value })} placeholder="Ej. $2^3 = 2 \cdot 2 \cdot 2 = 8$" />
          </label>
        </div>
      ))}

      {statements.length < MAX && (
        <button type="button" className="btn btn--ghost" onClick={() => setStatements([...statements, empty()])}>
          + Agregar afirmación
        </button>
      )}

      <SaveBar saver={saver} onSave={(status) => saver.save(content(), status, problem(statements))} />
    </section>
  )
}
