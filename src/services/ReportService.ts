import { injectable, inject } from 'tsyringe';
import { RentalRepository } from '../repositories/RentalRepository';
import { BicycleRepository } from '../repositories/BicycleRepository';
import { UserRepository } from '../repositories/UserRepository';
import { MaintenanceLogRepository } from '../repositories/MaintenanceLogRepository';
import { EventRepository } from '../repositories/EventRepository';

export interface MonthlyRevenueReport {
  month: string;
  year: number;
  totalRevenue: number;
  totalRentals: number;
  averageRevenue: number;
}

export interface BicycleUsageReport {
  bicycleId: string;
  bicycleCode: string;
  totalRentals: number;
  totalRevenue: number;
  averageRentalDuration: number;
}

export interface RegionalReport {
  regionalId: string;
  regionalName: string;
  totalBicycles: number;
  availableBicycles: number;
  rentedBicycles: number;
  maintenanceBicycles: number;
  totalRevenue: number;
  totalRentals: number;
}

export interface DashboardStats {
  totalBicycles: number;
  availableBicycles: number;
  rentedBicycles: number;
  maintenanceBicycles: number;
  retiredBicycles: number;
  totalUsers: number;
  activeRentals: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalEvents: number;
  upcomingEvents: number;
  totalMaintenanceCost: number;
}

@injectable()
export class ReportService {
  constructor(
    @inject(RentalRepository) private rentalRepository: RentalRepository,
    @inject(BicycleRepository) private bicycleRepository: BicycleRepository,
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(MaintenanceLogRepository)
    private maintenanceLogRepository: MaintenanceLogRepository,
    @inject(EventRepository) private eventRepository: EventRepository
  ) {}

  /**
   * Obtiene reporte de ingresos mensuales
   * @param year - Año del reporte
   * @returns Array con ingresos por mes
   */
  async getMonthlyRevenueReport(year: number): Promise<MonthlyRevenueReport[]> {
    const reports: MonthlyRevenueReport[] = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const stats = await this.rentalRepository.aggregateRevenue(startDate, endDate);

      reports.push({
        month: startDate.toLocaleString('es-ES', { month: 'long' }),
        year,
        totalRevenue: stats.totalRevenue,
        totalRentals: stats.totalRentals,
        averageRevenue: stats.averageRevenue,
      });
    }

