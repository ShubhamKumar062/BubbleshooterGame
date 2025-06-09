import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGame } from '../context/GameContext'
import './Header.css'
import SoundManager from '../utils/SoundManager'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { toggleMute, isMuted } = useGame()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false)
  }, [location])

  const handleToggleMenu = () => {
    SoundManager.play('buttonClick')
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    SoundManager.play('buttonClick')
    logout()
    setIsMenuOpen(false)
  }

  const handleToggleMute = () => {
    toggleMute()
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Bubble<span>Shooter</span></span>
        </Link>
        
        <div className="header-actions">
          <button 
            className="sound-toggle" 
            onClick={handleToggleMute}
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? (
              <span className="material-icons">volume_off</span>
            ) : (
              <span className="material-icons">volume_up</span>
            )}
          </button>
          
          <button 
            className="menu-toggle"
            onClick={handleToggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <span className="menu-icon"></span>
          </button>
        </div>
        
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li><Link to="/">Play Game</Link></li>
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            {isAuthenticated ? (
              <>
                <li className="user-info">
                  <span>Hello, {user.username}</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="nav-button">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li>
                  <Link to="/register" className="nav-button">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header