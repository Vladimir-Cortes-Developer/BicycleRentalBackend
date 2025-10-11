import { eventEmitter, EventType, UserRegisteredPayload } from '../EventEmitter';

/**
 * Listener para eventos relacionados con usuarios
 */
export class UserEventListener {
  constructor() {
    this.registerListeners();
  }

  private registerListeners(): void {
    // Listener para cuando se registra un usuario
    eventEmitter.on(EventType.USER_REGISTERED, this.onUserRegistered);

    // Listener para cuando un usuario inicia sesión
    eventEmitter.on(EventType.USER_LOGGED_IN, this.onUserLoggedIn);
  }

  private onUserRegistered(payload: UserRegisteredPayload): void {
    console.log('🎉 [Event] User registered:', {
      userId: payload.userId,
      email: payload.email,
      name: `${payload.firstName} ${payload.lastName}`,
    });

    // Aquí se pueden agregar acciones adicionales:
    // - Enviar email de bienvenida
    // - Crear perfil en servicios externos
    // - Registrar en analytics
  }

  private onUserLoggedIn(payload: { userId: string; email: string }): void {
    console.log('🔐 [Event] User logged in:', payload);

    // Aquí se pueden agregar acciones adicionales:
    // - Registrar actividad del usuario
    // - Actualizar última sesión
  }
}
