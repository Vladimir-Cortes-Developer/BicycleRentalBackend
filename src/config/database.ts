import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async (): Promise<void> => {
  try {
    const options = {
      dbName: config.mongodb.dbName,
      retryWrites: true,
      w: 'majority' as const,
    };

    await mongoose.connect(config.mongodb.uri, options);

    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName || config.mongodb.dbName}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Eventos de conexión de Mongoose
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB Atlas');
});

// Graceful shutdown
const gracefulShutdown = async (msg: string): Promise<void> => {
  await mongoose.connection.close();
  console.log(`Mongoose connection closed through ${msg}`);
};

process.on('SIGINT', async () => {
  await gracefulShutdown('app termination (SIGINT)');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await gracefulShutdown('app termination (SIGTERM)');
  process.exit(0);
});

// Para Windows
process.on('SIGUSR2', async () => {
  await gracefulShutdown('nodemon restart');
  process.kill(process.pid, 'SIGUSR2');
});
