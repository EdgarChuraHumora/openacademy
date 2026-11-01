import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { authErrorMessage, useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

// Aquí llega el alumno desde el enlace del correo "recuperar contraseña"
export default function NewPasswordPage() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) setError(authErrorMessage(error.message))
    else navigate('/perfil')
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={submit}>
        <Mascot size={100} />
        <h1>Nueva contraseña</h1>
        {loading ? (
          <p className="muted center">Cargando…</p>
        ) : !session ? (
          <p className="auth__error">El enlace no es válido o ya venció. Pide otro desde "¿Olvidaste tu contraseña?".</p>
        ) : (
          <>
            <label className="field">
              Escribe tu nueva contraseña
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </label>
            {error && <p className="auth__error" role="alert">{error}</p>}
            <button className="btn" type="submit" disabled={busy}>{busy ? 'Guardando…' : 'Guardar contraseña'}</button>
          </>
        )}
        <Link to="/login" className="link center">Volver a iniciar sesión</Link>
      </form>
    </div>
  )
}
