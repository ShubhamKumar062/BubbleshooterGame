import { useEffect, useRef, useState } from 'react'
import { useGame } from '../context/GameContext'
import GameCanvas from '../components/game/GameCanvas'
import GameControls from '../components/game/GameControls'
import GameInfo from '../components/game/GameInfo'
import GameMenu from '../components/game/GameMenu'
import LevelComplete from '../components/game/LevelComplete'
import GameOver from '../components/game/GameOver'
import './GamePage.css'

function GamePage() {
  const { 
    gameState, 
    GAME_STATES,
    score,
    level,
    lives,
    startGame,
    pauseGame,
    resumeGame,
    resetGame
  } = useGame()
  
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  const gameContainerRef = useRef(null)
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const calculateGameDimensions = () => {
    const maxWidth = Math.min(windowSize.width - 40, 800)
    const maxHeight = Math.min(windowSize.height - 200, 600)
    
    return { width: maxWidth, height: maxHeight }
  }
  
  const gameDimensions = calculateGameDimensions()
  
  return (
    <div className="game-page">
      <div className="game-container" ref={gameContainerRef}>
        {gameState === GAME_STATES.MENU && (
          <GameMenu onStartGame={startGame} />
        )}
        
        {gameState === GAME_STATES.PLAYING && (
          <>
            <GameInfo score={score} level={level} lives={lives} />
            <GameCanvas width={gameDimensions.width} height={gameDimensions.height} />
            <GameControls onPause={pauseGame} />
          </>
        )}
        
        {gameState === GAME_STATES.PAUSED && (
          <div className="game-overlay">
            <div className="pause-menu">
              <h2>Game Paused</h2>
              <button className="btn btn-primary" onClick={resumeGame}>Resume</button>
              <button className="btn btn-outline" onClick={resetGame}>Quit Game</button>
            </div>
          </div>
        )}
        
        {gameState === GAME_STATES.LEVEL_COMPLETE && (
          <LevelComplete level={level} score={score} onContinue={startGame} />
        )}
        
        {gameState === GAME_STATES.GAME_OVER && (
          <GameOver score={score} onRestart={startGame} onQuit={resetGame} />
        )}
      </div>
    </div>
  )
}

export default GamePage