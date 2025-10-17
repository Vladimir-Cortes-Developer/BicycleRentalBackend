import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authenticate, authorize } from '../middlewares';

const router = Router();
const reportController = new ReportController();

/**
 * @swagger
 * /reports/revenue/monthly:
 *   get:
 *     summary: Get monthly revenue report
 *     description: Retrieves revenue statistics grouped by month. Admin only.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by specific year
 *         example: 2024
 *       - in: query
 *         name: startMonth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Starting month (1-12)
 *         example: 1
 *       - in: query
 *         name: endMonth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Ending month (1-12)
 *         example: 12
 *     responses:
 *       200:
 *         description: Monthly revenue data retrieved successfully
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
 *                       month:
 *                         type: string
 *                         example: "2024-01"
 *                       monthName:
 *                         type: string
 *                         example: "January 2024"
 *                       totalRevenue:
 *                         type: number
 *                         example: 45250.75
 *                       rentalsCount:
 *                         type: number
 *                         example: 324
 *                       averageRevenuePerRental:
 *                         type: number
 *                         example: 139.66
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: number
 *                       example: 542109.00
 *                     totalRentals:
 *                       type: number
 *                       example: 3892
 *                     averageMonthlyRevenue:
 *                       type: number
 *                       example: 45175.75
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/revenue/monthly', authenticate, authorize('admin'), reportController.getMonthlyRevenue);

/**
 * @swagger
 * /reports/revenue/range:
 *   get:
 *     summary: Get revenue by date range
 *     description: Retrieves revenue statistics for a specific date range with daily breakdown. Admin only.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *         example: "2024-12-31"
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: day
 *         description: Grouping interval for results
 *         example: day
 *     responses:
 *       200:
 *         description: Revenue data for date range retrieved successfully
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
 *                     dateRange:
 *                       type: object
 *                       properties:
 *                         startDate:
 *                           type: string
 *                           format: date
 *                           example: "2024-01-01"
 *                         endDate:
 *                           type: string
 *                           format: date
 *                           example: "2024-12-31"
 *                     totalRevenue:
 *                       type: number
 *                       example: 542109.00
 *                     totalRentals:
 *                       type: number
 *                       example: 3892
 *                     averageRevenuePerRental:
 *                       type: number
 *                       example: 139.30
 *                     dailyBreakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                             example: "2024-01-15"
 *                           revenue:
 *                             type: number
 *                             example: 1850.50
 *                           rentalsCount:
 *                             type: number
 *                             example: 13
 *                     chartData:
 *                       type: object
 *                       properties:
 *                         labels:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["2024-01-01", "2024-01-02", "2024-01-03"]
 *                         datasets:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               label:
 *                                 type: string
 *                                 example: "Revenue"
 *                               data:
 *                                 type: array
 *                                 items:
 *                                   type: number
 *                                 example: [1850.50, 2103.25, 1678.00]
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/revenue/range', authenticate, authorize('admin'), reportController.getRevenueByDateRange);

/**
 * @swagger
 * /reports/revenue/regional:
 *   get:
 *     summary: Get revenue by regional
 *     description: Retrieves revenue statistics grouped by regional/region. Admin only.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter until end date (YYYY-MM-DD)
 *         example: "2024-12-31"
 *       - in: query
 *         name: regionalId
 *         schema:
 *           type: string
 *         description: Filter by specific regional ID
 *         example: "REG001"
 *     responses:
 *       200:
 *         description: Revenue data by regional retrieved successfully
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
 *                       regionalId:
 *                         type: string
 *                         example: "REG001"
 *                       regionalName:
 *                         type: string
 *                         example: "North Region"
 *                       totalRevenue:
 *                         type: number
 *                         example: 125430.50
 *                       rentalsCount:
 *                         type: number
 *                         example: 892
 *                       activeUsers:
 *                         type: number
 *                         example: 234
 *                       averageRevenuePerRental:
 *                         type: number
 *                         example: 140.66
 *                       percentageOfTotal:
 *                         type: number
 *                         example: 23.14
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: number
 *                       example: 542109.00
 *                     totalRentals:
 *                       type: number
 *                       example: 3892
 *                     topRegional:
 *                       type: object
 *                       properties:
 *                         regionalId:
 *                           type: string
 *                           example: "REG001"
 *                         regionalName:
 *                           type: string
 *                           example: "North Region"
 *                         revenue:
 *                           type: number
 *                           example: 125430.50
 *                 chartData:
 *                   type: object
 *                   properties:
 *                     labels:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["North Region", "South Region", "East Region"]
 *                     datasets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                             example: "Revenue by Region"
 *                           data:
 *                             type: array
 *                             items:
 *                               type: number
 *                             example: [125430.50, 98234.75, 87654.25]
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/revenue/regional', authenticate, authorize('admin'), reportController.getRevenueByRegional);

/**
 * @swagger
 * /reports/bicycles/most-rented:
 *   get:
 *     summary: Get most rented bicycles
 *     description: Retrieves statistics of the most frequently rented bicycles. Admin only.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of top bicycles to return
 *         example: 10
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter until end date (YYYY-MM-DD)
 *         example: "2024-12-31"
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [mountain, road, hybrid, electric]
 *         description: Filter by bicycle type
 *         example: mountain
 *     responses:
 *       200:
 *         description: Most rented bicycles data retrieved successfully
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
 *                       bicycleId:
 *                         type: string
 *                         example: "507f1f77bcf86cd799439011"
 *                       bicycleCode:
 *                         type: string
 *                         example: "BIC001"
 *                       model:
 *                         type: string
 *                         example: "Mountain Bike Pro"
 *                       type:
 *                         type: string
 *                         example: "mountain"
 *                       totalRentals:
 *                         type: number
 *                         example: 156
 *                       totalRevenue:
 *                         type: number
 *                         example: 23450.50
 *                       averageRentalDuration:
 *                         type: number
 *                         description: Average rental duration in hours
 *                         example: 3.5
 *                       totalHoursRented:
 *                         type: number
 *                         example: 546.0
 *                       utilizationRate:
 *                         type: number
 *                         description: Percentage of time the bicycle was rented
 *                         example: 68.5
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalBicyclesAnalyzed:
 *                       type: number
 *                       example: 78
 *                     totalRentalsInPeriod:
 *                       type: number
 *                       example: 3892
 *                     averageRentalsPerBicycle:
 *                       type: number
 *                       example: 49.9
 *                 chartData:
 *                   type: object
 *                   properties:
 *                     labels:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["BIC001", "BIC023", "BIC045"]
 *                     datasets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                             example: "Number of Rentals"
 *                           data:
 *                             type: array
 *                             items:
 *                               type: number
 *                             example: [156, 142, 138]
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/bicycles/most-rented', authenticate, authorize('admin'), reportController.getMostRentedBicycles);

/**
 * @swagger
 * /reports/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieves comprehensive dashboard statistics including overview metrics, recent activity, and key performance indicators. Admin only.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, week, month, year, all]
 *           default: month
 *         description: Time period for statistics
 *         example: month
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
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
 *                     overview:
 *                       type: object
 *                       properties:
 *                         totalRevenue:
 *                           type: number
 *                           example: 45250.75
 *                         revenueGrowth:
 *                           type: number
 *                           description: Percentage growth compared to previous period
 *                           example: 12.5
 *                         totalRentals:
 *                           type: number
 *                           example: 324
 *                         rentalsGrowth:
 *                           type: number
 *                           example: 8.3
 *                         activeUsers:
 *                           type: number
 *                           example: 156
 *                         usersGrowth:
 *                           type: number
 *                           example: 15.7
 *                         totalBicycles:
 *                           type: number
 *                           example: 78
 *                     bicycleStatus:
 *                       type: object
 *                       properties:
 *                         available:
 *                           type: number
 *                           example: 45
 *                         rented:
 *                           type: number
 *                           example: 23
 *                         maintenance:
 *                           type: number
 *                           example: 7
 *                         retired:
 *                           type: number
 *                           example: 3
 *                     recentActivity:
 *                       type: object
 *                       properties:
 *                         recentRentals:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               rentalId:
 *                                 type: string
 *                                 example: "507f1f77bcf86cd799439011"
 *                               userName:
 *                                 type: string
 *                                 example: "John Doe"
 *                               bicycleCode:
 *                                 type: string
 *                                 example: "BIC001"
 *                               startTime:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2024-01-15T14:30:00Z"
 *                               status:
 *                                 type: string
 *                                 example: "active"
 *                         recentRegistrations:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               userId:
 *                                 type: string
 *                                 example: "507f1f77bcf86cd799439012"
 *                               name:
 *                                 type: string
 *                                 example: "Jane Smith"
 *                               email:
 *                                 type: string
 *                                 example: "jane@example.com"
 *                               registeredAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2024-01-15T10:20:00Z"
 *                     revenueChart:
 *                       type: object
 *                       properties:
 *                         labels:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Week 1", "Week 2", "Week 3", "Week 4"]
 *                         datasets:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               label:
 *                                 type: string
 *                                 example: "Revenue"
 *                               data:
 *                                 type: array
 *                                 items:
 *                                   type: number
 *                                 example: [10250.50, 11430.25, 12050.00, 11520.00]
 *                     topMetrics:
 *                       type: object
 *                       properties:
 *                         averageRentalDuration:
 *                           type: number
 *                           example: 3.5
 *                         averageRevenuePerRental:
 *                           type: number
 *                           example: 139.66
 *                         customerSatisfaction:
 *                           type: number
 *                           example: 4.7
 *                         bicycleUtilizationRate:
 *                           type: number
 *                           example: 62.3
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/dashboard', authenticate, authorize('admin'), reportController.getDashboardStats);

/**
 * @swagger
 * /reports/users/stratum:
 *   get:
 *     summary: Get users by stratum
 *     description: Retrieves user distribution and statistics grouped by socioeconomic stratum. Admin only.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: regionalId
 *         schema:
 *           type: string
 *         description: Filter by specific regional ID
 *         example: "REG001"
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include inactive users in the report
 *         example: false
 *     responses:
 *       200:
 *         description: Users by stratum data retrieved successfully
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
 *                       stratum:
 *                         type: number
 *                         example: 3
 *                       stratumName:
 *                         type: string
 *                         example: "Middle Class"
 *                       userCount:
 *                         type: number
 *                         example: 234
 *                       percentageOfTotal:
 *                         type: number
 *                         example: 32.5
 *                       totalRentals:
 *                         type: number
 *                         example: 1245
 *                       totalRevenue:
 *                         type: number
 *                         example: 87653.25
 *                       averageRentalsPerUser:
 *                         type: number
 *                         example: 5.3
 *                       averageRevenuePerUser:
 *                         type: number
 *                         example: 374.58
 *                       discountApplied:
 *                         type: number
 *                         example: 8765.50
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                       example: 720
 *                     totalRentals:
 *                       type: number
 *                       example: 3892
 *                     totalRevenue:
 *                       type: number
 *                       example: 542109.00
 *                     totalDiscounts:
 *                       type: number
 *                       example: 54210.90
 *                     mostCommonStratum:
 *                       type: object
 *                       properties:
 *                         stratum:
 *                           type: number
 *                           example: 3
 *                         userCount:
 *                           type: number
 *                           example: 234
 *                 chartData:
 *                   type: object
 *                   properties:
 *                     labels:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Stratum 1", "Stratum 2", "Stratum 3", "Stratum 4", "Stratum 5", "Stratum 6"]
 *                     datasets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                             example: "User Distribution"
 *                           data:
 *                             type: array
 *                             items:
 *                               type: number
 *                             example: [85, 142, 234, 178, 65, 16]
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/users/stratum', authenticate, authorize('admin'), reportController.getUsersByStratum);

/**
 * @swagger
 * /reports/discounts:
 *   get:
 *     summary: Get discount report
 *     description: Retrieves comprehensive report on discounts applied, including breakdown by stratum and discount type. Admin only.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from start date (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter until end date (YYYY-MM-DD)
 *         example: "2024-12-31"
 *       - in: query
 *         name: regionalId
 *         schema:
 *           type: string
 *         description: Filter by specific regional ID
 *         example: "REG001"
 *       - in: query
 *         name: stratum
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 6
 *         description: Filter by specific stratum
 *         example: 1
 *     responses:
 *       200:
 *         description: Discount report data retrieved successfully
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
 *                     byStratum:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           stratum:
 *                             type: number
 *                             example: 1
 *                           stratumName:
 *                             type: string
 *                             example: "Low Income"
 *                           discountPercentage:
 *                             type: number
 *                             example: 30
 *                           totalDiscountAmount:
 *                             type: number
 *                             example: 25631.50
 *                           rentalsWithDiscount:
 *                             type: number
 *                             example: 456
 *                           totalRevenueLost:
 *                             type: number
 *                             example: 25631.50
 *                           averageDiscountPerRental:
 *                             type: number
 *                             example: 56.21
 *                     byRegional:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           regionalId:
 *                             type: string
 *                             example: "REG001"
 *                           regionalName:
 *                             type: string
 *                             example: "North Region"
 *                           totalDiscountAmount:
 *                             type: number
 *                             example: 15234.75
 *                           rentalsWithDiscount:
 *                             type: number
 *                             example: 234
 *                     byMonth:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                             example: "2024-01"
 *                           monthName:
 *                             type: string
 *                             example: "January 2024"
 *                           totalDiscountAmount:
 *                             type: number
 *                             example: 4517.25
 *                           rentalsWithDiscount:
 *                             type: number
 *                             example: 67
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalDiscountAmount:
 *                           type: number
 *                           example: 54210.90
 *                         totalRentalsWithDiscount:
 *                           type: number
 *                           example: 1456
 *                         totalRentals:
 *                           type: number
 *                           example: 3892
 *                         percentageRentalsWithDiscount:
 *                           type: number
 *                           example: 37.4
 *                         averageDiscountPerRental:
 *                           type: number
 *                           example: 37.23
 *                         totalPotentialRevenue:
 *                           type: number
 *                           example: 596319.90
 *                         actualRevenue:
 *                           type: number
 *                           example: 542109.00
 *                         discountImpactPercentage:
 *                           type: number
 *                           example: 9.09
 *                 chartData:
 *                   type: object
 *                   properties:
 *                     discountsByStratum:
 *                       type: object
 *                       properties:
 *                         labels:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Stratum 1", "Stratum 2", "Stratum 3"]
 *                         datasets:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               label:
 *                                 type: string
 *                                 example: "Discount Amount"
 *                               data:
 *                                 type: array
 *                                 items:
 *                                   type: number
 *                                 example: [25631.50, 18754.25, 9825.15]
 *                     monthlyTrend:
 *                       type: object
 *                       properties:
 *                         labels:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Jan 2024", "Feb 2024", "Mar 2024"]
 *                         datasets:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               label:
 *                                 type: string
 *                                 example: "Monthly Discounts"
 *                               data:
 *                                 type: array
 *                                 items:
 *                                   type: number
 *                                 example: [4517.25, 4823.50, 5102.75]
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/discounts', authenticate, authorize('admin'), reportController.getDiscountReport);

export default router;
