/**
 * Protocol definitions for AyushBridge API
 * This file contains TypeScript interfaces and types for API communication
 */

/**
 * Represents a generated medical code from the code generation service
 */
export interface GeneratedCode {
  /** The coding system used (e.g., ICD-11, NAMASTE) */
  codeSystem: string
  /** The actual code value */
  code: string
  /** Human-readable display name for the code */
  displayName: string
  /** Confidence score of the code generation (0-100) */
  confidence: number
}

/**
 * Request payload for code generation API
 */
export interface GenerationRequest {
  /** Clinical description text to generate codes from */
  clinicalDescription: string
}

/**
 * Response payload from code generation API
 */
export interface GenerationResponse {
  /** The original clinical description */
  clinicalDescription: string
  /** Array of generated codes with their metadata */
  codes: GeneratedCode[]
}

/**
 * Error response structure for API failures
 */
export interface ApiError {
  /** Error message describing what went wrong */
  error: string
}

/**
 * Supported coding systems in the platform
 */
export enum CodeSystem {
  ICD11 = 'ICD-11',
  NAMASTE = 'NAMASTE'
}

/**
 * Confidence level categories for code generation
 */
export enum ConfidenceLevel {
  LOW = 'low',      // < 75%
  MEDIUM = 'medium', // 75-89%
  HIGH = 'high',     // 90-100%
}

/**
 * Utility function to get confidence level from score
 * @param confidence - Confidence score (0-100)
 * @returns Confidence level category
 */
export function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 90) return ConfidenceLevel.HIGH
  if (confidence >= 75) return ConfidenceLevel.MEDIUM
  return ConfidenceLevel.LOW
}

/**
 * Type guard to check if a response is an error
 * @param response - API response to check
 * @returns True if response is an ApiError
 */
export function isApiError(response: any): response is ApiError {
  return response && typeof response.error === 'string'
}
