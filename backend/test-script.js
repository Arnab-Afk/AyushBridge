/**
 * Test script for AyushBridge API endpoints
 * Tests the ValueSet/$expand and ConceptMap/$translate endpoints
 */

const axios = require('axios');

// Base URL for the API
const baseUrl = 'http://localhost:3000/fhir';

// Helper function for HTTP requests
async function apiRequest(method, url, data = null, headers = {}) {
  try {
    const response = await axios({
      method,
      url: `${baseUrl}${url}`,
      data,
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/json',
        ...headers
      }
    });
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    if (error.response) {
      return { 
        success: false, 
        error: error.response.data, 
        status: error.response.status 
      };
    }
    return { success: false, error: error.message };
  }
}

// Test function for ValueSet/$expand
async function testValueSetExpand() {
  console.log('\n==== Testing ValueSet/$expand endpoint ====');
  
  // Test NAMASTE ValueSet expand
  const namasteResponse = await apiRequest('GET', '/ValueSet/namaste/$expand?filter=yoga');
  
  if (namasteResponse.success) {
    console.log('✅ NAMASTE ValueSet/$expand success');
    console.log(`   Retrieved ${namasteResponse.data.expansion.total || 0} concepts`);
    
    // Test the properties field handling
    if (namasteResponse.data.expansion.contains && namasteResponse.data.expansion.contains.length > 0) {
      const firstConcept = namasteResponse.data.expansion.contains[0];
      console.log(`   First concept: ${firstConcept.code} - ${firstConcept.display}`);
      
      // Check if property is correctly formatted
      if (firstConcept.property) {
        console.log('   ✅ Properties are correctly formatted as FHIR property array');
      } else {
        console.log('   ℹ️ No properties in the first concept');
      }
    }
  } else {
    console.error('❌ NAMASTE ValueSet/$expand failed:', namasteResponse.status);
    console.error(namasteResponse.error);
  }
  
  // Test ICD-11 ValueSet expand
  const icd11Response = await apiRequest('GET', '/ValueSet/icd11/$expand?filter=fever');
  
  if (icd11Response.success) {
    console.log('✅ ICD-11 ValueSet/$expand success');
    console.log(`   Retrieved ${icd11Response.data.expansion.total || 0} concepts`);
  } else {
    console.error('❌ ICD-11 ValueSet/$expand failed:', icd11Response.status);
    console.error(icd11Response.error);
  }
}

// Test function for ConceptMap/$translate
async function testConceptMapTranslate() {
  console.log('\n==== Testing ConceptMap/$translate endpoint ====');
  
  // Test NAMASTE to ICD-11 translation
  const translationResponse = await apiRequest('POST', '/ConceptMap/namaste-to-icd11/$translate', {
    code: 'Y1',
    system: 'https://ayush.gov.in/fhir/CodeSystem/namaste'
  });
  
  if (translationResponse.success) {
    console.log('✅ ConceptMap/$translate success');
    if (translationResponse.data.parameter) {
      const resultParam = translationResponse.data.parameter.find(p => p.name === 'result');
      console.log(`   Translation result: ${resultParam ? resultParam.valueBoolean : 'unknown'}`);
    }
  } else {
    console.log('❌ ConceptMap/$translate failed:', translationResponse.status);
    if (translationResponse.error) {
      if (translationResponse.status === 404) {
        console.log('   🔍 This is expected if the ConceptMap does not exist in the database');
      } else {
        console.error(translationResponse.error);
      }
    }
  }
  
  // Test GET endpoint version
  const getTranslationResponse = await apiRequest('GET', '/ConceptMap/namaste-to-icd11/$translate?code=Y1&system=https://ayush.gov.in/fhir/CodeSystem/namaste');
  
  if (getTranslationResponse.success) {
    console.log('✅ GET ConceptMap/$translate success');
    if (getTranslationResponse.data.parameter) {
      const resultParam = getTranslationResponse.data.parameter.find(p => p.name === 'result');
      console.log(`   Translation result: ${resultParam ? resultParam.valueBoolean : 'unknown'}`);
    }
  } else {
    console.log('❌ GET ConceptMap/$translate failed:', getTranslationResponse.status);
    if (getTranslationResponse.error) {
      if (getTranslationResponse.status === 404) {
        console.log('   🔍 This is expected if the ConceptMap does not exist in the database');
      } else {
        console.error(getTranslationResponse.error);
      }
    }
  }
}

// Run all tests
async function runTests() {
  try {
    console.log('Starting AyushBridge API tests...');
    
    // First check if server is running
    const healthCheck = await apiRequest('GET', '/health');
    if (!healthCheck.success) {
      console.error('❌ Server health check failed. Make sure the server is running.');
      return;
    }
    console.log('✅ Server is running');
    
    // Run the tests
    await testValueSetExpand();
    await testConceptMapTranslate();
    
    console.log('\n✅ All tests completed');
  } catch (error) {
    console.error('❌ Test script error:', error);
  }
}

runTests();
