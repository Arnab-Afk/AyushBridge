const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Create swagger spec
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'AyushBridge FHIR API',
    version: '1.0.0',
    description: 'FHIR R4-compliant terminology service for NAMASTE & ICD-11 TM2 integration'
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Development server'
    }
  ]
};

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AyushBridge FHIR R4 Terminology Service',
    version: '1.0.0',
    fhirVersion: '4.0.1',
    documentation: '/api-docs',
    endpoints: {
      health: '/health',
      setup: '/setup'
    },
    note: 'This is a minimal server. Set up PostgreSQL and Redis to enable full functionality.'
  });
});

// Setup instructions
app.get('/setup', (req, res) => {
  res.json({
    message: 'AyushBridge Backend Setup Instructions',
    services_required: ['PostgreSQL', 'Redis'],
    quick_start: {
      postgresql: 'docker run --name ayushbridge-postgres -e POSTGRES_DB=ayushbridge_db -e POSTGRES_USER=ayushbridge_user -e POSTGRES_PASSWORD=your_secure_password -p 5432:5432 -d postgres:15',
      redis: 'docker run --name ayushbridge-redis -p 6379:6379 -d redis:7',
      steps: [
        '1. Start PostgreSQL and Redis',
        '2. Update .env file with credentials',
        '3. Run: npm run db:migrate',
        '4. Run: npm run db:seed',
        '5. Restart server'
      ]
    },
    documentation: 'See SETUP.md for detailed instructions'
  });
});

// Basic FHIR metadata endpoint
app.get('/fhir/metadata', (req, res) => {
  res.setHeader('Content-Type', 'application/fhir+json');
  res.json({
    resourceType: 'CapabilityStatement',
    id: 'ayushbridge-terminology-server',
    status: 'active',
    date: new Date().toISOString(),
    publisher: 'Ministry of AYUSH, Government of India',
    kind: 'instance',
    software: {
      name: 'AyushBridge',
      version: '1.0.0'
    },
    fhirVersion: '4.0.1',
    format: ['application/fhir+json'],
    rest: [
      {
        mode: 'server',
        resource: [
          {
            type: 'CodeSystem',
            interaction: [
              { code: 'read' },
              { code: 'search-type' }
            ]
          }
        ]
      }
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: ['/', '/health', '/setup', '/fhir/metadata', '/api-docs']
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 AyushBridge server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`⚙️  Setup Instructions: http://localhost:${PORT}/setup`);
  console.log(`🔥 FHIR Metadata: http://localhost:${PORT}/fhir/metadata`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
