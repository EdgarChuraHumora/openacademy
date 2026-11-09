import { useState } from 'react'
import type { ClassifyItem } from '../games/classify/types'
import type { DbGame } from '../../lib/userGames'
import { EditorHeader, FormulaHelp, MathPreview, MetaFields, SaveBar, unclosedMath, useGameSaver } from './editorShared'

const MIN_ITEMS = 4
const MAX_ITEMS = 20

function problem(groups: string[], items: ClassifyItem[]) {
  if (groups.some((g) => !g.trim())) return 'Ponle nombre a todos los grupos.'
  if (new Set(groups.map((g) => g.trim())).size < groups.length) return 'Hay dos grupos con el mismo nombre.'
  if (items.length < MIN_ITEMS) return `Agrega al menos ${MIN_ITEMS} tarjetas.`
  if (items.some((it) => !it.text.trim())) return 'Hay una tarjeta vacía.'
  if (new Set(items.map((it) => it.text.trim())).size < items.length) return 'Hay dos tarjetas iguales.'
  for (const g of groups.keys()) {
    if (!items.some((it) => it.group === g)) return `El grupo "${groups[g]}" no tiene ninguna tarjeta.`
  }
  if (unclosedMath([...groups, ...items.map((it) => it.text)])) return 'Falta cerrar una fórmula: los signos $ van de dos en dos.'
  return ''
}

export default function ClassifyEditor({ initial }: { initial?: DbGame }) {
  const saver = useGameSaver('classify', initial)
  const [groups, setGroups] = useState<string[]>((initial?.content.groups as string[] | undefined) ?? ['', ''])
  const [items, setItems] = useState<ClassifyItem[]>(
    (initial?.content.items as ClassifyItem[] | undefined) ?? [0, 1, 0, 1].map((group) => ({ text: '', group })),
  )

  function setGroupCount(count: number) {
    if (count === groups.length) return
    setGroups(count > groups.length ? [...groups, ''] : groups.slice(0, count))
    // Las tarjetas del grupo que se quita pasan al primero
    setItems(items.map((it) => (it.group >= count ? { ...it, group: 0 } : it)))
  }

  function updateItem(i: number, change: Partial<ClassifyItem>) {
    setItems(items.map((it, j) => (j === i ? { ...it, ...change } : it)))
    saver.setNotice('')
  }

  return (
    <section className="stack narrow">
      <EditorHeader title={saver.id ? 'Editar Clasificar' : 'Nuevo juego de Clasificar'} />
      <p className="muted">
        Define 2 o 3 grupos y escribe tarjetas indicando a qué grupo pertenece cada una. El alumno las ubica y luego comprueba.
      </p>
      <MetaFields meta={saver.meta} onChange={saver.setMeta} />
      <FormulaHelp />

      <div className="card">
        <div className="field">
          Número de grupos
          <div className="tf-choice">
            {[2, 3].map((n) => (
              <button
                key={n}
                type="button"
                className={`tf-choice__btn ${groups.length === n ? 'tf-choice__btn--true' : ''}`}
                aria-pressed={groups.length === n}
                onClick={() => setGroupCount(n)}
              >
                {n} grupos
              </button>
            ))}
          </div>
        </div>
        {groups.map((g, i) => (
          <label key={i} className="field">
            Grupo {i + 1}
            <input
              value={g}
              maxLength={40}
              onChange={(e) => setGroups(groups.map((x, j) => (j === i ? e.target.value : x)))}
              placeholder={['Ej. Primo', 'Ej. Compuesto', 'Ej. Ninguno'][i]}
            />
          </label>
        ))}
      </div>

      <div className="card">
        <strong>Tarjetas ({items.length})</strong>
        {items.map((it, i) => (
          <div key={i} className="editor-step">
            <input value={it.text} onChange={(e) => updateItem(i, { text: e.target.value })} placeholder={`Tarjeta ${i + 1}`} />
            <select
              value={it.group}
              aria-label={`Grupo de la tarjeta ${i + 1}`}
              onChange={(e) => updateItem(i, { group: Number(e.target.value) })}
            >
              {groups.map((g, k) => <option key={k} value={k}>{g.trim() || `Grupo ${k + 1}`}</option>)}
            </select>
            {items.length > MIN_ITEMS && (
              <button
                type="button"
                className="link-btn editor-question__remove"
                aria-label={`Quitar la tarjeta ${i + 1}`}
                onClick={() => setItems(items.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            )}
            {it.text.includes('$') && <span className="editor-option__preview"><MathPreview text={it.text} /></span>}
          </div>
        ))}
        {items.length < MAX_ITEMS && (
          <button type="button" className="link-btn" onClick={() => setItems([...items, { text: '', group: 0 }])}>+ Agregar tarjeta</button>
        )}
      </div>

      <SaveBar
        saver={saver}
        onSave={(status) =>
          saver.save(
            { groups: groups.map((g) => g.trim()), items: items.map((it) => ({ text: it.text.trim(), group: it.group })) },
            status,
            problem(groups, items),
          )
        }
      />
    </section>
  )
}
