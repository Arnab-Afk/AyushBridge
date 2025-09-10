const ApiClient = require('../utils/api');
const Formatter = require('../utils/formatter');
const chalk = require('chalk');

class HealthCommand {
  static async check(options) {
    const api = new ApiClient();
    
    try {
      console.log(Formatter.formatHeader('Health Check'));
      
      // Check main health endpoint
      const healthResult = await api.withSpinner(
        api.healthCheck(),
        'Checking server health...'
      );
      
      console.log(Formatter.formatSuccess('Server is healthy'));
      console.log(`${chalk.blue('Status')}: ${healthResult.data.status}`);
      console.log(`${chalk.blue('Version')}: ${healthResult.data.version}`);
      console.log(`${chalk.blue('Service')}: ${healthResult.data.service}`);
      console.log(`${chalk.blue('Timestamp')}: ${healthResult.data.timestamp}`);
      
      // Check FHIR capability statement
      console.log('\n' + chalk.cyan('Checking FHIR capabilities...'));
      const capabilityResult = await api.withSpinner(
        api.getCapabilityStatement(),
        'Fetching capability statement...'
      );
      
      console.log(Formatter.formatSuccess('FHIR server is operational'));
      console.log(`${chalk.blue('FHIR Version')}: ${capabilityResult.data.fhirVersion}`);
      console.log(`${chalk.blue('Publisher')}: ${capabilityResult.data.publisher}`);
      console.log(`${chalk.blue('Software')}: ${capabilityResult.data.software.name} v${capabilityResult.data.software.version}`);
      
      // List supported resources
      if (capabilityResult.data.rest && capabilityResult.data.rest[0] && capabilityResult.data.rest[0].resource) {
        const resources = capabilityResult.data.rest[0].resource.map(r => r.type);
        console.log(`${chalk.blue('Supported Resources')}: ${resources.join(', ')}`);
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Health check failed: ${error.message}`));
      
      if (error.message.includes('ECONNREFUSED') || error.message.includes('No response from server')) {
        console.log(chalk.yellow('\nTroubleshooting:'));
        console.log('• Make sure the FHIR server is running');
        console.log('• Check if the server URL is correct (default: http://localhost:3000)');
        console.log('• Verify network connectivity');
        console.log(`• Use --server flag to specify a different server URL`);
      }
      
      process.exit(1);
    }
  }
}

module.exports = HealthCommand;
