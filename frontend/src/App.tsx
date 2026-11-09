import { lazy, Suspense, type ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import GamesPage from './pages/GamesPage'
import AcademyPage from './pages/AcademyPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import NewPasswordPage from './pages/NewPasswordPage'
import LabPage from './pages/LabPage'
import BalancePage from './pages/BalancePage'
import FractionStripsPage from './pages/FractionStripsPage'
import GeoboardPage from './pages/GeoboardPage'
import RankingPage from './pages/RankingPage'

// Estas pantallas usan KaTeX (pesado), así que se descargan solo al abrirlas
const GamePage = lazy(() => import('./pages/GamePage'))
const CoursePage = lazy(() => import('./pages/CoursePage'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const AcademyPracticePage = lazy(() => import('./pages/AcademyPracticePage'))
const TeacherPage = lazy(() => import('./pages/TeacherPage'))
const QuizEditorPage = lazy(() => import('./pages/QuizEditorPage'))

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<p className="muted center">Cargando…</p>}>{children}</Suspense>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/nueva-clave" element={<NewPasswordPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/juegos" element={<GamesPage />} />
        <Route path="/juegos/:id" element={<Lazy><GamePage /></Lazy>} />
        <Route path="/academia" element={<AcademyPage />} />
        <Route path="/academia/:courseId" element={<Lazy><CoursePage /></Lazy>} />
        <Route path="/academia/:courseId/clase/:lessonId" element={<Lazy><LessonPage /></Lazy>} />
        <Route
          path="/academia/:courseId/clase/:lessonId/practica"
          element={<Lazy><AcademyPracticePage kind="lesson" /></Lazy>}
        />
        <Route
          path="/academia/:courseId/unidad/:unitId/repaso"
          element={<Lazy><AcademyPracticePage kind="review" /></Lazy>}
        />
        <Route path="/laboratorio" element={<LabPage />} />
        <Route path="/laboratorio/balanza" element={<BalancePage />} />
        <Route path="/laboratorio/fracciones" element={<FractionStripsPage />} />
        <Route path="/laboratorio/geoplano" element={<GeoboardPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/docente" element={<Lazy><TeacherPage /></Lazy>} />
        <Route path="/docente/nuevo" element={<Lazy><QuizEditorPage /></Lazy>} />
        <Route path="/docente/editar/:id" element={<Lazy><QuizEditorPage key="editar" /></Lazy>} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}
