import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { EventService } from '../services/EventService';
import { AppError } from '../middlewares';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = container.resolve(EventService);
  }

  /**
   * POST /api/events
   * Crea un nuevo evento (admin only)
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const event = await this.eventService.create(req.body, req.user.userId);

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };

  /**
   * PUT /api/events/:id
   * Actualiza un evento (admin only)
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const event = await this.eventService.update(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: event,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };

  /**
   * DELETE /api/events/:id
   * Elimina un evento (admin only)
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.eventService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Event deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/events/:id
   * Obtiene un evento por ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const event = await this.eventService.findById(req.params.id);

      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/events
   * Obtiene todos los eventos
   * Query params: regionalId, status
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { regionalId, status } = req.query;
      const filters: any = {};

      if (regionalId) filters.regionalId = regionalId;
      if (status) filters.status = status;

      const events = await this.eventService.findAll();

      res.status(200).json({
        success: true,
        data: events,
        count: events.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/events/upcoming
   * Obtiene eventos próximos
   * Query params: regionalId
   */
  getUpcoming = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const events = await this.eventService.findUpcoming();

      res.status(200).json({
        success: true,
        data: events,
        count: events.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };

  /**
   * POST /api/events/:id/register
   * Registra al usuario autenticado en un evento
   */
  registerToEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const event = await this.eventService.registerToEvent(req.user.userId, { eventId: req.params.id });

      res.status(200).json({
        success: true,
        message: 'Successfully registered to event',
        data: event,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };

  /**
   * DELETE /api/events/:id/register
   * Cancela el registro del usuario autenticado en un evento
   */
  cancelRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const event = await this.eventService.cancelRegistration(req.user.userId, req.params.id);

      res.status(200).json({
        success: true,
        message: 'Registration cancelled successfully',
        data: event,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/events/:id/participants
   * Obtiene participantes de un evento (admin only)
   */
  getParticipants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const participants = await this.eventService.getEventParticipants(req.params.id);

      res.status(200).json({
        success: true,
        data: participants,
        count: participants.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 404));
      } else {
        next(error);
      }
    }
  };

  /**
   * POST /api/events/:id/attendance/:userId
   * Marca la asistencia de un usuario a un evento (admin only)
   */
  markAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id: eventId, userId } = req.params;

      const event = await this.eventService.markAttendance(eventId, userId);

      res.status(200).json({
        success: true,
        message: 'Attendance marked successfully',
        data: event,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/events/my
   * Obtiene eventos del usuario autenticado
   * Query params: status (draft, published, cancelled, completed)
   */
  getMyEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { status } = req.query;
      const eventStatus = status as string | undefined;

      const events = await this.eventService.getUserEvents(req.user.userId, eventStatus);

      res.status(200).json({
        success: true,
        data: events,
        count: events.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  };
}
