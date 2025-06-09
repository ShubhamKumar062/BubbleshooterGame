import './GameInfo.css'

function GameInfo({ score, level, lives }) {
  return (
    <div className="game-info">
      <div className="info-item level">
        <span className="info-label">Level</span>
        <span className="info-value">{level}</span>
      </div>
      
      <div className="info-item score">
        <span className="info-label">Score</span>
        <span className="info-value">{score}</span>
      </div>
      
      <div className="info-item lives">
        <span className="info-label">Lives</span>
        <div className="lives-container">
          {[...Array(lives)].map((_, i) => (
            <div key={i} className="life-icon"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GameInfo