import { Link, NavLink } from 'react-router-dom'
import { navLinks } from './navLinks'

// Menú superior: solo se muestra en tablets y computadoras
export default function TopNav() {
  return (
    <nav className="top-nav">
      {navLinks.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.to === '/'} className="top-nav__link">
          <span aria-hidden="true">{link.icon}</span> {link.label}
        </NavLink>
      ))}
      <Link to="/login" className="btn btn--small">Iniciar sesión</Link>
    </nav>
  )
}
