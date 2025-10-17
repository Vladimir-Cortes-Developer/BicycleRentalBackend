import { injectable, inject } from 'tsyringe';
import mongoose, { Types } from 'mongoose';
import { EventRepository } from '../repositories/EventRepository';
import { EventParticipantRepository } from '../repositories/EventParticipantRepository';
import { UserRepository } from '../repositories/UserRepository';
import { RegionalRepository } from '../repositories/RegionalRepository';
import { IEvent } from '../models/Event';
import { IEventParticipant } from '../models/EventParticipant';
import { CreateEventDto, UpdateEventDto, RegisterToEventDto } from '../dtos';

@injectable()
export class EventService {
  constructor(
    @inject(EventRepository) private eventRepository: EventRepository,
    @inject(EventParticipantRepository)
    private eventParticipantRepository: EventParticipantRepository,
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(RegionalRepository) private regionalRepository: RegionalRepository
  ) {}

  /**
   * Crea un nuevo evento (ciclopaseo)
   * @param dto - Datos del evento
   * @param userId - ID del usuario que crea el evento
   * @returns Evento creado
   */
  async create(dto: CreateEventDto, userId: string): Promise<IEvent> {
    // Verificar que la regional exista
    const regional = await this.regionalRepository.findById(dto.regionalId);
    if (!regional) {
      throw new Error('Regional not found');
    }

    // Convertir eventDate de string a Date
    const eventDate = new Date(dto.eventDate);

    // Validar que la fecha del evento sea futura
    if (eventDate <= new Date()) {
      throw new Error('Event date must be in the future');
    }

    // Preparar datos del evento
    const eventData: any = {
      name: dto.name,
      eventDate: eventDate,
      startTime: dto.startTime,
      regionalId: new Types.ObjectId(dto.regionalId),
      createdBy: new Types.ObjectId(userId),
      currentParticipants: 0,
    };

    // Agregar campos opcionales si existen
    if (dto.description) eventData.description = dto.description;
    if (dto.eventType) eventData.eventType = dto.eventType;
    if (dto.endTime) eventData.endTime = dto.endTime;
    if (dto.routeDescription) eventData.routeDescription = dto.routeDescription;
    if (dto.meetingPoint) eventData.meetingPoint = dto.meetingPoint;
    if (dto.meetingPointLocation) eventData.meetingPointLocation = dto.meetingPointLocation;
    if (dto.maxParticipants) eventData.maxParticipants = dto.maxParticipants;
    if (dto.status) eventData.status = dto.status;

    // Crear evento
    const event = await this.eventRepository.create(eventData);

    return event;
  }

