import { Router } from 'express';
import { RegionalController } from '../controllers/RegionalController';
import { authenticate, authorize, validateDto } from '../middlewares';
import { CreateRegionalDto, UpdateRegionalDto } from '../dtos';

const router = Router();
const regionalController = new RegionalController();

/**
 * @swagger
 * /regionals:
 *   post:
 *     summary: Create a new regional
 *     tags: [Regionals]
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
 *               - city
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *                 example: SENA Regional Antioquia
 *               city:
 *                 type: string
 *                 example: Medellín
 *               department:
 *                 type: string
 *                 example: Antioquia
 *               address:
 *                 type: string
 *                 example: Calle 52 No. 2-13
 *               location:
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
 *                     example: [-75.5635, 6.2476]
 *     responses:
 *       201:
 *         description: Regional created successfully
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
 *                   example: Regional created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Regional'
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
  validateDto(CreateRegionalDto),
  regionalController.create
);

/**
 * @swagger
 * /regionals:
 *   get:
 *     summary: Get all regionals
 *     tags: [Regionals]
 *     responses:
 *       200:
 *         description: List of regionals
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
 *                     $ref: '#/components/schemas/Regional'
 *                 count:
 *                   type: number
 *                   example: 10
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', regionalController.getAll);

/**
 * @swagger
 * /regionals/nearby:
 *   get:
 *     summary: Find nearby regionals
 *     tags: [Regionals]
 *     parameters:
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: User's longitude
 *         example: -75.5635
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: User's latitude
 *         example: 6.2476
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *           default: 50000
 *         description: Maximum distance in meters (default 50km)
 *         example: 50000
 *     responses:
 *       200:
 *         description: List of nearby regionals
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
 *                     $ref: '#/components/schemas/Regional'
 *                 count:
 *                   type: number
 *                   example: 3
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/nearby', regionalController.getNearby);

/**
 * @swagger
 * /regionals/stats/count:
 *   get:
 *     summary: Get total count of regionals
 *     tags: [Regionals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total count of regionals
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
 *                     count:
 *                       type: number
 *                       example: 10
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/stats/count', authenticate, authorize('admin'), regionalController.getCount);

/**
 * @swagger
 * /regionals/city/{city}:
 *   get:
 *     summary: Get regionals by city
 *     tags: [Regionals]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name
 *         example: Medellín
 *     responses:
 *       200:
 *         description: List of regionals in the city
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
 *                     $ref: '#/components/schemas/Regional'
 *                 count:
 *                   type: number
 *                   example: 2
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/city/:city', regionalController.getByCity);

/**
 * @swagger
 * /regionals/department/{department}:
 *   get:
 *     summary: Get regionals by department
 *     tags: [Regionals]
 *     parameters:
 *       - in: path
 *         name: department
 *         required: true
 *         schema:
 *           type: string
 *         description: Department name
 *         example: Antioquia
 *     responses:
 *       200:
 *         description: List of regionals in the department
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
 *                     $ref: '#/components/schemas/Regional'
 *                 count:
 *                   type: number
 *                   example: 3
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/department/:department', regionalController.getByDepartment);

/**
 * @swagger
 * /regionals/{id}:
 *   get:
 *     summary: Get regional by ID
 *     tags: [Regionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Regional ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Regional details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Regional'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', regionalController.getById);

/**
 * @swagger
 * /regionals/{id}:
 *   put:
 *     summary: Update regional
 *     tags: [Regionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Regional ID
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
 *                 example: SENA Regional Antioquia
 *               city:
 *                 type: string
 *                 example: Medellín
 *               department:
 *                 type: string
 *                 example: Antioquia
 *               address:
 *                 type: string
 *                 example: Calle 52 No. 2-13
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Point]
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     minItems: 2
 *                     maxItems: 2
 *     responses:
 *       200:
 *         description: Regional updated successfully
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
 *                   example: Regional updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Regional'
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
  validateDto(UpdateRegionalDto),
  regionalController.update
);

/**
 * @swagger
 * /regionals/{id}:
 *   delete:
 *     summary: Delete regional
 *     tags: [Regionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Regional ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Regional deleted successfully
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
 *                   example: Regional deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', authenticate, authorize('admin'), regionalController.delete);

export default router;