const ApiClient = require('../utils/api');
const Formatter = require('../utils/formatter');
const chalk = require('chalk');

class SearchCommand {
  static async search(options) {
    const api = new ApiClient();
    
    try {
      const limit = parseInt(options.limit) || 20;
      const resourceTypes = options.type ? [options.type] : ['CodeSystem', 'ConceptMap', 'ValueSet', 'Patient', 'Condition'];
      
      console.log(Formatter.formatHeader(`Search Results for: "${options.query}"`));
      
      const allResults = [];
      
      for (const resourceType of resourceTypes) {
        try {
          console.log(chalk.cyan(`\nSearching ${resourceType}s...`));
          
          let result;
          const searchParams = { 
            _count: Math.ceil(limit / resourceTypes.length),
            q: options.query  // Generic search parameter
          };
          
          // Add resource-specific search parameters
          switch (resourceType) {
            case 'CodeSystem':
              searchParams.name = options.query;
              searchParams.title = options.query;
              result = await api.getCodeSystems(searchParams);
              break;
              
            case 'ConceptMap':
              searchParams.name = options.query;
              searchParams.title = options.query;
              result = await api.getConceptMaps(searchParams);
              break;
              
            case 'ValueSet':
              searchParams.name = options.query;
              searchParams.title = options.query;
              result = await api.getValueSets(searchParams);
              break;
              
            case 'Patient':
              searchParams.name = options.query;
              result = await api.getPatients(searchParams);
              break;
              
            case 'Condition':
              searchParams._text = options.query;
              result = await api.getConditions(searchParams);
              break;
              
            default:
              continue;
          }
          
          if (result.data.entry && result.data.entry.length > 0) {
            const resources = result.data.entry.map(entry => ({
              ...entry.resource,
              resourceType: resourceType
            }));
            
            allResults.push(...resources);
            
            if (options.format === 'table') {
              console.log(`${chalk.green('✓')} Found ${resources.length} ${resourceType}(s)`);
              
              // Show brief results for each resource type
              switch (resourceType) {
                case 'CodeSystem':
                  console.log(Formatter.formatTable(resources.slice(0, 5), [
                    { header: 'NAME', key: 'name', width: 25 },
                    { header: 'URL', key: 'url', width: 40 },
                    { header: 'STATUS', key: 'status', width: 12 }
                  ]));
                  break;
                  
                case 'ConceptMap':
                  console.log(Formatter.formatTable(resources.slice(0, 5), [
                    { header: 'NAME', key: 'name', width: 25 },
                    { header: 'SOURCE', key: 'sourceCanonical', width: 30 },
                    { header: 'TARGET', key: 'targetCanonical', width: 30 }
                  ]));
                  break;
                  
                case 'ValueSet':
                  console.log(Formatter.formatTable(resources.slice(0, 5), [
                    { header: 'NAME', key: 'name', width: 25 },
                    { header: 'URL', key: 'url', width: 40 },
                    { header: 'STATUS', key: 'status', width: 12 }
                  ]));
                  break;
                  
                case 'Patient':
                  const formattedPatients = resources.slice(0, 5).map(patient => ({
                    ...patient,
                    name: patient.name?.[0] ? 
                      `${patient.name[0].family || ''}, ${patient.name[0].given?.join(' ') || ''}`.trim() : 
                      'N/A'
                  }));
                  console.log(Formatter.formatTable(formattedPatients, [
                    { header: 'NAME', key: 'name', width: 25 },
                    { header: 'GENDER', key: 'gender', width: 10 },
                    { header: 'BIRTH DATE', key: 'birthDate', width: 12 }
                  ]));
                  break;
                  
                case 'Condition':
                  const formattedConditions = resources.slice(0, 5).map(condition => ({
                    ...condition,
                    code: condition.code?.coding?.[0]?.code || 'N/A',
                    display: condition.code?.coding?.[0]?.display || condition.code?.text || 'N/A'
                  }));
                  console.log(Formatter.formatTable(formattedConditions, [
                    { header: 'CODE', key: 'code', width: 15 },
                    { header: 'DISPLAY', key: 'display', width: 30 },
                    { header: 'SUBJECT', key: 'subject.reference', width: 25 }
                  ]));
                  break;
              }
            }
          } else {
            console.log(chalk.gray(`No ${resourceType}s found`));
          }
          
        } catch (error) {
          console.log(chalk.yellow(`⚠ Error searching ${resourceType}s: ${error.message}`));
        }
      }
      
      // Summary
      if (allResults.length > 0) {
        console.log('\n' + Formatter.formatHeader('Search Summary'));
        console.log(`${chalk.blue('Total Results')}: ${allResults.length}`);
        
        const resultsByType = {};
        allResults.forEach(result => {
          resultsByType[result.resourceType] = (resultsByType[result.resourceType] || 0) + 1;
        });
        
        Object.entries(resultsByType).forEach(([type, count]) => {
          console.log(`${chalk.blue(type)}: ${count}`);
        });
        
        if (options.format === 'json') {
          console.log('\n' + chalk.cyan('Full Results:'));
          console.log(Formatter.formatJson(allResults));
        }
      } else {
        console.log('\n' + chalk.yellow('No results found for your search query.'));
        console.log('\n' + chalk.blue('Search Tips:'));
        console.log('• Try using broader terms');
        console.log('• Check spelling and try variations');
        console.log('• Use specific resource type filters with --type');
        console.log('• Search by specific fields like name, code, or display text');
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Search failed: ${error.message}`));
      process.exit(1);
    }
  }
}

module.exports = SearchCommand;
