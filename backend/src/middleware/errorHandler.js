const logger = require('../utils/logger');

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

class FHIRError extends AppError {
  constructor(message, operationOutcome = null) {
    super(message, 400, 'FHIR_ERROR');
    this.operationOutcome = operationOutcome;
  }
}

// Handle different types of errors
const handleSequelizeError = (err) => {
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));
    return new ValidationError('Validation failed', errors);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'field';
    return new ConflictError(`${field} already exists`);
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return new ValidationError('Invalid reference to related resource');
  }

  if (err.name === 'SequelizeDatabaseError') {
    logger.error('Database error:', err);
    return new AppError('Database operation failed', 500, 'DATABASE_ERROR');
  }

  return new AppError('Database error occurred', 500, 'DATABASE_ERROR');
};

const handleJWTError = (err) => {
  if (err.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }
  
  if (err.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired');
  }
  
  return new AuthenticationError('Token verification failed');
};

const handleValidationError = (err) => {
  if (err.isJoi) {
    const errors = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));
    return new ValidationError('Request validation failed', errors);
  }
  
  return err;
};

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    code: err.code,
    ...(err.errors && { errors: err.errors }),
    ...(err.operationOutcome && { operationOutcome: err.operationOutcome })
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational errors: send message to client
  if (err.isOperational) {
    const response = {
      status: err.status,
      message: err.message,
      code: err.code,
      timestamp: new Date().toISOString()
    };

    if (err.errors) {
      response.errors = err.errors;
    }

    if (err.operationOutcome) {
      response.operationOutcome = err.operationOutcome;
    }

    res.status(err.statusCode).json(response);
  } else {
    // Programming or unknown errors: don't leak error details
    logger.error('Unknown error:', err);
    
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString()
    });
  }
};

// Main error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (err.name && (
    err.name.startsWith('Sequelize') || 
    err.parent?.code // PostgreSQL errors
  )) {
    error = handleSequelizeError(err);
  } else if (err.name && err.name.includes('JsonWebToken')) {
    error = handleJWTError(err);
  } else if (err.isJoi) {
    error = handleValidationError(err);
  } else if (!err.isOperational) {
    // Convert non-operational errors to operational
    error = new AppError('Something went wrong', 500, 'INTERNAL_SERVER_ERROR');
  }

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new NotFoundError(`Endpoint ${req.originalUrl}`);
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFound,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  FHIRError
};
