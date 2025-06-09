import { useRef, useEffect } from 'react'
import { useGame } from '../../context/GameContext'
import BubbleShooter from '../../game/BubbleShooter'
import './GameCanvas.css'

function GameCanvas({ width, height }) {
  const canvasRef = useRef(null)
  const gameInstanceRef = useRef(null)
  const { 
    level, 
    popBubbles, 
    nextLevel, 
    loseLife, 
    endGame,
    gameState,
    GAME_STATES
  } = useGame()

  useEffect(() => {
    if (!canvasRef.current) return
    
    // Initialize game engine only if not already initialized
    if (!gameInstanceRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      gameInstanceRef.current = new BubbleShooter({
        canvas,
        ctx,
        width,
        height,
        onBubblesPopped: popBubbles,
        onLevelComplete: nextLevel,
        onLifeLost: loseLife,
        onGameOver: endGame
      })
    }
    
    // Update game dimensions if they change
    if (gameInstanceRef.current) {
      gameInstanceRef.current.resizeCanvas(width, height)
    }
    
    return () => {
      // Clean up game engine on unmount
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy()
        gameInstanceRef.current = null
      }
    }
  }, [width, height, popBubbles, nextLevel, loseLife, endGame])
  
  // Reset the game when level changes
  useEffect(() => {
    if (gameInstanceRef.current && gameState === GAME_STATES.PLAYING) {
      gameInstanceRef.current.setupLevel(level)
    }
  }, [level, gameState, GAME_STATES.PLAYING])
  
  // Pause/resume game engine based on game state
  useEffect(() => {
    if (!gameInstanceRef.current) return
    
    if (gameState === GAME_STATES.PLAYING) {
      gameInstanceRef.current.resume()
    } else {
      gameInstanceRef.current.pause()
    }
  }, [gameState, GAME_STATES.PLAYING])

  return (
    <div className="game-canvas-container">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="game-canvas"
      />
    </div>
  )
}

export default GameCanvas