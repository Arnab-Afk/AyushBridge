const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { sequelize } = require('../config/database');
const NAMASTECode = require('../models/NamasteCode');
const ICD11Code = require('../models/ICD11Code');
const ConceptMapping = require('../models/ConceptMapping');
const { cache } = require('../config/redis');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const csv = require('csv-parser');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || 
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'), false);
    }
  }
});

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative operations (restricted)
 */

/**
 * @swagger
 * /api/admin/health:
 *   get:
 *     summary: Detailed system health check
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 services:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: object
 *                     external_apis:
 *                       type: object
 */
router.get('/health', asyncHandler(async (req, res) => {
  // Check database connection
  let dbStatus = 'healthy';
  let dbError = null;
  
  try {
    await sequelize.authenticate();
  } catch (err) {
    dbStatus = 'unhealthy';
    dbError = err.message;
    logger.error('Database health check failed:', err);
  }
  
  // Check Redis connection
  let redisStatus = 'unknown';
  try {
    const redisAvailable = await cache.exists('health-check');
    redisStatus = redisAvailable !== null ? 'healthy' : 'unhealthy';
  } catch (err) {
    redisStatus = 'unhealthy';
    logger.warn('Redis health check failed:', err.message);
  }
  
  // Get system resources
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  const health = {
    status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: {
        status: dbStatus,
        type: 'PostgreSQL',
        error: dbError
      },
      cache: {
        status: redisStatus,
        type: 'Redis'
      },
      external_apis: {
        icd11: {
          status: 'unknown',
          last_sync: null
        }
      }
    },
    resources: {
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        unit: 'MB'
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      }
    }
  };

  res.json(health);
}));

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get system statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 terminology:
 *                   type: object
 *                 mappings:
 *                   type: object
 *                 api_usage:
 *                   type: object
 */
router.get('/stats', asyncHandler(async (req, res) => {
  // Get terminology statistics from database
  const namasteStats = await NAMASTECode.findAll({
    attributes: [
      'traditional_system',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['traditional_system'],
    raw: true
  });
  
  const icd11Stats = await ICD11Code.findAll({
    attributes: [
      'module',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['module'],
    raw: true
  });
  
  // Get mapping statistics
  const mappingStats = await ConceptMapping.findAll({
    attributes: [
      'equivalence',
      'validated',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: {
      status: 'active'
    },
    group: ['equivalence', 'validated'],
    raw: true
  });
  
  // Process raw data into more structured format
  const namasteCounts = {
    total: namasteStats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
    by_system: {}
  };
  
  namasteStats.forEach(stat => {
    namasteCounts.by_system[stat.traditional_system] = parseInt(stat.count);
  });
  
  const icd11Counts = {
    total: icd11Stats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
    by_module: {}
  };
  
  icd11Stats.forEach(stat => {
    icd11Counts.by_module[stat.module] = parseInt(stat.count);
  });
  
  const mappingCounts = {
    total: mappingStats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
    validated: mappingStats
      .filter(stat => stat.validated)
      .reduce((sum, stat) => sum + parseInt(stat.count), 0),
    by_equivalence: {}
  };
  
  mappingStats.forEach(stat => {
    if (!mappingCounts.by_equivalence[stat.equivalence]) {
      mappingCounts.by_equivalence[stat.equivalence] = 0;
    }
    mappingCounts.by_equivalence[stat.equivalence] += parseInt(stat.count);
  });
  
  // Get confidence distribution
  const confidenceStats = await ConceptMapping.findAll({
    attributes: [
      [sequelize.literal('FLOOR(confidence * 10) / 10'), 'confidence_range'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: {
      status: 'active'
    },
    group: [sequelize.literal('FLOOR(confidence * 10) / 10')],
    raw: true
  });
  
  const confidenceDistribution = {};
  confidenceStats.forEach(stat => {
    confidenceDistribution[stat.confidence_range] = parseInt(stat.count);
  });
  
  // Get API usage stats from cache or mock data
  const apiUsage = {
    total_requests: await cache.get('api:total_requests') || 0,
    requests_24h: await cache.get('api:requests_24h') || 0,
    top_endpoints: await cache.get('api:top_endpoints') || []
  };
  
  res.json({
    terminology: {
      namaste_codes: namasteCounts,
      icd11_codes: icd11Counts
    },
    mappings: {
      total: mappingCounts.total,
      validated: mappingCounts.validated,
      by_equivalence: mappingCounts.by_equivalence,
      confidence_distribution: confidenceDistribution
    },
    api_usage: apiUsage,
    last_updated: new Date().toISOString()
  });
}));

/**
 * @swagger
 * /api/admin/sync/icd11:
 *   post:
 *     summary: Trigger ICD-11 synchronization
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Synchronization started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job_id:
 *                   type: string
 *       503:
 *         description: Synchronization service unavailable
 */
// In-memory storage for job tracking (would use Redis or DB in production)
const jobStore = new Map();

router.post('/sync/icd11', asyncHandler(async (req, res) => {
  const jobId = uuidv4();
  const now = new Date();
  
  // Store job details
  const job = {
    id: jobId,
    type: 'icd11-sync',
    status: 'pending',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    progress: 0,
    result: null,
    error: null
  };
  
  jobStore.set(jobId, job);
  
  // Start background job (simulated)
  setTimeout(() => {
    const job = jobStore.get(jobId);
    if (job) {
      job.status = 'running';
      job.progress = 10;
      job.updated_at = new Date().toISOString();
      jobStore.set(jobId, job);
      
      // Simulate further progress
      setTimeout(() => {
        const job = jobStore.get(jobId);
        if (job) {
          job.status = 'completed';
          job.progress = 100;
          job.updated_at = new Date().toISOString();
          job.completed_at = new Date().toISOString();
          job.result = {
            codes_synced: 250,
            codes_updated: 75,
            codes_added: 25,
            elapsed_time_ms: 15000
          };
          jobStore.set(jobId, job);
        }
      }, 15000);
    }
  }, 2000);
  
  res.status(202).json({
    message: 'ICD-11 synchronization started',
    job_id: jobId,
    status: 'pending',
    started_at: now.toISOString()
  });
}));

/**
 * @swagger
 * /api/admin/import/namaste:
 *   post:
 *     summary: Import NAMASTE terminology from CSV
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file with NAMASTE codes
 *               overwrite:
 *                 type: boolean
 *                 default: false
 *                 description: Whether to overwrite existing codes
 *     responses:
 *       202:
 *         description: Import started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job_id:
 *                   type: string
 *       400:
 *         description: Invalid file or parameters
 */
router.post('/import/namaste', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded',
      message: 'Please upload a CSV or Excel file'
    });
  }
  
  const { overwrite = false } = req.body;
  const jobId = uuidv4();
  const now = new Date();
  
  // Store job details
  const job = {
    id: jobId,
    type: 'namaste-import',
    status: 'pending',
    file: req.file.path,
    filename: req.file.originalname,
    filesize: req.file.size,
    options: { overwrite: overwrite === 'true' || overwrite === true },
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    progress: 0,
    result: null,
    error: null
  };
  
  jobStore.set(jobId, job);
  
  // Start background processing
  setTimeout(() => {
    processImportJob(jobId, job);
  }, 100);
  
  res.status(202).json({
    message: 'NAMASTE import started',
    job_id: jobId,
    status: 'pending',
    started_at: now.toISOString(),
    filename: req.file.originalname,
    filesize: req.file.size
  });
}));

