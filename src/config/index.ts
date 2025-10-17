import dotenv from 'dotenv';

// Cargar variables de entorno solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

interface Config {
  port: number;
  nodeEnv: string;
  mongodb: {
    uri: string;
    dbName: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  sendgrid: {
    apiKey: string;
    fromEmail: string;
  };
  azure: {
    connectionString: string;
    containerName: string;
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGODB_URI || '',
    dbName: process.env.DB_NAME || 'bicycles_prod_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@sena.edu.co',
  },
  azure: {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'bicycle-files',
  },
};

// Validar configuración crítica
export const validateConfig = (): void => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.mongodb.uri) {
    errors.push('MONGODB_URI is required');
  }

  if (!config.jwt.secret || config.jwt.secret === 'default-secret-change-in-production') {
    errors.push('JWT_SECRET must be set to a secure value in production');
  }

  // SendGrid es opcional - solo advertencia
  if (config.nodeEnv === 'production' && !config.sendgrid.apiKey) {
    warnings.push('SENDGRID_API_KEY is not configured - email functionality will be disabled');
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Configuration warnings:');
    warnings.forEach((warning) => console.warn(`   - ${warning}`));
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:');
    errors.forEach((error) => console.error(`   - ${error}`));

    if (config.nodeEnv === 'production') {
      throw new Error('Invalid configuration for production environment');
    } else {
      console.warn('⚠️  Warning: Running with incomplete configuration');
    }
  }
};
