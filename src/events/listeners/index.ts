import { RentalEventListener } from './RentalEventListener';
import { UserEventListener } from './UserEventListener';

/**
 * Inicializa todos los event listeners
 */
export function initializeEventListeners(): void {
  new RentalEventListener();
  new UserEventListener();

  console.log('✨ Event listeners initialized');
}

export { RentalEventListener, UserEventListener };
