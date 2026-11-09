import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MathText from '../components/MathText'
import type { QuizQuestion } from '../features/games/quiz/types'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { shareUrl, type DbGame } from '../lib/userGames'
import { TeacherGate, useIsTeacher } from './TeacherPage'

const icons = ['🎯', '➕', '✖️', '➗', '🍕', '🧮', '📐', '⚡', '📊', '🎲', '🧠', '🏆']
const colors = [
  { value: 'blue', label: 'Azul' },
  { value: 'green', label: 'Verde' },
  { value: 'yellow', label: 'Amarillo' },
  { value: 'pink', label: 'Rosado' },
] as const
const letters = ['A', 'B', 'C', 'D']
const MAX_QUESTIONS = 30

interface Draft {
  question: string
  options: string[]
  answerIndex: number
  hint1: string
  hint2: string
  explanation: string
}

const emptyQuestion = (): Draft => ({ question: '', options: ['', '', '', ''], answerIndex: 0, hint1: '', hint2: '', explanation: '' })

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

// Revisa que el quiz esté completo antes de guardar; devuelve el primer problema encontrado
function problem(title: string, questions: Draft[]) {
  if (!title.trim()) return 'Ponle un título al quiz.'
  for (const [i, q] of questions.entries()) {
    if (!q.question.trim()) return `Falta escribir la pregunta ${i + 1}.`
    if (q.options.some((o) => !o.trim())) return `La pregunta ${i + 1} necesita sus 4 opciones.`
    if (new Set(q.options.map((o) => o.trim())).size < 4) return `En la pregunta ${i + 1} hay opciones repetidas.`
    if ([q.question, ...q.options, q.hint1, q.hint2, q.explanation].some((t) => t.split('$').length % 2 === 0)) {
      return `En la pregunta ${i + 1} falta cerrar una fórmula: los signos $ van de dos en dos.`
    }
  }
  return ''
}

export default function QuizEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const isTeacher = useIsTeacher()
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState<'primaria' | 'secundaria'>('secundaria')
  const [icon, setIcon] = useState('🎯')
  const [color, setColor] = useState<DbGame['color']>('blue')
  const [questions, setQuestions] = useState<Draft[]>([emptyQuestion()])
  const [status, setStatus] = useState<DbGame['status']>('draft')
  const [shareCode, setShareCode] = useState('')
  const [loading, setLoading] = useState(Boolean(id))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!id || !supabase || !isTeacher) return
    supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        const g = data as DbGame | null
        if (g && g.kind === 'quiz') {
          setTitle(g.title)
          setLevel(g.level)
          setIcon(g.icon)
          setColor(g.color)
          setStatus(g.status)
          setShareCode(g.share_code)
          setQuestions(((g.content.questions as QuizQuestion[]) ?? []).map(toDraft))
        } else {
          setError('No encontramos ese quiz entre tus juegos.')
        }
        setLoading(false)
      })
  }, [id, isTeacher])

  if (!isTeacher) return <TeacherGate />
  if (loading) return <p className="muted center">Cargando quiz…</p>

  function update(i: number, change: Partial<Draft>) {
    setQuestions(questions.map((q, j) => (j === i ? { ...q, ...change } : q)))
    setNotice('')
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= questions.length) return
    const next = [...questions]
    ;[next[i], next[j]] = [next[j], next[i]]
    setQuestions(next)
  }

  async function save(nextStatus: DbGame['status']) {
    if (!supabase || !session) return
    const issue = problem(title, questions)
    if (issue) {
      setError(issue)
      setNotice('')
      return
    }
    setBusy(true)
    setError('')
    const row = {
      kind: 'quiz' as const,
      title: title.trim(),
      level,
      icon,
      color,
      status: nextStatus,
      content: { questions: questions.map(toQuestion) },
    }
    const result = id
      ? await supabase.from('games').update(row).eq('id', id).select('id, share_code').single()
      : await supabase.from('games').insert(row).select('id, share_code').single()
    setBusy(false)
    if (result.error || !result.data) {
      setError('No se pudo guardar. Revisa tu conexión e inténtalo otra vez.')
      return
    }
    setStatus(nextStatus)
    setShareCode(result.data.share_code)
    setNotice(nextStatus === 'published' ? '¡Publicado! Ya puedes compartirlo con tus alumnos.' : 'Borrador guardado.')
    if (!id) navigate(`/docente/editar/${result.data.id}`, { replace: true })
  }

  return (
    <section className="stack narrow">
      <div className="lab-head">
        <Link to="/docente" className="quiz-close" aria-label="Volver al panel docente">✕</Link>
        <h1>{id ? 'Editar quiz' : 'Nuevo quiz'}</h1>
      </div>

      <div className="card">
        <label className="field">
          Título
          <input value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Repaso de ecuaciones" />
        </label>
        <div className="editor-row">
          <label className="field">
            Nivel
            <select value={level} onChange={(e) => setLevel(e.target.value as typeof level)}>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
            </select>
          </label>
          <label className="field">
            Color
            <select value={color} onChange={(e) => setColor(e.target.value as DbGame['color'])}>
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
                className={`icon-picker__item ${ic === icon ? 'icon-picker__item--on' : ''}`}
                aria-pressed={ic === icon}
                onClick={() => setIcon(ic)}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>
      </div>

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

      {questions.map((q, i) => (
        <div key={i} className="card editor-question">
          <div className="editor-question__head">
            <strong>Pregunta {i + 1}</strong>
            <div className="editor-question__tools">
              <button type="button" className="link-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Subir pregunta">↑</button>
              <button type="button" className="link-btn" disabled={i === questions.length - 1} onClick={() => move(i, 1)} aria-label="Bajar pregunta">↓</button>
              {questions.length > 1 && (
                <button type="button" className="link-btn editor-question__remove" onClick={() => setQuestions(questions.filter((_, j) => j !== i))}>
                  Quitar
                </button>
              )}
            </div>
          </div>

          <label className="field">
            Pregunta
            <input value={q.question} onChange={(e) => update(i, { question: e.target.value })} placeholder="Ej. $2x + 3 = 11$" />
          </label>
          {q.question.includes('$') && <div className="editor-preview"><MathText text={q.question} /></div>}

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
                {opt.includes('$') && <span className="editor-option__preview"><MathText text={opt} /></span>}
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

      {questions.length < MAX_QUESTIONS && (
        <button type="button" className="btn btn--ghost" onClick={() => setQuestions([...questions, emptyQuestion()])}>
          + Agregar pregunta
        </button>
      )}

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
        <button className="btn btn--ghost" disabled={busy} onClick={() => save('draft')}>
          {status === 'published' ? 'Pasar a borrador' : 'Guardar borrador'}
        </button>
        <button className="btn btn--green" disabled={busy} onClick={() => save('published')}>
          {busy ? 'Guardando…' : status === 'published' ? 'Guardar cambios' : 'Publicar'}
        </button>
      </div>
      {id && <Link to={`/juegos/${id}`} className="link center">Probar el quiz →</Link>}
    </section>
  )
}
