import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppError } from './errorHandler';

type ClassConstructor<T> = new (...args: any[]) => T;

/**
 * Middleware de validación de DTOs
 * Valida el body del request usando class-validator
 */
export const validateDto = <T extends object>(dtoClass: ClassConstructor<T>) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Convertir el body a instancia del DTO
      const dtoInstance = plainToInstance(dtoClass, req.body);

      // Validar
      const errors: ValidationError[] = await validate(dtoInstance, {
        whitelist: true, // Elimina propiedades no definidas en el DTO
        forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      });

      if (errors.length > 0) {
        // Formatear errores
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));

        throw new AppError(
          `Validation failed: ${JSON.stringify(formattedErrors)}`,
          400
        );
      }

      // Reemplazar el body con la instancia validada
      req.body = dtoInstance;

      next();
    } catch (error) {
      next(error);
    }
  };
};
