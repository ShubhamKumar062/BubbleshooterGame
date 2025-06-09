import mongoose from 'mongoose'

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  bubblesPopped: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Create indexes for faster querying
scoreSchema.index({ score: -1 })
scoreSchema.index({ userId: 1, score: -1 })

const Score = mongoose.model('Score', scoreSchema)

export default Score