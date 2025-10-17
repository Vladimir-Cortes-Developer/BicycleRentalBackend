import { Router } from 'express';
import { MaintenanceLogController } from '../controllers/MaintenanceLogController';
import { authenticate, authorize, validateDto } from '../middlewares';
import { CreateMaintenanceLogDto, UpdateMaintenanceLogDto } from '../dtos';

const router = Router();
const maintenanceLogController = new MaintenanceLogController();

/**
 * @swagger
 * /maintenance:
 *   post:
 *     summary: Create a new maintenance log
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bicycleId
 *               - maintenanceType
 *             properties:
 *               bicycleId:
 *                 type: string
 *                 description: MongoDB ObjectId of the bicycle
 *                 example: 507f1f77bcf86cd799439012
 *               maintenanceType:
 *                 type: string
 *                 enum: [preventive, corrective, inspection, repair, other]
 *                 example: preventive
 *               description:
 *                 type: string
 *                 example: Brake pad replacement and chain lubrication
 *               cost:
 *                 type: number
 *                 minimum: 0
 *                 example: 25.50
 *               performedBy:
 *                 type: string
 *                 maxLength: 150
 *                 example: John Mechanic
 *               maintenanceDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-15T10:00:00Z
 *               nextMaintenanceDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-15T10:00:00Z
 *     responses:
 *       201:
 *         description: Maintenance log created successfully
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
 *                   example: Maintenance log created successfully
 *                 data:
 *                   $ref: '#/components/schemas/MaintenanceLog'
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
  validateDto(CreateMaintenanceLogDto),
  maintenanceLogController.create
);

/**
 * @swagger
 * /maintenance/{id}:
 *   put:
 *     summary: Update a maintenance log
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance log ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bicycleId:
 *                 type: string
 *                 description: MongoDB ObjectId of the bicycle
 *                 example: 507f1f77bcf86cd799439012
 *               maintenanceType:
 *                 type: string
 *                 enum: [preventive, corrective, inspection, repair, other]
 *                 example: corrective
 *               description:
 *                 type: string
 *                 example: Updated description - tire replacement
 *               cost:
 *                 type: number
 *                 minimum: 0
 *                 example: 45.00
 *               performedBy:
 *                 type: string
 *                 maxLength: 150
 *                 example: Jane Technician
 *               maintenanceDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-15T14:00:00Z
 *               nextMaintenanceDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-15T10:00:00Z
 *     responses:
 *       200:
 *         description: Maintenance log updated successfully
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
 *                   example: Maintenance log updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/MaintenanceLog'
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
  validateDto(UpdateMaintenanceLogDto),
  maintenanceLogController.update
);

/**
 * @swagger
 * /maintenance/{id}:
 *   delete:
 *     summary: Delete a maintenance log
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance log ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Maintenance log deleted successfully
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
 *                   example: Maintenance log deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', authenticate, authorize('admin'), maintenanceLogController.delete);

/**
 * @swagger
 * /maintenance/upcoming:
 *   get:
 *     summary: Get upcoming maintenance logs
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all maintenance logs scheduled for future dates
 *     responses:
 *       200:
 *         description: List of upcoming maintenance logs
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
 *                     $ref: '#/components/schemas/MaintenanceLog'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/upcoming', authenticate, authorize('admin'), maintenanceLogController.getUpcoming);

/**
 * @swagger
 * /maintenance/overdue:
 *   get:
 *     summary: Get overdue maintenance logs
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all maintenance logs that are past their scheduled date
 *     responses:
 *       200:
 *         description: List of overdue maintenance logs
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
 *                     $ref: '#/components/schemas/MaintenanceLog'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/overdue', authenticate, authorize('admin'), maintenanceLogController.getOverdue);

/**
 * @swagger
 * /maintenance/stats:
 *   get:
 *     summary: Get maintenance statistics
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve statistical information about maintenance logs
 *     responses:
 *       200:
 *         description: Maintenance statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalLogs:
 *                       type: number
 *                       example: 150
 *                     totalCost:
 *                       type: number
 *                       example: 5250.75
 *                     byType:
 *                       type: object
 *                       properties:
 *                         preventive:
 *                           type: number
 *                           example: 60
 *                         corrective:
 *                           type: number
 *                           example: 50
 *                         inspection:
 *                           type: number
 *                           example: 25
 *                         repair:
 *                           type: number
 *                           example: 10
 *                         other:
 *                           type: number
 *                           example: 5
 *                     upcoming:
 *                       type: number
 *                       example: 20
 *                     overdue:
 *                       type: number
 *                       example: 8
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/stats', authenticate, authorize('admin'), maintenanceLogController.getStats);

/**
 * @swagger
 * /maintenance/bicycle/{bicycleId}:
 *   get:
 *     summary: Get maintenance logs by bicycle
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bicycleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Bicycle ID
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: List of maintenance logs for the specified bicycle
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
 *                     $ref: '#/components/schemas/MaintenanceLog'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/bicycle/:bicycleId', authenticate, authorize('admin'), maintenanceLogController.getByBicycle);

/**
 * @swagger
 * /maintenance/{id}:
 *   get:
 *     summary: Get maintenance log by ID
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance log ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Maintenance log details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MaintenanceLog'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', authenticate, authorize('admin'), maintenanceLogController.getById);

/**
 * @swagger
 * /maintenance:
 *   get:
 *     summary: Get all maintenance logs
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
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
 *         name: maintenanceType
 *         schema:
 *           type: string
 *           enum: [preventive, corrective, inspection, repair, other]
 *         description: Filter by maintenance type
 *       - in: query
 *         name: bicycleId
 *         schema:
 *           type: string
 *         description: Filter by bicycle ID
 *     responses:
 *       200:
 *         description: List of all maintenance logs
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
 *                     $ref: '#/components/schemas/MaintenanceLog'
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
 *                       example: 150
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', authenticate, authorize('admin'), maintenanceLogController.getAll);

/**
 * @swagger
 * /maintenance/{id}/complete:
 *   post:
 *     summary: Complete a maintenance log
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance log ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completionNotes:
 *                 type: string
 *                 example: Maintenance completed successfully. All parts replaced.
 *               actualCost:
 *                 type: number
 *                 minimum: 0
 *                 example: 30.00
 *     responses:
 *       200:
 *         description: Maintenance log marked as completed
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
 *                   example: Maintenance completed successfully
 *                 data:
 *                   $ref: '#/components/schemas/MaintenanceLog'
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
router.post('/:id/complete', authenticate, authorize('admin'), maintenanceLogController.completeMaintenance);

export default router;