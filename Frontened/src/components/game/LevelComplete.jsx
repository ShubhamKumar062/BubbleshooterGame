import './LevelComplete.css'

function LevelComplete({ level, score, onContinue }) {
  return (
    <div className="game-overlay">
      <div className="level-complete">
        <h2>Level {level} Complete!</h2>
        <div className="level-stats">
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Next Level</span>
            <span className="stat-value">{level + 1}</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}

export default LevelComplete