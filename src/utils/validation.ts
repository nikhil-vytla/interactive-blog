/**
 * Input validation utilities for security and safety
 */

import { DANGEROUS_PATTERNS, PYODIDE_CONFIG } from '@/constants';

export class CodeValidationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'CodeValidationError';
  }
}

/**
 * Validates Python code for security and safety before execution
 * @param code - The Python code to validate
 * @throws {CodeValidationError} If the code is invalid or potentially dangerous
 */
export function validatePythonCode(code: string): void {
  // Check if code is empty or null
  if (!code || typeof code !== 'string') {
    throw new CodeValidationError('Code cannot be empty', code);
  }

  // Check code length
  if (code.length > PYODIDE_CONFIG.MAX_CODE_LENGTH) {
    throw new CodeValidationError(
      `Code exceeds maximum length of ${PYODIDE_CONFIG.MAX_CODE_LENGTH} characters`,
      code
    );
  }

  // Check for dangerous patterns
  const foundPattern = DANGEROUS_PATTERNS.find(pattern => 
    code.toLowerCase().includes(pattern.toLowerCase())
  );
  
  if (foundPattern) {
    throw new CodeValidationError(
      `Potentially dangerous code detected: ${foundPattern}`,
      code
    );
  }

  // Check for excessive loops (basic heuristic)
  const loopCount = (code.match(/\b(for|while)\b/g) || []).length;
  if (loopCount > 10) {
    throw new CodeValidationError(
      'Code contains too many loops (potential infinite loop risk)',
      code
    );
  }
}

/**
 * Sanitizes code by removing potentially harmful content
 * @param code - The code to sanitize
 * @returns Sanitized code
 */
export function sanitizeCode(code: string): string {
  return code
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\r\n/g, '\n') // Normalize line endings
    .slice(0, PYODIDE_CONFIG.MAX_CODE_LENGTH); // Ensure max length
}