import { injectable, inject } from 'tsyringe';
import mongoose, { Types } from 'mongoose';
import { MaintenanceLogRepository } from '../repositories/MaintenanceLogRepository';
import { BicycleRepository } from '../repositories/BicycleRepository';
import { IMaintenanceLog } from '../models/MaintenanceLog';

export interface CreateMaintenanceLogDto {
  bicycleId: string;
  maintenanceType: string;
  description?: string;
  cost: number;
  performedBy?: string;
  nextMaintenanceDate?: Date;
}

export interface UpdateMaintenanceLogDto {
  maintenanceType?: string;
  description?: string;
  cost?: number;
  performedBy?: string;
  nextMaintenanceDate?: Date;
}

@injectable()
export class MaintenanceLogService {
  constructor(
    @inject(MaintenanceLogRepository)
    private maintenanceLogRepository: MaintenanceLogRepository,
    @inject(BicycleRepository) private bicycleRepository: BicycleRepository
  ) {}

  /**
   * Crea un nuevo registro de mantenimiento (con transacción)
   * @param dto - Datos del registro de mantenimiento
   * @returns Registro de mantenimiento creado
   */
  async create(dto: CreateMaintenanceLogDto): Promise<IMaintenanceLog> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Verificar que la bicicleta exista
      const bicycle = await this.bicycleRepository.findById(dto.bicycleId);
      if (!bicycle) {
        throw new Error('Bicycle not found');
      }

      // Crear registro de mantenimiento
      const maintenanceLog = await this.maintenanceLogRepository.create(
        {
          ...dto,
          bicycleId: new Types.ObjectId(dto.bicycleId),
          maintenanceDate: new Date(),
        },
        session
      );

      // Actualizar estado de la bicicleta a 'maintenance'
      await this.bicycleRepository.updateStatus(dto.bicycleId, 'maintenance', session);

      await session.commitTransaction();
      return maintenanceLog;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Obtiene un registro de mantenimiento por su ID
   * @param id - ID del registro
   * @returns Registro de mantenimiento encontrado
   */
  async findById(id: string): Promise<IMaintenanceLog> {
    const maintenanceLog = await this.maintenanceLogRepository.findById(id);
    if (!maintenanceLog) {
      throw new Error('Maintenance log not found');
    }
    return maintenanceLog;
  }

  /**
   * Obtiene todos los registros de mantenimiento
   * @returns Lista de registros
   */
  async findAll(): Promise<IMaintenanceLog[]> {
    return this.maintenanceLogRepository.findAll();
  }

  /**
   * Obtiene registros de mantenimiento de una bicicleta
   * @param bicycleId - ID de la bicicleta
   * @returns Lista de registros
   */
  async findByBicycle(bicycleId: string): Promise<IMaintenanceLog[]> {
    // Verificar que la bicicleta exista
    const bicycle = await this.bicycleRepository.findById(bicycleId);
    if (!bicycle) {
      throw new Error('Bicycle not found');
    }

    return this.maintenanceLogRepository.findByBicycle(bicycleId);
  }

  /**
   * Obtiene registros de mantenimiento por tipo
   * @param maintenanceType - Tipo de mantenimiento
   * @returns Lista de registros
   */
  async findByType(maintenanceType: string): Promise<IMaintenanceLog[]> {
    return this.maintenanceLogRepository.findByType(maintenanceType);
  }

  /**
   * Obtiene registros de mantenimiento en un rango de fechas
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Lista de registros
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<IMaintenanceLog[]> {
    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    return this.maintenanceLogRepository.findByDateRange(startDate, endDate);
  }

  /**
   * Obtiene mantenimientos próximos (pendientes)
   * @returns Lista de registros con mantenimiento próximo
   */
  async findUpcomingMaintenance(): Promise<IMaintenanceLog[]> {
    return this.maintenanceLogRepository.findUpcomingMaintenance();
  }

