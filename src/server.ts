import 'reflect-metadata';
import { connectDB } from './config/database';
import { config, validateConfig } from './config';

const startServer = async (): Promise<void> => {
  try {
    // Validar configuración
    console.log('🔍 Validating configuration...');
    validateConfig();

    // Conectar a MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();

    // TODO: Inicializar Express app aquí
    console.log(`🚀 Server ready to start on port ${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`📦 Database: ${config.mongodb.dbName}`);
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
