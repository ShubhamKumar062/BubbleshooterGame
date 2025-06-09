import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import './GameMenu.css'

function GameMenu({ onStartGame }) {
  const { isAuthenticated } = useAuth()
  
  return (
    <div className="game-menu">
      <h1 className="game-title">Bubble<span>Shooter</span></h1>
      <p className="game-description">Match 3 or more bubbles of the same color to pop them!</p>
      
      <div className="menu-buttons">
        <button 
          className="btn btn-primary start-button"
          onClick={onStartGame}
        >
          Start Game
        </button>
        
        <Link to="/leaderboard" className="btn btn-outline">
          Leaderboard
        </Link>
      </div>
      
      {!isAuthenticated && (
        <div className="auth-prompt">
          <p>Sign in to save your scores!</p>
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline">
              Sign Up
            </Link>
          </div>
        </div>
      )}
      
      <div className="game-instructions">
        <h3>How to Play</h3>
        <ul>
          <li>Aim and shoot bubbles at the grid</li>
          <li>Match 3 or more bubbles of the same color to pop them</li>
          <li>Clear the grid to advance to the next level</li>
          <li>The game ends when bubbles reach the bottom</li>
        </ul>
      </div>
    </div>
  )
}

export default GameMenu