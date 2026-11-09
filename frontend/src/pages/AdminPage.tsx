import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

type Role = 'student' | 'teacher' | 'admin'

interface AdminUser {
  id: string
  display_name: string
  email: string
  role: Role
  grade: string | null
  xp: number
  teacher_requested_at: string | null
  created_at: string
}

const roleLabel: Record<Role, string> = { student: 'Alumno', teacher: 'Docente', admin: 'Administrador' }
const date = (iso: string) => new Date(iso).toLocaleDateString('es-PE')

export default function AdminPage() {
  const { session, profile, loading } = useAuth()
  const [users, setUsers] = useState<AdminUser[] | null>(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const isAdmin = profile?.role === 'admin'

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase.rpc('admin_list_users')
    if (error) setError('No se pudo cargar la lista de usuarios.')
    else setUsers((data as AdminUser[]) ?? [])
  }, [])

  useEffect(() => {
    if (isAdmin) load()
  }, [isAdmin, load])

  async function setRole(user: AdminUser, role: Role) {
    if (!supabase || role === user.role) return
    if (role === 'admin' && !window.confirm(`¿Dar a ${user.display_name} permisos de administrador? Podrá cambiar los roles de todos.`)) return
    setError('')
    const { error } = await supabase.rpc('admin_set_role', { p_user: user.id, p_role: role })
    if (error) setError(error.message)
    else load()
  }

  if (loading) return <p className="muted center">Cargando…</p>
  if (!session || !isAdmin) {
    return (
      <section className="stack narrow center">
        <Mascot mood="sad" />
        <p>Esta página es solo para el administrador de OpenAcademy.</p>
        <Link to="/" className="btn">Ir al inicio</Link>
      </section>
    )
  }

  const term = search.trim().toLowerCase()
  const visible = (users ?? []).filter(
    (u) => !term || u.display_name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term),
  )
  const requests = visible.filter((u) => u.teacher_requested_at && u.role === 'student')
  const others = visible.filter((u) => !(u.teacher_requested_at && u.role === 'student'))

  const row = (u: AdminUser, highlight = false) => (
    <li key={u.id} className={`admin-user ${highlight ? 'admin-user--request' : ''}`}>
      <div className="admin-user__info">
        <strong>{u.display_name}</strong>
        <span className="muted">{u.email}</span>
        <span className="muted">
          {u.grade ?? 'Sin grado'} · {u.xp} XP · desde {date(u.created_at)}
          {u.teacher_requested_at && ` · pidió ser docente el ${date(u.teacher_requested_at)}`}
        </span>
      </div>
      <div className="admin-user__actions">
        {highlight && (
          <button className="btn btn--green btn--small" onClick={() => setRole(u, 'teacher')}>Aprobar como docente</button>
        )}
        <select
          value={u.role}
          aria-label={`Rol de ${u.display_name}`}
          disabled={u.id === session.user.id}
          onChange={(e) => setRole(u, e.target.value as Role)}
        >
          {(Object.keys(roleLabel) as Role[]).map((r) => <option key={r} value={r}>{roleLabel[r]}</option>)}
        </select>
      </div>
    </li>
  )

  return (
    <section className="stack narrow">
      <div className="page-head">
        <h1>🛠️ Administración</h1>
        <p className="muted">Aprueba a los docentes y cambia el rol de cada usuario.</p>
      </div>

      <label className="field">
        Buscar por nombre o correo
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ej. maria@…" />
      </label>

      {error && <p className="auth__error" role="alert">{error}</p>}

      {users === null ? (
        <p className="muted center">Cargando usuarios…</p>
      ) : (
        <>
          {requests.length > 0 && (
            <>
              <h2 className="section-title">Solicitudes de docente ({requests.length})</h2>
              <ul className="admin-list">{requests.map((u) => row(u, true))}</ul>
            </>
          )}
          <h2 className="section-title">Usuarios ({others.length})</h2>
          <ul className="admin-list">{others.map((u) => row(u))}</ul>
        </>
      )}
    </section>
  )
}
