import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ReportService } from '../services/ReportService';
import { AppError } from '../middlewares';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = container.resolve(ReportService);
  }

  /**
   * GET /api/reports/revenue/monthly
   * Obtiene ingresos mensuales por año (admin only)
   * Query params: year (required)
   */
  getMonthlyRevenue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { year } = req.query;

      if (!year) {
        throw new AppError('Year parameter is required', 400);
      }

      const revenue = await this.reportService.getMonthlyRevenueReport(parseInt(year as string));

      res.status(200).json({
        success: true,
        data: revenue,
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
   * GET /api/reports/revenue/range
   * Obtiene ingresos por rango de fechas (admin only)
   * Query params: startDate (required), endDate (required)
   */
  getRevenueByDateRange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        throw new AppError('Start date and end date are required', 400);
      }

      const revenue = await this.reportService.getRevenueByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json({
        success: true,
        data: revenue,
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
   * GET /api/reports/bicycles/most-rented
   * Obtiene las bicicletas más rentadas (admin only)
   * Query params: limit (optional, default: 10)
   */
  getMostRentedBicycles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { limit } = req.query;
      const bicycles = await this.reportService.getMostRentedBicycles(
        limit ? parseInt(limit as string) : 10
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
   * GET /api/reports/revenue/regional
   * Obtiene ingresos por regional (admin only)
   * Query params: startDate (optional), endDate (optional)
   */
  getRevenueByRegional = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        throw new AppError('Start date and end date are required', 400);
      }

      const revenue = await this.reportService.getRevenueByRegional(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json({
        success: true,
        data: revenue,
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
   * GET /api/reports/dashboard
   * Obtiene estadísticas del dashboard (admin only)
   */
  getDashboardStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.reportService.getDashboardStats();

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

  /**
   * GET /api/reports/users/stratum
   * Obtiene distribución de usuarios por estrato (admin only)
   */
  getUsersByStratum = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const distribution = await this.reportService.getUsersByStratum();

      res.status(200).json({
        success: true,
        data: distribution,
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
   * GET /api/reports/discounts
   * Obtiene reporte de descuentos aplicados (admin only)
   * Query params: startDate (optional), endDate (optional)
   */
  getDiscountReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        throw new AppError('Start date and end date are required', 400);
      }

      const report = await this.reportService.getDiscountReport(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json({
        success: true,
        data: report,
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
