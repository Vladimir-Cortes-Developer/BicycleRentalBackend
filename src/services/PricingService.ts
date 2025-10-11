import { injectable } from 'tsyringe';

export interface PricingCalculation {
  hours: number;
  baseRate: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
}

@injectable()
export class PricingService {
  /**
   * Calcula el descuento basado en el estrato socioeconómico
   * Estrato 1-2: 10% descuento
   * Estrato 3-4: 5% descuento
   * Estrato 5-6: 0% descuento
   * Sin estrato: 0% descuento
   */
  calculateDiscountPercentage(socioeconomicStratum?: number): number {
    if (!socioeconomicStratum) {
      return 0;
    }

    if (socioeconomicStratum >= 1 && socioeconomicStratum <= 2) {
      return 10;
    }

    if (socioeconomicStratum >= 3 && socioeconomicStratum <= 4) {
      return 5;
    }

    return 0; // Estrato 5-6
  }

  /**
   * Calcula el precio total de un alquiler
   * @param startTime - Fecha/hora de inicio del alquiler
   * @param endTime - Fecha/hora de finalización del alquiler
   * @param pricePerHour - Precio por hora de la bicicleta
   * @param socioeconomicStratum - Estrato socioeconómico del usuario (opcional)
   * @returns Objeto con detalles del cálculo de precio
   */
  calculateRentalPrice(
    startTime: Date,
    endTime: Date,
    pricePerHour: number,
    socioeconomicStratum?: number
  ): PricingCalculation {
    // Calcular horas transcurridas
    const milliseconds = endTime.getTime() - startTime.getTime();
    const hours = Math.max(milliseconds / (1000 * 60 * 60), 0);

    // Redondear hacia arriba (se cobra por hora completa)
    const billingHours = Math.ceil(hours);

    // Calcular subtotal
    const subtotal = billingHours * pricePerHour;

    // Calcular descuento
    const discountPercentage = this.calculateDiscountPercentage(socioeconomicStratum);
    const discountAmount = (subtotal * discountPercentage) / 100;

    // Calcular total
    const totalAmount = subtotal - discountAmount;

    return {
      hours: billingHours,
      baseRate: pricePerHour,
      subtotal,
      discountPercentage,
      discountAmount,
      totalAmount,
    };
  }

  /**
   * Valida que el tiempo de alquiler sea válido
   * @param startTime - Fecha/hora de inicio
   * @param endTime - Fecha/hora de finalización
   */
  validateRentalTime(startTime: Date, endTime: Date): void {
    if (endTime <= startTime) {
      throw new Error('End time must be after start time');
    }

    const now = new Date();
    if (startTime > now) {
      throw new Error('Start time cannot be in the future');
    }
  }
}
