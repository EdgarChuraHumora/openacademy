import { useState } from 'react'
import type { MatchPair } from '../games/match/types'
import type { DbGame } from '../../lib/userGames'
import { EditorHeader, FormulaHelp, ItemTools, MathPreview, MetaFields, SaveBar, moveItem, unclosedMath, useGameSaver } from './editorShared'

const MIN = 3
const MAX = 10
const empty = (): MatchPair => ({ left: '', right: '' })

function problem(pairs: MatchPair[]) {
  if (pairs.length < MIN) return `Agrega al menos ${MIN} parejas.`
  for (const [i, p] of pairs.entries()) {
    if (!p.left.trim() || !p.right.trim()) return `Completa los dos lados de la pareja ${i + 1}.`
    if (unclosedMath([p.left, p.right])) return `En la pareja ${i + 1} falta cerrar una fórmula: los signos $ van de dos en dos.`
  }
  // Si dos tarjetas son iguales, el alumno no sabría cuál es su pareja
  if (new Set(pairs.map((p) => p.left.trim())).size < pairs.length) return 'Hay dos tarjetas de la izquierda iguales.'
  if (new Set(pairs.map((p) => p.right.trim())).size < pairs.length) return 'Hay dos tarjetas de la derecha iguales.'
  return ''
}

export default function MatchEditor({ initial }: { initial?: DbGame }) {
  const saver = useGameSaver('match', initial)
  const [pairs, setPairs] = useState<MatchPair[]>(
    (initial?.content.pairs as MatchPair[] | undefined) ?? [empty(), empty(), empty()],
  )

  function update(i: number, change: Partial<MatchPair>) {
    setPairs(pairs.map((p, j) => (j === i ? { ...p, ...change } : p)))
    saver.setNotice('')
  }

  return (
    <section className="stack narrow">
      <EditorHeader title={saver.id ? 'Editar Emparejar' : 'Nuevo juego de Emparejar'} />
      <p className="muted">
        Escribe parejas: a la izquierda una expresión y a la derecha su resultado o su equivalente. El juego las mezcla y el
        alumno las une.
      </p>
      <MetaFields meta={saver.meta} onChange={saver.setMeta} />
      <FormulaHelp />

      {pairs.map((p, i) => (
        <div key={i} className="card editor-question">
          <div className="editor-question__head">
            <strong>Pareja {i + 1}</strong>
            <ItemTools
              index={i}
              count={pairs.length}
              min={MIN}
              onMove={(dir) => setPairs(moveItem(pairs, i, dir))}
              onRemove={() => setPairs(pairs.filter((_, j) => j !== i))}
            />
          </div>
          <div className="editor-row">
            <label className="field">
              Izquierda
              <input value={p.left} onChange={(e) => update(i, { left: e.target.value })} placeholder="Ej. $2^3$" />
            </label>
            <label className="field">
              Derecha
              <input value={p.right} onChange={(e) => update(i, { right: e.target.value })} placeholder="Ej. 8" />
            </label>
          </div>
          {(p.left.includes('$') || p.right.includes('$')) && (
            <div className="editor-row">
              <MathPreview text={p.left || ' '} />
              <MathPreview text={p.right || ' '} />
            </div>
          )}
        </div>
      ))}

      {pairs.length < MAX && (
        <button type="button" className="btn btn--ghost" onClick={() => setPairs([...pairs, empty()])}>
          + Agregar pareja
        </button>
      )}

      <SaveBar
        saver={saver}
        onSave={(status) =>
          saver.save({ pairs: pairs.map((p) => ({ left: p.left.trim(), right: p.right.trim() })) }, status, problem(pairs))
        }
      />
    </section>
  )
}
