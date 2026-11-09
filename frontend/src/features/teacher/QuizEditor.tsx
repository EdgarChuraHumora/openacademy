import { useState } from 'react'
import type { QuizQuestion } from '../games/quiz/types'
import type { DbGame } from '../../lib/userGames'
import { EditorHeader, FormulaHelp, ItemTools, MathPreview, MetaFields, SaveBar, moveItem, unclosedMath, useGameSaver } from './editorShared'

const letters = ['A', 'B', 'C', 'D']
const MAX = 30

interface Draft {
  question: string
  options: string[]
  answerIndex: number
  hint1: string
  hint2: string
  explanation: string
}

const empty = (): Draft => ({ question: '', options: ['', '', '', ''], answerIndex: 0, hint1: '', hint2: '', explanation: '' })

function toDraft(q: QuizQuestion): Draft {
  return {
    question: q.question,
    options: [...q.options, '', '', '', ''].slice(0, 4),
    answerIndex: q.answerIndex,
    hint1: q.hints?.[0] ?? '',
    hint2: q.hints?.[1] ?? '',
    explanation: q.explanation ?? '',
  }
}

function toQuestion(d: Draft): QuizQuestion {
  const hints = [d.hint1, d.hint2].map((h) => h.trim()).filter(Boolean)
  return {
    question: d.question.trim(),
    options: d.options.map((o) => o.trim()),
    answerIndex: d.answerIndex,
    ...(hints.length ? { hints } : {}),
    ...(d.explanation.trim() ? { explanation: d.explanation.trim() } : {}),
  }
}

function problem(questions: Draft[]) {
  for (const [i, q] of questions.entries()) {
    if (!q.question.trim()) return `Falta escribir la pregunta ${i + 1}.`
    if (q.options.some((o) => !o.trim())) return `La pregunta ${i + 1} necesita sus 4 opciones.`
    if (new Set(q.options.map((o) => o.trim())).size < 4) return `En la pregunta ${i + 1} hay opciones repetidas.`
    if (unclosedMath([q.question, ...q.options, q.hint1, q.hint2, q.explanation])) {
      return `En la pregunta ${i + 1} falta cerrar una fórmula: los signos $ van de dos en dos.`
    }
  }
  return ''
}

export default function QuizEditor({ initial }: { initial?: DbGame }) {
  const saver = useGameSaver('quiz', initial)
  const [questions, setQuestions] = useState<Draft[]>(
    ((initial?.content.questions as QuizQuestion[] | undefined) ?? []).map(toDraft).concat(initial ? [] : [empty()]),
  )

  function update(i: number, change: Partial<Draft>) {
    setQuestions(questions.map((q, j) => (j === i ? { ...q, ...change } : q)))
    saver.setNotice('')
  }

  return (
    <section className="stack narrow">
      <EditorHeader title={saver.id ? 'Editar quiz' : 'Nuevo quiz'} />
      <MetaFields meta={saver.meta} onChange={saver.setMeta} />
      <FormulaHelp />

      {questions.map((q, i) => (
        <div key={i} className="card editor-question">
          <div className="editor-question__head">
            <strong>Pregunta {i + 1}</strong>
            <ItemTools
              index={i}
              count={questions.length}
              min={1}
              onMove={(dir) => setQuestions(moveItem(questions, i, dir))}
              onRemove={() => setQuestions(questions.filter((_, j) => j !== i))}
            />
          </div>
          <label className="field">
            Pregunta
            <input value={q.question} onChange={(e) => update(i, { question: e.target.value })} placeholder="Ej. $2x + 3 = 11$" />
          </label>
          <MathPreview text={q.question} />

          <div className="field">
            Opciones (marca la correcta)
            {q.options.map((opt, k) => (
              <div key={k} className={`editor-option ${q.answerIndex === k ? 'editor-option--correct' : ''}`}>
                <input
                  type="radio"
                  name={`correct-${i}`}
                  checked={q.answerIndex === k}
                  onChange={() => update(i, { answerIndex: k })}
                  aria-label={`La opción ${letters[k]} es la correcta`}
                />
                <span className="option__letter">{letters[k]}</span>
                <input
                  value={opt}
                  onChange={(e) => update(i, { options: q.options.map((o, m) => (m === k ? e.target.value : o)) })}
                  placeholder={`Opción ${letters[k]}`}
                />
                {opt.includes('$') && <span className="editor-option__preview"><MathPreview text={opt} /></span>}
              </div>
            ))}
          </div>

          <details>
            <summary className="muted">Pistas y solución (opcional)</summary>
            <label className="field">
              Pista 1
              <input value={q.hint1} onChange={(e) => update(i, { hint1: e.target.value })} placeholder="Una ayuda pequeña" />
            </label>
            <label className="field">
              Pista 2
              <input value={q.hint2} onChange={(e) => update(i, { hint2: e.target.value })} placeholder="Una ayuda más grande" />
            </label>
            <label className="field">
              Solución (se muestra si el alumno falla)
              <textarea rows={2} value={q.explanation} onChange={(e) => update(i, { explanation: e.target.value })} />
            </label>
          </details>
        </div>
      ))}

      {questions.length < MAX && (
        <button type="button" className="btn btn--ghost" onClick={() => setQuestions([...questions, empty()])}>
          + Agregar pregunta
        </button>
      )}

      <SaveBar saver={saver} onSave={(status) => saver.save({ questions: questions.map(toQuestion) }, status, problem(questions))} />
    </section>
  )
}