// Helper function to process import jobs
async function processImportJob(jobId, job) {
  try {
    // Update job status to running
    job.status = 'running';
    job.progress = 5;
    job.updated_at = new Date().toISOString();
    jobStore.set(jobId, job);
    
    // Check file type
    const filePath = job.file;
    const isCSV = filePath.toLowerCase().endsWith('.csv');
    
    const results = {
      total_rows: 0,
      processed: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };
    
    if (isCSV) {
      // Process CSV file
      const rows = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            rows.push(row);
          })
          .on('end', () => {
            results.total_rows = rows.length;
            resolve();
          })
          .on('error', reject);
      });
      
      // Update progress
      job.progress = 30;
      job.updated_at = new Date().toISOString();
      jobStore.set(jobId, job);
      
      // Process rows in batches
      const batchSize = 100;
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        
        for (const row of batch) {
          try {
            // Extract data (using common CSV column formats)
            const code = row.code || row.Code || row.CODE;
            const display = row.display || row.Display || row.name || row.Name || row.DISPLAY_NAME;
            const system = row.traditional_system || row.system || row.System || 'ayurveda';
            const definition = row.definition || row.Definition || row.description || row.Description || '';
            
            if (!code || !display) {
              results.skipped++;
              results.errors.push(`Row ${results.processed + 1}: Missing required code or display`);
              continue;
            }
            
            // Check if code already exists
            const existingCode = await NAMASTECode.findOne({
              where: { code }
            });
            
            if (existingCode) {
              if (job.options.overwrite) {
                // Update existing code
                await existingCode.update({
                  display,
                  definition,
                  traditional_system: system,
                  updated_at: new Date()
                });
                results.updated++;
              } else {
                results.skipped++;
              }
            } else {
              // Create new code
              await NAMASTECode.create({
                code,
                display,
                definition,
                traditional_system: system,
                status: 'active',
                properties: {}
              });
              results.created++;
            }
            
            results.processed++;
          } catch (err) {
            results.errors.push(`Row ${results.processed + 1}: ${err.message}`);
            results.skipped++;
            results.processed++;
          }
        }
        
        // Update progress
        job.progress = Math.min(30 + Math.floor(((i + batch.length) / rows.length) * 70), 99);
        job.updated_at = new Date().toISOString();
        jobStore.set(jobId, job);
      }
    } else {
      // For non-CSV files (like Excel)
      // In a real implementation, you would use a library like xlsx to process the file
      results.errors.push('Only CSV processing is implemented in this version');
    }
    
    // Clean up the temporary file
    fs.unlinkSync(filePath);
    
    // Update job status to completed
    job.status = 'completed';
    job.progress = 100;
    job.updated_at = new Date().toISOString();
    job.completed_at = new Date().toISOString();
    job.result = results;
    jobStore.set(jobId, job);
    
    logger.info(`Import job ${jobId} completed successfully`, { 
      jobId, 
      results
    });
  } catch (error) {
    logger.error(`Error processing import job ${jobId}:`, error);
    
    // Update job status to failed
    job.status = 'failed';
    job.error = error.message;
    job.updated_at = new Date().toISOString();
    jobStore.set(jobId, job);
    
    // Clean up the temporary file if it exists
    try {
      if (job.file && fs.existsSync(job.file)) {
        fs.unlinkSync(job.file);
      }
    } catch (cleanupError) {
      logger.warn(`Failed to clean up file for job ${jobId}:`, cleanupError);
    }
  }
}

