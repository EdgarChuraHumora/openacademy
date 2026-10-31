import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import GamesPage from './pages/GamesPage'
import QuizPage from './pages/QuizPage'
import AcademyPage from './pages/AcademyPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import LabPage from './pages/LabPage'
import BalancePage from './pages/BalancePage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/juegos" element={<GamesPage />} />
        <Route path="/juegos/:id" element={<QuizPage />} />
        <Route path="/academia" element={<AcademyPage />} />
        <Route path="/laboratorio" element={<LabPage />} />
        <Route path="/laboratorio/balanza" element={<BalancePage />} />
        <Route path="/perfil"element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}
