import { Router } from 'express';
import { BicycleController } from '../controllers/BicycleController';
import { authenticate, authorize, validateDto } from '../middlewares';
import { CreateBicycleDto, UpdateBicycleDto } from '../dtos';

const router = Router();
const bicycleController = new BicycleController();

/**
 * @swagger
 * /bicycles:
 *   post:
 *     summary: Create a new bicycle
 *     tags: [Bicycles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - model
 *               - type
 *               - location
 *               - pricePerHour
 *             properties:
 *               model:
 *                 type: string
 *                 example: Mountain Bike Pro
 *               type:
 *                 type: string
 *                 enum: [mountain, road, hybrid, electric]
 *                 example: mountain
 *               location:
 *                 type: string
 *                 example: Station A
 *               pricePerHour:
 *                 type: number
 *                 example: 5.99
 *     responses:
 *       201:
 *         description: Bicycle created successfully
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
 *                   example: Bicycle created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Bicycle'
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
  validateDto(CreateBicycleDto),
  bicycleController.create
);

/**
 * @swagger
 * /bicycles/available:
 *   get:
 *     summary: Get all available bicycles
 *     tags: [Bicycles]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [mountain, road, hybrid, electric]
 *         description: Filter by bicycle type
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *     responses:
 *       200:
 *         description: List of available bicycles
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
 *                     $ref: '#/components/schemas/Bicycle'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/available', bicycleController.getAvailable);

/**
 * @swagger
 * /bicycles/nearby:
 *   get:
 *     summary: Find nearby bicycles
 *     tags: [Bicycles]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: User's latitude
 *         example: 40.7128
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: User's longitude
 *         example: -74.0060
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5
 *         description: Search radius in kilometers
 *         example: 5
 *     responses:
 *       200:
 *         description: List of nearby bicycles
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
 *                     $ref: '#/components/schemas/Bicycle'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/nearby', bicycleController.getNearby);

/**
 * @swagger
 * /bicycles/stats/count-by-status:
 *   get:
 *     summary: Get bicycle count by status
 *     tags: [Bicycles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bicycle count by status
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
 *                     available:
 *                       type: number
 *                       example: 45
 *                     rented:
 *                       type: number
 *                       example: 23
 *                     maintenance:
 *                       type: number
 *                       example: 7
 *                     retired:
 *                       type: number
 *                       example: 3
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/stats/count-by-status',
  authenticate,
  authorize('admin'),
  bicycleController.getCountByStatus
);

/**
 * @swagger
 * /bicycles/code/{code}:
 *   get:
 *     summary: Get bicycle by code
 *     tags: [Bicycles]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Bicycle code
 *         example: BIC001
 *     responses:
 *       200:
 *         description: Bicycle details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Bicycle'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/code/:code', bicycleController.getByCode);

/**
 * @swagger
 * /bicycles/{id}:
 *   get:
 *     summary: Get bicycle by ID
 *     tags: [Bicycles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bicycle ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Bicycle details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Bicycle'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', bicycleController.getById);

/**
 * @swagger
 * /bicycles:
 *   get:
 *     summary: Get all bicycles
 *     tags: [Bicycles]
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
 *           enum: [available, rented, maintenance, retired]
 *         description: Filter by status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [mountain, road, hybrid, electric]
 *         description: Filter by type
 *     responses:
 *       200:
 *         description: List of bicycles
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
 *                     $ref: '#/components/schemas/Bicycle'
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
 *                       example: 100
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', bicycleController.getAll);

/**
 * @swagger
 * /bicycles/{id}:
 *   put:
 *     summary: Update bicycle
 *     tags: [Bicycles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bicycle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [mountain, road, hybrid, electric]
 *               location:
 *                 type: string
 *               pricePerHour:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bicycle updated successfully
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
 *                   example: Bicycle updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Bicycle'
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
  validateDto(UpdateBicycleDto),
  bicycleController.update
);

/**
 * @swagger
 * /bicycles/{id}/status:
 *   patch:
 *     summary: Update bicycle status
 *     tags: [Bicycles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bicycle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, rented, maintenance, retired]
 *                 example: maintenance
 *     responses:
 *       200:
 *         description: Bicycle status updated successfully
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
 *                   example: Bicycle status updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Bicycle'
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
router.patch('/:id/status', authenticate, authorize('admin'), bicycleController.updateStatus);

/**
 * @swagger
 * /bicycles/{id}/location:
 *   patch:
 *     summary: Update bicycle location
 *     tags: [Bicycles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bicycle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *             properties:
 *               location:
 *                 type: string
 *                 example: Station B
 *     responses:
 *       200:
 *         description: Bicycle location updated successfully
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
 *                   example: Bicycle location updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Bicycle'
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
router.patch('/:id/location', authenticate, authorize('admin'), bicycleController.updateLocation);

/**
 * @swagger
 * /bicycles/{id}:
 *   delete:
 *     summary: Delete bicycle
 *     tags: [Bicycles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bicycle ID
 *     responses:
 *       200:
 *         description: Bicycle deleted successfully
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
 *                   example: Bicycle deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', authenticate, authorize('admin'), bicycleController.delete);

export default router;
