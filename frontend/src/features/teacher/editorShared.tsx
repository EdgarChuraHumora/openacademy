import { useState } from 'react'
import { Link } from 'react-router-dom'
import MathText from '../../components/MathText'
import { supabase } from '../../lib/supabase'
import { shareUrl, type DbGame } from '../../lib/userGames'

// Partes comunes de los editores de juegos del panel docente

export const icons = ['🎯', '➕', '✖️', '➗', '🍕', '🧮', '📐', '⚡', '📊', '🎲', '🧠', '🏆', '🔗', '⏱️']
const colors = [
  { value: 'blue', label: 'Azul' },
  { value: 'green', label: 'Verde' },
  { value: 'yellow', label: 'Amarillo' },
  { value: 'pink', label: 'Rosado' },
] as const

export interface Meta {
  title: string
  level: DbGame['level']
  icon: string
  color: DbGame['color']
}

// Un $ sin cerrar rompe la fórmula
export const unclosedMath = (texts: string[]) => texts.some((t) => t.split('$').length % 2 === 0)

// Guarda (crea o actualiza) un juego del docente y recuerda su estado y código
export function useGameSaver(kind: DbGame['kind'], initial?: DbGame) {
  const [meta, setMeta] = useState<Meta>({
    title: initial?.title ?? '',
    level: initial?.level ?? 'secundaria',
    icon: initial?.icon ?? '🎯',
    color: initial?.color ?? 'blue',
  })
  const [id, setId] = useState(initial?.id)
  const [status, setStatus] = useState<DbGame['status']>(initial?.status ?? 'draft')
  const [shareCode, setShareCode] = useState(initial?.share_code ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function save(content: object, nextStatus: DbGame['status'], problem: string) {
    if (!supabase) return
    if (!meta.title.trim()) problem = 'Ponle un título al juego.'
    if (problem) {
      setError(problem)
      setNotice('')
      return
    }
    setBusy(true)
    setError('')
    const row = { kind, ...meta, title: meta.title.trim(), status: nextStatus, content }
    const result = id
      ? await supabase.from('games').update(row).eq('id', id).select('id, share_code').single()
      : await supabase.from('games').insert(row).select('id, share_code').single()
    setBusy(false)
    if (result.error || !result.data) {
      setError('No se pudo guardar. Revisa tu conexión e inténtalo otra vez.')
      return
    }
    setId(result.data.id)
    setStatus(nextStatus)
    setShareCode(result.data.share_code)
    setNotice(nextStatus === 'published' ? '¡Publicado! Ya puedes compartirlo con tus alumnos.' : 'Borrador guardado.')
  }

  return { meta, setMeta, id, status, shareCode, busy, error, notice, setNotice, save }
}

export function EditorHeader({ title }: { title: string }) {
  return (
    <div className="lab-head">
      <Link to="/docente" className="quiz-close" aria-label="Volver al panel docente">✕</Link>
      <h1>{title}</h1>
    </div>
  )
}

export function MetaFields({ meta, onChange }: { meta: Meta; onChange: (meta: Meta) => void }) {
  return (
    <div className="card">
      <label className="field">
        Título
        <input value={meta.title} maxLength={80} onChange={(e) => onChange({ ...meta, title: e.target.value })} placeholder="Ej. Repaso de fracciones" />
      </label>
      <div className="editor-row">
        <label className="field">
          Nivel
          <select value={meta.level} onChange={(e) => onChange({ ...meta, level: e.target.value as Meta['level'] })}>
            <option value="primaria">Primaria</option>
            <option value="secundaria">Secundaria</option>
          </select>
        </label>
        <label className="field">
          Color
          <select value={meta.color} onChange={(e) => onChange({ ...meta, color: e.target.value as Meta['color'] })}>
            {colors.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </label>
      </div>
      <div className="field">
        Ícono
        <div className="icon-picker">
          {icons.map((ic) => (
            <button
              key={ic}
              type="button"
              className={`icon-picker__item ${ic === meta.icon ? 'icon-picker__item--on' : ''}`}
              aria-pressed={ic === meta.icon}
              onClick={() => onChange({ ...meta, icon: ic })}
            >
              {ic}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FormulaHelp() {
  return (
    <details className="card editor-help">
      <summary>💡 ¿Cómo escribo fórmulas?</summary>
      <p>Escríbelas entre signos <code>$</code>. Algunos ejemplos:</p>
      <ul>
        <li><code>$\frac{'{1}{2}'}$</code> → <MathText text="$\frac{1}{2}$" /></li>
        <li><code>$2^5$</code> → <MathText text="$2^5$" /></li>
        <li><code>$\sqrt{'{81}'}$</code> → <MathText text="$\sqrt{81}$" /></li>
        <li><code>$7 \times 8$</code> → <MathText text="$7 \times 8$" /></li>
        <li><code>$x = 4$</code> → <MathText text="$x = 4$" /></li>
      </ul>
    </details>
  )
}

// Vista previa pequeña cuando el texto tiene una fórmula
export function MathPreview({ text }: { text: string }) {
  return text.includes('$') ? <div className="editor-preview"><MathText text={text} /></div> : null
}

type Saver = ReturnType<typeof useGameSaver>

export function SaveBar({ saver, onSave }: { saver: Saver; onSave: (status: DbGame['status']) => void }) {
  const { status, shareCode, busy, error, notice, id } = saver
  return (
    <>
      {error && <p className="auth__error" role="alert">{error}</p>}
      {notice && <p className="auth__notice" role="status">{notice}</p>}
      {status === 'published' && shareCode && (
        <div className="card share-box">
          <strong>Comparte con tus alumnos</strong>
          <p>Código: <span className="share-box__code">{shareCode}</span></p>
          <p className="muted">o el enlace: {shareUrl(shareCode)}</p>
        </div>
      )}
      <div className="editor-actions">
        <button className="btn btn--ghost" disabled={busy} onClick={() => onSave('draft')}>
          {status === 'published' ? 'Pasar a borrador' : 'Guardar borrador'}
        </button>
        <button className="btn btn--green" disabled={busy} onClick={() => onSave('published')}>
          {busy ? 'Guardando…' : status === 'published' ? 'Guardar cambios' : 'Publicar'}
        </button>
      </div>
      {id && <Link to={`/juegos/${id}`} className="link center">Probar el juego →</Link>}
    </>
  )
}

// Botones para subir, bajar o quitar un elemento de una lista
export function ItemTools({ index, count, min, onMove, onRemove }: {
  index: number
  count: number
  min: number
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
}) {
  return (
    <div className="editor-question__tools">
      <button type="button" className="link-btn" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Subir">↑</button>
      <button type="button" className="link-btn" disabled={index === count - 1} onClick={() => onMove(1)} aria-label="Bajar">↓</button>
      {count > min && <button type="button" className="link-btn editor-question__remove" onClick={onRemove}>Quitar</button>}
    </div>
  )
}

export function moveItem<T>(list: T[], i: number, dir: -1 | 1) {
  const j = i + dir
  if (j < 0 || j >= list.length) return list
  const next = [...list]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}
