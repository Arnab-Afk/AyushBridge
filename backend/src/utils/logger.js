const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Ensure logs directory exists
const logDir = process.env.LOG_FILE_PATH || './logs';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    });
  })
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Transport configurations
const transports = [];

// Console transport for development
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.LOG_LEVEL || 'info'
    })
  );
}

// File transports
transports.push(
  // Combined log (all levels)
  new DailyRotateFile({
    filename: path.join(logDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    format: logFormat,
    level: 'info'
  }),
  
  // Error log (errors only)
  new DailyRotateFile({
    filename: path.join(logDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    format: logFormat,
    level: 'error'
  }),
  
  // FHIR operations log
  new DailyRotateFile({
    filename: path.join(logDir, 'fhir-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    format: logFormat,
    level: 'info'
  }),
  
  // Security audit log
  new DailyRotateFile({
    filename: path.join(logDir, 'security-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '30d',
    format: logFormat,
    level: 'warn'
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exitOnError: false,
  
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ],
  
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

// Helper functions for specific log types
const loggers = {
  // FHIR operation logger
  fhir: (operation, resourceType, resourceId, userId, metadata = {}) => {
    logger.info('FHIR Operation', {
      type: 'fhir_operation',
      operation,
      resourceType,
      resourceId,
      userId,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  },

  // Security audit logger
  security: (event, userId, ip, userAgent, details = {}) => {
    logger.warn('Security Event', {
      type: 'security_audit',
      event,
      userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      ...details
    });
  },

  // Authentication logger
  auth: (event, userId, ip, success, details = {}) => {
    const level = success ? 'info' : 'warn';
    logger[level]('Authentication Event', {
      type: 'auth_event',
      event,
      userId,
      ip,
      success,
      timestamp: new Date().toISOString(),
      ...details
    });
  },

  // API access logger
  api: (method, url, statusCode, responseTime, userId, ip) => {
    logger.info('API Access', {
      type: 'api_access',
      method,
      url,
      statusCode,
      responseTime,
      userId,
      ip,
      timestamp: new Date().toISOString()
    });
  },

  // Database operation logger
  database: (operation, table, affected, duration, error = null) => {
    const level = error ? 'error' : 'debug';
    logger[level]('Database Operation', {
      type: 'database_operation',
      operation,
      table,
      affected,
      duration,
      error: error ? error.message : null,
      timestamp: new Date().toISOString()
    });
  },

  // External API logger
  external: (service, operation, statusCode, responseTime, error = null) => {
    const level = error ? 'error' : 'info';
    logger[level]('External API Call', {
      type: 'external_api',
      service,
      operation,
      statusCode,
      responseTime,
      error: error ? error.message : null,
      timestamp: new Date().toISOString()
    });
  }
};

// Export logger with additional methods
module.exports = Object.assign(logger, loggers);
