import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set. Copy .env.example to .env and fill it in.');

  mongoose.set('strictQuery', true);
  // Fail a query in two seconds rather than buffering for ten, so a database
  // outage surfaces quickly and the public site can fall back to its own copy.
  mongoose.set('bufferTimeoutMS', 2000);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);

  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
}
