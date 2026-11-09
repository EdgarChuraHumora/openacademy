import { useState } from 'react'
import type { RouletteSector } from '../games/roulette/types'
import Wheel from '../games/roulette/Wheel'
import type { DbGame } from '../../lib/userGames'
import { EditorHeader, FormulaHelp, ItemTools, MathPreview, MetaFields, SaveBar, moveItem, unclosedMath, useGameSaver } from './editorShared'

const letters = ['A', 'B', 'C', 'D']
const MIN = 4
const MAX = 8
const LABEL_MAX = 12 // más largo ya no cabe en el sector de la ruleta

interface Draft {
  label: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

const empty = (): Draft => ({ label: '', question: '', options: ['', '', '', ''], answerIndex: 0, explanation: '' })

const toDraft = (s: RouletteSector): Draft => ({
  label: s.label,
  question: s.question,
  options: [...s.options, '', '', '', ''].slice(0, 4),
  answerIndex: s.answerIndex,
  explanation: s.explanation ?? '',
})

function problem(sectors: Draft[]) {
  if (sectors.length < MIN) return `La ruleta necesita al menos ${MIN} sectores.`
  for (const [i, s] of sectors.entries()) {
    const n = i + 1
    if (!s.label.trim()) return `Ponle un nombre corto al sector ${n} (se ve en la ruleta).`
    if (!s.question.trim()) return `Falta la pregunta del sector ${n}.`
    if (s.options.some((o) => !o.trim())) return `El sector ${n} necesita sus 4 opciones.`
    if (new Set(s.options.map((o) => o.trim())).size < 4) return `En el sector ${n} hay opciones repetidas.`
    if (unclosedMath([s.question, ...s.options, s.explanation])) return `En el sector ${n} falta cerrar una fórmula: los signos $ van de dos en dos.`
  }
  return ''
}

export default function RouletteEditor({ initial }: { initial?: DbGame }) {
  const saver = useGameSaver('roulette', initial)
  const [sectors, setSectors] = useState<Draft[]>(
    ((initial?.content.sectors as RouletteSector[] | undefined) ?? []).map(toDraft).concat(initial ? [] : [empty(), empty(), empty(), empty()]),
  )

  function update(i: number, change: Partial<Draft>) {
    setSectors(sectors.map((s, j) => (j === i ? { ...s, ...change } : s)))
    saver.setNotice('')
  }

  function content() {
    return {
      sectors: sectors.map((s) => ({
        label: s.label.trim(),
        question: s.question.trim(),
        options: s.options.map((o) => o.trim()),
        answerIndex: s.answerIndex,
        ...(s.explanation.trim() ? { explanation: s.explanation.trim() } : {}),
      })),
    }
  }

  return (
    <section className="stack narrow">
      <EditorHeader title={saver.id ? 'Editar Ruleta' : 'Nueva Ruleta'} />
      <p className="muted">
        Cada sector de la ruleta tiene un nombre corto y un ejercicio de opción múltiple. El alumno gira y responde el sector
        donde cae.
      </p>
      <MetaFields meta={saver.meta} onChange={saver.setMeta} />

      <div className="card">
        <strong>Vista previa</strong>
        <Wheel labels={sectors.map((s, i) => s.label.trim() || `${i + 1}`)} rotation={0} results={sectors.map(() => undefined)} spinMs={0} />
      </div>

      <FormulaHelp />

      {sectors.map((s, i) => (
        <div key={i} className="card editor-question">
          <div className="editor-question__head">
            <strong>Sector {i + 1}</strong>
            <ItemTools
              index={i}
              count={sectors.length}
              min={MIN}
              onMove={(dir) => setSectors(moveItem(sectors, i, dir))}
              onRemove={() => setSectors(sectors.filter((_, j) => j !== i))}
            />
          </div>
          <label className="field">
            Nombre en la ruleta (máx. {LABEL_MAX} letras)
            <input value={s.label} maxLength={LABEL_MAX} onChange={(e) => update(i, { label: e.target.value })} placeholder="Ej. Potencias" />
          </label>
          <label className="field">
            Pregunta
            <input value={s.question} onChange={(e) => update(i, { question: e.target.value })} placeholder="Ej. $(-3)^3$" />
          </label>
          <MathPreview text={s.question} />
          <div className="field">
            Opciones (marca la correcta)
            {s.options.map((opt, k) => (
              <div key={k} className={`editor-option ${s.answerIndex === k ? 'editor-option--correct' : ''}`}>
                <input
                  type="radio"
                  name={`sector-${i}`}
                  checked={s.answerIndex === k}
                  onChange={() => update(i, { answerIndex: k })}
                  aria-label={`La opción ${letters[k]} es la correcta`}
                />
                <span className="option__letter">{letters[k]}</span>
                <input value={opt} onChange={(e) => update(i, { options: s.options.map((o, m) => (m === k ? e.target.value : o)) })} placeholder={`Opción ${letters[k]}`} />
                {opt.includes('$') && <span className="editor-option__preview"><MathPreview text={opt} /></span>}
              </div>
            ))}
          </div>
          <label className="field">
            Solución (opcional)
            <input value={s.explanation} onChange={(e) => update(i, { explanation: e.target.value })} />
          </label>
        </div>
      ))}

      {sectors.length < MAX && (
        <button type="button" className="btn btn--ghost" onClick={() => setSectors([...sectors, empty()])}>+ Agregar sector</button>
      )}

      <SaveBar saver={saver} onSave={(status) => saver.save(content(), status, problem(sectors))} />
    </section>
  )
}
