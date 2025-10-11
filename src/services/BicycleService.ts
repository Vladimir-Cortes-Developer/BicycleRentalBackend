import { injectable, inject } from 'tsyringe';
import { Types, FilterQuery } from 'mongoose';
import { BicycleRepository } from '../repositories/BicycleRepository';
import { RegionalRepository } from '../repositories/RegionalRepository';
import { IBicycle } from '../models/Bicycle';
import { CreateBicycleDto, UpdateBicycleDto } from '../dtos';

@injectable()
export class BicycleService {
  constructor(
    @inject(BicycleRepository) private bicycleRepository: BicycleRepository,
    @inject(RegionalRepository) private regionalRepository: RegionalRepository
  ) {}

  /**
   * Crea una nueva bicicleta
   * @param dto - Datos de la bicicleta
   * @returns Bicicleta creada
   */
  async create(dto: CreateBicycleDto): Promise<IBicycle> {
    // Verificar que el código no esté en uso
    const existingBicycle = await this.bicycleRepository.findByCode(dto.code);
    if (existingBicycle) {
      throw new Error('Bicycle code already exists');
    }

    // Verificar que la regional exista
    const regional = await this.regionalRepository.findById(dto.regionalId);
    if (!regional) {
      throw new Error('Regional not found');
    }

    // Crear bicicleta con código en mayúsculas
    const bicycle = await this.bicycleRepository.create({
      ...dto,
      code: dto.code.toUpperCase(),
      status: dto.status || 'available',
      regionalId: new Types.ObjectId(dto.regionalId),
    });

    return bicycle;
  }

  /**
   * Obtiene una bicicleta por su ID
   * @param id - ID de la bicicleta
   * @returns Bicicleta encontrada
   */
  async findById(id: string): Promise<IBicycle> {
    const bicycle = await this.bicycleRepository.findById(id);
    if (!bicycle) {
      throw new Error('Bicycle not found');
    }
    return bicycle;
  }

  /**
   * Obtiene una bicicleta por su código
   * @param code - Código de la bicicleta
   * @returns Bicicleta encontrada
   */
  async findByCode(code: string): Promise<IBicycle> {
    const bicycle = await this.bicycleRepository.findByCode(code);
    if (!bicycle) {
      throw new Error('Bicycle not found');
    }
    return bicycle;
  }

  /**
   * Obtiene todas las bicicletas con filtros opcionales
   * @param filters - Filtros de búsqueda
   * @returns Lista de bicicletas
   */
  async findAll(filters?: FilterQuery<IBicycle>): Promise<IBicycle[]> {
    return this.bicycleRepository.findAll(filters);
  }

  /**
   * Obtiene bicicletas disponibles
   * @param regionalId - ID de la regional (opcional)
   * @returns Lista de bicicletas disponibles
   */
  async findAvailable(regionalId?: string): Promise<IBicycle[]> {
    return this.bicycleRepository.findAvailable(regionalId);
  }

  /**
   * Obtiene bicicletas por estado
   * @param status - Estado de las bicicletas
   * @param regionalId - ID de la regional (opcional)
   * @returns Lista de bicicletas
   */
  async findByStatus(status: string, regionalId?: string): Promise<IBicycle[]> {
    return this.bicycleRepository.findByStatus(status, regionalId);
  }

  /**
   * Obtiene bicicletas por regional
   * @param regionalId - ID de la regional
   * @returns Lista de bicicletas
   */
  async findByRegional(regionalId: string): Promise<IBicycle[]> {
    // Verificar que la regional exista
    const regional = await this.regionalRepository.findById(regionalId);
    if (!regional) {
      throw new Error('Regional not found');
    }

    return this.bicycleRepository.findByRegional(regionalId);
  }

  /**
   * Encuentra bicicletas cercanas a una ubicación
   * @param longitude - Longitud
   * @param latitude - Latitud
   * @param maxDistance - Distancia máxima en metros
   * @returns Lista de bicicletas cercanas
   */
  async findNearby(
    longitude: number,
    latitude: number,
    maxDistance: number = 5000
  ): Promise<IBicycle[]> {
    // Validar coordenadas
    if (longitude < -180 || longitude > 180) {
      throw new Error('Invalid longitude. Must be between -180 and 180');
    }
    if (latitude < -90 || latitude > 90) {
      throw new Error('Invalid latitude. Must be between -90 and 90');
    }
    if (maxDistance <= 0) {
      throw new Error('Invalid max distance. Must be greater than 0');
    }

    return this.bicycleRepository.findNearby(longitude, latitude, maxDistance);
  }

