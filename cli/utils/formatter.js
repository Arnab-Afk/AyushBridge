const chalk = require('chalk');
const Table = require('cli-table3');

class Formatter {
  static formatJson(data, colorize = true) {
    const json = JSON.stringify(data, null, 2);
    if (colorize) {
      return this.colorizeJson(json);
    }
    return json;
  }

  static colorizeJson(json) {
    return json
      .replace(/(".*?")\s*:/g, chalk.blue('$1') + ':')
      .replace(/:\s*(".*?")/g, ': ' + chalk.green('$1'))
      .replace(/:\s*(true|false)/g, ': ' + chalk.yellow('$1'))
      .replace(/:\s*(null)/g, ': ' + chalk.gray('$1'))
      .replace(/:\s*(\d+)/g, ': ' + chalk.magenta('$1'));
  }

  static formatTable(data, columns = null) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return chalk.yellow('No data to display');
    }

    // Auto-detect columns if not provided
    if (!columns) {
      const firstItem = data[0];
      columns = Object.keys(firstItem).map(key => ({
        header: key.toUpperCase(),
        key: key,
        width: Math.min(Math.max(key.length + 2, 10), 50)
      }));
    }

    const table = new Table({
      head: columns.map(col => chalk.cyan(col.header)),
      colWidths: columns.map(col => col.width || 20),
      style: {
        head: ['cyan'],
        border: ['gray']
      }
    });

    data.forEach(item => {
      const row = columns.map(col => {
        let value = this.getNestedValue(item, col.key);
        if (value === undefined || value === null) {
          return chalk.gray('N/A');
        }
        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        return this.truncateText(String(value), col.width - 4);
      });
      table.push(row);
    });

    return table.toString();
  }

  static formatCodeSystemTable(codeSystems) {
    const columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'NAME', key: 'name', width: 25 },
      { header: 'URL', key: 'url', width: 40 },
      { header: 'STATUS', key: 'status', width: 12 },
      { header: 'VERSION', key: 'version', width: 12 },
      { header: 'COUNT', key: 'count', width: 8 }
    ];

    return this.formatTable(codeSystems, columns);
  }

  static formatConceptMapTable(conceptMaps) {
    const columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'NAME', key: 'name', width: 25 },
      { header: 'SOURCE', key: 'sourceCanonical', width: 35 },
      { header: 'TARGET', key: 'targetCanonical', width: 35 },
      { header: 'STATUS', key: 'status', width: 12 }
    ];

    return this.formatTable(conceptMaps, columns);
  }

  static formatValueSetTable(valueSets) {
    const columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'NAME', key: 'name', width: 25 },
      { header: 'URL', key: 'url', width: 40 },
      { header: 'STATUS', key: 'status', width: 12 },
      { header: 'VERSION', key: 'version', width: 12 }
    ];

    return this.formatTable(valueSets, columns);
  }

  static formatPatientTable(patients) {
    const columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'NAME', key: 'name', width: 25 },
      { header: 'GENDER', key: 'gender', width: 10 },
      { header: 'BIRTH DATE', key: 'birthDate', width: 12 },
      { header: 'ACTIVE', key: 'active', width: 8 }
    ];

    const formattedPatients = patients.map(patient => ({
      ...patient,
      name: patient.name?.[0] ? 
        `${patient.name[0].family || ''}, ${patient.name[0].given?.join(' ') || ''}`.trim() : 
        'N/A'
    }));

    return this.formatTable(formattedPatients, columns);
  }

  static formatConditionTable(conditions) {
    const columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'CODE', key: 'code', width: 15 },
      { header: 'DISPLAY', key: 'display', width: 30 },
      { header: 'STATUS', key: 'clinicalStatus', width: 15 },
      { header: 'PATIENT', key: 'subject', width: 25 }
    ];

    const formattedConditions = conditions.map(condition => ({
      ...condition,
      code: condition.code?.coding?.[0]?.code || 'N/A',
      display: condition.code?.coding?.[0]?.display || condition.code?.text || 'N/A',
      clinicalStatus: condition.clinicalStatus?.coding?.[0]?.code || 'N/A',
      subject: condition.subject?.reference || 'N/A'
    }));

    return this.formatTable(formattedConditions, columns);
  }

  static formatLookupResult(result) {
    if (!result.parameter) {
      return chalk.yellow('No lookup result found');
    }

    const table = new Table({
      head: [chalk.cyan('PROPERTY'), chalk.cyan('VALUE')],
      colWidths: [20, 60],
      style: {
        head: ['cyan'],
        border: ['gray']
      }
    });

    result.parameter.forEach(param => {
      const name = param.name;
      let value = param.valueString || param.valueCode || param.valueBoolean || 
                  param.valueUri || param.valueInteger || 'N/A';
      
      if (typeof value === 'object') {
        value = JSON.stringify(value, null, 2);
      }

      table.push([chalk.blue(name), this.truncateText(String(value), 56)]);
    });

    return table.toString();
  }

  static formatTranslationResult(result) {
    if (!result.parameter) {
      return chalk.yellow('No translation result found');
    }

    const resultParam = result.parameter.find(p => p.name === 'result');
    const isMatch = resultParam?.valueBoolean === true;

    if (!isMatch) {
      return chalk.red('No translation found');
    }

    const matchParams = result.parameter.filter(p => p.name === 'match');
    if (matchParams.length === 0) {
      return chalk.yellow('Translation found but no details available');
    }

    const table = new Table({
      head: [chalk.cyan('SOURCE'), chalk.cyan('TARGET'), chalk.cyan('EQUIVALENCE')],
      colWidths: [25, 25, 15],
      style: {
        head: ['cyan'],
        border: ['gray']
      }
    });

    matchParams.forEach(match => {
      const concept = match.part?.find(p => p.name === 'concept');
      const equivalence = match.part?.find(p => p.name === 'equivalence');
      
      const sourceCode = concept?.valueCoding?.code || 'N/A';
      const targetCode = concept?.valueCoding?.code || 'N/A';
      const equiv = equivalence?.valueCode || 'N/A';

      table.push([sourceCode, targetCode, equiv]);
    });

    return table.toString();
  }

  static getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  static truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }

  static formatSuccess(message) {
    return chalk.green('✓ ' + message);
  }

  static formatError(message) {
    return chalk.red('✗ ' + message);
  }

  static formatWarning(message) {
    return chalk.yellow('⚠ ' + message);
  }

  static formatInfo(message) {
    return chalk.blue('ℹ ' + message);
  }

  static formatHeader(text) {
    const line = '═'.repeat(text.length + 4);
    return chalk.cyan(`\n╔${line}╗\n║  ${chalk.white.bold(text)}  ║\n╚${line}╝\n`);
  }
}

module.exports = Formatter;
