/**
 * AyushBridge API Client
 * 
 * Utility functions for interacting with the AyushBridge Backend API
 */

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Check if the API is available and healthy
 */
export async function checkApiHealth(baseUrl = DEFAULT_API_URL): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      mode: 'cors',
      credentials: 'omit', // Don't send credentials with wildcard CORS
    });
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}

/**
 * Get the FHIR CapabilityStatement from the API
 */
export async function getCapabilityStatement(baseUrl = DEFAULT_API_URL) {
  try {
    const response = await fetch(`${baseUrl}/fhir/metadata`, {
      headers: { 'Accept': 'application/fhir+json' },
      mode: 'cors',
      credentials: 'omit', // Don't send credentials with wildcard CORS
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch capability statement:', error);
    return null;
  }
}

/**
 * Generic API request function
 */
export async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}, 
  baseUrl = DEFAULT_API_URL
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const url = `${baseUrl}${endpoint}`;
    
    // Default headers for FHIR API
    const headers: Record<string, string> = {
      'Accept': 'application/fhir+json',
      ...(options.headers as Record<string, string> || {})
    };
    
    // For POST/PUT requests, set content type
    if (options.method === 'POST' || options.method === 'PUT') {
      headers['Content-Type'] = 'application/fhir+json';
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'omit', // Don't send credentials with wildcard CORS
    });
    
    let data = null;
    
    // Try to parse response as JSON
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { text };
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      const text = await response.text();
      data = { text };
    }
    
    if (!response.ok) {
      return {
        data: null,
        error: data?.issue?.[0]?.details?.text || 'API request failed',
        status: response.status
      };
    }
    
    return {
      data,
      error: null,
      status: response.status
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 0
    };
  }
}
