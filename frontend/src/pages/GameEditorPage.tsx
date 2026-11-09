import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import MatchEditor from '../features/teacher/MatchEditor'
import QuizEditor from '../features/teacher/QuizEditor'
import TrueFalseEditor from '../features/teacher/TrueFalseEditor'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import type { DbGame } from '../lib/userGames'
import { TeacherGate, useIsTeacher } from './TeacherPage'

// Tipos de juego que ya se pueden crear desde el panel docente
export const editableKinds = ['quiz', 'match', 'truefalse'] as const
type EditableKind = (typeof editableKinds)[number]
const isEditable = (kind: string): kind is EditableKind => (editableKinds as readonly string[]).includes(kind)

function Editor({ kind, initial }: { kind: EditableKind; initial?: DbGame }) {
  if (kind === 'match') return <MatchEditor initial={initial} />
  if (kind === 'truefalse') return <TrueFalseEditor initial={initial} />
  return <QuizEditor initial={initial} />
}

// /docente/nuevo?tipo=match crea un juego; /docente/editar/:id abre uno propio
export default function GameEditorPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { session } = useAuth()
  const isTeacher = useIsTeacher()
  const [row, setRow] = useState<DbGame | null | undefined>(id ? undefined : null)

  useEffect(() => {
    if (!id || !supabase || !session || !isTeacher) return
    supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .eq('owner_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setRow((data as DbGame | null) ?? null))
  }, [id, session, isTeacher])

  if (!isTeacher) return <TeacherGate />

  if (!id) {
    const kind = params.get('tipo') ?? 'quiz'
    return <Editor key={kind} kind={isEditable(kind) ? kind : 'quiz'} />
  }
  if (row === undefined) return <p className="muted center">Cargando juego…</p>
  if (!row || !isEditable(row.kind)) {
    return (
      <section className="stack narrow center">
        <p>No encontramos ese juego entre los tuyos, o todavía no se puede editar desde aquí.</p>
        <Link to="/docente" className="btn">Volver al panel docente</Link>
      </section>
    )
  }
  return <Editor key={row.id} kind={row.kind} initial={row} />
}