    return reports;
  }

  /**
   * Obtiene reporte de ingresos en un rango de fechas
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Estadísticas de ingresos
   */
  async getRevenueByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalRevenue: number;
    totalRentals: number;
    averageRevenue: number;
  }> {
    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    return this.rentalRepository.aggregateRevenue(startDate, endDate);
  }

  /**
   * Obtiene las bicicletas más rentadas
   * @param limit - Límite de resultados
   * @returns Array con las bicicletas más rentadas
   */
  async getMostRentedBicycles(limit: number = 10): Promise<BicycleUsageReport[]> {
    const results = await this.rentalRepository.findMostRentableBicycles(limit);

    const reports: BicycleUsageReport[] = [];

    for (const result of results) {
      const bicycle = await this.bicycleRepository.findById(result.bicycleId);
      if (bicycle) {
        reports.push({
          bicycleId: result.bicycleId,
          bicycleCode: bicycle.code,
          totalRentals: result.totalRentals,
          totalRevenue: result.totalRevenue,
          averageRentalDuration: 0, // Puede calcularse si se necesita
        });
      }
    }

    return reports;
  }

  /**
   * Obtiene reporte de ingresos por regional
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Array con ingresos por regional
   */
  async getRevenueByRegional(startDate: Date, endDate: Date): Promise<RegionalReport[]> {
    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    const regionalStats = await this.rentalRepository.aggregateByRegional(startDate, endDate);

    const reports: RegionalReport[] = [];

    for (const stat of regionalStats) {
      const regionalBicycles = await this.bicycleRepository.findByRegional(stat.regionalId);

      reports.push({
        regionalId: stat.regionalId,
        regionalName: 'Regional', // Nombre genérico, se puede mejorar con lookup
        totalBicycles: regionalBicycles.length,
        availableBicycles:
          regionalBicycles.filter((b) => b.status === 'available').length,
        rentedBicycles: regionalBicycles.filter((b) => b.status === 'rented').length,
        maintenanceBicycles:
          regionalBicycles.filter((b) => b.status === 'maintenance').length,
        totalRevenue: stat.totalRevenue,
        totalRentals: stat.totalRentals,
      });
    }

    return reports;
  }

  /**
   * Obtiene estadísticas generales del dashboard
   * @returns Estadísticas del sistema
   */
  async getDashboardStats(): Promise<DashboardStats> {
    // Obtener conteo de bicicletas por estado
    const bicycleStats = await this.bicycleRepository.countByStatus();
    const totalBicycles = await this.bicycleRepository.count();

    const availableBicycles =
      bicycleStats.find((s) => s.status === 'available')?.count || 0;
    const rentedBicycles = bicycleStats.find((s) => s.status === 'rented')?.count || 0;
    const maintenanceBicycles =
      bicycleStats.find((s) => s.status === 'maintenance')?.count || 0;
    const retiredBicycles =
      bicycleStats.find((s) => s.status === 'retired')?.count || 0;

    // Obtener usuarios totales
    const totalUsers = await this.userRepository.count();

    // Obtener alquileres activos
    const activeRentals = await this.rentalRepository.findByStatus('active');

    // Obtener ingresos totales
    const allTimeStart = new Date(2020, 0, 1);
    const now = new Date();
    const revenueStats = await this.rentalRepository.aggregateRevenue(allTimeStart, now);

    // Obtener ingresos del mes actual
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const monthlyRevenueStats = await this.rentalRepository.aggregateRevenue(
      monthStart,
      monthEnd
    );

    // Obtener eventos
    const totalEvents = await this.eventRepository.count();
    const upcomingEvents = await this.eventRepository.findUpcoming();

    // Obtener costos de mantenimiento
    const totalMaintenanceCost =
      await this.maintenanceLogRepository.getTotalMaintenanceCost();

    return {
      totalBicycles,
      availableBicycles,
      rentedBicycles,
      maintenanceBicycles,
      retiredBicycles,
      totalUsers,
      activeRentals: activeRentals.length,
      totalRevenue: revenueStats.totalRevenue,
      monthlyRevenue: monthlyRevenueStats.totalRevenue,
      totalEvents,
      upcomingEvents: upcomingEvents.length,
      totalMaintenanceCost,
    };
  }

  /**
   * Obtiene reporte de usuarios por estrato socioeconómico
   * @returns Distribución de usuarios por estrato
   */
  async getUsersByStratum(): Promise<
    Array<{
      stratum: number;
      count: number;
      percentage: number;
    }>
  > {
    const users = await this.userRepository.findAll();
    const totalUsers = users.length;

    const stratumCounts = new Map<number, number>();

    for (const user of users) {
      if (user.socioeconomicStratum) {
        const count = stratumCounts.get(user.socioeconomicStratum) || 0;
        stratumCounts.set(user.socioeconomicStratum, count + 1);
      }
    }

    const report = [];
    for (let stratum = 1; stratum <= 6; stratum++) {
      const count = stratumCounts.get(stratum) || 0;
      report.push({
        stratum,
        count,
        percentage: totalUsers > 0 ? (count / totalUsers) * 100 : 0,
      });
    }

    return report;
  }

  /**
   * Obtiene reporte de descuentos aplicados
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Estadísticas de descuentos
   */
  async getDiscountReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalDiscounts: number;
    totalDiscountAmount: number;
    averageDiscountPercentage: number;
  }> {
    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    const rentals = await this.rentalRepository.findByDateRange(startDate, endDate);

    const rentalsWithDiscount = rentals.filter((r) => r.discountPercentage > 0);

    const totalDiscountAmount = rentalsWithDiscount.reduce(
      (sum, r) => sum + (r.discountAmount || 0),
      0
    );

    const averageDiscountPercentage =
      rentalsWithDiscount.length > 0
        ? rentalsWithDiscount.reduce((sum, r) => sum + r.discountPercentage, 0) /
          rentalsWithDiscount.length
        : 0;

    return {
      totalDiscounts: rentalsWithDiscount.length,
      totalDiscountAmount,
      averageDiscountPercentage,
    };
  }
}