  /**
   * Obtiene un evento por su ID
   * @param id - ID del evento
   * @returns Evento encontrado
   */
  async findById(id: string): Promise<IEvent> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }

  /**
   * Obtiene todos los eventos
   * @returns Lista de eventos
   */
  async findAll(): Promise<IEvent[]> {
    return this.eventRepository.findAll();
  }

  /**
   * Obtiene eventos por regional
   * @param regionalId - ID de la regional
   * @returns Lista de eventos
   */
  async findByRegional(regionalId: string): Promise<IEvent[]> {
    // Verificar que la regional exista
    const regional = await this.regionalRepository.findById(regionalId);
    if (!regional) {
      throw new Error('Regional not found');
    }

    return this.eventRepository.findByRegional(regionalId);
  }

  /**
   * Obtiene eventos próximos
   * @returns Lista de eventos próximos
   */
  async findUpcoming(): Promise<IEvent[]> {
    return this.eventRepository.findUpcoming();
  }

  /**
   * Obtiene eventos en un rango de fechas
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Lista de eventos
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<IEvent[]> {
    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    return this.eventRepository.findByDateRange(startDate, endDate);
  }

  /**
   * Obtiene eventos disponibles (con cupos)
   * @returns Lista de eventos disponibles
   */
  async findAvailableEvents(): Promise<IEvent[]> {
    return this.eventRepository.findAvailableEvents();
  }

  /**
   * Actualiza un evento
   * @param id - ID del evento
   * @param dto - Datos a actualizar
   * @returns Evento actualizado
   */
  async update(id: string, dto: UpdateEventDto): Promise<IEvent> {
    // Verificar que el evento exista
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }

    // Si se actualiza la regional, verificar que exista
    if (dto.regionalId) {
      const regional = await this.regionalRepository.findById(dto.regionalId);
      if (!regional) {
        throw new Error('Regional not found');
      }
    }

    // Si se actualiza la fecha, validar que sea futura
    if (dto.eventDate) {
      const eventDate = new Date(dto.eventDate);
      if (eventDate <= new Date()) {
        throw new Error('Event date must be in the future');
      }
    }

    // Si se actualiza maxParticipants, validar que sea mayor o igual a currentParticipants
    if (dto.maxParticipants && dto.maxParticipants < event.currentParticipants) {
      throw new Error('Max participants cannot be less than current participants');
    }

    // Preparar datos de actualización
    const updateData: any = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.eventType) updateData.eventType = dto.eventType;
    if (dto.eventDate) updateData.eventDate = new Date(dto.eventDate);
    if (dto.startTime) updateData.startTime = dto.startTime;
    if (dto.endTime !== undefined) updateData.endTime = dto.endTime;
    if (dto.routeDescription !== undefined) updateData.routeDescription = dto.routeDescription;
    if (dto.meetingPoint !== undefined) updateData.meetingPoint = dto.meetingPoint;
    if (dto.meetingPointLocation) updateData.meetingPointLocation = dto.meetingPointLocation;
    if (dto.maxParticipants) updateData.maxParticipants = dto.maxParticipants;
    if (dto.regionalId) updateData.regionalId = new Types.ObjectId(dto.regionalId);
    if (dto.status) updateData.status = dto.status;

    const updatedEvent = await this.eventRepository.update(id, updateData);
    if (!updatedEvent) {
      throw new Error('Failed to update event');
    }

    return updatedEvent;
  }

  /**
   * Elimina un evento
   * @param id - ID del evento
   * @returns Evento eliminado
   */
  async delete(id: string): Promise<IEvent> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }

    // No permitir eliminar eventos con participantes
    if (event.currentParticipants > 0) {
      throw new Error('Cannot delete event with participants');
    }

    const deletedEvent = await this.eventRepository.delete(id);
    if (!deletedEvent) {
      throw new Error('Failed to delete event');
    }

    return deletedEvent;
  }

  /**
   * Registra un usuario en un evento (con transacción)
   * @param userId - ID del usuario
   * @param dto - Datos del registro
   * @returns Registro de participante creado
   */
  async registerToEvent(userId: string, dto: RegisterToEventDto): Promise<IEventParticipant> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Verificar que el usuario exista
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verificar que el evento exista
      const event = await this.eventRepository.findById(dto.eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Verificar que el evento sea futuro
      if (event.eventDate <= new Date()) {
        throw new Error('Cannot register to past events');
      }

      // Verificar que haya cupos disponibles
      if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
        throw new Error('Event is full');
      }

      // Verificar que el usuario no esté ya registrado
      const existingParticipant = await this.eventParticipantRepository.findByEventAndUser(
        dto.eventId,
        userId
      );
      if (existingParticipant) {
        throw new Error('User is already registered to this event');
      }

      // Crear registro de participante
      const participant = await this.eventParticipantRepository.create(
        {
          eventId: new Types.ObjectId(dto.eventId),
          userId: new Types.ObjectId(userId),
          registrationDate: new Date(),
          attendanceStatus: 'registered',
        },
        session
      );

      // Incrementar contador de participantes
      await this.eventRepository.incrementParticipants(dto.eventId, session);

      await session.commitTransaction();
      return participant;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Cancela el registro de un usuario en un evento (con transacción)
   * @param userId - ID del usuario
   * @param eventId - ID del evento
   * @returns Registro de participante eliminado
   */
  async cancelRegistration(userId: string, eventId: string): Promise<IEventParticipant> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Verificar que el evento exista
      const event = await this.eventRepository.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Verificar que el usuario esté registrado
      const participant = await this.eventParticipantRepository.findByEventAndUser(
        eventId,
        userId
      );
      if (!participant) {
        throw new Error('User is not registered to this event');
      }

      // No permitir cancelar si el evento ya pasó
      if (event.eventDate <= new Date()) {
        throw new Error('Cannot cancel registration for past events');
      }

      // Eliminar registro de participante
      const deletedParticipant = await this.eventParticipantRepository.delete(
        (participant._id as Types.ObjectId).toString(),
        session
      );

      if (!deletedParticipant) {
        throw new Error('Failed to cancel registration');
      }

      // Decrementar contador de participantes
      await this.eventRepository.decrementParticipants(eventId, session);

      await session.commitTransaction();
      return deletedParticipant;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Marca asistencia de un participante
   * @param eventId - ID del evento
   * @param userId - ID del usuario
   * @returns Registro de participante actualizado
   */
  async markAttendance(eventId: string, userId: string): Promise<IEventParticipant> {
    // Verificar que el evento exista
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Verificar que el usuario esté registrado
    const participant = await this.eventParticipantRepository.findByEventAndUser(eventId, userId);
    if (!participant) {
      throw new Error('User is not registered to this event');
    }

    // Marcar asistencia
    const updatedParticipant = await this.eventParticipantRepository.update(
      (participant._id as Types.ObjectId).toString(),
      {
        attendanceStatus: 'attended',
      }
    );

    if (!updatedParticipant) {
      throw new Error('Failed to mark attendance');
    }

    return updatedParticipant;
  }

  /**
   * Obtiene todos los participantes de un evento
   * @param eventId - ID del evento
   * @returns Lista de participantes
   */
  async getEventParticipants(eventId: string): Promise<IEventParticipant[]> {
    // Verificar que el evento exista
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    return this.eventParticipantRepository.findByEvent(eventId);
  }

  /**
   * Obtiene todos los eventos en los que está registrado un usuario
   * @param userId - ID del usuario
   * @param eventStatus - Estado del evento para filtrar (opcional)
   * @returns Lista de eventos
   */
  async getUserEvents(userId: string, eventStatus?: string): Promise<IEventParticipant[]> {
    // Verificar que el usuario exista
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.eventParticipantRepository.findByUser(userId, eventStatus);
  }
}
