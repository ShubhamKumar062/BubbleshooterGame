import { createContext, useContext, useReducer, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'
import SoundManager from '../utils/SoundManager'

// Game states
const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  LEVEL_COMPLETE: 'levelComplete'
}

// Initial state
const initialState = {
  gameState: GAME_STATES.MENU,
  score: 0,
  level: 1,
  lives: 3,
  bubblesPopped: 0,
  highScore: 0,
  isMuted: false
}

// Action types
const ACTION_TYPES = {
  START_GAME: 'START_GAME',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  END_GAME: 'END_GAME',
  UPDATE_SCORE: 'UPDATE_SCORE',
  POP_BUBBLES: 'POP_BUBBLES',
  NEXT_LEVEL: 'NEXT_LEVEL',
  LOSE_LIFE: 'LOSE_LIFE',
  RESET_GAME: 'RESET_GAME',
  SET_HIGH_SCORE: 'SET_HIGH_SCORE',
  TOGGLE_MUTE: 'TOGGLE_MUTE'
}

// Reducer
function gameReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.START_GAME:
      return {
        ...state,
        gameState: GAME_STATES.PLAYING,
        score: 0,
        level: 1,
        lives: 3,
        bubblesPopped: 0
      }
    case ACTION_TYPES.PAUSE_GAME:
      return {
        ...state,
        gameState: GAME_STATES.PAUSED
      }
    case ACTION_TYPES.RESUME_GAME:
      return {
        ...state,
        gameState: GAME_STATES.PLAYING
      }
    case ACTION_TYPES.END_GAME:
      return {
        ...state,
        gameState: GAME_STATES.GAME_OVER
      }
    case ACTION_TYPES.UPDATE_SCORE:
      return {
        ...state,
        score: state.score + action.payload
      }
    case ACTION_TYPES.POP_BUBBLES:
      const bubbleCount = action.payload
      const newScore = state.score + (bubbleCount * 10)
      return {
        ...state,
        score: newScore,
        bubblesPopped: state.bubblesPopped + bubbleCount,
        highScore: newScore > state.highScore ? newScore : state.highScore
      }
    case ACTION_TYPES.NEXT_LEVEL:
      return {
        ...state,
        level: state.level + 1,
        gameState: GAME_STATES.LEVEL_COMPLETE
      }
    case ACTION_TYPES.LOSE_LIFE:
      const newLives = state.lives - 1
      return {
        ...state,
        lives: newLives,
        gameState: newLives <= 0 ? GAME_STATES.GAME_OVER : state.gameState
      }
    case ACTION_TYPES.RESET_GAME:
      return {
        ...initialState,
        highScore: state.highScore,
        isMuted: state.isMuted
      }
    case ACTION_TYPES.SET_HIGH_SCORE:
      return {
        ...state,
        highScore: action.payload
      }
    case ACTION_TYPES.TOGGLE_MUTE:
      return {
        ...state,
        isMuted: !state.isMuted
      }
    default:
      return state
  }
}

// Create context
const GameContext = createContext()

export const useGame = () => useContext(GameContext)

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const { user, isAuthenticated } = useAuth()

  const startGame = useCallback(() => {
    SoundManager.play('gameStart')
    dispatch({ type: ACTION_TYPES.START_GAME })
  }, [])

  const pauseGame = useCallback(() => {
    SoundManager.play('buttonClick')
    dispatch({ type: ACTION_TYPES.PAUSE_GAME })
  }, [])

  const resumeGame = useCallback(() => {
    SoundManager.play('buttonClick')
    dispatch({ type: ACTION_TYPES.RESUME_GAME })
  }, [])

  const endGame = useCallback(async () => {
    SoundManager.play('gameOver')
    dispatch({ type: ACTION_TYPES.END_GAME })
    
    // Save score if authenticated
    if (isAuthenticated && user && state.score > 0) {
      try {
        await saveScore(state.score)
      } catch (error) {
        console.error('Failed to save score:', error)
      }
    }
  }, [isAuthenticated, user, state.score])

  const popBubbles = useCallback((count) => {
    if (count > 2) {
      SoundManager.play('bubblePop')
      dispatch({ type: ACTION_TYPES.POP_BUBBLES, payload: count })
    }
  }, [])

  const nextLevel = useCallback(() => {
    SoundManager.play('levelComplete')
    dispatch({ type: ACTION_TYPES.NEXT_LEVEL })
  }, [])

  const loseLife = useCallback(() => {
    SoundManager.play('loseLife')
    dispatch({ type: ACTION_TYPES.LOSE_LIFE })
  }, [])

  const resetGame = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET_GAME })
  }, [])

  const toggleMute = useCallback(() => {
    dispatch({ type: ACTION_TYPES.TOGGLE_MUTE })
    SoundManager.toggleMute()
  }, [])

  // Save score to backend
  const saveScore = async (score) => {
    const token = localStorage.getItem('token')
    
    if (!token) return
    
    try {
      await axios.post('/api/scores', { score }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const value = {
    ...state,
    GAME_STATES,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    popBubbles,
    nextLevel,
    loseLife,
    resetGame,
    toggleMute
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}