import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import scoreRoutes from './routes/scores.js'
import leaderboardRoutes from './routes/leaderboard.js'

import connect from './config/connect.js'

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/scores', scoreRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

// Default route
app.get('/', (req, res) => {
  res.send('Bubble Shooter API is running')
})

// Start server
connect().then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
  })
}).catch((err) =>{
  console.log("Error is coming in Server" , err)
})

export default app