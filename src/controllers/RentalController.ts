import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { RentalService } from '../services/RentalService';
import { AppError } from '../middlewares';

export class RentalController {
  private rentalService: RentalService;

  constructor() {
    this.rentalService = container.resolve(RentalService);
  }

  /**
   * POST /api/rentals
   * Alquila una bicicleta (auth required)
   */
  rentBicycle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const rental = await this.rentalService.rentBicycle(req.user.userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Bicycle rented successfully',
        data: rental,
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
   * PUT /api/rentals/:id/return
   * Devuelve una bicicleta (auth required)
   */
  returnBicycle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const rental = await this.rentalService.returnBicycle(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Bicycle returned successfully',
        data: rental,
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
   * GET /api/rentals/:id
   * Obtiene un alquiler por ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rental = await this.rentalService.findById(req.params.id);

      res.status(200).json({
        success: true,
        data: rental,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/rentals/my
   * Obtiene alquileres del usuario autenticado
   */
  getMyRentals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const rentals = await this.rentalService.findByUser(req.user.userId);

      res.status(200).json({
        success: true,
        data: rentals,
        count: rentals.length,
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
   * GET /api/rentals/my/active
   * Obtiene alquiler activo del usuario autenticado
   */
  getActiveRental = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const rental = await this.rentalService.findActiveRentalByUser(req.user.userId);

      res.status(200).json({
        success: true,
        data: rental,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/rentals
   * Obtiene todos los alquileres (admin only)
   * Query params: userId, bicycleId, status
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, bicycleId, status } = req.query;
      const filters: any = {};

      if (userId) filters.userId = userId;
      if (bicycleId) filters.bicycleId = bicycleId;
      if (status) filters.status = status;

      const rentals = await this.rentalService.findByStatus(status as 'active' | 'completed' | 'cancelled' || 'active');

      res.status(200).json({
        success: true,
        data: rentals,
        count: rentals.length,
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
   * DELETE /api/rentals/:id
   * Cancela un alquiler activo
   */
  cancelRental = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      await this.rentalService.cancelRental(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Rental cancelled successfully',
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
