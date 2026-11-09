import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type { Classroom } from '../lib/classrooms'
import { supabase } from '../lib/supabase'
import { TeacherGate, useIsTeacher } from './TeacherPage'

type Row = Classroom & { classroom_members: { count: number }[] }

// /docente/aulas: lista de aulas del docente y formulario para crear una
export default function TeacherClassroomsPage() {
  const { session } = useAuth()
  const isTeacher = useIsTeacher()
  const navigate = useNavigate()
  const [rows, setRows] = useState<Row[] | null>(null)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase || !session || !isTeacher) return
    supabase
      .from('classrooms')
      .select('*, classroom_members(count)')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setRows((data as Row[]) ?? []))
  }, [session, isTeacher])

  if (!isTeacher) return <TeacherGate />

  async function create(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !name.trim()) return
    setBusy(true)
    setError('')
    const { data, error } = await supabase.from('classrooms').insert({ name: name.trim() }).select('id').single()
    setBusy(false)
    if (error || !data) setError('No se pudo crear el aula. Inténtalo de nuevo.')
    else navigate(`/docente/aulas/${data.id}`)
  }

  return (
    <section className="stack narrow">
      <Link to="/docente" className="back-link">← Panel docente</Link>
      <div className="page-head">
        <h1>🏫 Mis aulas</h1>
        <p className="muted">
          Crea un aula, comparte su código con tus alumnos, asígnales juegos y mira cómo le va a cada uno.
        </p>
      </div>

      <form className="card" onSubmit={create}>
        <label className="field">
          Nombre del aula
          <input value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="Ej. 1.º B · Matemática" />
        </label>
        <button className="btn" type="submit" disabled={busy || !name.trim()}>
          {busy ? 'Creando…' : 'Crear aula'}
        </button>
        {error && <p className="auth__error" role="alert">{error}</p>}
      </form>

      {rows === null ? (
        <p className="muted center">Cargando tus aulas…</p>
      ) : rows.length === 0 ? (
        <p className="muted center">Aún no tienes aulas.</p>
      ) : (
        <ul className="teacher-list">
          {rows.map((c) => (
            <li key={c.id}>
              <Link to={`/docente/aulas/${c.id}`} className="classroom-card">
                <span className="tile tile--blue" aria-hidden="true">🏫</span>
                <div>
                  <strong>{c.name}</strong>
                  <p className="muted">
                    {c.classroom_members[0]?.count ?? 0} alumnos · código <strong className="code">{c.join_code}</strong>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
