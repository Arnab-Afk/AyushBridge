/**
 * Test script to verify API endpoint fixes
 */

const axios = require('axios');

// Base URL for the API
const API_URL = 'http://localhost:3000/fhir';

// Headers
const headers = {
  'Accept': 'application/fhir+json',
  'Content-Type': 'application/json'
};

// Test endpoints
async function runTests() {
  try {
    console.log('Starting API tests...');
    
    // Test 1: Health check
    console.log('\n🔍 Testing health check endpoint...');
    const healthResult = await axios.get(`${API_URL.replace('/fhir', '')}/health`);
    console.log('✅ Health check successful:', healthResult.data);
    
    // Test 2: ValueSet expand endpoint
    console.log('\n🔍 Testing ValueSet expand endpoint...');
    try {
      const valueSetResult = await axios.get(`${API_URL}/ValueSet/namaste/$expand?filter=yoga`, { headers });
      console.log('✅ ValueSet expand successful:');
      console.log(`   Found ${valueSetResult.data?.expansion?.total || 0} results`);
    } catch (error) {
      console.error('❌ ValueSet expand failed:', error.response?.data || error.message);
    }
    
    // Test 3: GET translation endpoint with default parameters
    console.log('\n🔍 Testing GET translation endpoint with default parameters...');
    try {
      const translateResult = await axios.get(`${API_URL}/ConceptMap/namaste-to-icd11/$translate`, { headers });
      console.log('✅ GET translation successful:');
      console.log(`   Result: ${translateResult.data?.parameter?.[0]?.valueBoolean ? 'Found' : 'Not found'}`);
      if (translateResult.data?.parameter?.[0]?.name === 'message') {
        console.log(`   Message: ${translateResult.data.parameter[0].valueString}`);
      }
    } catch (error) {
      console.error('❌ GET translation failed:', error.response?.data || error.message);
    }
    
    // Test 4: POST translation endpoint with empty body
    console.log('\n🔍 Testing POST translation endpoint with empty body...');
    try {
      const translatePostResult = await axios.post(`${API_URL}/ConceptMap/namaste-to-icd11/$translate`, {}, { headers });
      console.log('✅ POST translation successful:');
      console.log(`   Result: ${translatePostResult.data?.parameter?.[0]?.valueBoolean ? 'Found' : 'Not found'}`);
      if (translatePostResult.data?.parameter?.[0]?.name === 'message') {
        console.log(`   Message: ${translatePostResult.data.parameter[0].valueString}`);
      }
    } catch (error) {
      console.error('❌ POST translation failed:', error.response?.data || error.message);
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${JSON.stringify(error.response?.data)}`);
    }
    
    console.log('\n✅ Tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the tests
runTests();
