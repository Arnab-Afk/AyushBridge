const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

class Config {
  constructor() {
    this.configDir = path.join(os.homedir(), '.ayushbridge');
    this.configFile = path.join(this.configDir, 'config.json');
    this.defaultConfig = {
      server: 'http://localhost:3000',
      timeout: 30000,
      format: 'table',
      verbose: false,
      theme: 'default',
      pageSize: 10
    };
  }

  async init() {
    try {
      await fs.ensureDir(this.configDir);
      
      if (!(await fs.pathExists(this.configFile))) {
        await fs.writeJson(this.configFile, this.defaultConfig, { spaces: 2 });
        console.log(chalk.green(`✓ Configuration initialized at ${this.configFile}`));
      } else {
        console.log(chalk.yellow(`⚠ Configuration already exists at ${this.configFile}`));
      }
    } catch (error) {
      console.error(chalk.red(`✗ Failed to initialize configuration: ${error.message}`));
      throw error;
    }
  }

  async load() {
    try {
      if (await fs.pathExists(this.configFile)) {
        const config = await fs.readJson(this.configFile);
        return { ...this.defaultConfig, ...config };
      }
      return this.defaultConfig;
    } catch (error) {
      console.error(chalk.yellow(`⚠ Failed to load config, using defaults: ${error.message}`));
      return this.defaultConfig;
    }
  }

  async save(config) {
    try {
      await fs.ensureDir(this.configDir);
      await fs.writeJson(this.configFile, config, { spaces: 2 });
      console.log(chalk.green('✓ Configuration saved'));
    } catch (error) {
      console.error(chalk.red(`✗ Failed to save configuration: ${error.message}`));
      throw error;
    }
  }

  async set(key, value) {
    const config = await this.load();
    
    // Parse value based on key type
    if (key === 'timeout' || key === 'pageSize') {
      value = parseInt(value, 10);
      if (isNaN(value)) {
        throw new Error(`Invalid number value for ${key}: ${value}`);
      }
    } else if (key === 'verbose') {
      value = value === 'true' || value === true;
    }

    config[key] = value;
    await this.save(config);
    console.log(chalk.green(`✓ Set ${key} = ${value}`));
  }

  async get(key = null) {
    const config = await this.load();
    if (key) {
      return config[key];
    }
    return config;
  }

  async reset() {
    try {
      await fs.writeJson(this.configFile, this.defaultConfig, { spaces: 2 });
      console.log(chalk.green('✓ Configuration reset to defaults'));
    } catch (error) {
      console.error(chalk.red(`✗ Failed to reset configuration: ${error.message}`));
      throw error;
    }
  }

  async show() {
    const config = await this.load();
    
    console.log(chalk.cyan('\n╔══════════════════════════════════╗'));
    console.log(chalk.cyan('║         Configuration            ║'));
    console.log(chalk.cyan('╚══════════════════════════════════╝\n'));

    Object.entries(config).forEach(([key, value]) => {
      console.log(`${chalk.blue(key.padEnd(12))}: ${chalk.white(value)}`);
    });

    console.log(chalk.gray(`\nConfig file: ${this.configFile}`));
  }

  getConfigPath() {
    return this.configFile;
  }
}

module.exports = Config;
