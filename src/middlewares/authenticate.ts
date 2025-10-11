import { Request, Response, NextFunction } from 'express';
import { JWTUtils, JWTPayload } from '../utils/jwt';
import { AppError } from './errorHandler';

// Extender la interfaz Request de Express
declare module 'express-serve-static-core' {
  interface Request {
    user?: JWTPayload;
  }
}

/**
 * Middleware de autenticación
 * Verifica que el usuario esté autenticado mediante JWT
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar y decodificar el token
    const payload = JWTUtils.verifyToken(token);

    // Agregar el payload al request
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token', 401));
    }
  }
};
