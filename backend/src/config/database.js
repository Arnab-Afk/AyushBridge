const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Create connection string for Neon
const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;

// Create Sequelize instance
const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  
  // Connection pool configuration
  pool: {
    max: 20,
    min: 5,
    idle: 30000,
    acquire: 60000,
    evict: 1000
  },
  
  // Logging configuration
  logging: process.env.NODE_ENV === 'development' 
    ? (msg) => logger.debug(msg)
    : false,
    
  // Timezone configuration
  timezone: '+00:00',
  
  // Additional options
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft deletes
    freezeTableName: true
  },
  
  // Performance optimizations
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000,
    acquireConnectionTimeout: 60000,
    timeout: 60000
  }
});

// Test database connection
async function connectDB() {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL connection established successfully');
    
    // Sync models in development
    if (process.env.NODE_ENV === 'development') {
      // await sequelize.sync({ alter: false });
      logger.info('Database models synchronization disabled');
    }
    
    return sequelize;
  } catch (error) {
    logger.error('Unable to connect to PostgreSQL database:', error);
    throw error;
  }
}

// Close database connection
async function closeDB() {
  try {
    await sequelize.close();
    logger.info('PostgreSQL connection closed');
  } catch (error) {
    logger.error('Error closing PostgreSQL connection:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  connectDB,
  closeDB
};