  /**
   * Obtiene mantenimientos vencidos
   * @returns Lista de registros con mantenimiento vencido
   */
  async findOverdueMaintenance(): Promise<IMaintenanceLog[]> {
    return this.maintenanceLogRepository.findOverdueMaintenance();
  }

  /**
   * Obtiene el último mantenimiento de una bicicleta
   * @param bicycleId - ID de la bicicleta
   * @returns Último registro de mantenimiento o null
   */
  async getLastMaintenanceByBicycle(bicycleId: string): Promise<IMaintenanceLog | null> {
    // Verificar que la bicicleta exista
    const bicycle = await this.bicycleRepository.findById(bicycleId);
    if (!bicycle) {
      throw new Error('Bicycle not found');
    }

    return this.maintenanceLogRepository.getLastMaintenanceByBicycle(bicycleId);
  }

  /**
   * Actualiza un registro de mantenimiento
   * @param id - ID del registro
   * @param dto - Datos a actualizar
   * @returns Registro actualizado
   */
  async update(id: string, dto: UpdateMaintenanceLogDto): Promise<IMaintenanceLog> {
    // Verificar que el registro exista
    const maintenanceLog = await this.maintenanceLogRepository.findById(id);
    if (!maintenanceLog) {
      throw new Error('Maintenance log not found');
    }

    const updatedLog = await this.maintenanceLogRepository.update(id, dto);
    if (!updatedLog) {
      throw new Error('Failed to update maintenance log');
    }

    return updatedLog;
  }

  /**
   * Completa un mantenimiento y actualiza el estado de la bicicleta (con transacción)
   * @param id - ID del registro de mantenimiento
   * @returns Registro actualizado
   */
  async completeMaintenance(id: string): Promise<IMaintenanceLog> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Verificar que el registro exista
      const maintenanceLog = await this.maintenanceLogRepository.findById(id);
      if (!maintenanceLog) {
        throw new Error('Maintenance log not found');
      }

      // Actualizar estado de la bicicleta a 'available'
      await this.bicycleRepository.updateStatus(
        maintenanceLog.bicycleId.toString(),
        'available',
        session
      );

      await session.commitTransaction();
      return maintenanceLog;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Elimina un registro de mantenimiento
   * @param id - ID del registro
   * @returns Registro eliminado
   */
  async delete(id: string): Promise<IMaintenanceLog> {
    const maintenanceLog = await this.maintenanceLogRepository.findById(id);
    if (!maintenanceLog) {
      throw new Error('Maintenance log not found');
    }

    const deletedLog = await this.maintenanceLogRepository.delete(id);
    if (!deletedLog) {
      throw new Error('Failed to delete maintenance log');
    }

    return deletedLog;
  }

  /**
   * Obtiene el costo total de mantenimientos en un rango de fechas
   * @param startDate - Fecha de inicio (opcional)
   * @param endDate - Fecha de fin (opcional)
   * @returns Costo total
   */
  async getTotalMaintenanceCost(startDate?: Date, endDate?: Date): Promise<number> {
    if (startDate && endDate && endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    return this.maintenanceLogRepository.getTotalMaintenanceCost(startDate, endDate);
  }

  /**
   * Obtiene estadísticas de mantenimiento
   * @returns Estadísticas de mantenimiento
   */
  async getMaintenanceStats(): Promise<{
    totalMaintenance: number;
    upcomingMaintenance: number;
    overdueMaintenance: number;
    totalCost: number;
  }> {
    const [totalMaintenance, upcoming, overdue, totalCost] = await Promise.all([
      this.maintenanceLogRepository.count(),
      this.maintenanceLogRepository.findUpcomingMaintenance(),
      this.maintenanceLogRepository.findOverdueMaintenance(),
      this.maintenanceLogRepository.getTotalMaintenanceCost(),
    ]);

    return {
      totalMaintenance,
      upcomingMaintenance: upcoming.length,
      overdueMaintenance: overdue.length,
      totalCost,
    };
  }
}
