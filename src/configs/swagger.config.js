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
        ErrorResponse: {
          "type": "object",
          "properties": {
            "success": {
              "type": "boolean",
              "example": false
            },
            "message": {
              "type": "string"
            },
            "errors": {
              "type": "object",
              "additionalProperties": true
            },
            "meta": {
              "type": "object",
              "properties": {
                "path": {
                  "type": "string"
                },
                "method": {
                  "type": "string"
                }
              }
            }
          }
        },
        ListMeta: {
          "type": "object",
          "properties": {
            "page": {
              "type": "integer"
            },
            "pageSize": {
              "type": "integer"
            },
            "total": {
              "type": "integer"
            },
            "totalPages": {
              "type": "integer"
            },
            "sortBy": {
              "type": "string"
            },
            "sortOrder": {
              "type": "string",
              "enum": [
                "ASC",
                "DESC"
              ]
            },
            "search": {
              "type": "string",
              "nullable": true
            }
          }
        },
        AuthToken: {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string",
              "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            },
            "tokenType": {
              "type": "string",
              "example": "Bearer"
            },
            "expiresIn": {
              "type": "string",
              "example": "1h"
            }
          }
        },
        User: {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "firstName": {
              "type": "string"
            },
            "lastName": {
              "type": "string"
            },
            "email": {
              "type": "string",
              "format": "email"
            },
            "role": {
              "type": "string",
              "enum": [
                "admin",
                "station",
                "viewer"
              ]
            },
            "isActive": {
              "type": "boolean"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        Province: {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "name": {
              "type": "string"
            },
            "code": {
              "type": "string"
            },
            "districts": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/District"
              }
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        District: {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "provinceId": {
              "type": "integer"
            },
            "name": {
              "type": "string"
            },
            "code": {
              "type": "string"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        PoliceStation: {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "districtId": {
              "type": "integer"
            },
            "name": {
              "type": "string"
            },
            "code": {
              "type": "string"
            },
            "district": {
              "$ref": "#/components/schemas/District"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        TrackingDevice: {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "vehicleId": {
              "type": "integer"
            },
            "deviceSerial": {
              "type": "string"
            },
            "isActive": {
              "type": "boolean"
            },
            "vehicle": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "integer"
                },
                "registrationNo": {
                  "type": "string"
                },
                "ownerName": {
                  "type": "string"
                },
                "districtId": {
                  "type": "integer"
                },
                "isActive": {
                  "type": "boolean"
                }
              }
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        Vehicle: {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "registrationNo": {
              "type": "string"
            },
            "ownerName": {
              "type": "string"
            },
            "districtId": {
              "type": "integer"
            },
            "isActive": {
              "type": "boolean"
            },
            "district": {
              "$ref": "#/components/schemas/District"
            },
            "trackingDevice": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "integer"
                },
                "deviceSerial": {
                  "type": "string"
                },
                "isActive": {
                  "type": "boolean"
                },
                "createdAt": {
                  "type": "string",
                  "format": "date-time"
                },
                "updatedAt": {
                  "type": "string",
                  "format": "date-time"
                }
              }
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        LocationPing: {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "vehicleId": {
              "type": "integer"
            },
            "latitude": {
              "type": "number"
            },
            "longitude": {
              "type": "number"
            },
            "recordedAt": {
              "type": "string",
              "format": "date-time"
            },
            "sourceType": {
              "type": "string"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        LatestLocation: {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "vehicleId": {
              "type": "integer"
            },
            "registrationNo": {
              "type": "string"
            },
            "latitude": {
              "type": "number"
            },
            "longitude": {
              "type": "number"
            },
            "recordedAt": {
              "type": "string",
              "format": "date-time"
            },
            "sourceType": {
              "type": "string"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        HistoryPing: {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "latitude": {
              "type": "number"
            },
            "longitude": {
              "type": "number"
            },
            "recordedAt": {
              "type": "string",
              "format": "date-time"
            },
            "sourceType": {
              "type": "string"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        VehiclePing: {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "latitude": {
              "type": "number"
            },
            "longitude": {
              "type": "number"
            },
            "timestamp": {
              "type": "string",
              "format": "date-time"
            },
            "sourceType": {
              "type": "string"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        StationHistoryPing: {
          "allOf": [
            {
              "$ref": "#/components/schemas/HistoryPing"
            },
            {
              "type": "object",
              "properties": {
                "vehicle": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "integer"
                    },
                    "registrationNo": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          ]
        },
        FilteredHistoryPing: {
          "allOf": [
            {
              "$ref": "#/components/schemas/HistoryPing"
            },
            {
              "type": "object",
              "properties": {
                "vehicle": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "integer"
                    },
                    "registrationNo": {
                      "type": "string"
                    }
                  }
                },
                "district": {
                  "$ref": "#/components/schemas/District"
                },
                "province": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "integer"
                    },
                    "name": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          ]
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
    './src/routes/devices.route.js',
    './src/routes/users.route.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
