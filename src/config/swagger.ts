import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bicycle Rental API',
      version: '1.0.0',
      description: 'Complete API documentation for the Bicycle Rental System',
      contact: {
        name: 'API Support',
        url: 'https://github.com/Vladimir-Cortes-Developer/BicycleRentalBackend',
        email: 'support@bicyclerental.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: config.nodeEnv === 'production'
          ? `${process.env.API_BASE_URL || 'https://your-app.azurewebsites.net'}/api`
          : `http://localhost:${config.port}/api`,
        description: config.nodeEnv === 'production' ? 'Production server (Azure)' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Enter: Bearer YOUR_TOKEN_HERE (include "Bearer " prefix). Get your token from /auth/login or /auth/register endpoint.',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message description',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    example: 'Invalid email format',
                  },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
            },
            regionalId: {
              type: 'string',
              example: 'REG001',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Bicycle: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            model: {
              type: 'string',
              example: 'Mountain Bike Pro',
            },
            type: {
              type: 'string',
              enum: ['mountain', 'road', 'hybrid', 'electric'],
              example: 'mountain',
            },
            status: {
              type: 'string',
              enum: ['available', 'rented', 'maintenance', 'retired'],
              example: 'available',
            },
            location: {
              type: 'string',
              example: 'Station A',
            },
            pricePerHour: {
              type: 'number',
              example: 5.99,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Rental: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            userId: {
              type: 'string',
              example: '507f1f77bcf86cd799439012',
            },
            bicycleId: {
              type: 'string',
              example: '507f1f77bcf86cd799439013',
            },
            startTime: {
              type: 'string',
              format: 'date-time',
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            totalCost: {
              type: 'number',
              example: 15.99,
              nullable: true,
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'cancelled'],
              example: 'active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Event: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'City Cycling Tour',
            },
            description: {
              type: 'string',
              example: 'A guided tour through the city parks',
            },
            date: {
              type: 'string',
              format: 'date-time',
            },
            location: {
              type: 'string',
              example: 'Central Park',
            },
            maxParticipants: {
              type: 'number',
              example: 20,
            },
            participantsCount: {
              type: 'number',
              example: 15,
            },
            status: {
              type: 'string',
              enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
              example: 'upcoming',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        MaintenanceLog: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            bicycleId: {
              type: 'string',
              example: '507f1f77bcf86cd799439012',
            },
            description: {
              type: 'string',
              example: 'Brake pad replacement',
            },
            cost: {
              type: 'number',
              example: 25.50,
            },
            performedBy: {
              type: 'string',
              example: 'John Mechanic',
            },
            performedAt: {
              type: 'string',
              format: 'date-time',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Regional: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'SENA Regional Antioquia',
            },
            city: {
              type: 'string',
              example: 'Medellín',
            },
            department: {
              type: 'string',
              example: 'Antioquia',
            },
            address: {
              type: 'string',
              example: 'Calle 52 No. 2-13',
              nullable: true,
            },
            location: {
              type: 'object',
              nullable: true,
              properties: {
                type: {
                  type: 'string',
                  enum: ['Point'],
                  example: 'Point',
                },
                coordinates: {
                  type: 'array',
                  items: {
                    type: 'number',
                  },
                  minItems: 2,
                  maxItems: 2,
                  example: [-75.5635, 6.2476],
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Unauthorized - Invalid or missing token',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'User does not have permission to access this resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Forbidden - Insufficient permissions',
              },
            },
          },
        },
        NotFoundError: {
          description: 'The requested resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Resource not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Invalid request data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Internal server error',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and registration endpoints',
      },
      {
        name: 'Bicycles',
        description: 'Bicycle management operations',
      },
      {
        name: 'Rentals',
        description: 'Bicycle rental operations',
      },
      {
        name: 'Events',
        description: 'Event management and participation',
      },
      {
        name: 'Maintenance',
        description: 'Bicycle maintenance logging',
      },
      {
        name: 'Reports',
        description: 'Analytics and reporting endpoints',
      },
      {
        name: 'Health',
        description: 'System health check',
      },
      {
        name: 'Regionals',
        description: 'Regional SENA offices management',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);