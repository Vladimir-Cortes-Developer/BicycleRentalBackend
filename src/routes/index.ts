import { Router } from 'express';
import authRoutes from './auth.routes';
import bicycleRoutes from './bicycle.routes';
import rentalRoutes from './rental.routes';
import eventRoutes from './event.routes';
import maintenanceRoutes from './maintenance.routes';
import reportRoutes from './report.routes';
import regionalRoutes from './regional.routes';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Check if the API server is running and responsive
 *     responses:
 *       200:
 *         description: Server is running successfully
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
 *                   example: Server is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-10-15T14:30:00.000Z
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/bicycles', bicycleRoutes);
router.use('/rentals', rentalRoutes);
router.use('/events', eventRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/reports', reportRoutes);
router.use('/regionals', regionalRoutes);

export default router;
