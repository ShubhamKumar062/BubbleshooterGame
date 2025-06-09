import { useRef, useEffect } from 'react'
import SoundManager from '../../utils/SoundManager'
import './GameControls.css'

function GameControls({ onPause }) {
  const touchRef = useRef(null)
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        onPause()
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onPause])
  
  const handlePauseClick = () => {
    SoundManager.play('buttonClick')
    onPause()
  }
  
  return (
    <div className="game-controls">
      <div className="touch-area" ref={touchRef}></div>
      <button className="pause-button" onClick={handlePauseClick}>
        <span className="material-icons">pause</span>
      </button>
    </div>
  )
}

export default GameControls