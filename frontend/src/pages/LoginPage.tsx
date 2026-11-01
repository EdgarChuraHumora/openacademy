import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'
import { authErrorMessage, useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

type Mode = 'entrar' | 'registro' | 'recuperar'

const titles: Record<Mode, string> = {
  entrar: 'Bienvenido a',
  registro: 'Crea tu cuenta en',
  recuperar: 'Recupera tu cuenta de',
}

export default function LoginPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('entrar')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  if (session) return <Navigate to="/perfil" replace />

  function change(next: Mode) {
    setMode(next)
    setError('')
    setNotice('')
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')
    setNotice('')
    const redirectTo = window.location.origin
    try {
      if (mode === 'entrar') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/perfil')
      } else if (mode === 'registro') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name.trim() }, emailRedirectTo: redirectTo },
        })
        if (error) throw error
        if (data.session) navigate('/perfil')
        else setNotice('¡Listo! Te enviamos un correo: abre el enlace para confirmar tu cuenta y luego inicia sesión.')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${redirectTo}/nueva-clave` })
        if (error) throw error
        setNotice('Si ese correo tiene una cuenta, te llegará un enlace para crear una contraseña nueva.')
      }
    } catch (err) {
      setError(authErrorMessage(err instanceof Error ? err.message : ''))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={submit}>
        <Mascot size={100} />
        <h1>{titles[mode]} <span className="logo__accent">OpenAcademy</span></h1>

        {!supabase ? (
          <p className="auth__error">El inicio de sesión aún no está configurado en esta versión de la app.</p>
        ) : (
          <>
            {mode === 'registro' && (
              <label className="field">
                Tu nombre o apodo
                <input
                  required
                  maxLength={40}
                  autoComplete="nickname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Así te verán en el ranking"
                />
              </label>
            )}
            <label className="field">
              Correo
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
              />
            </label>
            {mode !== 'recuperar' && (
              <label className="field">
                Contraseña
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === 'registro' ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'registro' ? 'Mínimo 6 caracteres' : '••••••••'}
                />
              </label>
            )}

            {error && <p className="auth__error" role="alert">{error}</p>}
            {notice && <p className="auth__notice" role="status">{notice}</p>}

            <button className="btn" type="submit" disabled={busy}>
              {busy ? 'Un momento…' : mode === 'entrar' ? 'Entrar' : mode === 'registro' ? 'Crear cuenta' : 'Enviar enlace'}
            </button>

            {mode === 'entrar' && (
              <>
                <button type="button" className="link-btn" onClick={() => change('recuperar')}>¿Olvidaste tu contraseña?</button>
                <p className="muted center">
                  ¿No tienes cuenta? <button type="button" className="link-btn" onClick={() => change('registro')}>Regístrate</button>
                </p>
              </>
            )}
            {mode !== 'entrar' && (
              <p className="muted center">
                ¿Ya tienes cuenta? <button type="button" className="link-btn" onClick={() => change('entrar')}>Inicia sesión</button>
              </p>
            )}
          </>
        )}
        <Link to="/" className="link center">Volver al inicio</Link>
      </form>
    </div>
  )
}
