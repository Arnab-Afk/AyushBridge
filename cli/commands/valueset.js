const ApiClient = require('../utils/api');
const Formatter = require('../utils/formatter');
const chalk = require('chalk');

class ValueSetCommand {
  static async list(options) {
    const api = new ApiClient();
    
    try {
      const limit = parseInt(options.limit) || 10;
      const params = { _count: limit };
      
      const result = await api.withSpinner(
        api.getValueSets(params),
        'Fetching ValueSets...'
      );
      
      if (!result.data.entry || result.data.entry.length === 0) {
        console.log(chalk.yellow('No ValueSets found'));
        return;
      }
      
      const valueSets = result.data.entry.map(entry => entry.resource);
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(valueSets));
      } else {
        console.log(Formatter.formatHeader(`ValueSets (${valueSets.length})`));
        console.log(Formatter.formatValueSetTable(valueSets));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to list ValueSets: ${error.message}`));
      process.exit(1);
    }
  }

  static async get(id, options) {
    const api = new ApiClient();
    
    try {
      const result = await api.withSpinner(
        api.getValueSet(id),
        `Fetching ValueSet ${id}...`
      );
      
      if (options.format === 'table') {
        console.log(Formatter.formatHeader('ValueSet Details'));
        
        const valueSet = result.data;
        const details = [
          ['ID', valueSet.id],
          ['Name', valueSet.name],
          ['Title', valueSet.title],
          ['URL', valueSet.url],
          ['Version', valueSet.version],
          ['Status', valueSet.status],
          ['Publisher', valueSet.publisher],
          ['Description', valueSet.description]
        ];
        
        console.log(Formatter.formatTable(details.map(([key, value]) => ({ Property: key, Value: value || 'N/A' }))));
        
        if (valueSet.compose && valueSet.compose.include) {
          console.log('\n' + chalk.cyan('Included Concepts:'));
          valueSet.compose.include.forEach((include, index) => {
            console.log(`\n${chalk.blue(`Include ${index + 1}:`)} ${include.system || 'No system specified'}`);
            
            if (include.concept && include.concept.length > 0) {
              console.log(Formatter.formatTable(include.concept, [
                { header: 'CODE', key: 'code', width: 20 },
                { header: 'DISPLAY', key: 'display', width: 40 }
              ]));
            }
          });
        }
      } else {
        console.log(Formatter.formatJson(result.data));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to get ValueSet: ${error.message}`));
      process.exit(1);
    }
  }

  static async expand(id, options) {
    const api = new ApiClient();
    
    try {
      const result = await api.withSpinner(
        api.expandValueSet(id),
        `Expanding ValueSet ${id}...`
      );
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(result.data));
      } else {
        console.log(Formatter.formatHeader(`ValueSet Expansion: ${id}`));
        
        if (result.data.expansion && result.data.expansion.contains) {
          const concepts = result.data.expansion.contains;
          console.log(`${chalk.blue('Total Concepts')}: ${concepts.length}`);
          
          console.log('\n' + Formatter.formatTable(concepts, [
            { header: 'SYSTEM', key: 'system', width: 35 },
            { header: 'CODE', key: 'code', width: 20 },
            { header: 'DISPLAY', key: 'display', width: 40 }
          ]));
        } else {
          console.log(chalk.yellow('No expansion available for this ValueSet'));
        }
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to expand ValueSet: ${error.message}`));
      process.exit(1);
    }
  }
}

module.exports = ValueSetCommand;
