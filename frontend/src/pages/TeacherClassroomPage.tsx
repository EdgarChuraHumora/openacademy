import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { games as builtInGames } from '../features/games/catalog'
import { useAuth } from '../lib/auth'
import {
  byDue,
  daysLeft,
  dueLabel,
  fetchAssigned,
  fetchClassroom,
  joinUrl,
  formatDue,
  pctClass,
  todayLima,
  type AssignedGame,
  type ClassStudent,
  type Classroom,
  type ReportCell,
} from '../lib/classrooms'
import { supabase } from '../lib/supabase'
import { fetchMyGames, type DbGame } from '../lib/userGames'
import { TeacherGate, useIsTeacher } from './TeacherPage'

interface Option {
  id: string
  title: string
  icon: string
}

const date = (iso: string) => new Date(iso).toLocaleDateString('es-PE')

// Descarga los resultados como CSV (se abre en Excel o Google Sheets)
function downloadCsv(name: string, students: ClassStudent[], assigned: AssignedGame[], cell: (s: string, g: string) => ReportCell | undefined) {
  const quote = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const head = ['Alumno', 'Grado', 'XP semana', ...assigned.map((g) => `${g.title} (%)`)]
  const lines = students.map((s) => [
    s.display_name,
    s.grade ?? '',
    s.week_xp,
    ...assigned.map((g) => {
      const c = cell(s.student_id, g.game_id)
      if (!c) return g.due_date && daysLeft(g.due_date) < 0 ? 'no entregó' : ''
      return c.on_time === false ? `${c.best_pct} (tarde)` : c.best_pct
    }),
  ])
  // El BOM (﻿) hace que Excel lea bien las tildes
  const csv = '﻿' + [head, ...lines].map((l) => l.map(quote).join(';')).join('\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  link.download = `resultados-${name.replace(/[^\w-]+/g, '-')}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

// /docente/aulas/:id: código del aula, juegos asignados y resultados por alumno
export default function TeacherClassroomPage() {
  const { id = '' } = useParams()
  const { session } = useAuth()
  const isTeacher = useIsTeacher()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Classroom | null | undefined>(undefined)
  const [assigned, setAssigned] = useState<AssignedGame[]>([])
  const [students, setStudents] = useState<ClassStudent[]>([])
  const [report, setReport] = useState<ReportCell[]>([])
  const [myGames, setMyGames] = useState<DbGame[]>([])
  const [pick, setPick] = useState('')
  const [due, setDue] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!supabase) return
    const [r, a, s, rep] = await Promise.all([
      fetchClassroom(id),
      fetchAssigned(id),
      supabase.rpc('classroom_students', { p_classroom: id }),
      supabase.rpc('classroom_report', { p_classroom: id }),
    ])
    setRoom(r)
    setAssigned([...a].sort(byDue))
    setStudents((s.data as ClassStudent[]) ?? [])
    setReport((rep.data as ReportCell[]) ?? [])
  }, [id])

  useEffect(() => {
    if (!session || !isTeacher) return
    load()
    fetchMyGames(session.user.id).then((list) => setMyGames(list.filter((g) => g.status === 'published')))
  }, [session, isTeacher, load])

  if (!isTeacher) return <TeacherGate />
  if (room === undefined) return <p className="muted center">Cargando aula…</p>
  if (!room || room.owner_id !== session?.user.id) {
    return (
      <section className="stack narrow center">
        <p>No encontramos esa aula entre las tuyas.</p>
        <Link to="/docente/aulas" className="btn">Volver a mis aulas</Link>
      </section>
    )
  }

  const assignedIds = new Set(assigned.map((g) => g.game_id))
  const options: { group: string; items: Option[] }[] = [
    { group: 'Mis juegos publicados', items: myGames.map((g) => ({ id: g.id, title: g.title, icon: g.icon })) },
    { group: 'Juegos de OpenAcademy', items: builtInGames.map((g) => ({ id: g.id, title: g.title, icon: g.icon })) },
  ]
  const cell = (studentId: string, gameId: string) =>
    report.find((r) => r.student_id === studentId && r.game_id === gameId)

  async function assign() {
    const option = options.flatMap((o) => o.items).find((o) => o.id === pick)
    if (!supabase || !option) return
    setError('')
    const { error } = await supabase
      .from('classroom_games')
      .insert({ classroom_id: id, game_id: option.id, title: option.title.slice(0, 80), icon: option.icon, due_date: due || null })
    if (error) setError('No se pudo asignar el juego.')
    setPick('')
    setDue('')
    load()
  }

  async function changeDue(game: AssignedGame, value: string) {
    if (!supabase) return
    const { error } = await supabase
      .from('classroom_games')
      .update({ due_date: value || null })
      .eq('classroom_id', id)
      .eq('game_id', game.game_id)
    if (error) setError('No se pudo cambiar la fecha límite.')
    load()
  }

  async function unassign(game: AssignedGame) {
    if (!supabase || !window.confirm(`¿Quitar "${game.title}" del aula? Los resultados de los alumnos no se borran.`)) return
    await supabase.from('classroom_games').delete().eq('classroom_id', id).eq('game_id', game.game_id)
    load()
  }

  async function removeStudent(s: ClassStudent) {
    if (!supabase || !window.confirm(`¿Sacar a ${s.display_name} del aula?`)) return
    await supabase.from('classroom_members').delete().eq('classroom_id', id).eq('student_id', s.student_id)
    load()
  }

  async function removeRoom() {
    if (!supabase || !room) return
    if (!window.confirm(`¿Borrar el aula "${room.name}"? Los alumnos dejarán de verla. Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('classrooms').delete().eq('id', id)
    if (error) setError('No se pudo borrar el aula.')
    else navigate('/docente/aulas')
  }

  async function copy() {
    if (!room) return
    try {
      await navigator.clipboard.writeText(joinUrl(room.join_code))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  // Promedio del aula en cada juego (solo de quienes lo jugaron)
  const average = (gameId: string) => {
    const cells = report.filter((r) => r.game_id === gameId)
    return cells.length ? Math.round(cells.reduce((sum, r) => sum + r.best_pct, 0) / cells.length) : null
  }

  return (
    <section className="stack">
      <Link to="/docente/aulas" className="back-link">← Mis aulas</Link>
      <div className="page-head">
        <h1>🏫 {room.name}</h1>
        <p className="muted">Creada el {date(room.created_at)} · {students.length} alumnos</p>
      </div>

      <div className="card classroom-code">
        <span className="muted">Código para tus alumnos</span>
        <strong className="classroom-code__value">{room.join_code}</strong>
        <p className="muted">
          Tus alumnos entran a <strong>Perfil → Mis aulas</strong> y escriben el código, o abren el enlace.
        </p>
        <button className="btn btn--ghost btn--small" onClick={copy}>{copied ? '¡Enlace copiado!' : 'Copiar enlace para unirse'}</button>
      </div>

      {error && <p className="auth__error" role="alert">{error}</p>}

      <h2 className="section-title">Juegos asignados ({assigned.length})</h2>
      <div className="card">
        <label className="field">
          Asignar un juego
          <select value={pick} onChange={(e) => setPick(e.target.value)}>
            <option value="">Elige un juego…</option>
            {options.map((o) =>
              o.items.length ? (
                <optgroup key={o.group} label={o.group}>
                  {o.items.map((g) => (
                    <option key={g.id} value={g.id} disabled={assignedIds.has(g.id)}>
                      {g.icon} {g.title}
                    </option>
                  ))}
                </optgroup>
              ) : null,
            )}
          </select>
        </label>
        <label className="field">
          Fecha límite (opcional)
          <input type="date" value={due} min={todayLima()} onChange={(e) => setDue(e.target.value)} />
        </label>
        <button className="btn" disabled={!pick} onClick={assign}>Asignar al aula</button>
      </div>
      {assigned.length > 0 && (
        <ul className="assigned-list">
          {assigned.map((g) => {
            const avg = average(g.game_id)
            return (
              <li key={g.game_id} className="assigned-game">
                <span aria-hidden="true">{g.icon}</span>
                <div className="assigned-game__info">
                  <strong>{g.title}</strong>
                  <span className="muted">
                    {report.filter((r) => r.game_id === g.game_id).length} de {students.length} lo jugaron
                    {avg !== null && <> · promedio <span className={pctClass(avg)}>{avg}%</span></>}
                  </span>
                  {g.due_date && <span className={dueLabel(g.due_date).className}>{dueLabel(g.due_date).text}</span>}
                  <label className="due-input">
                    Fecha límite:
                    <input
                      type="date"
                      value={g.due_date ?? ''}
                      onChange={(e) => changeDue(g, e.target.value)}
                      aria-label={`Fecha límite de ${g.title}`}
                    />
                  </label>
                </div>
                <button className="link-btn teacher-game__delete" onClick={() => unassign(g)}>Quitar</button>
              </li>
            )
          })}
        </ul>
      )}

      <h2 className="section-title">Alumnos y resultados</h2>
      {students.length === 0 ? (
        <div className="card center">
          <p>Aún no hay alumnos. Comparte el código <strong className="code">{room.join_code}</strong> para que se unan.</p>
        </div>
      ) : (
        <>
          <p className="muted">Cada casilla muestra el mejor resultado del alumno en ese juego.</p>
          <div className="table-scroll">
            <table className="results-table">
              <thead>
                <tr>
                  <th scope="col">Alumno</th>
                  <th scope="col">XP semana</th>
                  {assigned.map((g) => (
                    <th key={g.game_id} scope="col" title={g.title}>
                      <span aria-hidden="true">{g.icon}</span> {g.title}
                      {g.due_date && <small className="muted"> · {formatDue(g.due_date)}</small>}
                    </th>
                  ))}
                  <th scope="col"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.student_id}>
                    <th scope="row">
                      {s.display_name}
                      <small className="muted">{s.grade ?? 'Sin grado'}</small>
                    </th>
                    <td>{s.week_xp}</td>
                    {assigned.map((g) => {
                      const c = cell(s.student_id, g.game_id)
                      return (
                        <td key={g.game_id}>
                          {c ? (
                            <span className={pctClass(c.best_pct)} title={`${c.attempts} intento(s), último el ${date(c.last_played)}`}>
                              {c.best_pct}%
                              {c.on_time === false && <span className="late-mark">tarde</span>}
                            </span>
                          ) : g.due_date && daysLeft(g.due_date) < 0 ? (
                            <span className="pct pct--low">Falta</span>
                          ) : (
                            <span className="muted">—</span>
                          )}
                        </td>
                      )
                    })}
                    <td>
                      <button className="link-btn teacher-game__delete" onClick={() => removeStudent(s)} aria-label={`Sacar a ${s.display_name}`}>
                        Sacar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn--ghost" onClick={() => downloadCsv(room.name, students, assigned, cell)}>
            ⬇️ Descargar resultados (Excel)
          </button>
        </>
      )}

      <Link to={`/aulas/${room.id}`} className="ranking-link">🏆 Ver el ranking del aula</Link>
      <button className="btn btn--red" onClick={removeRoom}>Borrar aula</button>
    </section>
  )
}
