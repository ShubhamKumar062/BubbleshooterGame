import express from 'express'
import Score from '../models/Score.js'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Save a new score
router.post('/', auth, async (req, res) => {
  try {
    const { score, level = 1, bubblesPopped = 0 } = req.body
    
    // Get user
    const user = await User.findById(req.user.id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    // Create new score
    const newScore = new Score({
      userId: user._id,
      username: user.username,
      score,
      level,
      bubblesPopped
    })
    
    await newScore.save()
    
    // Update user's high score if necessary
    await user.updateHighScore(score)
    
    res.status(201).json(newScore)
  } catch (error) {
    console.error('Save score error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all scores for the authenticated user
router.get('/user', auth, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.id })
      .sort({ score: -1 })
      .limit(10)
    
    res.json(scores)
  } catch (error) {
    console.error('Get user scores error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's best score
router.get('/best', auth, async (req, res) => {
  try {
    const bestScore = await Score.findOne({ userId: req.user.id })
      .sort({ score: -1 })
      .limit(1)
    
    res.json(bestScore || { score: 0 })
  } catch (error) {
    console.error('Get best score error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router