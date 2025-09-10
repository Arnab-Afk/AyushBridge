const ApiClient = require('../utils/api');
const Formatter = require('../utils/formatter');
const FileUtils = require('../utils/file');
const chalk = require('chalk');

class ConditionCommand {
  static async list(options) {
    const api = new ApiClient();
    
    try {
      const limit = parseInt(options.limit) || 10;
      const params = { _count: limit };
      
      const result = await api.withSpinner(
        api.getConditions(params),
        'Fetching Conditions...'
      );
      
      if (!result.data.entry || result.data.entry.length === 0) {
        console.log(chalk.yellow('No Conditions found'));
        return;
      }
      
      const conditions = result.data.entry.map(entry => entry.resource);
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(conditions));
      } else {
        console.log(Formatter.formatHeader(`Conditions (${conditions.length})`));
        console.log(Formatter.formatConditionTable(conditions));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to list Conditions: ${error.message}`));
      process.exit(1);
    }
  }

  static async get(id, options) {
    const api = new ApiClient();
    
    try {
      const result = await api.withSpinner(
        api.getCondition(id),
        `Fetching Condition ${id}...`
      );
      
      if (options.format === 'table') {
        console.log(Formatter.formatHeader('Condition Details'));
        
        const condition = result.data;
        const details = [
          ['ID', condition.id],
          ['Subject', condition.subject?.reference],
          ['Clinical Status', condition.clinicalStatus?.coding?.[0]?.code],
          ['Verification Status', condition.verificationStatus?.coding?.[0]?.code],
          ['Category', condition.category?.[0]?.coding?.[0]?.code],
          ['Severity', condition.severity?.coding?.[0]?.code],
          ['Onset Date', condition.onsetDateTime],
          ['Recorded Date', condition.recordedDate]
        ];
        
        console.log(Formatter.formatTable(details.map(([key, value]) => ({ Property: key, Value: value || 'N/A' }))));
        
        // Show code information
        if (condition.code) {
          console.log('\n' + chalk.cyan('Code Information:'));
          
          if (condition.code.coding && condition.code.coding.length > 0) {
            console.log(Formatter.formatTable(condition.code.coding, [
              { header: 'SYSTEM', key: 'system', width: 40 },
              { header: 'CODE', key: 'code', width: 15 },
              { header: 'DISPLAY', key: 'display', width: 40 }
            ]));
          }
          
          if (condition.code.text) {
            console.log(`${chalk.blue('Text')}: ${condition.code.text}`);
          }
        }
        
        // Show evidence if any
        if (condition.evidence && condition.evidence.length > 0) {
          console.log('\n' + chalk.cyan('Evidence:'));
          condition.evidence.forEach((evidence, index) => {
            console.log(`\n${chalk.blue(`Evidence ${index + 1}:`)}`);
            if (evidence.code && evidence.code.length > 0) {
              evidence.code.forEach(code => {
                if (code.coding && code.coding.length > 0) {
                  console.log(Formatter.formatTable(code.coding, [
                    { header: 'SYSTEM', key: 'system', width: 40 },
                    { header: 'CODE', key: 'code', width: 15 },
                    { header: 'DISPLAY', key: 'display', width: 40 }
                  ]));
                }
              });
            }
          });
        }
      } else {
        console.log(Formatter.formatJson(result.data));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to get Condition: ${error.message}`));
      process.exit(1);
    }
  }

  static async create(filePath) {
    const api = new ApiClient();
    
    try {
      const data = await FileUtils.readJsonFile(filePath);
      await FileUtils.validateFhirResource(data, 'Condition');
      
      const result = await api.withSpinner(
        api.createCondition(data),
        'Creating Condition...'
      );
      
      console.log(Formatter.formatSuccess(`Condition created successfully`));
      console.log(`${chalk.blue('ID')}: ${result.data.id}`);
      console.log(`${chalk.blue('Subject')}: ${result.data.subject?.reference || 'N/A'}`);
      
      // Show code information
      if (result.data.code) {
        const coding = result.data.code.coding?.[0];
        if (coding) {
          console.log(`${chalk.blue('Code')}: ${coding.code} (${coding.display || 'No display'})`);
          console.log(`${chalk.blue('System')}: ${coding.system || 'No system'}`);
        } else if (result.data.code.text) {
          console.log(`${chalk.blue('Code Text')}: ${result.data.code.text}`);
        }
      }
      
      // Show status
      const clinicalStatus = result.data.clinicalStatus?.coding?.[0]?.code;
      if (clinicalStatus) {
        console.log(`${chalk.blue('Clinical Status')}: ${clinicalStatus}`);
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to create Condition: ${error.message}`));
      process.exit(1);
    }
  }
}

module.exports = ConditionCommand;
