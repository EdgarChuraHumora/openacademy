import { useState } from 'react'
import type { OrderProblem } from '../games/order/types'
import type { DbGame } from '../../lib/userGames'
import { EditorHeader, FormulaHelp, ItemTools, MathPreview, MetaFields, SaveBar, moveItem, unclosedMath, useGameSaver } from './editorShared'

const MAX_PROBLEMS = 10
const MIN_STEPS = 3
const MAX_STEPS = 8
const empty = (): OrderProblem => ({ prompt: '', steps: ['', '', ''] })

function problem(problems: OrderProblem[]) {
  for (const [i, p] of problems.entries()) {
    const n = i + 1
    if (!p.prompt.trim()) return `Falta el enunciado del problema ${n}.`
    if (p.steps.length < MIN_STEPS) return `El problema ${n} necesita al menos ${MIN_STEPS} pasos.`
    if (p.steps.some((s) => !s.trim())) return `Hay un paso vacío en el problema ${n}.`
    // Si dos pasos son iguales habría dos órdenes correctos
    if (new Set(p.steps.map((s) => s.trim())).size < p.steps.length) return `En el problema ${n} hay dos pasos iguales.`
    if (unclosedMath([p.prompt, ...p.steps])) return `En el problema ${n} falta cerrar una fórmula: los signos $ van de dos en dos.`
  }
  return ''
}

export default function OrderEditor({ initial }: { initial?: DbGame }) {
  const saver = useGameSaver('order', initial)
  const [problems, setProblems] = useState<OrderProblem[]>((initial?.content.problems as OrderProblem[] | undefined) ?? [empty()])

  function update(i: number, change: Partial<OrderProblem>) {
    setProblems(problems.map((p, j) => (j === i ? { ...p, ...change } : p)))
    saver.setNotice('')
  }

  const setStep = (i: number, k: number, value: string) =>
    update(i, { steps: problems[i].steps.map((s, m) => (m === k ? value : s)) })

  return (
    <section className="stack narrow">
      <EditorHeader title={saver.id ? 'Editar Ordenar pasos' : 'Nuevo juego de Ordenar pasos'} />
      <p className="muted">
        Escribe cada problema y sus pasos <b>en el orden correcto</b>. El juego los mezcla y el alumno los ordena. Procura que
        cada paso salga del anterior, para que haya un solo orden posible.
      </p>
      <MetaFields meta={saver.meta} onChange={saver.setMeta} />
      <FormulaHelp />

      {problems.map((p, i) => (
        <div key={i} className="card editor-question">
          <div className="editor-question__head">
            <strong>Problema {i + 1}</strong>
            <ItemTools
              index={i}
              count={problems.length}
              min={1}
              onMove={(dir) => setProblems(moveItem(problems, i, dir))}
              onRemove={() => setProblems(problems.filter((_, j) => j !== i))}
            />
          </div>
          <label className="field">
            Enunciado
            <input value={p.prompt} onChange={(e) => update(i, { prompt: e.target.value })} placeholder="Ej. Resuelve $3x + 5 = 20$" />
          </label>
          <MathPreview text={p.prompt} />

          <div className="field">
            Pasos en orden
            {p.steps.map((s, k) => (
              <div key={k} className="editor-step">
                <span className="order-slot__num">{k + 1}</span>
                <input value={s} onChange={(e) => setStep(i, k, e.target.value)} placeholder={k === 0 ? 'Ej. $3x = 20 - 5$' : `Paso ${k + 1}`} />
                {p.steps.length > MIN_STEPS && (
                  <button
                    type="button"
                    className="link-btn editor-question__remove"
                    aria-label={`Quitar el paso ${k + 1}`}
                    onClick={() => update(i, { steps: p.steps.filter((_, m) => m !== k) })}
                  >
                    ✕
                  </button>
                )}
                {s.includes('$') && <span className="editor-option__preview"><MathPreview text={s} /></span>}
              </div>
            ))}
            {p.steps.length < MAX_STEPS && (
              <button type="button" className="link-btn" onClick={() => update(i, { steps: [...p.steps, ''] })}>+ Agregar paso</button>
            )}
          </div>
        </div>
      ))}

      {problems.length < MAX_PROBLEMS && (
        <button type="button" className="btn btn--ghost" onClick={() => setProblems([...problems, empty()])}>
          + Agregar problema
        </button>
      )}

      <SaveBar
        saver={saver}
        onSave={(status) =>
          saver.save(
            { problems: problems.map((p) => ({ prompt: p.prompt.trim(), steps: p.steps.map((s) => s.trim()) })) },
            status,
            problem(problems),
          )
        }
      />
    </section>
  )
}
