const ApiClient = require('../utils/api');
const Formatter = require('../utils/formatter');
const FileUtils = require('../utils/file');
const chalk = require('chalk');

class ConceptMapCommand {
  static async list(options) {
    const api = new ApiClient();
    
    try {
      const limit = parseInt(options.limit) || 10;
      const params = { _count: limit };
      
      const result = await api.withSpinner(
        api.getConceptMaps(params),
        'Fetching ConceptMaps...'
      );
      
      if (!result.data.entry || result.data.entry.length === 0) {
        console.log(chalk.yellow('No ConceptMaps found'));
        return;
      }
      
      const conceptMaps = result.data.entry.map(entry => entry.resource);
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(conceptMaps));
      } else {
        console.log(Formatter.formatHeader(`ConceptMaps (${conceptMaps.length})`));
        console.log(Formatter.formatConceptMapTable(conceptMaps));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to list ConceptMaps: ${error.message}`));
      process.exit(1);
    }
  }

  static async get(id, options) {
    const api = new ApiClient();
    
    try {
      const result = await api.withSpinner(
        api.getConceptMap(id),
        `Fetching ConceptMap ${id}...`
      );
      
      if (options.format === 'table') {
        console.log(Formatter.formatHeader('ConceptMap Details'));
        
        const conceptMap = result.data;
        const details = [
          ['ID', conceptMap.id],
          ['Name', conceptMap.name],
          ['Title', conceptMap.title],
          ['URL', conceptMap.url],
          ['Version', conceptMap.version],
          ['Status', conceptMap.status],
          ['Publisher', conceptMap.publisher],
          ['Description', conceptMap.description],
          ['Source', conceptMap.sourceCanonical],
          ['Target', conceptMap.targetCanonical]
        ];
        
        console.log(Formatter.formatTable(details.map(([key, value]) => ({ Property: key, Value: value || 'N/A' }))));
        
        if (conceptMap.group && conceptMap.group.length > 0) {
          console.log('\n' + chalk.cyan('Mappings:'));
          conceptMap.group.forEach((group, groupIndex) => {
            if (group.element && group.element.length > 0) {
              console.log(`\n${chalk.blue(`Group ${groupIndex + 1}:`)} ${group.source} → ${group.target}`);
              
              const mappings = [];
              group.element.forEach(element => {
                if (element.target && element.target.length > 0) {
                  element.target.forEach(target => {
                    mappings.push({
                      sourceCode: element.code,
                      targetCode: target.code,
                      equivalence: target.equivalence || 'N/A'
                    });
                  });
                }
              });
              
              if (mappings.length > 0) {
                console.log(Formatter.formatTable(mappings, [
                  { header: 'SOURCE CODE', key: 'sourceCode', width: 20 },
                  { header: 'TARGET CODE', key: 'targetCode', width: 20 },
                  { header: 'EQUIVALENCE', key: 'equivalence', width: 15 }
                ]));
              }
            }
          });
        }
      } else {
        console.log(Formatter.formatJson(result.data));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to get ConceptMap: ${error.message}`));
      process.exit(1);
    }
  }

  static async create(filePath) {
    const api = new ApiClient();
    
    try {
      const data = await FileUtils.readJsonFile(filePath);
      await FileUtils.validateFhirResource(data, 'ConceptMap');
      
      const result = await api.withSpinner(
        api.createConceptMap(data),
        'Creating ConceptMap...'
      );
      
      console.log(Formatter.formatSuccess(`ConceptMap created successfully`));
      console.log(`${chalk.blue('ID')}: ${result.data.id}`);
      console.log(`${chalk.blue('URL')}: ${result.data.url}`);
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to create ConceptMap: ${error.message}`));
      process.exit(1);
    }
  }

  static async translate(conceptMapId, code, options) {
    const api = new ApiClient();
    
    try {
      const result = await api.withSpinner(
        api.translateCode(conceptMapId, code, options.system),
        `Translating code ${code} using ConceptMap ${conceptMapId}...`
      );
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(result.data));
      } else {
        console.log(Formatter.formatHeader(`Code Translation: ${code}`));
        console.log(Formatter.formatTranslationResult(result.data));
        
        // Show source system info
        console.log(`\n${chalk.blue('Source System')}: ${options.system}`);
        console.log(`${chalk.blue('Source Code')}: ${code}`);
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to translate code: ${error.message}`));
      process.exit(1);
    }
  }
}

module.exports = ConceptMapCommand;
