const { sequelize } = require('../config/database');
const NAMASTECode = require('./NamasteCode');
const ICD11Code = require('./ICD11Code');
const ConceptMapping = require('./ConceptMapping');

// Define all associations here to avoid circular dependency issues
const setupAssociations = () => {
  // ConceptMapping associations
  ConceptMapping.belongsTo(NAMASTECode, {
    foreignKey: 'source_code',
    targetKey: 'code',
    as: 'sourceEntity'
  });

  ConceptMapping.belongsTo(ICD11Code, {
    foreignKey: 'target_code',
    targetKey: 'code',
    as: 'targetEntity'
  });

  // NAMASTECode associations
  NAMASTECode.hasMany(ConceptMapping, {
    foreignKey: 'source_code',
    sourceKey: 'code',
    as: 'mappings'
  });

  // ICD11Code associations
  ICD11Code.hasMany(ConceptMapping, {
    foreignKey: 'target_code',
    sourceKey: 'code',
    as: 'reverseMappings'
  });

  // ICD11Code self-referencing associations (already defined in model)
  // ICD11Code.belongsTo(ICD11Code, { as: 'parent', foreignKey: 'parent_code', targetKey: 'code' });
  // ICD11Code.hasMany(ICD11Code, { as: 'children', foreignKey: 'parent_code', sourceKey: 'code' });
};

// Initialize associations
setupAssociations();

module.exports = {
  sequelize,
  NAMASTECode,
  ICD11Code,
  ConceptMapping,
  setupAssociations
};
