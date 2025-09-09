// Simple test script to check basic functionality
console.log('Starting AyushBridge backend test...');

try {
  // Test basic imports
  console.log('Testing imports...');
  
  // Load environment variables
  require('dotenv').config();
  console.log('✓ Environment variables loaded');
  
  // Test express
  const express = require('express');
  console.log('✓ Express loaded');
  
  // Test database config (without connection)
  const dbConfig = require('./src/config/database');
  console.log('✓ Database config loaded');
  
  // Test logger
  const logger = require('./src/utils/logger');
  console.log('✓ Logger loaded');
  logger.info('Logger test message');
  
  // Test models (without database connection)
  console.log('✓ Testing model imports...');
  // Don't load models yet as they might try to connect to DB
  
  console.log('\n✅ All basic imports successful!');
  console.log('You can now set up PostgreSQL and Redis, then run the full server.');
  
} catch (error) {
  console.error('❌ Error during testing:', error.message);
  console.error('Stack:', error.stack);
}
