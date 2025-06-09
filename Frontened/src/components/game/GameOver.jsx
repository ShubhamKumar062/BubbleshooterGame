import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import './GameOver.css'

function GameOver({ score, onRestart, onQuit }) {
  const { isAuthenticated } = useAuth()
  
  return (
    <div className="game-overlay">
      <div className="game-over">
        <h2>Game Over</h2>
        <div className="final-score">
          <span className="score-label">Your Score</span>
          <span className="score-value">{score}</span>
        </div>
        
        <div className="game-over-buttons">
          <button className="btn btn-primary" onClick={onRestart}>
            Play Again
          </button>
          <button className="btn btn-outline" onClick={onQuit}>
            Main Menu
          </button>
        </div>
        
        {!isAuthenticated && score > 0 && (
          <div className="auth-prompt">
            <p>Sign up to save your score!</p>
            <Link to="/register" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        )}
        
        <Link to="/leaderboard" className="leaderboard-link">
          View Leaderboard
        </Link>
      </div>
    </div>
  )
}

export default GameOver