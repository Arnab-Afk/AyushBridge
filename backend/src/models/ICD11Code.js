const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * ICD-11 Codes Model
 * Stores ICD-11 TM2 and Biomedicine module codes
 */
const ICD11Code = sequelize.define('icd11_codes', {
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
      notEmpty: true
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
    defaultValue: 'http://id.who.int/icd/release/11/mms'
  },
  
  // ICD-11 specific properties
  module: {
    type: DataTypes.ENUM('tm2', 'biomedicine'),
    allowNull: false,
    validate: {
      isIn: [['tm2', 'biomedicine']]
    }
  },
  
  // Hierarchical structure
  parent_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
    references: {
      model: 'icd11_codes',
      key: 'code'
    }
  },
  
  // WHO ICD-11 properties
  linearization: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'mms'
  },
  
  chapter: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  block_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  // Status and versioning
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'deprecated'),
    allowNull: false,
    defaultValue: 'active'
  },
  
  who_version: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '2022'
  },
  
  who_updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Language support
  language: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'en'
  },
  
  // Additional WHO properties
  who_properties: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  
  // Synonyms and translations
  synonyms: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  
  // Exclusions and inclusions
  exclusions: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  
  inclusions: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  
  // Search indexing
  search_vector: {
    type: DataTypes.TSVECTOR,
    allowNull: true
  },
  
  // Sync metadata
  last_sync_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'icd11_codes',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['code'],
      unique: true
    },
    {
      fields: ['module']
    },
    {
      fields: ['parent_code']
    },
    {
      fields: ['status']
    },
    {
      fields: ['linearization']
    },
    {
      fields: ['who_version']
    },
    {
      name: 'icd11_search_idx',
      fields: ['search_vector'],
      using: 'gin'
    },
    {
      name: 'icd11_display_idx',
      fields: [sequelize.fn('to_tsvector', 'english', sequelize.col('display'))],
      using: 'gin'
    },
    {
      name: 'icd11_hierarchy_idx',
      fields: ['parent_code', 'code']
    }
  ],
  hooks: {
    beforeSave: (instance) => {
      // Generate search vector
      const searchText = [
        instance.display,
        instance.definition,
        ...(instance.synonyms || [])
      ].filter(Boolean).join(' ');
      
      if (searchText) {
        instance.search_vector = sequelize.fn('to_tsvector', 'english', searchText);
      }
    }
  }
});

// Define self-referencing association for hierarchy
ICD11Code.belongsTo(ICD11Code, { 
  as: 'parent', 
  foreignKey: 'parent_code',
  targetKey: 'code'
});

ICD11Code.hasMany(ICD11Code, { 
  as: 'children', 
  foreignKey: 'parent_code',
  sourceKey: 'code'
});

// Instance methods
ICD11Code.prototype.toFHIR = function() {
  return {
    system: this.system,
    code: this.code,
    display: this.display,
    definition: this.definition,
    property: [
      {
        code: 'module',
        valueString: this.module
      },
      {
        code: 'linearization',
        valueString: this.linearization
      },
      {
        code: 'parent',
        valueCode: this.parent_code
      },
      {
        code: 'chapter',
        valueString: this.chapter
      },
      {
        code: 'who-version',
        valueString: this.who_version
      }
    ].filter(prop => prop.valueString || prop.valueCode)
  };
};

ICD11Code.prototype.getHierarchy = async function() {
  const hierarchy = [];
  let current = this;
  
  while (current && current.parent_code) {
    const parent = await ICD11Code.findOne({
      where: { code: current.parent_code }
    });
    
    if (parent) {
      hierarchy.unshift(parent.toFHIR());
      current = parent;
    } else {
      break;
    }
  }
  
  return hierarchy;
};

// Class methods
ICD11Code.searchByText = async function(searchText, module = null, limit = 20, offset = 0) {
  const whereClause = {
    status: 'active'
  };
  
  if (module) {
    whereClause.module = module;
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
      },
      sequelize.where(
        sequelize.cast(sequelize.col('synonyms'), 'text'),
        sequelize.Op.iLike,
        `%${searchText}%`
      )
    ];
  }
  
  return this.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: ICD11Code,
        as: 'parent',
        required: false
      }
    ],
    limit,
    offset,
    order: [
      [sequelize.literal(`ts_rank(to_tsvector('english', display), plainto_tsquery('english', '${searchText}'))`), 'DESC'],
      ['display', 'ASC']
    ]
  });
};

ICD11Code.getByModule = async function(module, limit = 100, offset = 0) {
  return this.findAndCountAll({
    where: {
      module,
      status: 'active'
    },
    include: [
      {
        model: ICD11Code,
        as: 'parent',
        required: false
      }
    ],
    limit,
    offset,
    order: [['code', 'ASC']]
  });
};

ICD11Code.getChildren = async function(parentCode) {
  return this.findAll({
    where: {
      parent_code: parentCode,
      status: 'active'
    },
    order: [['code', 'ASC']]
  });
};

module.exports = ICD11Code;
