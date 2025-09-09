const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global state for database connections
let dbConnected = false;
let redisConnected = false;

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint with service status
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: {
        status: dbConnected ? 'connected' : 'disconnected',
        type: 'PostgreSQL'
      },
      redis: {
        status: redisConnected ? 'connected' : 'disconnected',
        type: 'Redis'
      }
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AyushBridge FHIR R4 Terminology Service',
    version: '1.0.0',
    fhirVersion: '4.0.1',
    documentation: '/api-docs',
    status: {
      database: dbConnected ? 'connected' : 'disconnected',
      redis: redisConnected ? 'connected' : 'disconnected'
    },
    endpoints: {
      health: '/health',
      fhir: '/fhir',
      auth: '/auth',
      terminology: '/api/terminology'
    },
    setup_required: !dbConnected || !redisConnected,
    setup_instructions: !dbConnected || !redisConnected ? '/setup' : null
  });
});

// Setup instructions endpoint
app.get('/setup', (req, res) => {
  res.json({
    message: 'AyushBridge Backend Setup Required',
    missing_services: [
      ...(!dbConnected ? ['PostgreSQL Database'] : []),
      ...(!redisConnected ? ['Redis Cache'] : [])
    ],
    instructions: {
      documentation: 'See SETUP.md in the backend directory',
      quick_start: {
        database: 'docker run --name ayushbridge-postgres -e POSTGRES_DB=ayushbridge_db -e POSTGRES_USER=ayushbridge_user -e POSTGRES_PASSWORD=your_secure_password -p 5432:5432 -d postgres:15',
        redis: 'docker run --name ayushbridge-redis -p 6379:6379 -d redis:7',
        migration: 'npm run db:migrate',
        seeding: 'npm run db:seed'
      }
    }
  });
});

// Initialize database and redis connections with graceful handling
async function initializeServices() {
  // Try to connect to PostgreSQL
  try {
    const { connectDB } = require('./config/database');
    await connectDB();
    dbConnected = true;
    logger.info('✓ PostgreSQL database connected successfully');
  } catch (error) {
    logger.warn('⚠ PostgreSQL connection failed:', error.message);
    logger.warn('Database-dependent routes will be disabled');
  }

  // Try to connect to Redis
  try {
    const { connectRedis } = require('./config/redis');
    await connectRedis();
    redisConnected = true;
    logger.info('✓ Redis connected successfully');
  } catch (error) {
    logger.warn('⚠ Redis connection failed:', error.message);
    logger.warn('Caching will be disabled');
  }
}

// Conditional route loading based on service availability
function createRouteHandler(routePath, serviceName, setupMessage) {
  return (req, res, next) => {
    if (!dbConnected) {
      if (req.path.startsWith('/fhir')) {
        return res.status(503).json({
          resourceType: 'OperationOutcome',
          issue: [
            {
              severity: 'error',
              code: 'not-supported',
              diagnostics: setupMessage
            }
          ]
        });
      } else {
        return res.status(503).json({
          error: 'Service unavailable',
          message: setupMessage,
          setup_required: true
        });
      }
    }
    
    try {
      const router = require(routePath);
      router(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// Setup routes with graceful degradation
try {
  app.use('/auth', createRouteHandler('./routes/auth', 'database', 'Database connection required for authentication'));
  app.use('/api/terminology', createRouteHandler('./routes/terminology', 'database', 'Database connection required for terminology operations'));
  app.use('/api/admin', createRouteHandler('./routes/admin', 'database', 'Database connection required for admin operations'));
  app.use('/fhir', createRouteHandler('./routes/fhir', 'database', 'FHIR operations require database connection. Please set up PostgreSQL and run migrations.'));
} catch (error) {
  logger.warn('Some routes could not be loaded:', error.message);
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: ['/health', '/setup', '/fhir', '/auth', '/api/terminology']
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    logger.info('Server closed successfully');
    process.exit(0);
  });
  
  // Force close server after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server function
async function startServer() {
  try {
    // Initialize services (non-blocking)
    await initializeServices();
    
    // Start the server regardless of service status
    const server = app.listen(PORT, () => {
      logger.info(`🚀 AyushBridge server is running on port ${PORT}`);
      logger.info(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
      
      if (dbConnected && redisConnected) {
        logger.info(`🔥 FHIR Endpoint available at http://localhost:${PORT}/fhir`);
        logger.info(`✅ All services connected and ready`);
      } else {
        logger.info(`⚠️  Some services are not available. Check http://localhost:${PORT}/setup for instructions`);
      }
      
      logger.info(`🏥 Health Check available at http://localhost:${PORT}/health`);
    });

    // Handle server errors
    server.on('error', (error) => {
      logger.error('Server error:', error);
      process.exit(1);
    });

    return server;

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server only if this file is run directly
if (require.main === module) {
  const server = startServer();
}

module.exports = app;