/**
 * @swagger
 * /api/admin/jobs/{jobId}:
 *   get:
 *     summary: Get job status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [pending, running, completed, failed]
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 completed_at:
 *                   type: string
 *                   format: date-time
 *                 result:
 *                   type: object
 *       404:
 *         description: Job not found
 */
router.get('/jobs/:jobId', asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  
  const job = jobStore.get(jobId);
  
  if (!job) {
    return res.status(404).json({
      error: 'Job not found',
      message: `No job found with ID ${jobId}`
    });
  }
  
  // Return job details without file path and other sensitive info
  const { file, ...safeJob } = job;
  
  res.json(safeJob);
}));

// Add a route to get all jobs
router.get('/jobs', asyncHandler(async (req, res) => {
  const jobs = Array.from(jobStore.values()).map(job => {
    const { file, ...safeJob } = job;
    return safeJob;
  });
  
  // Sort by created_at (newest first)
  jobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  res.json({
    count: jobs.length,
    jobs
  });
}));

// Add a route to cancel a job
router.post('/jobs/:jobId/cancel', asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  
  const job = jobStore.get(jobId);
  
  if (!job) {
    return res.status(404).json({
      error: 'Job not found',
      message: `No job found with ID ${jobId}`
    });
  }
  
  if (job.status === 'completed' || job.status === 'failed') {
    return res.status(400).json({
      error: 'Cannot cancel job',
      message: `Job is already in ${job.status} state`
    });
  }
  
  // Update job status to cancelled
  job.status = 'cancelled';
  job.updated_at = new Date().toISOString();
  jobStore.set(jobId, job);
  
  // Clean up the temporary file if it exists
  try {
    if (job.file && fs.existsSync(job.file)) {
      fs.unlinkSync(job.file);
    }
  } catch (err) {
    logger.warn(`Failed to clean up file for cancelled job ${jobId}:`, err);
  }
  
  res.json({
    message: 'Job cancelled successfully',
    job_id: jobId,
    status: 'cancelled'
  });
}));

// Add a route to export data
router.get('/export/:type', asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { format = 'csv' } = req.query;
  
  let data = [];
  let filename = '';
  
  switch (type) {
    case 'namaste':
      data = await NAMASTECode.findAll({
        attributes: ['code', 'display', 'definition', 'traditional_system', 'status'],
        raw: true
      });
      filename = `namaste-export-${Date.now()}.${format}`;
      break;
      
    case 'icd11':
      data = await ICD11Code.findAll({
        attributes: ['code', 'display', 'definition', 'module', 'parent_code', 'status'],
        raw: true
      });
      filename = `icd11-export-${Date.now()}.${format}`;
      break;
      
    case 'mappings':
      data = await ConceptMapping.findAll({
        attributes: [
          'source_code', 'source_display', 'target_code', 'target_display', 
          'equivalence', 'confidence', 'validated'
        ],
        raw: true
      });
      filename = `mappings-export-${Date.now()}.${format}`;
      break;
      
    default:
      return res.status(400).json({
        error: 'Invalid export type',
        message: 'Valid types are: namaste, icd11, mappings'
      });
  }
  
  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.json(data);
  } else if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    if (data.length === 0) {
      return res.send('No data');
    }
    
    // Generate CSV header
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';
    
    // Generate CSV rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        return value;
      });
      csv += values.join(',') + '\n';
    });
    
    return res.send(csv);
  } else {
    return res.status(400).json({
      error: 'Invalid export format',
      message: 'Valid formats are: csv, json'
    });
  }
}));

module.exports = router;