  /**
   * Actualiza una bicicleta
   * @param id - ID de la bicicleta
   * @param dto - Datos a actualizar
   * @returns Bicicleta actualizada
   */
  async update(id: string, dto: UpdateBicycleDto): Promise<IBicycle> {
    // Verificar que la bicicleta exista
    const bicycle = await this.bicycleRepository.findById(id);
    if (!bicycle) {
      throw new Error('Bicycle not found');
    }

    // Si se actualiza el código, verificar que no esté en uso
    if (dto.code && dto.code.toUpperCase() !== bicycle.code) {
      const existingBicycle = await this.bicycleRepository.findByCode(dto.code);
      if (existingBicycle) {
        throw new Error('Bicycle code already exists');
      }
    }

    // Si se actualiza la regional, verificar que exista
    if (dto.regionalId) {
      const regional = await this.regionalRepository.findById(dto.regionalId);
      if (!regional) {
        throw new Error('Regional not found');
      }
    }

    // Actualizar bicicleta
    const { regionalId: _regionalId, ...dtoWithoutRegional } = dto;
    const updateData: Partial<IBicycle> = {
      ...dtoWithoutRegional,
      code: dto.code ? dto.code.toUpperCase() : undefined,
    };

    if (dto.regionalId) {
      updateData.regionalId = new Types.ObjectId(dto.regionalId);
    }

    const updatedBicycle = await this.bicycleRepository.update(id, updateData);

    if (!updatedBicycle) {
      throw new Error('Failed to update bicycle');
    }

    return updatedBicycle;
  }

  /**
   * Actualiza el estado de una bicicleta
   * @param id - ID de la bicicleta
   * @param status - Nuevo estado
   * @returns Bicicleta actualizada
   */
  async updateStatus(
    id: string,
    status: 'available' | 'rented' | 'maintenance' | 'retired'
  ): Promise<IBicycle> {
    const bicycle = await this.bicycleRepository.findById(id);
    if (!bicycle) {
      throw new Error('Bicycle not found');
    }

    const updatedBicycle = await this.bicycleRepository.updateStatus(id, status);
    if (!updatedBicycle) {
      throw new Error('Failed to update bicycle status');
    }

    return updatedBicycle;
  }

  /**
   * Actualiza la ubicación de una bicicleta
   * @param id - ID de la bicicleta
   * @param longitude - Longitud
   * @param latitude - Latitud
   * @returns Bicicleta actualizada
   */
  async updateLocation(id: string, longitude: number, latitude: number): Promise<IBicycle> {
    // Validar coordenadas
    if (longitude < -180 || longitude > 180) {
      throw new Error('Invalid longitude. Must be between -180 and 180');
    }
    if (latitude < -90 || latitude > 90) {
      throw new Error('Invalid latitude. Must be between -90 and 90');
    }

    const bicycle = await this.bicycleRepository.findById(id);
    if (!bicycle) {
      throw new Error('Bicycle not found');
    }

    const updatedBicycle = await this.bicycleRepository.updateLocation(id, longitude, latitude);
    if (!updatedBicycle) {
      throw new Error('Failed to update bicycle location');
    }

    return updatedBicycle;
  }

  /**
   * Elimina una bicicleta
   * @param id - ID de la bicicleta
   * @returns Bicicleta eliminada
   */
  async delete(id: string): Promise<IBicycle> {
    const bicycle = await this.bicycleRepository.findById(id);
    if (!bicycle) {
      throw new Error('Bicycle not found');
    }

    // No permitir eliminar bicicletas que están alquiladas
    if (bicycle.status === 'rented') {
      throw new Error('Cannot delete a rented bicycle');
    }

    const deletedBicycle = await this.bicycleRepository.delete(id);
    if (!deletedBicycle) {
      throw new Error('Failed to delete bicycle');
    }

    return deletedBicycle;
  }

  /**
   * Cuenta bicicletas con filtros opcionales
   * @param filters - Filtros de búsqueda
   * @returns Número de bicicletas
   */
  async count(filters?: FilterQuery<IBicycle>): Promise<number> {
    return this.bicycleRepository.count(filters);
  }

  /**
   * Obtiene el conteo de bicicletas por estado
   * @returns Array con conteos por estado
   */
  async countByStatus(): Promise<{ status: string; count: number }[]> {
    return this.bicycleRepository.countByStatus();
  }
}
