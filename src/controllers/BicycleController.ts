import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { BicycleService } from '../services/BicycleService';
import { AppError } from '../middlewares';

export class BicycleController {
  private bicycleService: BicycleService;

  constructor() {
    this.bicycleService = container.resolve(BicycleService);
  }

  /**
   * POST /api/bicycles
   * Crea una nueva bicicleta (Admin only)
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bicycle = await this.bicycleService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Bicycle created successfully',
        data: bicycle,
      });
    } catch (error: any) {
      // Handle MongoDB validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
        next(new AppError(`Validation failed: ${validationErrors.join(', ')}`, 400));
      } else if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/bicycles/:id
   * Obtiene una bicicleta por ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bicycle = await this.bicycleService.findById(req.params.id);

      res.status(200).json({
        success: true,
        data: bicycle,
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
   * GET /api/bicycles/code/:code
   * Obtiene una bicicleta por código
   */
  getByCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bicycle = await this.bicycleService.findByCode(req.params.code);

      res.status(200).json({
        success: true,
        data: bicycle,
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
   * GET /api/bicycles
   * Obtiene todas las bicicletas con filtros opcionales
   * Query params: status, regionalId
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, regionalId } = req.query;
      const filters: any = {};

      if (status) filters.status = status;
      if (regionalId) filters.regionalId = regionalId;

      const bicycles = await this.bicycleService.findAll(filters);

      res.status(200).json({
        success: true,
        data: bicycles,
        count: bicycles.length,
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
   * GET /api/bicycles/available
   * Obtiene bicicletas disponibles
   * Query params: regionalId
   */
  getAvailable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { regionalId } = req.query;
      const bicycles = await this.bicycleService.findAvailable(regionalId as string);

      res.status(200).json({
        success: true,
        data: bicycles,
        count: bicycles.length,
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
   * GET /api/bicycles/nearby
   * Encuentra bicicletas cercanas
   * Query params: longitude, latitude, maxDistance
   */
  getNearby = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { longitude, latitude, maxDistance } = req.query;

      if (!longitude || !latitude) {
        throw new AppError('Longitude and latitude are required', 400);
      }

      const bicycles = await this.bicycleService.findNearby(
        parseFloat(longitude as string),
        parseFloat(latitude as string),
        maxDistance ? parseFloat(maxDistance as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: bicycles,
        count: bicycles.length,
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
   * PUT /api/bicycles/:id
   * Actualiza una bicicleta (Admin only)
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bicycle = await this.bicycleService.update(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Bicycle updated successfully',
        data: bicycle,
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
   * PATCH /api/bicycles/:id/status
   * Actualiza el estado de una bicicleta (Admin only)
   */
  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = req.body;

      if (!status) {
        throw new AppError('Status is required', 400);
      }

      const bicycle = await this.bicycleService.updateStatus(req.params.id, status);

      res.status(200).json({
        success: true,
        message: 'Bicycle status updated successfully',
        data: bicycle,
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
   * PATCH /api/bicycles/:id/location
   * Actualiza la ubicación de una bicicleta (Admin only)
   */
  updateLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { longitude, latitude } = req.body;

      if (longitude === undefined || latitude === undefined) {
        throw new AppError('Longitude and latitude are required', 400);
      }

      const bicycle = await this.bicycleService.updateLocation(
        req.params.id,
        longitude,
        latitude
      );

      res.status(200).json({
        success: true,
        message: 'Bicycle location updated successfully',
        data: bicycle,
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
   * DELETE /api/bicycles/:id
   * Elimina una bicicleta (Admin only)
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.bicycleService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Bicycle deleted successfully',
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
   * GET /api/bicycles/stats/count-by-status
   * Obtiene conteo de bicicletas por estado
   */
  getCountByStatus = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const stats = await this.bicycleService.countByStatus();

      res.status(200).json({
        success: true,
        data: stats,
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
