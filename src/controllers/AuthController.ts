import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { AuthService } from '../services/AuthService';
import { AppError } from '../middlewares';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = container.resolve(AuthService);
  }

  /**
   * POST /api/auth/register
   * Registra un nuevo usuario
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };

  /**
   * POST /api/auth/login
   * Inicia sesión
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 401));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/auth/me
   * Obtiene el perfil del usuario autenticado
   */
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const user = await this.authService.getUserById(req.user.userId);

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          documentType: user.documentType,
          documentNumber: user.documentNumber,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          socioeconomicStratum: user.socioeconomicStratum,
          role: user.role,
          regionalId: user.regionalId,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };
}
