import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import GamesPage from './pages/GamesPage'
import AcademyPage from './pages/AcademyPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import LabPage from './pages/LabPage'
import BalancePage from './pages/BalancePage'
import FractionStripsPage from './pages/FractionStripsPage'
import GeoboardPage from './pages/GeoboardPage'

// El quiz usa KaTeX (pesado), así que se descarga solo al abrir un juego
const QuizPage = lazy(() => import('./pages/QuizPage'))

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/juegos" element={<GamesPage />} />
        <Route
          path="/juegos/:id"
          element={
            <Suspense fallback={<p className="muted center">Cargando…</p>}>
              <QuizPage />
            </Suspense>
          }
        />
        <Route path="/academia" element={<AcademyPage />} />
        <Route path="/laboratorio" element={<LabPage />} />
        <Route path="/laboratorio/balanza" element={<BalancePage />} />
        <Route path="/laboratorio/fracciones" element={<FractionStripsPage />} />
        <Route path="/laboratorio/geoplano" element={<GeoboardPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}
