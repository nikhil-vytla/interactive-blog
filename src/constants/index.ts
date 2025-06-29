/**
 * Application constants
 */

export const PYODIDE_CONFIG = {
  CDN_URL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js',
  VERSION: 'v0.27.7',
  PACKAGES: ['numpy', 'scipy', 'scikit-learn', 'micropip'] as string[],
  MAX_CODE_LENGTH: 10000,
  EXECUTION_TIMEOUT: 30000, // 30 seconds
} as const;

export const DANGEROUS_PATTERNS = [
  'import os',
  'import subprocess',
  '__import__',
  'eval(',
  'exec(',
  'open(',
  'file(',
  'input(',
  'raw_input(',
] as const;

export const APP_CONFIG = {
  SITE_NAME: "Nik's Interactive Blog",
  SITE_DESCRIPTION: 'Explore mathematical concepts through interactive code and visualizations',
  MAX_PLOT_SIZE: 1000, // pixels
  DEFAULT_TIMEOUT: 5000, // ms
} as const;

export const ROUTES = {
  HOME: '/',
  DEMO: '/demo',
  BLOG: '/blog',
} as const;