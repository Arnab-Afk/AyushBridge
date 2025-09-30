/**
 * Enhanced CORS Middleware
 * 
 * Ensures all routes have proper CORS headers
 */

const corsMiddleware = (req, res, next) => {
  // Allow requests from any origin
  res.header('Access-Control-Allow-Origin', '*');
  
  // Allow all common HTTP methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  
  // Allow all common headers
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Accept-Language'
  );
  
  // Expose additional headers that clients might need to access
  res.header(
    'Access-Control-Expose-Headers',
    'Content-Length, Content-Type, ETag, Location'
  );
  
  // Allow credentials (but note this won't work with '*' origin in browsers)
  res.header('Access-Control-Allow-Credentials', true);
  
  // Cache preflight requests for 24 hours to improve performance
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
};

module.exports = { corsMiddleware };
