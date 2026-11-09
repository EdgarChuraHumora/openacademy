import { useState } from 'react'
import MathText from '../../components/MathText'
import type { DominoPair } from '../games/domino/types'
import type { DbGame } from '../../lib/userGames'
import { EditorHeader, FormulaHelp, ItemTools, MathPreview, MetaFields, SaveBar, moveItem, unclosedMath, useGameSaver } from './editorShared'

const MIN = 4
const MAX = 10
const empty = (): DominoPair => ({ question: '', answer: '' })

function problem(pairs: DominoPair[]) {
  if (pairs.length < MIN) return `Agrega al menos ${MIN} operaciones.`
  for (const [i, p] of pairs.entries()) {
    if (!p.question.trim() || !p.answer.trim()) return `Completa la operación y el resultado de la fila ${i + 1}.`
    if (unclosedMath([p.question, p.answer])) return `En la fila ${i + 1} falta cerrar una fórmula: los signos $ van de dos en dos.`
  }
  // Cada ficha empieza con un resultado: si dos se repiten, la cadena tendría dos caminos
  if (new Set(pairs.map((p) => p.answer.trim())).size < pairs.length) return 'Cada resultado debe ser distinto.'
  return ''
}

export default function DominoEditor({ initial }: { initial?: DbGame }) {
  const saver = useGameSaver('domino', initial)
  const [pairs, setPairs] = useState<DominoPair[]>((initial?.content.pairs as DominoPair[] | undefined) ?? [empty(), empty(), empty(), empty()])

  function update(i: number, change: Partial<DominoPair>) {
    setPairs(pairs.map((p, j) => (j === i ? { ...p, ...change } : p)))
    saver.setNotice('')
  }

  const n = pairs.length
  return (
    <section className="stack narrow">
      <EditorHeader title={saver.id ? 'Editar Dominó' : 'Nuevo Dominó'} />
      <p className="muted">
        Escribe operaciones con su resultado. La app arma las fichas en cadena: cada ficha empieza con el resultado de la
        anterior, y la última vuelve a la primera.
      </p>
      <MetaFields meta={saver.meta} onChange={saver.setMeta} />
      <FormulaHelp />

      {pairs.map((p, i) => (
        <div key={i} className="card editor-question">
          <div className="editor-question__head">
            <strong>Fila {i + 1}</strong>
            <ItemTools
              index={i}
              count={n}
              min={MIN}
              onMove={(dir) => setPairs(moveItem(pairs, i, dir))}
              onRemove={() => setPairs(pairs.filter((_, j) => j !== i))}
            />
          </div>
          <div className="editor-row">
            <label className="field">
              Operación
              <input value={p.question} onChange={(e) => update(i, { question: e.target.value })} placeholder="Ej. $6 \times 7$" />
            </label>
            <label className="field">
              Resultado
              <input value={p.answer} onChange={(e) => update(i, { answer: e.target.value })} placeholder="Ej. 42" />
            </label>
          </div>
          {(p.question.includes('$') || p.answer.includes('$')) && (
            <div className="editor-row">
              <MathPreview text={p.question || ' '} />
              <MathPreview text={p.answer || ' '} />
            </div>
          )}
        </div>
      ))}

      {n < MAX && (
        <button type="button" className="btn btn--ghost" onClick={() => setPairs([...pairs, empty()])}>+ Agregar operación</button>
      )}

      {pairs.every((p) => p.question.trim() && p.answer.trim()) && (
        <div className="card">
          <strong>Así quedarán las fichas</strong>
          <ol className="domino-chain">
            {pairs.map((p, k) => (
              <li key={k} className="domino domino--placed domino--preview">
                <span className="domino__half"><MathText text={pairs[(k - 1 + n) % n].answer} /></span>
                <span className="domino__half"><MathText text={p.question} /></span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <SaveBar
        saver={saver}
        onSave={(status) =>
          saver.save({ pairs: pairs.map((p) => ({ question: p.question.trim(), answer: p.answer.trim() })) }, status, problem(pairs))
        }
      />
    </section>
  )
}
