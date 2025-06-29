/**
 * Utilities for finding editable ranges in code strings
 */

import type { EditableRange } from '@/types';

export interface EditableRangeConfig {
  /** Starting marker to look for */
  startMarker: string;
  /** Ending marker to look for */
  endMarker: string;
  /** Whether to skip the line containing the start marker (default: true) */
  skipStartLine?: boolean;
  /** Whether to include the end marker in the range (default: false) */
  includeEndMarker?: boolean;
}

/**
 * Generic function to find editable ranges in code based on start/end markers
 * 
 * @param code - The code string to search in
 * @param config - Configuration for the markers and options
 * @returns Array of editable ranges, empty if markers not found
 */
export function getEditableRangesByMarkers(
  code: string,
  config: EditableRangeConfig
): EditableRange[] {
  const {
    startMarker,
    endMarker,
    skipStartLine = true,
    includeEndMarker = false
  } = config;

  const startIndex = code.indexOf(startMarker);
  const endIndex = code.indexOf(endMarker);
  
  if (startIndex === -1 || endIndex === -1) {
    return [];
  }
  
  const contentStart = skipStartLine 
    ? code.indexOf('\n', startIndex) + 1 
    : startIndex;
    
  const contentEnd = includeEndMarker 
    ? endIndex + endMarker.length 
    : endIndex;
  
  return [{ from: contentStart, to: contentEnd }];
}

/**
 * Predefined common patterns for editable ranges
 */
export const EDITABLE_RANGE_PATTERNS = {
  /** Explicit delimiters with clear start/end markers */
  EXPLICIT_MARKERS: {
    startMarker: '# === EDITABLE REGION START ===',
    endMarker: '# === EDITABLE REGION END ===',
    skipStartLine: true
  },
  
  /** Parameters section based on semantic comments */
  PARAMETERS_SECTION: {
    startMarker: '# Parameters',
    endMarker: '# Generate sample data',
    skipStartLine: true
  },
  
  /** Configuration section for settings */
  CONFIG_SECTION: {
    startMarker: '# Configuration',
    endMarker: '# Main code',
    skipStartLine: true
  }
} as const;

/**
 * Factory function to create reusable editable range getters
 * 
 * @param config - Configuration for the range detection
 * @returns Function that takes code and returns editable ranges
 */
export function createEditableRangeGetter(config: EditableRangeConfig) {
  return (code: string): EditableRange[] => {
    return getEditableRangesByMarkers(code, config);
  };
}

/**
 * Convenience functions for common patterns
 */
export const getExplicitEditableRanges = createEditableRangeGetter(
  EDITABLE_RANGE_PATTERNS.EXPLICIT_MARKERS
);

export const getParametersEditableRanges = createEditableRangeGetter(
  EDITABLE_RANGE_PATTERNS.PARAMETERS_SECTION
);

/**
 * Validates that editable ranges are valid for the given code
 * 
 * @param code - The code string
 * @param ranges - The ranges to validate
 * @returns True if all ranges are valid
 */
export function validateEditableRanges(
  code: string, 
  ranges: EditableRange[]
): boolean {
  return ranges.every(range => 
    range.from >= 0 && 
    range.to <= code.length && 
    range.from < range.to
  );
}