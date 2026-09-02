import mongoose from 'mongoose';

// A promise, not a boolean. Sharing the in-flight connect() call across
// concurrent invocations avoids opening multiple connections when several
// requests hit a cold Vercel function at once.
let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Connects to MongoDB once and reuses the connection across the app.
 * Reads MONGODB_URI from the environment (see .env.example). This
 * MUST be set — locally in a .env file, and on Vercel under
 * Project Settings -> Environment Variables.
 *
 * IMPORTANT (serverless): this checks mongoose.connection.readyState on
 * every call rather than trusting a cached "already connected" flag.
 * On Vercel, a function's process can be frozen between invocations and
 * the underlying socket can get dropped by MongoDB Atlas or the network
 * while frozen. A cached boolean would skip reconnecting in that case,
 * and every query would then hang until Mongoose's buffering timeout
 * (~10s) throws. Re-checking readyState here means a dead connection
 * gets re-established instead of silently failing every request.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Create a .env file locally (see .env.example) ' +
      'and add MONGODB_URI as an Environment Variable in your Vercel project settings.'
    );
  }

  // 1 = connected. Nothing to do.
  if (mongoose.connection.readyState === 1) return;

  // 2 = currently connecting. Reuse the in-flight promise instead of
  // calling mongoose.connect() again.
  if (mongoose.connection.readyState === 2 && connectionPromise) {
    await connectionPromise;
    return;
  }

  // 0 = disconnected, 3 = disconnecting (stale from a previous frozen
  // invocation) — reconnect for real.
  mongoose.set('strictQuery', true);

  try {
    connectionPromise = mongoose.connect(uri, {
      // Fail fast instead of hanging for the full default 30s when the
      // cluster is unreachable (bad URI, IP not whitelisted, etc.) —
      // surfaces as a clear error instead of a Vercel function timeout.
      serverSelectionTimeoutMS: 8000,
    });
    await connectionPromise;

    const safeUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`🍃 Connected to MongoDB: ${safeUri}`);
  } catch (err) {
    connectionPromise = null;
    console.error('❌ MongoDB connection failed:', err);
    console.error(
      'Make sure MONGODB_URI points to a reachable database (e.g. a MongoDB Atlas cluster), ' +
      'and that your Atlas cluster allows connections from 0.0.0.0/0 (Vercel functions use dynamic IPs).'
    );
    throw err;
  }
}