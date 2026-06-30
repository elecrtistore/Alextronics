import mongoose from 'mongoose';

export async function connectDatabase(uri: string) {
  if (!uri) {
    console.warn('connectDatabase: no MONGODB_URI provided; skipping mongoose.connect');
    return;
  }
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(uri);
    // Log some connection info for debugging
    // readyState 1 = connected
    const ready = mongoose.connection.readyState;
    const dbName = (mongoose.connection.db && (mongoose.connection.db as any).databaseName) || 'unknown';
    console.log(`MongoDB connected (readyState=${ready}, db=${dbName})`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}
