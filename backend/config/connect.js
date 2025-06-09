// config/connect.js
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Unable to connect to database', error)
    process.exit(1)
  }
}

export default connect
