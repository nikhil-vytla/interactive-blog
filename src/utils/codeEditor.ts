/**
 * Utilities for code editor functionality
 */

import { EditableRange } from '@/types';

export interface EditableRangeMarkers {
  start: string;
  end: string;
}

/**
 * Default markers for editable regions in code
 */
export const DEFAULT_EDITABLE_MARKERS: EditableRangeMarkers = {
  start: '# === EDITABLE REGION START ===',
  end: '# === EDITABLE REGION END ==='
};



/**
 * Converts editable ranges to read-only ranges for CodeMirror
 * @param code - The full code string
 * @param editableRanges - Array of editable ranges
 * @returns Array of read-only ranges (inverse of editable ranges)
 */
export function getReadOnlyRanges(code: string, editableRanges: EditableRange[]): EditableRange[] {
  const readOnlyRanges: EditableRange[] = [];
  const codeLength = code.length;

  // Sort editable ranges by start position
  const sortedEditable = [...editableRanges].sort((a, b) => a.from - b.from);

  // Add read-only range before first editable range
  if (sortedEditable.length > 0 && sortedEditable[0].from > 0) {
    readOnlyRanges.push({ from: 0, to: sortedEditable[0].from });
  }

  // Add read-only ranges between editable ranges
  for (let i = 0; i < sortedEditable.length - 1; i++) {
    const currentEnd = sortedEditable[i].to;
    const nextStart = sortedEditable[i + 1].from;
    
    if (currentEnd < nextStart) {
      readOnlyRanges.push({ from: currentEnd, to: nextStart });
    }
  }

  // Add read-only range after last editable range
  if (sortedEditable.length > 0) {
    const lastEnd = sortedEditable[sortedEditable.length - 1].to;
    if (lastEnd < codeLength) {
      readOnlyRanges.push({ from: lastEnd, to: codeLength });
    }
  } else {
    // If no editable ranges, entire code is read-only
    readOnlyRanges.push({ from: 0, to: codeLength });
  }

  return readOnlyRanges;
}

/**
 * Validates that the given ranges are within the code bounds
 * @param code - The code string
 * @param ranges - Array of ranges to validate
 * @returns True if all ranges are valid
 */
export function validateRanges(code: string, ranges: EditableRange[]): boolean {
  const codeLength = code.length;
  
  return ranges.every(range => 
    range.from >= 0 && 
    range.to <= codeLength && 
    range.from <= range.to
  );
}