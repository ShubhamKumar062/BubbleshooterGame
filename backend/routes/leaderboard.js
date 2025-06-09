import express from 'express'
import Score from '../models/Score.js'

const router = express.Router()

// Get global leaderboard (top scores)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    
    // Get top scores, only one entry per user (their highest score)
    const leaderboard = await Score.aggregate([
      { $sort: { score: -1 } },
      { $group: {
          _id: '$userId',
          userId: { $first: '$userId' },
          username: { $first: '$username' },
          score: { $max: '$score' },
          level: { $first: '$level' },
          createdAt: { $first: '$createdAt' }
        }
      },
      { $sort: { score: -1 } },
      { $limit: limit }
    ])
    
    res.json(leaderboard)
  } catch (error) {
    console.error('Leaderboard error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get weekly leaderboard
router.get('/weekly', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    // Get top scores from the past week
    const leaderboard = await Score.aggregate([
      { $match: { createdAt: { $gte: oneWeekAgo } } },
      { $sort: { score: -1 } },
      { $group: {
          _id: '$userId',
          userId: { $first: '$userId' },
          username: { $first: '$username' },
          score: { $max: '$score' },
          level: { $first: '$level' },
          createdAt: { $first: '$createdAt' }
        }
      },
      { $sort: { score: -1 } },
      { $limit: limit }
    ])
    
    res.json(leaderboard)
  } catch (error) {
    console.error('Weekly leaderboard error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router