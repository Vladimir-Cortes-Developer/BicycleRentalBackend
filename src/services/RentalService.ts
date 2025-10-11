import { injectable, inject } from 'tsyringe';
import mongoose, { Types } from 'mongoose';
import { RentalRepository } from '../repositories/RentalRepository';
import { BicycleRepository } from '../repositories/BicycleRepository';
import { UserRepository } from '../repositories/UserRepository';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { PricingService } from './PricingService';
import { IRental } from '../models/Rental';
import { RentBicycleDto, ReturnBicycleDto } from '../dtos';

export interface RentalDetails extends IRental {
  bicycle?: {
    code: string;
    brand: string;
    bicycleModel?: string;
  };
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

@injectable()
export class RentalService {
  constructor(
    @inject(RentalRepository) private rentalRepository: RentalRepository,
    @inject(BicycleRepository) private bicycleRepository: BicycleRepository,
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(PaymentRepository) private paymentRepository: PaymentRepository,
    @inject(PricingService) private pricingService: PricingService
  ) {}

  /**
   * Alquila una bicicleta (con transacción)
   * @param userId - ID del usuario que alquila
   * @param dto - Datos del alquiler
   * @returns Alquiler creado
   */
  async rentBicycle(userId: string, dto: RentBicycleDto): Promise<IRental> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Verificar que el usuario exista
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verificar que el usuario no tenga alquileres activos
      const activeRental = await this.rentalRepository.findActiveByUser(userId);
      if (activeRental) {
        throw new Error('User already has an active rental');
      }

      // Verificar que la bicicleta exista y esté disponible
      const bicycle = await this.bicycleRepository.findById(dto.bicycleId);
      if (!bicycle) {
        throw new Error('Bicycle not found');
      }

      if (bicycle.status !== 'available') {
        throw new Error('Bicycle is not available');
      }

      // Calcular descuento basado en estrato socioeconómico
      const discountPercentage = this.pricingService.calculateDiscountPercentage(
        user.socioeconomicStratum
      );

      // Crear alquiler
      const rental = await this.rentalRepository.create(
        {
          userId: new Types.ObjectId(userId),
          bicycleId: new Types.ObjectId(dto.bicycleId),
          startTime: new Date(),
          status: 'active',
          baseRate: bicycle.rentalPricePerHour,
          discountPercentage,
          startLocation: dto.startLocation || bicycle.currentLocation,
        },
        session
      );

      // Actualizar estado de la bicicleta a 'rented'
      await this.bicycleRepository.updateStatus(dto.bicycleId, 'rented', session);

      await session.commitTransaction();
      return rental;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Devuelve una bicicleta y procesa el pago (con transacción)
   * @param rentalId - ID del alquiler
   * @param dto - Datos de la devolución
   * @returns Alquiler completado con detalles de pago
   */
  async returnBicycle(rentalId: string, dto: ReturnBicycleDto): Promise<IRental> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Obtener el alquiler
      const rental = await this.rentalRepository.findById(rentalId);
      if (!rental) {
        throw new Error('Rental not found');
      }

      if (rental.status !== 'active') {
        throw new Error('Rental is not active');
      }

      // Obtener la bicicleta
      const bicycle = await this.bicycleRepository.findById(rental.bicycleId.toString());
      if (!bicycle) {
        throw new Error('Bicycle not found');
      }

      // Obtener el usuario para calcular descuento
      const user = await this.userRepository.findById(rental.userId.toString());
      if (!user) {
        throw new Error('User not found');
      }

      // Calcular precio del alquiler
      const endTime = new Date();
      const pricing = this.pricingService.calculateRentalPrice(
        rental.startTime,
        endTime,
        rental.baseRate,
        user.socioeconomicStratum
      );

      // Actualizar el alquiler
      const updatedRental = await this.rentalRepository.update(
        rentalId,
        {
          endTime,
          status: 'completed',
          endLocation: dto.endLocation || bicycle.currentLocation,
          discountAmount: pricing.discountAmount,
          totalAmount: pricing.totalAmount,
        },
        session
      );

      if (!updatedRental) {
        throw new Error('Failed to update rental');
      }

