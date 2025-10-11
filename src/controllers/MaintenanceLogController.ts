import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { MaintenanceLogService } from '../services/MaintenanceLogService';
import { AppError } from '../middlewares';

export class MaintenanceLogController {
  private maintenanceLogService: MaintenanceLogService;

  constructor() {
    this.maintenanceLogService = container.resolve(MaintenanceLogService);
  }

  /**
   * POST /api/maintenance
   * Crea un nuevo registro de mantenimiento (admin only)
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const maintenanceLog = await this.maintenanceLogService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Maintenance log created successfully',
        data: maintenanceLog,
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
   * PUT /api/maintenance/:id
   * Actualiza un registro de mantenimiento (admin only)
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const maintenanceLog = await this.maintenanceLogService.update(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Maintenance log updated successfully',
        data: maintenanceLog,
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
   * DELETE /api/maintenance/:id
   * Elimina un registro de mantenimiento (admin only)
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.maintenanceLogService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Maintenance log deleted successfully',
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
   * GET /api/maintenance/:id
   * Obtiene un registro de mantenimiento por ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const maintenanceLog = await this.maintenanceLogService.findById(req.params.id);

      res.status(200).json({
        success: true,
        data: maintenanceLog,
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
   * GET /api/maintenance
   * Obtiene todos los registros de mantenimiento
   * Query params: bicycleId, type, status
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { bicycleId, type, status } = req.query;
      const filters: any = {};

      if (bicycleId) filters.bicycleId = bicycleId;
      if (type) filters.type = type;
      if (status) filters.status = status;

      const maintenanceLogs = await this.maintenanceLogService.findAll();

      res.status(200).json({
        success: true,
        data: maintenanceLogs,
        count: maintenanceLogs.length,
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
   * GET /api/maintenance/bicycle/:bicycleId
   * Obtiene registros de mantenimiento por bicicleta
   */
  getByBicycle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const maintenanceLogs = await this.maintenanceLogService.findByBicycle(req.params.bicycleId);

      res.status(200).json({
        success: true,
        data: maintenanceLogs,
        count: maintenanceLogs.length,
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
   * GET /api/maintenance/upcoming
   * Obtiene próximos mantenimientos programados
   */
  getUpcoming = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const maintenanceLogs = await this.maintenanceLogService.findUpcomingMaintenance();

      res.status(200).json({
        success: true,
        data: maintenanceLogs,
        count: maintenanceLogs.length,
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
   * GET /api/maintenance/overdue
   * Obtiene mantenimientos vencidos
   */
  getOverdue = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const maintenanceLogs = await this.maintenanceLogService.findOverdueMaintenance();

      res.status(200).json({
        success: true,
        data: maintenanceLogs,
        count: maintenanceLogs.length,
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
   * POST /api/maintenance/:id/complete
   * Marca un mantenimiento como completado (admin only)
   */
  completeMaintenance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const maintenanceLog = await this.maintenanceLogService.completeMaintenance(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: 'Maintenance completed successfully',
        data: maintenanceLog,
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
   * GET /api/maintenance/stats
   * Obtiene estadísticas de mantenimiento
   */
  getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.maintenanceLogService.getMaintenanceStats();

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
