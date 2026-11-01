import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Logo from '../brand/Logo'
import BottomNav from './BottomNav'
import TopNav from './TopNav'

export default function AppLayout() {
  // Al cambiar de página, empezar desde arriba
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" aria-label="Ir al inicio">
            <Logo />
          </Link>
          <TopNav />
          <div className="stats-chips">
            <span className="chip chip--streak">🔥 0</span>
            <span className="chip chip--xp">⭐ 0 XP</span>
          </div>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">© OpenAcademy · Creado por Edgar Chura Humora</footer>
      <BottomNav />
    </div>
  )
}
