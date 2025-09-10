const ApiClient = require('../utils/api');
const Formatter = require('../utils/formatter');
const chalk = require('chalk');

class TerminologyCommand {
  static async namasteToIcd11(code, options) {
    const api = new ApiClient();
    
    try {
      // Use the NAMASTE to ICD-11 ConceptMap (from API quick reference)
      const conceptMapId = 'cmfczxkcw0000pau5h8g5h76g';
      const namasteSystem = 'https://ayush.gov.in/fhir/CodeSystem/namaste';
      
      const result = await api.withSpinner(
        api.translateCode(conceptMapId, code, namasteSystem),
        `Translating NAMASTE code ${code} to ICD-11 TM2...`
      );
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(result.data));
      } else {
        console.log(Formatter.formatHeader(`NAMASTE to ICD-11 TM2 Translation`));
        console.log(`${chalk.blue('Source Code')}: ${code}`);
        console.log(`${chalk.blue('Source System')}: ${namasteSystem}`);
        console.log(Formatter.formatTranslationResult(result.data));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to translate NAMASTE code: ${error.message}`));
      process.exit(1);
    }
  }

  static async icd11Lookup(code, options) {
    const api = new ApiClient();
    
    try {
      // Use the ICD-11 TM2 CodeSystem (from API quick reference)
      const codeSystemId = 'cmfcyyugq0007srbpohh1o7s9';
      
      const result = await api.withSpinner(
        api.lookupCode(codeSystemId, code),
        `Looking up ICD-11 TM2 code ${code}...`
      );
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(result.data));
      } else {
        console.log(Formatter.formatHeader(`ICD-11 TM2 Code Lookup: ${code}`));
        console.log(Formatter.formatLookupResult(result.data));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to lookup ICD-11 code: ${error.message}`));
      process.exit(1);
    }
  }

  static async listSystems(options) {
    const api = new ApiClient();
    
    try {
      const result = await api.withSpinner(
        api.getCodeSystems({ _count: 100 }),
        'Fetching available code systems...'
      );
      
      if (!result.data.entry || result.data.entry.length === 0) {
        console.log(chalk.yellow('No code systems found'));
        return;
      }
      
      const codeSystems = result.data.entry.map(entry => entry.resource);
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(codeSystems));
      } else {
        console.log(Formatter.formatHeader('Available Code Systems'));
        
        // Highlight known systems
        const knownSystems = {
          'https://ayush.gov.in/fhir/CodeSystem/namaste': 'NAMASTE',
          'https://ayush.gov.in/fhir/CodeSystem/unani': 'Unani',
          'http://id.who.int/icd11/mms': 'ICD-11 TM2'
        };
        
        const systemData = codeSystems.map(cs => ({
          id: cs.id,
          name: cs.name,
          url: cs.url,
          status: cs.status,
          type: knownSystems[cs.url] || 'Other',
          count: cs.count || 'N/A'
        }));
        
        console.log(Formatter.formatTable(systemData, [
          { header: 'TYPE', key: 'type', width: 15 },
          { header: 'NAME', key: 'name', width: 25 },
          { header: 'ID', key: 'id', width: 30 },
          { header: 'STATUS', key: 'status', width: 12 },
          { header: 'COUNT', key: 'count', width: 8 }
        ]));
        
        console.log('\n' + chalk.cyan('Key System IDs:'));
        console.log(`${chalk.blue('ICD-11 TM2')}: cmfcyyugq0007srbpohh1o7s9`);
        console.log(`${chalk.blue('NAMASTE')}: cmfcyytj10000srbp2as56xqh`);
        console.log(`${chalk.blue('Unani')}: cmfcz4ytd0000q19ju46acvl3`);
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to list code systems: ${error.message}`));
      process.exit(1);
    }
  }
}

module.exports = TerminologyCommand;
