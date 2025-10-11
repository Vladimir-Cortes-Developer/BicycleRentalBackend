import { EventEmitter as NodeEventEmitter } from 'events';

// Define los tipos de eventos del sistema
export enum EventType {
  // Eventos de alquiler
  RENTAL_CREATED = 'rental.created',
  RENTAL_COMPLETED = 'rental.completed',
  RENTAL_CANCELLED = 'rental.cancelled',

  // Eventos de pago
  PAYMENT_COMPLETED = 'payment.completed',
  PAYMENT_FAILED = 'payment.failed',

  // Eventos de usuario
  USER_REGISTERED = 'user.registered',
  USER_LOGGED_IN = 'user.logged_in',

  // Eventos de bicicleta
  BICYCLE_RENTED = 'bicycle.rented',
  BICYCLE_RETURNED = 'bicycle.returned',
  BICYCLE_MAINTENANCE_SCHEDULED = 'bicycle.maintenance_scheduled',

  // Eventos de ciclopaseo
  EVENT_CREATED = 'event.created',
  EVENT_REGISTRATION = 'event.registration',
  EVENT_CANCELLED = 'event.cancelled',
}

// Interfaces para los payloads de eventos
export interface RentalCreatedPayload {
  rentalId: string;
  userId: string;
  bicycleId: string;
  startTime: Date;
}

export interface RentalCompletedPayload {
  rentalId: string;
  userId: string;
  bicycleId: string;
  totalAmount: number;
  discountAmount: number;
  endTime: Date;
}

export interface PaymentCompletedPayload {
  paymentId: string;
  rentalId: string;
  userId: string;
  amount: number;
}

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface BicycleMaintenanceScheduledPayload {
  bicycleId: string;
  maintenanceType: string;
  nextMaintenanceDate: Date;
}

export interface EventRegistrationPayload {
  eventId: string;
  userId: string;
  eventName: string;
}

// Singleton EventEmitter
class ApplicationEventEmitter extends NodeEventEmitter {
  private static instance: ApplicationEventEmitter;

  private constructor() {
    super();
    this.setMaxListeners(20); // Aumentar límite de listeners
  }

  public static getInstance(): ApplicationEventEmitter {
    if (!ApplicationEventEmitter.instance) {
      ApplicationEventEmitter.instance = new ApplicationEventEmitter();
    }
    return ApplicationEventEmitter.instance;
  }

  // Métodos tipados para emitir eventos
  emitRentalCreated(payload: RentalCreatedPayload): void {
    this.emit(EventType.RENTAL_CREATED, payload);
  }

  emitRentalCompleted(payload: RentalCompletedPayload): void {
    this.emit(EventType.RENTAL_COMPLETED, payload);
  }

  emitRentalCancelled(rentalId: string): void {
    this.emit(EventType.RENTAL_CANCELLED, { rentalId });
  }

  emitPaymentCompleted(payload: PaymentCompletedPayload): void {
    this.emit(EventType.PAYMENT_COMPLETED, payload);
  }

  emitUserRegistered(payload: UserRegisteredPayload): void {
    this.emit(EventType.USER_REGISTERED, payload);
  }

  emitBicycleRented(bicycleId: string, userId: string): void {
    this.emit(EventType.BICYCLE_RENTED, { bicycleId, userId });
  }

  emitBicycleReturned(bicycleId: string, userId: string): void {
    this.emit(EventType.BICYCLE_RETURNED, { bicycleId, userId });
  }

  emitBicycleMaintenanceScheduled(payload: BicycleMaintenanceScheduledPayload): void {
    this.emit(EventType.BICYCLE_MAINTENANCE_SCHEDULED, payload);
  }

  emitEventCreated(eventId: string, eventName: string): void {
    this.emit(EventType.EVENT_CREATED, { eventId, eventName });
  }

  emitEventRegistration(payload: EventRegistrationPayload): void {
    this.emit(EventType.EVENT_REGISTRATION, payload);
  }
}

export const eventEmitter = ApplicationEventEmitter.getInstance();
