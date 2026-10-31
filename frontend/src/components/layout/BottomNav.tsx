import { NavLink } from 'react-router-dom'
import { navLinks } from './navLinks'

// Menú inferior: solo se muestra en celulares
export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navLinks.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.to === '/'} className="bottom-nav__link">
          <span aria-hidden="true">{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
