const ApiClient = require('../utils/api');
const Formatter = require('../utils/formatter');
const FileUtils = require('../utils/file');
const chalk = require('chalk');

class PatientCommand {
  static async list(options) {
    const api = new ApiClient();
    
    try {
      const limit = parseInt(options.limit) || 10;
      const params = { _count: limit };
      
      const result = await api.withSpinner(
        api.getPatients(params),
        'Fetching Patients...'
      );
      
      if (!result.data.entry || result.data.entry.length === 0) {
        console.log(chalk.yellow('No Patients found'));
        return;
      }
      
      const patients = result.data.entry.map(entry => entry.resource);
      
      if (options.format === 'json') {
        console.log(Formatter.formatJson(patients));
      } else {
        console.log(Formatter.formatHeader(`Patients (${patients.length})`));
        console.log(Formatter.formatPatientTable(patients));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to list Patients: ${error.message}`));
      process.exit(1);
    }
  }

  static async get(id, options) {
    const api = new ApiClient();
    
    try {
      const result = await api.withSpinner(
        api.getPatient(id),
        `Fetching Patient ${id}...`
      );
      
      if (options.format === 'table') {
        console.log(Formatter.formatHeader('Patient Details'));
        
        const patient = result.data;
        const details = [
          ['ID', patient.id],
          ['Active', patient.active ? 'Yes' : 'No'],
          ['Gender', patient.gender],
          ['Birth Date', patient.birthDate]
        ];
        
        // Add name information
        if (patient.name && patient.name.length > 0) {
          const primaryName = patient.name[0];
          const fullName = `${primaryName.family || ''}, ${primaryName.given?.join(' ') || ''}`.trim();
          details.push(['Name', fullName]);
          details.push(['Name Use', primaryName.use || 'N/A']);
        }
        
        // Add address information
        if (patient.address && patient.address.length > 0) {
          const address = patient.address[0];
          const addressLine = [
            ...(address.line || []),
            address.city,
            address.state,
            address.postalCode,
            address.country
          ].filter(Boolean).join(', ');
          details.push(['Address', addressLine]);
        }
        
        console.log(Formatter.formatTable(details.map(([key, value]) => ({ Property: key, Value: value || 'N/A' }))));
        
        // Show additional names if any
        if (patient.name && patient.name.length > 1) {
          console.log('\n' + chalk.cyan('Additional Names:'));
          const additionalNames = patient.name.slice(1);
          console.log(Formatter.formatTable(additionalNames.map(name => ({
            Name: `${name.family || ''}, ${name.given?.join(' ') || ''}`.trim(),
            Use: name.use || 'N/A'
          }))));
        }
        
        // Show additional addresses if any
        if (patient.address && patient.address.length > 1) {
          console.log('\n' + chalk.cyan('Additional Addresses:'));
          const additionalAddresses = patient.address.slice(1);
          console.log(Formatter.formatTable(additionalAddresses.map(address => ({
            Address: [
              ...(address.line || []),
              address.city,
              address.state,
              address.postalCode,
              address.country
            ].filter(Boolean).join(', '),
            Use: address.use || 'N/A'
          }))));
        }
      } else {
        console.log(Formatter.formatJson(result.data));
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to get Patient: ${error.message}`));
      process.exit(1);
    }
  }

  static async create(filePath) {
    const api = new ApiClient();
    
    try {
      const data = await FileUtils.readJsonFile(filePath);
      await FileUtils.validateFhirResource(data, 'Patient');
      
      const result = await api.withSpinner(
        api.createPatient(data),
        'Creating Patient...'
      );
      
      console.log(Formatter.formatSuccess(`Patient created successfully`));
      console.log(`${chalk.blue('ID')}: ${result.data.id}`);
      
      // Show basic info about created patient
      if (result.data.name && result.data.name.length > 0) {
        const name = result.data.name[0];
        const fullName = `${name.family || ''}, ${name.given?.join(' ') || ''}`.trim();
        console.log(`${chalk.blue('Name')}: ${fullName}`);
      }
      
      if (result.data.gender) {
        console.log(`${chalk.blue('Gender')}: ${result.data.gender}`);
      }
      
      if (result.data.birthDate) {
        console.log(`${chalk.blue('Birth Date')}: ${result.data.birthDate}`);
      }
      
    } catch (error) {
      console.error(Formatter.formatError(`Failed to create Patient: ${error.message}`));
      process.exit(1);
    }
  }
}

module.exports = PatientCommand;
