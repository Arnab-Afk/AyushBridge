const Config = require('../utils/config');
const { program } = require('commander');
const chalk = require('chalk');

class ConfigCommand {
  static init() {
    return program
      .createCommand('init')
      .description('Initialize CLI configuration')
      .action(async () => {
        const config = new Config();
        await config.init();
      });
  }

  static show() {
    return program
      .createCommand('show')
      .description('Show current configuration')
      .action(async () => {
        const config = new Config();
        await config.show();
      });
  }

  static set() {
    return program
      .createCommand('set')
      .description('Set configuration value')
      .argument('<key>', 'Configuration key')
      .argument('<value>', 'Configuration value')
      .action(async (key, value) => {
        const config = new Config();
        
        const validKeys = ['server', 'timeout', 'format', 'verbose', 'theme', 'pageSize'];
        if (!validKeys.includes(key)) {
          console.error(chalk.red(`Invalid configuration key: ${key}`));
          console.log(chalk.blue(`Valid keys: ${validKeys.join(', ')}`));
          process.exit(1);
        }
        
        await config.set(key, value);
      });
  }

  static reset() {
    return program
      .createCommand('reset')
      .description('Reset configuration to defaults')
      .action(async () => {
        const config = new Config();
        await config.reset();
      });
  }
}

module.exports = ConfigCommand;
