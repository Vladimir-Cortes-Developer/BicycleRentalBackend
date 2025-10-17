import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { RegionalService } from '../services/RegionalService';
import { AppError } from '../middlewares';

export class RegionalController {
  private regionalService: RegionalService;

  constructor() {
    this.regionalService = container.resolve(RegionalService);
  }

  /**
   * POST /api/regionals
   * Crea una nueva regional (Admin only)
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const regional = await this.regionalService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Regional created successfully',
        data: regional,
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
   * GET /api/regionals/:id
   * Obtiene una regional por ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const regional = await this.regionalService.findById(req.params.id);

      res.status(200).json({
        success: true,
        data: regional,
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
   * GET /api/regionals
   * Obtiene todas las regionales
   */
  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const regionals = await this.regionalService.findAll();

      res.status(200).json({
        success: true,
        data: regionals,
        count: regionals.length,
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
   * GET /api/regionals/city/:city
   * Obtiene regionales por ciudad
   */
  getByCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const regionals = await this.regionalService.findByCity(req.params.city);

      res.status(200).json({
        success: true,
        data: regionals,
        count: regionals.length,
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
   * GET /api/regionals/department/:department
   * Obtiene regionales por departamento
   */
  getByDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const regionals = await this.regionalService.findByDepartment(req.params.department);

      res.status(200).json({
        success: true,
        data: regionals,
        count: regionals.length,
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
   * GET /api/regionals/nearby
   * Encuentra regionales cercanas
   * Query params: longitude, latitude, maxDistance
   */
  getNearby = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { longitude, latitude, maxDistance } = req.query;

      if (!longitude || !latitude) {
        throw new AppError('Longitude and latitude are required', 400);
      }

      const regionals = await this.regionalService.findNearby(
        parseFloat(longitude as string),
        parseFloat(latitude as string),
        maxDistance ? parseFloat(maxDistance as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: regionals,
        count: regionals.length,
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
   * PUT /api/regionals/:id
   * Actualiza una regional (Admin only)
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const regional = await this.regionalService.update(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Regional updated successfully',
        data: regional,
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
   * DELETE /api/regionals/:id
   * Elimina una regional (Admin only)
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.regionalService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Regional deleted successfully',
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
   * GET /api/regionals/stats/count
   * Obtiene el total de regionales (Admin only)
   */
  getCount = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const count = await this.regionalService.count();

      res.status(200).json({
        success: true,
        data: { count },
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