import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import './styles/App.css'
import GamePage from './pages/GamePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LeaderboardPage from './pages/LeaderboardPage'
import Layout from './components/Layout'
import NotFoundPage from './pages/NotFoundPage'
import SoundManager from './utils/SoundManager'
import LayoutNoHeader from './components/LayoutNoHeader'

function App() {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Initialize sound system
    SoundManager.init()
    
    // Clean up on unmount
    return () => {
      SoundManager.stopAll()
    }
  }, [])

  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<GamePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Route>
      <Route element={< LayoutNoHeader/>}>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" /> : <RegisterPage />
        } />
      </Route>
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App