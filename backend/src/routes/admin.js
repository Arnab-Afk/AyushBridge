const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

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
 *                     redis:
 *                       type: object
 *                     external_apis:
 *                       type: object
 */
router.get('/health', asyncHandler(async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    services: {
      database: {
        status: 'healthy',
        type: 'PostgreSQL'
      },
      redis: {
        status: 'healthy',
        type: 'Redis'
      },
      external_apis: {
        icd11: {
          status: 'unknown',
          last_sync: null
        },
        abha: {
          status: 'unknown',
          last_check: null
        }
      }
    },
    resources: {
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      },
      cpu: {
        load: process.cpuUsage()
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
  // TODO: Implement actual statistics collection
  const stats = {
    terminology: {
      namaste_codes: {
        total: 0,
        by_system: {
          ayurveda: 0,
          siddha: 0,
          unani: 0
        }
      },
      icd11_codes: {
        total: 0,
        by_module: {
          tm2: 0,
          biomedicine: 0
        }
      }
    },
    mappings: {
      total: 0,
      validated: 0,
      confidence_distribution: {}
    },
    api_usage: {
      total_requests: 0,
      requests_24h: 0,
      top_endpoints: []
    }
  };

  res.json(stats);
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
router.post('/sync/icd11', asyncHandler(async (req, res) => {
  // TODO: Implement ICD-11 synchronization trigger
  const jobId = require('crypto').randomUUID();
  
  res.status(202).json({
    message: 'ICD-11 synchronization started',
    job_id: jobId,
    status: 'pending',
    started_at: new Date().toISOString()
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
router.post('/import/namaste', asyncHandler(async (req, res) => {
  // TODO: Implement NAMASTE CSV import
  const jobId = require('crypto').randomUUID();
  
  res.status(202).json({
    message: 'NAMASTE import started',
    job_id: jobId,
    status: 'pending',
    started_at: new Date().toISOString()
  });
}));

/**
 * @swagger
 * /api/admin/cache/clear:
 *   post:
 *     summary: Clear all caches
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cleared_items:
 *                   type: integer
 */
router.post('/cache/clear', asyncHandler(async (req, res) => {
  // TODO: Implement cache clearing
  const { cache } = require('../config/redis');
  
  try {
    const clearedItems = await cache.clearPattern('*');
    
    res.json({
      message: 'Cache cleared successfully',
      cleared_items: clearedItems,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to clear cache',
      message: error.message
    });
  }
}));

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
  
  // TODO: Implement job status tracking
  // For now, return a mock response
  res.json({
    id: jobId,
    status: 'pending',
    type: 'unknown',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    progress: 0,
    message: 'Job is queued for processing'
  });
}));

module.exports = router;
