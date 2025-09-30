require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

// Import routes
const codeSystemRoutes = require('./routes/codeSystem');
const conceptMapRoutes = require('./routes/conceptMap');
const valueSetRoutes = require('./routes/valueSet');
const conditionRoutes = require('./routes/condition');
const patientRoutes = require('./routes/patient');
const bundleRoutes = require('./routes/bundle');
const encounterRoutes = require('./routes/encounter');
const terminologyRoutes = require('./routes/terminology');
const problemListRoutes = require('./routes/problemList');
const symptomSearchRoutes = require('./routes/symptomSearch');
const { router: auditRoutes } = require('./routes/audit');
const { namasteRoutes } = require('./routes/specificCodeSystems');
const { translationRoutes } = require('./routes/translation');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');
const { corsMiddleware } = require('./middleware/corsMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for FHIR API
  crossOriginEmbedderPolicy: false
}));

// CORS configuration - Allow all origins for development
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin'],
  exposedHeaders: ['Content-Length', 'Content-Type', 'X-Powered-By'],
  credentials: true, // Allow credentials
  maxAge: 86400 // Cache preflight requests for 24 hours
}));

// Use our custom CORS middleware as a backup
app.use(corsMiddleware);

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'AyushBridge FHIR Backend'
  });
});

// FHIR Capability Statement
app.get('/fhir/metadata', (req, res) => {
  res.json({
    resourceType: 'CapabilityStatement',
    status: 'active',
    date: new Date().toISOString(),
    publisher: 'AyushBridge',
    kind: 'instance',
    software: {
      name: 'AyushBridge FHIR Backend',
      version: '1.0.0'
    },
    implementation: {
      description: 'FHIR R4 Backend for NAMASTE & ICD-11 TM2 Integration'
    },
    fhirVersion: '4.0.1',
    format: ['json'],
    rest: [{
      mode: 'server',
      resource: [
        {
          type: 'CodeSystem',
          interaction: [
            { code: 'read' },
            { code: 'search-type' },
            { code: 'create' },
            { code: 'update' }
          ],
          searchParam: [
            { name: 'url', type: 'uri' },
            { name: 'version', type: 'token' },
            { name: 'name', type: 'string' },
            { name: 'status', type: 'token' }
          ]
        },
        {
          type: 'ConceptMap',
          interaction: [
            { code: 'read' },
            { code: 'search-type' },
            { code: 'create' },
            { code: 'update' }
          ],
          searchParam: [
            { name: 'url', type: 'uri' },
            { name: 'version', type: 'token' },
            { name: 'name', type: 'string' },
            { name: 'status', type: 'token' }
          ]
        },
        {
          type: 'ValueSet',
          interaction: [
            { code: 'read' },
            { code: 'search-type' },
            { code: 'create' },
            { code: 'update' }
          ],
          searchParam: [
            { name: 'url', type: 'uri' },
            { name: 'version', type: 'token' },
            { name: 'name', type: 'string' },
            { name: 'status', type: 'token' }
          ]
        },
        {
          type: 'Condition',
          interaction: [
            { code: 'read' },
            { code: 'search-type' },
            { code: 'create' },
            { code: 'update' },
            { code: 'delete' }
          ],
          searchParam: [
            { name: 'patient', type: 'reference' },
            { name: 'clinical-status', type: 'token' },
            { name: 'code', type: 'token' },
            { name: 'category', type: 'token' }
          ]
        },
        {
          type: 'Encounter',
          interaction: [
            { code: 'read' },
            { code: 'search-type' },
            { code: 'create' },
            { code: 'update' },
            { code: 'delete' }
          ],
          searchParam: [
            { name: 'patient', type: 'reference' },
            { name: 'status', type: 'token' },
            { name: 'class', type: 'token' },
            { name: 'type', type: 'token' },
            { name: 'date', type: 'date' }
          ]
        },
        {
          type: 'Operation',
          interaction: [
            { code: 'operation' }
          ],
          operation: [
            {
              name: 'symptom-search',
              definition: 'http://localhost:3000/fhir/OperationDefinition/symptom-search'
            }
          ]
        },
      ]
    }]
  });
});

// API Routes
app.use('/fhir/CodeSystem', codeSystemRoutes);
app.use('/fhir/CodeSystem', namasteRoutes); // Add specific namaste and icd11 routes
app.use('/fhir/ValueSet', namasteRoutes); // Add ValueSet expand operations
app.use('/fhir/ConceptMap', conceptMapRoutes);
app.use('/fhir/ConceptMap', translationRoutes); // Add translation routes for API playground
app.use('/fhir/ValueSet', valueSetRoutes);
app.use('/fhir/Condition', conditionRoutes);
app.use('/fhir/Patient', patientRoutes);
app.use('/fhir/Bundle', bundleRoutes);
app.use('/fhir/Encounter', encounterRoutes);
app.use('/fhir/terminology', terminologyRoutes);
app.use('/fhir/problem-list', problemListRoutes);
app.use('/fhir/symptom-search', symptomSearchRoutes);
app.use('/fhir/AuditEvent', auditRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    resourceType: 'OperationOutcome',
    issue: [{
      severity: 'error',
      code: 'not-found',
      details: {
        text: `Resource ${req.originalUrl} not found`
      }
    }]
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    await prisma.$connect();
    console.log('✅ Database connected successfully');

    await prisma.$disconnect();

    app.listen(PORT, () => {
      console.log(`🚀 FHIR Backend server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 FHIR Capability: http://localhost:${PORT}/fhir/metadata`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
