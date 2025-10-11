import 'reflect-metadata';
import { container } from 'tsyringe';

// Repositories
import {
  UserRepository,
  BicycleRepository,
  RentalRepository,
  EventRepository,
  EventParticipantRepository,
  RegionalRepository,
  PaymentRepository,
  MaintenanceLogRepository,
} from '../repositories';

// Register all repositories as singletons
container.registerSingleton(UserRepository);
container.registerSingleton(BicycleRepository);
container.registerSingleton(RentalRepository);
container.registerSingleton(EventRepository);
container.registerSingleton(EventParticipantRepository);
container.registerSingleton(RegionalRepository);
container.registerSingleton(PaymentRepository);
container.registerSingleton(MaintenanceLogRepository);

// Services
import {
  PricingService,
  AuthService,
  BicycleService,
  RentalService,
  EventService,
  MaintenanceLogService,
  ReportService,
} from '../services';

// Register all services as singletons
container.registerSingleton(PricingService);
container.registerSingleton(AuthService);
container.registerSingleton(BicycleService);
container.registerSingleton(RentalService);
container.registerSingleton(EventService);
container.registerSingleton(MaintenanceLogService);
container.registerSingleton(ReportService);

export { container };
