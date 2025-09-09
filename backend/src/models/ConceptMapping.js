const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Concept Mapping Model
 * Stores FHIR ConceptMap relationships between NAMASTE and ICD-11 codes
 */
const ConceptMapping = sequelize.define('concept_mappings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  // Source system (NAMASTE)
  source_system: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: 'https://ayush.gov.in/fhir/CodeSystem/namaste'
  },
  
  source_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  
  source_display: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  
  // Target system (ICD-11)
  target_system: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: 'http://id.who.int/icd/release/11/mms'
  },
  
  target_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  
  target_display: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  
  // FHIR ConceptMap equivalence
  equivalence: {
    type: DataTypes.ENUM(
      'relatedto',
      'equivalent', 
      'equal',
      'wider',
      'subsumes',
      'narrower',
      'specializes',
      'inexact',
      'unmatched',
      'disjoint'
    ),
    allowNull: false,
    defaultValue: 'equivalent',
    validate: {
      isIn: [[
        'relatedto', 'equivalent', 'equal', 'wider', 
        'subsumes', 'narrower', 'specializes', 'inexact', 
        'unmatched', 'disjoint'
      ]]
    }
  },
  
  // Confidence score (0.0 - 1.0)
  confidence: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 1.0,
    validate: {
      min: 0.0,
      max: 1.0
    }
  },
  
  // Mapping metadata
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Validation and approval
  validated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  
  validated_by: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  validated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Mapping method
  mapping_method: {
    type: DataTypes.ENUM('manual', 'automatic', 'semi-automatic', 'expert-review'),
    allowNull: false,
    defaultValue: 'manual'
  },
  
  // Version and status
  version: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '1.0.0'
  },
  
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'deprecated', 'draft'),
    allowNull: false,
    defaultValue: 'active'
  },
  
  // Additional properties
  properties: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  
  // WHO module for target
  target_module: {
    type: DataTypes.ENUM('tm2', 'biomedicine'),
    allowNull: true
  },
  
  // NAMASTE traditional system for source
  source_traditional_system: {
    type: DataTypes.ENUM('ayurveda', 'siddha', 'unani'),
    allowNull: true
  }
}, {
  tableName: 'concept_mappings',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['source_system', 'source_code'],
      name: 'concept_mapping_source_idx'
    },
    {
      fields: ['target_system', 'target_code'],
      name: 'concept_mapping_target_idx'
    },
    {
      fields: ['source_code', 'target_code'],
      unique: true,
      name: 'concept_mapping_unique_idx'
    },
    {
      fields: ['equivalence']
    },
    {
      fields: ['status']
    },
    {
      fields: ['validated']
    },
    {
      fields: ['confidence']
    },
    {
      fields: ['mapping_method']
    },
    {
      fields: ['target_module']
    },
    {
      fields: ['source_traditional_system']
    }
  ]
});

// Define associations
ConceptMapping.belongsTo(require('./NamasteCode'), {
  foreignKey: 'source_code',
  targetKey: 'code',
  as: 'sourceEntity'
});

ConceptMapping.belongsTo(require('./ICD11Code'), {
  foreignKey: 'target_code',
  targetKey: 'code',
  as: 'targetEntity'
});

// Instance methods
ConceptMapping.prototype.toFHIR = function() {
  return {
    source: this.source_code,
    target: [
      {
        code: this.target_code,
        display: this.target_display,
        equivalence: this.equivalence,
        comment: this.comment,
        extension: [
          {
            url: 'http://ayush.gov.in/fhir/StructureDefinition/mapping-confidence',
            valueDecimal: parseFloat(this.confidence)
          },
          {
            url: 'http://ayush.gov.in/fhir/StructureDefinition/mapping-method',
            valueString: this.mapping_method
          },
          {
            url: 'http://ayush.gov.in/fhir/StructureDefinition/validated',
            valueBoolean: this.validated
          }
        ].filter(ext => ext.valueDecimal !== undefined || ext.valueString || ext.valueBoolean !== undefined)
      }
    ]
  };
};

ConceptMapping.prototype.validate = function(validatorId) {
  this.validated = true;
  this.validated_by = validatorId;
  this.validated_at = new Date();
  return this.save();
};

// Class methods
ConceptMapping.translateCode = async function(sourceCode, sourceSystem = null, targetSystem = null) {
  const whereClause = {
    source_code: sourceCode,
    status: 'active'
  };
  
  if (sourceSystem) {
    whereClause.source_system = sourceSystem;
  }
  
  if (targetSystem) {
    whereClause.target_system = targetSystem;
  }
  
  return this.findAll({
    where: whereClause,
    include: [
      {
        model: require('./NamasteCode'),
        as: 'sourceEntity',
        required: false
      },
      {
        model: require('./ICD11Code'),
        as: 'targetEntity',
        required: false
      }
    ],
    order: [['confidence', 'DESC'], ['equivalence', 'ASC']]
  });
};

ConceptMapping.reverseTranslateCode = async function(targetCode, targetSystem = null, sourceSystem = null) {
  const whereClause = {
    target_code: targetCode,
    status: 'active'
  };
  
  if (targetSystem) {
    whereClause.target_system = targetSystem;
  }
  
  if (sourceSystem) {
    whereClause.source_system = sourceSystem;
  }
  
  return this.findAll({
    where: whereClause,
    include: [
      {
        model: require('./NamasteCode'),
        as: 'sourceEntity',
        required: false
      },
      {
        model: require('./ICD11Code'),
        as: 'targetEntity',
        required: false
      }
    ],
    order: [['confidence', 'DESC'], ['equivalence', 'ASC']]
  });
};

ConceptMapping.batchTranslate = async function(sourceCodes, sourceSystem = null, targetSystem = null) {
  const whereClause = {
    source_code: {
      [sequelize.Op.in]: sourceCodes
    },
    status: 'active'
  };
  
  if (sourceSystem) {
    whereClause.source_system = sourceSystem;
  }
  
  if (targetSystem) {
    whereClause.target_system = targetSystem;
  }
  
  return this.findAll({
    where: whereClause,
    include: [
      {
        model: require('./NamasteCode'),
        as: 'sourceEntity',
        required: false
      },
      {
        model: require('./ICD11Code'),
        as: 'targetEntity',
        required: false
      }
    ],
    order: [['source_code', 'ASC'], ['confidence', 'DESC']]
  });
};

ConceptMapping.getMappingStats = async function() {
  const stats = await this.findAll({
    attributes: [
      'equivalence',
      'mapping_method',
      'validated',
      'target_module',
      'source_traditional_system',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('AVG', sequelize.col('confidence')), 'avg_confidence']
    ],
    where: {
      status: 'active'
    },
    group: ['equivalence', 'mapping_method', 'validated', 'target_module', 'source_traditional_system'],
    raw: true
  });
  
  return stats;
};

module.exports = ConceptMapping;
