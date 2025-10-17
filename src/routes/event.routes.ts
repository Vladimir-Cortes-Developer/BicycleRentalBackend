import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authenticate, authorize, validateDto } from '../middlewares';
import { CreateEventDto, UpdateEventDto, RegisterToEventDto } from '../dtos';

const router = Router();
const eventController = new EventController();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - eventDate
 *               - startTime
 *               - regionalId
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 200
 *                 example: City Cycling Tour
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: A guided tour through the city parks and scenic routes
 *               eventType:
 *                 type: string
 *                 maxLength: 50
 *                 example: Tour
 *               eventDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-15
 *               startTime:
 *                 type: string
 *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                 example: 09:00
 *               endTime:
 *                 type: string
 *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                 example: 12:00
 *               routeDescription:
 *                 type: string
 *                 example: Starting from Central Park, through downtown, ending at riverside
 *               meetingPoint:
 *                 type: string
 *                 maxLength: 255
 *                 example: Central Park Main Entrance
 *               meetingPointLocation:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Point]
 *                     example: Point
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     minItems: 2
 *                     maxItems: 2
 *                     example: [-74.0060, 40.7128]
 *               maxParticipants:
 *                 type: number
 *                 minimum: 1
 *                 example: 20
 *               regionalId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               status:
 *                 type: string
 *                 enum: [draft, published, cancelled, completed]
 *                 example: published
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Event created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateDto(CreateEventDto),
  eventController.create
);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 200
 *                 example: City Cycling Tour - Updated
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Updated description for the cycling tour
 *               eventType:
 *                 type: string
 *                 maxLength: 50
 *                 example: Tour
 *               eventDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-20
 *               startTime:
 *                 type: string
 *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                 example: 10:00
 *               endTime:
 *                 type: string
 *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                 example: 13:00
 *               routeDescription:
 *                 type: string
 *                 example: Updated route description
 *               meetingPoint:
 *                 type: string
 *                 maxLength: 255
 *                 example: Central Park South Entrance
 *               meetingPointLocation:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Point]
 *                     example: Point
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     minItems: 2
 *                     maxItems: 2
 *                     example: [-74.0060, 40.7128]
 *               maxParticipants:
 *                 type: number
 *                 minimum: 1
 *                 example: 25
 *               regionalId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               status:
 *                 type: string
 *                 enum: [draft, published, cancelled, completed]
 *                 example: published
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Event updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateDto(UpdateEventDto),
  eventController.update
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Event deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', authenticate, authorize('admin'), eventController.delete);

/**
 * @swagger
 * /events/upcoming:
 *   get:
 *     summary: Get upcoming events
 *     tags: [Events]
 *     description: Retrieve all upcoming published events that haven't occurred yet
 *     responses:
 *       200:
 *         description: List of upcoming events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/upcoming', eventController.getUpcoming);

/**
 * @swagger
 * /events/my:
 *   get:
 *     summary: Get my registered events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all events the authenticated user has registered for
 *     responses:
 *       200:
 *         description: List of user's registered events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/my', authenticate, eventController.getMyEvents);

/**
 * @swagger
 * /events/{id}/participants:
 *   get:
 *     summary: Get event participants
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: List of event participants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439012
 *                       eventId:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       userId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439013
 *                           name:
 *                             type: string
 *                             example: John Doe
 *                           email:
 *                             type: string
 *                             example: john.doe@example.com
 *                       registrationDate:
 *                         type: string
 *                         format: date-time
 *                       attended:
 *                         type: boolean
 *                         example: false
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id/participants', authenticate, authorize('admin'), eventController.getParticipants);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', eventController.getById);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, cancelled, completed]
 *         description: Filter by event status
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *         description: Filter by event type
 *       - in: query
 *         name: regionalId
 *         schema:
 *           type: string
 *         description: Filter by regional ID
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                       example: 1
 *                     limit:
 *                       type: number
 *                       example: 10
 *                     total:
 *                       type: number
 *                       example: 50
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', eventController.getAll);

/**
 * @swagger
 * /events/{id}/register:
 *   post:
 *     summary: Register to an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Successfully registered to event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully registered to event
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     eventId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     userId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439013
 *                     registrationDate:
 *                       type: string
 *                       format: date-time
 *                     attended:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Bad request - User already registered or event is full
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               alreadyRegistered:
 *                 value:
 *                   success: false
 *                   message: User is already registered for this event
 *               eventFull:
 *                 value:
 *                   success: false
 *                   message: Event has reached maximum capacity
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/:id/register',
  authenticate,
  validateDto(RegisterToEventDto),
  eventController.registerToEvent
);

/**
 * @swagger
 * /events/{id}/register:
 *   delete:
 *     summary: Cancel event registration
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Registration cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registration cancelled successfully
 *       400:
 *         description: Bad request - User is not registered for this event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: User is not registered for this event
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id/register', authenticate, eventController.cancelRegistration);

/**
 * @swagger
 * /events/{id}/attendance/{userId}:
 *   post:
 *     summary: Mark participant attendance
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *         example: 507f1f77bcf86cd799439011
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the participant
 *         example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Attendance marked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Attendance marked successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     eventId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     userId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439013
 *                     registrationDate:
 *                       type: string
 *                       format: date-time
 *                     attended:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request - User is not registered for this event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: User is not registered for this event
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/:id/attendance/:userId', authenticate, authorize('admin'), eventController.markAttendance);

export default router;