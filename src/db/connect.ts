import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connects to MongoDB once and reuses the connection across the app.
 * Reads MONGODB_URI from the environment (see .env.example). This
 * MUST be set — locally in a .env file, and on Vercel under
 * Project Settings -> Environment Variables.
 */
export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Create a .env file locally (see .env.example) ' +
      'and add MONGODB_URI as an Environment Variable in your Vercel project settings.'
    );
  }

  mongoose.set('strictQuery', true);

  try {
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return;
    }
    await mongoose.connect(uri);
    isConnected = true;

    const safeUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`🍃 Connected to MongoDB: ${safeUri}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    console.error(
      'Make sure MONGODB_URI points to a reachable database (e.g. a MongoDB Atlas cluster), ' +
      'and that your Atlas cluster allows connections from 0.0.0.0/0 (Vercel functions use dynamic IPs).'
    );
    throw err;
  }
}
