const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * NAMASTE Codes Model
 * Stores NAMASTE terminology codes for Ayurveda, Siddha, and Unani systems
 */
const NAMASTECode = sequelize.define('namaste_codes', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  // FHIR CodeSystem properties
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isAlphanumeric: true
    }
  },
  
  display: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 500]
    }
  },
  
  definition: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  system: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'https://ayush.gov.in/fhir/CodeSystem/namaste'
  },
  
  // Traditional medicine system
  traditional_system: {
    type: DataTypes.ENUM('ayurveda', 'siddha', 'unani'),
    allowNull: false,
    validate: {
      isIn: [['ayurveda', 'siddha', 'unani']]
    }
  },
  
  // FHIR status
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'deprecated'),
    allowNull: false,
    defaultValue: 'active'
  },
  
  // Language and localization
  language: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'en'
  },
  
  // Additional properties as JSON
  properties: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  
  // Version information
  version: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '1.0.0'
  },
  
  // Metadata
  publisher: {
    type: DataTypes.STRING(200),
    allowNull: true,
    defaultValue: 'Ministry of AYUSH, Government of India'
  },
  
  // Search and indexing fields
  search_vector: {
    type: DataTypes.TSVECTOR,
    allowNull: true
  }
}, {
  tableName: 'namaste_codes',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['code'],
      unique: true
    },
    {
      fields: ['traditional_system']
    },
    {
      fields: ['status']
    },
    {
      name: 'namaste_search_idx',
      fields: ['search_vector'],
      using: 'gin'
    },
    {
      name: 'namaste_display_idx',
      fields: [sequelize.fn('to_tsvector', 'english', sequelize.col('display'))],
      using: 'gin'
    }
  ],
  hooks: {
    beforeSave: (instance) => {
      // Generate search vector
      if (instance.display || instance.definition) {
        const searchText = [instance.display, instance.definition].filter(Boolean).join(' ');
        instance.search_vector = sequelize.fn('to_tsvector', 'english', searchText);
      }
    }
  }
});

// Instance methods
NAMASTECode.prototype.toFHIR = function() {
  return {
    system: this.system,
    code: this.code,
    display: this.display,
    definition: this.definition,
    property: [
      {
        code: 'traditional-system',
        valueString: this.traditional_system
      },
      {
        code: 'status',
        valueCode: this.status
      },
      {
        code: 'version',
        valueString: this.version
      }
    ]
  };
};

// Class methods
NAMASTECode.searchByText = async function(searchText, system = null, limit = 20, offset = 0) {
  const whereClause = {
    status: 'active'
  };
  
  if (system) {
    whereClause.traditional_system = system;
  }
  
  if (searchText) {
    whereClause[sequelize.Op.or] = [
      sequelize.where(
        sequelize.fn('to_tsvector', 'english', sequelize.col('display')),
        sequelize.Op.match,
        sequelize.fn('plainto_tsquery', 'english', searchText)
      ),
      {
        code: {
          [sequelize.Op.iLike]: `%${searchText}%`
        }
      }
    ];
  }
  
  return this.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [
      [sequelize.literal(`ts_rank(to_tsvector('english', display), plainto_tsquery('english', '${searchText}'))`), 'DESC'],
      ['display', 'ASC']
    ]
  });
};

module.exports = NAMASTECode;
