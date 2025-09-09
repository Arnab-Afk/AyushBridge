const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const NAMASTECode = require('../models/NamasteCode');
const ICD11Code = require('../models/ICD11Code');
const ConceptMapping = require('../models/ConceptMapping');

/**
 * @swagger
 * tags:
 *   name: Terminology
 *   description: NAMASTE and ICD-11 terminology operations
 */

/**
 * @swagger
 * /api/terminology/namaste/search:
 *   get:
 *     summary: Search NAMASTE terminology codes
 *     tags: [Terminology]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query string
 *       - in: query
 *         name: system
 *         schema:
 *           type: string
 *           enum: [ayurveda, siddha, unani]
 *         description: Traditional medicine system filter
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Maximum number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NAMASTECode'
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/namaste/search', asyncHandler(async (req, res) => {
  const { q, system, limit = 20, offset = 0 } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.status(400).json({
      error: 'Search query (q) is required'
    });
  }
  
  const results = await NAMASTECode.searchByText(
    q.trim(),
    system,
    Math.min(parseInt(limit), 100),
    Math.max(parseInt(offset), 0)
  );
  
  res.json({
    data: results.rows.map(code => ({
      id: code.id,
      code: code.code,
      display: code.display,
      definition: code.definition,
      system: code.system,
      traditional_system: code.traditional_system,
      status: code.status
    })),
    total: results.count,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
}));

/**
 * @swagger
 * /api/terminology/namaste/{code}:
 *   get:
 *     summary: Get NAMASTE code details
 *     tags: [Terminology]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: NAMASTE code
 *     responses:
 *       200:
 *         description: Code details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NAMASTECode'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/namaste/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;
  
  const namasteCode = await NAMASTECode.findOne({
    where: { code, status: 'active' }
  });
  
  if (!namasteCode) {
    return res.status(404).json({
      error: 'NAMASTE code not found',
      code
    });
  }
  
  res.json({
    id: namasteCode.id,
    code: namasteCode.code,
    display: namasteCode.display,
    definition: namasteCode.definition,
    system: namasteCode.system,
    traditional_system: namasteCode.traditional_system,
    status: namasteCode.status,
    properties: namasteCode.properties,
    version: namasteCode.version,
    language: namasteCode.language
  });
}));

/**
 * @swagger
 * /api/terminology/icd11/search:
 *   get:
 *     summary: Search ICD-11 codes
 *     tags: [Terminology]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query string
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *           enum: [tm2, biomedicine]
 *         description: ICD-11 module filter
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Maximum number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ICD11Code'
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 */
router.get('/icd11/search', asyncHandler(async (req, res) => {
  const { q, module, limit = 20, offset = 0 } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.status(400).json({
      error: 'Search query (q) is required'
    });
  }
  
  const results = await ICD11Code.searchByText(
    q.trim(),
    module,
    Math.min(parseInt(limit), 100),
    Math.max(parseInt(offset), 0)
  );
  
  res.json({
    data: results.rows.map(code => ({
      id: code.id,
      code: code.code,
      display: code.display,
      definition: code.definition,
      system: code.system,
      module: code.module,
      parent_code: code.parent_code,
      status: code.status
    })),
    total: results.count,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
}));

/**
 * @swagger
 * /api/terminology/translate:
 *   post:
 *     summary: Translate codes between NAMASTE and ICD-11
 *     tags: [Terminology]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               source_code:
 *                 type: string
 *                 description: Source code to translate
 *               source_system:
 *                 type: string
 *                 description: Source code system
 *               target_system:
 *                 type: string
 *                 description: Target code system
 *             required:
 *               - source_code
 *     responses:
 *       200:
 *         description: Translation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 translations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ConceptMapping'
 *       404:
 *         description: No translations found
 */
router.post('/translate', asyncHandler(async (req, res) => {
  const { source_code, source_system, target_system } = req.body;
  
  if (!source_code) {
    return res.status(400).json({
      error: 'source_code is required'
    });
  }
  
  const mappings = await ConceptMapping.translateCode(
    source_code,
    source_system,
    target_system
  );
  
  if (mappings.length === 0) {
    return res.status(404).json({
      error: 'No translations found',
      source_code
    });
  }
  
  res.json({
    source_code,
    source_system,
    target_system,
    translations: mappings.map(mapping => ({
      target_code: mapping.target_code,
      target_display: mapping.target_display,
      target_system: mapping.target_system,
      equivalence: mapping.equivalence,
      confidence: parseFloat(mapping.confidence),
      comment: mapping.comment,
      validated: mapping.validated
    }))
  });
}));

/**
 * @swagger
 * /api/terminology/mappings/stats:
 *   get:
 *     summary: Get mapping statistics
 *     tags: [Terminology]
 *     responses:
 *       200:
 *         description: Mapping statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_mappings:
 *                   type: integer
 *                 by_equivalence:
 *                   type: object
 *                 by_module:
 *                   type: object
 *                 by_traditional_system:
 *                   type: object
 *                 validation_status:
 *                   type: object
 */
router.get('/mappings/stats', asyncHandler(async (req, res) => {
  const stats = await ConceptMapping.getMappingStats();
  
  // Process stats into a more readable format
  const processed = {
    total_mappings: stats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
    by_equivalence: {},
    by_module: {},
    by_traditional_system: {},
    validation_status: {
      validated: 0,
      not_validated: 0
    }
  };
  
  stats.forEach(stat => {
    if (stat.equivalence) {
      processed.by_equivalence[stat.equivalence] = (processed.by_equivalence[stat.equivalence] || 0) + parseInt(stat.count);
    }
    if (stat.target_module) {
      processed.by_module[stat.target_module] = (processed.by_module[stat.target_module] || 0) + parseInt(stat.count);
    }
    if (stat.source_traditional_system) {
      processed.by_traditional_system[stat.source_traditional_system] = (processed.by_traditional_system[stat.source_traditional_system] || 0) + parseInt(stat.count);
    }
    if (stat.validated !== null) {
      const key = stat.validated ? 'validated' : 'not_validated';
      processed.validation_status[key] += parseInt(stat.count);
    }
  });
  
  res.json(processed);
}));

module.exports = router;
