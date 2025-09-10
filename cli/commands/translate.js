const ApiClient = require('../utils/api');
const Formatter = require('../utils/formatter');
const chalk = require('chalk');

class TranslateCommand {
  static async translate(options) {
    const api = new ApiClient();
    
    try {
      // First, find ConceptMaps that map from source to target system
      const conceptMapsResult = await api.withSpinner(
        api.getConceptMaps({ _count: 100 }),
        'Finding appropriate ConceptMap...'
      );
      
      if (!conceptMapsResult.data.entry || conceptMapsResult.data.entry.length === 0) {
        console.error(Formatter.formatError('No ConceptMaps found'));
        process.exit(1);
      }
      
      // Find ConceptMap that maps from source to target system
      const conceptMaps = conceptMapsResult.data.entry.map(entry => entry.resource);
      const suitableMap = conceptMaps.find(cm => 
        cm.sourceCanonical === options.from || 
        (cm.group && cm.group.some(g => g.source === options.from))
      );
      
      if (!suitableMap) {
        console.error(Formatter.formatError(`No ConceptMap found that maps from ${options.from} to ${options.to}`));
        
        // Show available ConceptMaps
        console.log('\n' + chalk.yellow('Available ConceptMaps:'));
        conceptMaps.forEach(cm => {
          console.log(`  • ${cm.name || cm.id}: ${cm.sourceCanonical || 'Unknown'} → ${cm.targetCanonical || 'Unknown'}`);
        });
        
        process.exit(1);
      }
      
      const result = await api.withSpinner(
        api.translateCode(suitableMap.id, options.code, options.from, options.to),
        `Translating code ${options.code} from ${options.from} to ${options.to}...`
      );
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(result.data));
      } else {
        console.log(Formatter.formatHeader('Code Translation Result'));
        console.log(`${chalk.blue('Source Code')}: ${options.code}`);
        console.log(`${chalk.blue('Source System')}: ${options.from}`);
        console.log(`${chalk.blue('Target System')}: ${options.to}`);
        console.log(`${chalk.blue('ConceptMap')}: ${suitableMap.name || suitableMap.id}`);
        
        console.log('\n' + Formatter.formatTranslationResult(result.data));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to translate code: ${error.message}`));
      process.exit(1);
    }
  }
}

module.exports = TranslateCommand;
