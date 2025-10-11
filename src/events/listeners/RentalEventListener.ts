import {
  eventEmitter,
  EventType,
  RentalCreatedPayload,
  RentalCompletedPayload,
} from '../EventEmitter';

/**
 * Listener para eventos relacionados con alquileres
 */
export class RentalEventListener {
  constructor() {
    this.registerListeners();
  }

  private registerListeners(): void {
    // Listener para cuando se crea un alquiler
    eventEmitter.on(EventType.RENTAL_CREATED, this.onRentalCreated);

    // Listener para cuando se completa un alquiler
    eventEmitter.on(EventType.RENTAL_COMPLETED, this.onRentalCompleted);

    // Listener para cuando se cancela un alquiler
    eventEmitter.on(EventType.RENTAL_CANCELLED, this.onRentalCancelled);
  }

  private onRentalCreated(payload: RentalCreatedPayload): void {
    console.log('📦 [Event] Rental created:', {
      rentalId: payload.rentalId,
      userId: payload.userId,
      bicycleId: payload.bicycleId,
      time: payload.startTime,
    });

    // Aquí se pueden agregar acciones adicionales:
    // - Enviar notificación al usuario
    // - Registrar en logs
    // - Actualizar métricas en tiempo real
  }

  private onRentalCompleted(payload: RentalCompletedPayload): void {
    console.log('✅ [Event] Rental completed:', {
      rentalId: payload.rentalId,
      totalAmount: payload.totalAmount,
      discountAmount: payload.discountAmount,
      duration: payload.endTime.getTime() - new Date().getTime(),
    });

    // Aquí se pueden agregar acciones adicionales:
    // - Enviar recibo por email
    // - Actualizar estadísticas de uso
    // - Solicitar feedback del usuario
  }

  private onRentalCancelled(payload: { rentalId: string }): void {
    console.log('❌ [Event] Rental cancelled:', payload.rentalId);

    // Aquí se pueden agregar acciones adicionales:
    // - Notificar al administrador
    // - Registrar motivo de cancelación
  }
}
