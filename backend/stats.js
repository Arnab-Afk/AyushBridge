require('dotenv').config();
const { Sequelize } = require('sequelize');

async function getStats() {
  const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;
  
  const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });

  try {
    const [results] = await sequelize.query('SELECT traditional_system, COUNT(*) as count FROM namaste_codes GROUP BY traditional_system ORDER BY count DESC');
    const [total] = await sequelize.query('SELECT COUNT(*) as total FROM namaste_codes');
    
    console.log('📊 Final Import Statistics:');
    console.log('='.repeat(40));
    results.forEach(row => {
      console.log(`${row.traditional_system}: ${row.count} codes`);
    });
    console.log('='.repeat(40));
    console.log(`Total: ${total[0].total} codes`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

getStats();
