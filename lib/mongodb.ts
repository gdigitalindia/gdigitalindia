import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI missing in .env file')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Allow commands to wait for connection
      serverSelectionTimeoutMS: 5000,
      family: 4, // Force IPv4
    }

    console.log('--- 🔗 Connecting to MongoDB... ---')
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('--- ✅ Connected to MongoDB ---')
      return mongoose
    }).catch((err) => {
      console.error('--- ❌ MongoDB Connection Error: ---', err.message)
      cached.promise = null // Reset promise so it can retry
      throw err // Re-throw so API routes know it failed
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
