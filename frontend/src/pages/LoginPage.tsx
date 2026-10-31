import { Link } from 'react-router-dom'
import Mascot from '../components/brand/Mascot'

// Pantalla de muestra: el login real se conectará con Supabase
export default function LoginPage() {
  return (
    <div className="auth">
      <form className="auth__card" onSubmit={(e) => e.preventDefault()}>
        <Mascot size={110} />
        <h1>Bienvenido a <span className="logo__accent">OpenAcademy</span></h1>
        <p className="muted center">Aprende, juega y sube de nivel.</p>
        <label className="field">
          Correo
          <input type="email" placeholder="tucorreo@ejemplo.com" />
        </label>
        <label className="field">
          Contraseña
          <input type="password" placeholder="••••••••" />
        </label>
        <button className="btn" type="submit">Entrar</button>
        <p className="muted center">¿No tienes cuenta? <a className="link">Regístrate</a></p>
        <Link to="/" className="link center">Volver al inicio</Link>
      </form>
    </div>
  )
}
