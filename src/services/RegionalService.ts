import { injectable, inject } from 'tsyringe';
import { RegionalRepository } from '../repositories/RegionalRepository';
import { IRegional } from '../models/Regional';
import { CreateRegionalDto, UpdateRegionalDto } from '../dtos';

@injectable()
export class RegionalService {
  constructor(@inject(RegionalRepository) private regionalRepository: RegionalRepository) {}

  /**
   * Crea una nueva regional
   * @param dto - Datos de la regional
   * @returns Regional creada
   */
  async create(dto: CreateRegionalDto): Promise<IRegional> {
    // Verificar que no exista una regional con el mismo nombre
    const existingRegional = await this.regionalRepository.findByName(dto.name);
    if (existingRegional) {
      throw new Error('Regional with this name already exists');
    }

    const regionalData: any = {
      name: dto.name,
      city: dto.city,
      department: dto.department,
    };

    if (dto.address) regionalData.address = dto.address;
    if (dto.location) regionalData.location = dto.location;

    const regional = await this.regionalRepository.create(regionalData);
    return regional;
  }

  /**
   * Obtiene una regional por su ID
   * @param id - ID de la regional
   * @returns Regional encontrada
   */
  async findById(id: string): Promise<IRegional> {
    const regional = await this.regionalRepository.findById(id);
    if (!regional) {
      throw new Error('Regional not found');
    }
    return regional;
  }

  /**
   * Obtiene todas las regionales
   * @returns Lista de regionales
   */
  async findAll(): Promise<IRegional[]> {
    return this.regionalRepository.findAll();
  }

  /**
   * Obtiene regionales por ciudad
   * @param city - Nombre de la ciudad
   * @returns Lista de regionales
   */
  async findByCity(city: string): Promise<IRegional[]> {
    return this.regionalRepository.findByCity(city);
  }

  /**
   * Obtiene regionales por departamento
   * @param department - Nombre del departamento
   * @returns Lista de regionales
   */
  async findByDepartment(department: string): Promise<IRegional[]> {
    return this.regionalRepository.findByDepartment(department);
  }

  /**
   * Encuentra regionales cercanas a una ubicación
   * @param longitude - Longitud
   * @param latitude - Latitud
   * @param maxDistance - Distancia máxima en metros
   * @returns Lista de regionales cercanas
   */
  async findNearby(
    longitude: number,
    latitude: number,
    maxDistance: number = 50000
  ): Promise<IRegional[]> {
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

    return this.regionalRepository.findNearby(longitude, latitude, maxDistance);
  }

  /**
   * Actualiza una regional
   * @param id - ID de la regional
   * @param dto - Datos a actualizar
   * @returns Regional actualizada
   */
  async update(id: string, dto: UpdateRegionalDto): Promise<IRegional> {
    // Verificar que la regional exista
    const regional = await this.regionalRepository.findById(id);
    if (!regional) {
      throw new Error('Regional not found');
    }

    // Si se actualiza el nombre, verificar que no esté en uso
    if (dto.name && dto.name !== regional.name) {
      const existingRegional = await this.regionalRepository.findByName(dto.name);
      if (existingRegional) {
        throw new Error('Regional with this name already exists');
      }
    }

    const updateData: any = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.city) updateData.city = dto.city;
    if (dto.department) updateData.department = dto.department;
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.location) updateData.location = dto.location;

    const updatedRegional = await this.regionalRepository.update(id, updateData);

    if (!updatedRegional) {
      throw new Error('Failed to update regional');
    }

    return updatedRegional;
  }

  /**
   * Elimina una regional
   * @param id - ID de la regional
   * @returns Regional eliminada
   */
  async delete(id: string): Promise<IRegional> {
    const regional = await this.regionalRepository.findById(id);
    if (!regional) {
      throw new Error('Regional not found');
    }

    // TODO: Verificar que no haya bicicletas o usuarios asociados a esta regional
    // antes de eliminarla (implementar según necesidad del negocio)

    const deletedRegional = await this.regionalRepository.delete(id);
    if (!deletedRegional) {
      throw new Error('Failed to delete regional');
    }

    return deletedRegional;
  }

  /**
   * Cuenta regionales
   * @returns Número total de regionales
   */
  async count(): Promise<number> {
    return this.regionalRepository.count();
  }
}