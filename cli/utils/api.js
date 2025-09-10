const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');

class ApiClient {
  constructor(baseURL = null) {
    this.baseURL = baseURL || process.env.FHIR_SERVER || 'http://localhost:3000';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        if (process.env.VERBOSE) {
          console.log(chalk.gray(`→ ${config.method?.toUpperCase()} ${config.url}`));
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        if (process.env.VERBOSE) {
          console.log(chalk.gray(`← ${response.status} ${response.config.url}`));
        }
        return response;
      },
      (error) => {
        if (error.response) {
          const { status, statusText, data } = error.response;
          const errorMsg = data?.issue?.[0]?.details?.text || data?.message || statusText;
          throw new Error(`HTTP ${status}: ${errorMsg}`);
        } else if (error.request) {
          throw new Error('No response from server. Check if the FHIR server is running.');
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      }
    );
  }

  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  // FHIR-specific methods
  async healthCheck() {
    return this.get('/health');
  }

  async getCapabilityStatement() {
    return this.get('/fhir/metadata');
  }

  // CodeSystem operations
  async getCodeSystems(params = {}) {
    return this.get('/fhir/CodeSystem', { params });
  }

  async getCodeSystem(id) {
    return this.get(`/fhir/CodeSystem/${id}`);
  }

  async createCodeSystem(data) {
    return this.post('/fhir/CodeSystem', data);
  }

  async updateCodeSystem(id, data) {
    return this.put(`/fhir/CodeSystem/${id}`, data);
  }

  async deleteCodeSystem(id) {
    return this.delete(`/fhir/CodeSystem/${id}`);
  }

  async lookupCode(codeSystemId, code, system = null) {
    const params = {
      parameter: [
        { name: 'code', valueCode: code }
      ]
    };
    if (system) {
      params.parameter.push({ name: 'system', valueUri: system });
    }
    return this.post(`/fhir/CodeSystem/${codeSystemId}/$lookup`, params);
  }

  async validateCode(codeSystemId, code, system = null) {
    const params = {
      parameter: [
        { name: 'code', valueCode: code }
      ]
    };
    if (system) {
      params.parameter.push({ name: 'system', valueUri: system });
    }
    return this.post(`/fhir/CodeSystem/${codeSystemId}/$validate-code`, params);
  }

  // ConceptMap operations
  async getConceptMaps(params = {}) {
    return this.get('/fhir/ConceptMap', { params });
  }

  async getConceptMap(id) {
    return this.get(`/fhir/ConceptMap/${id}`);
  }

  async createConceptMap(data) {
    return this.post('/fhir/ConceptMap', data);
  }

  async translateCode(conceptMapId, code, sourceSystem, targetSystem = null) {
    const params = {
      parameter: [
        { name: 'code', valueCode: code },
        { name: 'system', valueUri: sourceSystem }
      ]
    };
    if (targetSystem) {
      params.parameter.push({ name: 'targetsystem', valueUri: targetSystem });
    }
    return this.post(`/fhir/ConceptMap/${conceptMapId}/$translate`, params);
  }

  // ValueSet operations
  async getValueSets(params = {}) {
    return this.get('/fhir/ValueSet', { params });
  }

  async getValueSet(id) {
    return this.get(`/fhir/ValueSet/${id}`);
  }

  async expandValueSet(id, params = {}) {
    return this.get(`/fhir/ValueSet/${id}/$expand`, { params });
  }

  // Patient operations
  async getPatients(params = {}) {
    return this.get('/fhir/Patient', { params });
  }

  async getPatient(id) {
    return this.get(`/fhir/Patient/${id}`);
  }

  async createPatient(data) {
    return this.post('/fhir/Patient', data);
  }

  // Condition operations
  async getConditions(params = {}) {
    return this.get('/fhir/Condition', { params });
  }

  async getCondition(id) {
    return this.get(`/fhir/Condition/${id}`);
  }

  async createCondition(data) {
    return this.post('/fhir/Condition', data);
  }

  // Utility method for loading spinner
  async withSpinner(promise, text = 'Loading...') {
    const spinner = ora(text).start();
    try {
      const result = await promise;
      spinner.succeed();
      return result;
    } catch (error) {
      spinner.fail(error.message);
      throw error;
    }
  }
}

module.exports = ApiClient;