      // Crear registro de pago
      await this.paymentRepository.create(
        {
          rentalId: rental._id as Types.ObjectId,
          amount: pricing.totalAmount,
          paymentMethod: 'card', // Por defecto, puede ser configurable
          status: 'completed',
        },
        session
      );

      // Actualizar estado de la bicicleta a 'available'
      await this.bicycleRepository.updateStatus(
        rental.bicycleId.toString(),
        'available',
        session
      );

      // Actualizar ubicación de la bicicleta si se proporciona
      if (dto.endLocation) {
        await this.bicycleRepository.updateLocation(
          rental.bicycleId.toString(),
          dto.endLocation.coordinates[0],
          dto.endLocation.coordinates[1],
          session
        );
      }

      await session.commitTransaction();
      return updatedRental;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Obtiene un alquiler por su ID
   * @param id - ID del alquiler
   * @returns Alquiler encontrado
   */
  async findById(id: string): Promise<IRental> {
    const rental = await this.rentalRepository.findById(id);
    if (!rental) {
      throw new Error('Rental not found');
    }
    return rental;
  }

  /**
   * Obtiene todos los alquileres de un usuario
   * @param userId - ID del usuario
   * @returns Lista de alquileres
   */
  async findByUser(userId: string): Promise<IRental[]> {
    return this.rentalRepository.findByUser(userId);
  }

  /**
   * Obtiene el alquiler activo de un usuario
   * @param userId - ID del usuario
   * @returns Alquiler activo o null
   */
  async findActiveRentalByUser(userId: string): Promise<IRental | null> {
    return this.rentalRepository.findActiveByUser(userId);
  }

  /**
   * Obtiene todos los alquileres de una bicicleta
   * @param bicycleId - ID de la bicicleta
   * @returns Lista de alquileres
   */
  async findByBicycle(bicycleId: string): Promise<IRental[]> {
    return this.rentalRepository.findByBicycle(bicycleId);
  }

  /**
   * Obtiene alquileres por estado
   * @param status - Estado de los alquileres
   * @returns Lista de alquileres
   */
  async findByStatus(status: 'active' | 'completed' | 'cancelled'): Promise<IRental[]> {
    return this.rentalRepository.findByStatus(status);
  }

  /**
   * Obtiene alquileres en un rango de fechas
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Lista de alquileres
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<IRental[]> {
    return this.rentalRepository.findByDateRange(startDate, endDate);
  }

  /**
   * Cancela un alquiler activo (con transacción)
   * @param rentalId - ID del alquiler
   * @returns Alquiler cancelado
   */
  async cancelRental(rentalId: string): Promise<IRental> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Obtener el alquiler
      const rental = await this.rentalRepository.findById(rentalId);
      if (!rental) {
        throw new Error('Rental not found');
      }

      if (rental.status !== 'active') {
        throw new Error('Rental is not active');
      }

      // Actualizar el alquiler
      const updatedRental = await this.rentalRepository.update(
        rentalId,
        {
          status: 'cancelled',
          endTime: new Date(),
        },
        session
      );

      if (!updatedRental) {
        throw new Error('Failed to cancel rental');
      }

      // Actualizar estado de la bicicleta a 'available'
      await this.bicycleRepository.updateStatus(
        rental.bicycleId.toString(),
        'available',
        session
      );

      await session.commitTransaction();
      return updatedRental;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Obtiene estadísticas de ingresos en un rango de fechas
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Estadísticas de ingresos
   */
  async getRevenueStats(
    startDate: Date,
    endDate: Date
  ): Promise<{ totalRevenue: number; totalRentals: number; averageRevenue: number }> {
    return this.rentalRepository.aggregateRevenue(startDate, endDate);
  }

  /**
   * Obtiene las bicicletas más alquiladas
   * @param limit - Límite de resultados
   * @returns Lista de bicicletas con conteo de alquileres
   */
  async getMostRentedBicycles(limit: number = 10): Promise<
    Array<{
      bicycleId: string;
      totalRentals: number;
      totalRevenue: number;
    }>
  > {
    const results = await this.rentalRepository.findMostRentableBicycles(limit);
    return results.map(result => ({
      bicycleId: result.bicycleId,
      totalRentals: result.totalRentals,
      totalRevenue: result.totalRevenue,
    }));
  }
}
