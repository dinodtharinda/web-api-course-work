const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sri Lanka Police Tuk-Tuk Tracking API',
      version: '1.0.0',
      description:
        'A RESTful web service for real-time GPS tracking and movement logging of tuk-tuks (three-wheelers) for law enforcement operations.',
      contact: {
        name: 'API Support',
        url: 'https://github.com/dinodtharinda/web-api-course-work',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com/api',
        description: 'Production server (configure on deployment)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            statusCode: { type: 'integer', example: 200 },
            data: { type: 'object' },
            message: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            statusCode: { type: 'integer', example: 400 },
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'station_officer', 'device'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Province: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
          },
        },
        District: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            province_id: { type: 'integer' },
          },
        },
        PoliceStation: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            code: { type: 'string' },
            district_id: { type: 'integer' },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            registration_no: { type: 'string' },
            owner_name: { type: 'string' },
            owner_contact: { type: 'string' },
            description: { type: 'string' },
          },
        },
        LocationPing: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            registration_no: { type: 'string' },
            device_id: { type: 'string' },
            latitude: { type: 'number', format: 'double' },
            longitude: { type: 'number', format: 'double' },
            accuracy: { type: 'number' },
            speed: { type: 'number' },
            heading: { type: 'number' },
            timestamp: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        TrackingHistory: {
          type: 'object',
          properties: {
            registration_no: { type: 'string' },
            total_pings: { type: 'integer' },
            pings: {
              type: 'array',
              items: { $ref: '#/components/schemas/LocationPing' },
            },
          },
        },
      },
    },
  },
  apis: [
    './src/routes/auth.route.js',
    './src/routes/locations.route.js',
    './src/routes/tracking.route.js',
    './src/routes/vehicles.route.js',
    './src/routes/stations.route.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
