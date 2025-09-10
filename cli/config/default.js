require('dotenv').config();

const config = {
  // Default FHIR server configuration
  FHIR_SERVER: process.env.FHIR_SERVER || 'http://localhost:3000',
  
  // Request timeout
  TIMEOUT: parseInt(process.env.TIMEOUT) || 30000,
  
  // Default output format
  DEFAULT_FORMAT: process.env.DEFAULT_FORMAT || 'table',
  
  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE) || 10,
  
  // Known CodeSystem IDs (from API documentation)
  KNOWN_SYSTEMS: {
    ICD11_TM2: {
      id: 'cmfcyyugq0007srbpohh1o7s9',
      url: 'http://id.who.int/icd11/mms',
      name: 'ICD-11 TM2'
    },
    NAMASTE: {
      id: 'cmfcyytj10000srbp2as56xqh',
      url: 'https://ayush.gov.in/fhir/CodeSystem/namaste',
      name: 'NAMASTE'
    },
    UNANI: {
      id: 'cmfcz4ytd0000q19ju46acvl3',
      url: 'https://ayush.gov.in/fhir/CodeSystem/unani',
      name: 'Unani'
    }
  },
  
  // Known ConceptMap IDs
  KNOWN_CONCEPT_MAPS: {
    NAMASTE_TO_ICD11: {
      id: 'cmfczxkcw0000pau5h8g5h76g',
      name: 'NAMASTE to ICD-11 TM2 Mapping'
    }
  },
  
  // Color theme
  COLORS: {
    primary: 'cyan',
    success: 'green',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    gray: 'gray'
  }
};

module.exports = config;
