import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { useAuth } from '../lib/auth'
import type { Classroom } from '../lib/classrooms'
import { supabase } from '../lib/supabase'

function joinError(message: string) {
  if (message.includes('No existe')) return 'No existe un aula con ese código. Revisa las letras y números.'
  if (message.includes('llena')) return 'El aula está llena. Avísale a tu profesor.'
  return 'No se pudo entrar al aula. Inténtalo de nuevo.'
}

async function join(code: string) {
  if (!supabase) return { error: 'Sin conexión' }
  const { data, error } = await supabase.rpc('join_classroom', { p_code: code.trim().toUpperCase() })
  return error ? { error: joinError(error.message) } : { id: data as string }
}

function LoginFirst({ text }: { text: string }) {
  return (
    <section className="stack narrow center">
      <Mascot size={100} />
      <h1>🏫 Mis aulas</h1>
      <p className="muted">{text}</p>
      <Link to="/login" className="btn">Iniciar sesión o crear cuenta</Link>
    </section>
  )
}

// /aulas: aulas del alumno y formulario para entrar con el código del profesor
export default function MyClassroomsPage() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<Classroom[] | null>(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase || !session) return
    supabase
      .from('classroom_members')
      .select('joined_at, classrooms(*)')
      .eq('student_id', session.user.id)
      .order('joined_at', { ascending: false })
      .then(({ data }) => {
        const list = ((data ?? []) as unknown as { classrooms: Classroom | null }[]).map((r) => r.classrooms)
        setRooms(list.filter((r): r is Classroom => r !== null))
      })
  }, [session])

  if (loading) return <p className="muted center">Cargando…</p>
  if (!session) return <LoginFirst text="Inicia sesión para entrar al aula de tu profesor y ver los juegos que te asignó." />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const result = await join(code)
    setBusy(false)
    if ('id' in result) navigate(`/aulas/${result.id}`)
    else setError(result.error)
  }

  return (
    <section className="stack narrow">
      <div className="page-head">
        <h1>🏫 Mis aulas</h1>
        <p className="muted">Aquí ves los juegos que te asignó tu profesor y el ranking de tu salón.</p>
      </div>

      <form className="join-code" onSubmit={submit}>
        <label htmlFor="class-code">Código del aula</label>
        <div className="join-code__row">
          <input
            id="class-code"
            value={code}
            maxLength={6}
            autoComplete="off"
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ej. Q4T9ZB"
          />
          <button className="btn btn--small" type="submit" disabled={busy || code.trim().length < 6}>
            {busy ? '…' : 'Entrar'}
          </button>
        </div>
        {error && <p className="auth__error" role="alert">{error}</p>}
      </form>

      {rooms === null ? (
        <p className="muted center">Cargando tus aulas…</p>
      ) : rooms.length === 0 ? (
        <div className="card center">
          <Mascot size={80} />
          <p>Aún no estás en ninguna aula. Pídele el código a tu profesor.</p>
        </div>
      ) : (
        <ul className="teacher-list">
          {rooms.map((c) => (
            <li key={c.id}>
              <Link to={`/aulas/${c.id}`} className="classroom-card">
                <span className="tile tile--blue" aria-hidden="true">🏫</span>
                <strong>{c.name}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// /aulas/unirse/:code: enlace que comparte el profesor
export function JoinClassroomPage() {
  const { code = '' } = useParams()
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) return
    join(code).then((result) => {
      if ('id' in result) navigate(`/aulas/${result.id}`, { replace: true })
      else setError(result.error)
    })
  }, [session, code, navigate])

  if (loading) return <p className="muted center">Cargando…</p>
  if (!session) {
    return <LoginFirst text={`Inicia sesión y luego vuelve a abrir el enlace, o escribe el código ${code.toUpperCase()} en Perfil → Mis aulas.`} />
  }
  return (
    <section className="stack narrow center">
      {error ? (
        <>
          <Mascot mood="sad" size={100} />
          <p className="auth__error" role="alert">{error}</p>
          <Link to="/aulas" className="btn">Ir a Mis aulas</Link>
        </>
      ) : (
        <p className="muted">Entrando al aula…</p>
      )}
    </section>
  )
}
