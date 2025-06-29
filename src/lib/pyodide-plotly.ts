// Reusable Pyodide + Plotly execution utilities
'use client';

import React from 'react';
import { loadPyodide, executePythonCode } from './pyodide';

export interface PlotlyExecutionResult {
  success: boolean;
  output: string;
  plotData?: unknown;
  error?: string;
}

/**
 * Loads Plotly.js library dynamically
 */
export async function loadPlotlyJS(): Promise<void> {
  if (document.querySelector('script[src*="plotly"]')) {
    return; // Already loaded
  }

  const script = document.createElement('script');
  script.src = 'https://cdn.plot.ly/plotly-2.35.2.min.js';
  
  document.head.appendChild(script);
  await new Promise((resolve) => {
    script.onload = resolve;
  });
}

/**
 * Detects if the current theme is dark mode
 */
function isDarkMode(): boolean {
  // Check for dark mode using various methods
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  
  // Check if dark class is on html or body
  if (document.documentElement.classList.contains('dark') || 
      document.body.classList.contains('dark')) {
    return true;
  }
  
  // Check computed background color of body
  const bodyBg = window.getComputedStyle(document.body).backgroundColor;
  if (bodyBg && bodyBg !== 'rgba(0, 0, 0, 0)') {
    // Convert to RGB and check if dark
    const rgbMatch = bodyBg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 128;
    }
  }
  
  return false;
}

/**
 * Gets dark mode theme configuration for Plotly
 */
function getDarkModeLayout() {
  return {
    paper_bgcolor: 'rgba(0,0,0,0)',  // Transparent background
    plot_bgcolor: 'rgba(0,0,0,0)',   // Transparent plot area
    font: { color: '#e5e7eb' },      // Light gray text
    xaxis: {
      gridcolor: '#374151',          // Dark gray grid
      linecolor: '#6b7280',          // Medium gray axis lines
      tickcolor: '#6b7280',          // Medium gray ticks
      zerolinecolor: '#6b7280',      // Medium gray zero line
      title: { font: { color: '#e5e7eb' } }
    },
    yaxis: {
      gridcolor: '#374151',          // Dark gray grid
      linecolor: '#6b7280',          // Medium gray axis lines
      tickcolor: '#6b7280',          // Medium gray ticks
      zerolinecolor: '#6b7280',      // Medium gray zero line
      title: { font: { color: '#e5e7eb' } }
    },
    title: { font: { color: '#f9fafb' } }, // Nearly white title
    legend: {
      bgcolor: 'rgba(0,0,0,0)',      // Transparent legend background
      bordercolor: '#6b7280',        // Medium gray border
      font: { color: '#e5e7eb' }     // Light gray text
    }
  };
}

/**
 * Renders a Plotly plot in the specified container
 */
export async function renderPlotlyPlot(
  plotContainer: HTMLElement, 
  plotData: unknown,
  options?: Record<string, unknown>
): Promise<void> {
  await loadPlotlyJS();
  
  const windowWithPlotly = window as unknown as { 
    Plotly?: { newPlot: (...args: unknown[]) => Promise<unknown> } 
  };
  
  const Plotly = windowWithPlotly.Plotly;
  if (!Plotly) {
    throw new Error('Plotly failed to load');
  }

  // Clear previous plot
  plotContainer.innerHTML = '';
  
  const parsedData = typeof plotData === 'string' ? JSON.parse(plotData) : plotData;
  
  // Apply dark mode theme if detected
  const darkMode = isDarkMode();
  let layout = parsedData.layout || {};
  
  if (darkMode) {
    layout = {
      ...layout,
      ...getDarkModeLayout(),
      // Preserve any existing layout settings but override theme
      title: layout.title ? {
        ...layout.title,
        font: { ...layout.title.font, color: '#f9fafb' }
      } : layout.title
    };
  }
  
  // Ensure proper sizing for plots
  layout = {
    ...layout,
    autosize: true,
    margin: { l: 50, r: 20, t: 40, b: 40 }
  };
  
  const defaultOptions = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
    useResizeHandler: true,
    style: { width: '100%', height: '100%' }
  };

  await Plotly.newPlot(
    plotContainer, 
    parsedData.data, 
    layout, 
    { ...defaultOptions, ...options }
  );
}

/**
 * Executes Python code with Plotly support and returns results + plot data
 */
export async function executePythonWithPlotly(
  code: string,
  onProgress?: (message: string) => void
): Promise<PlotlyExecutionResult> {
  try {
    onProgress?.('Loading Pyodide...');
    
    // Use the secure executePythonCode function
    const result = await executePythonCode(code);
    
    if (result.success) {
      onProgress?.('Extracting plot data...');
      
      // Try to extract plot data if available
      const pyodide = await loadPyodide();
      const plotJson = await pyodide.runPython(`
        import json
        fig_dict = fig.to_dict() if 'fig' in locals() else None
        json.dumps(fig_dict) if fig_dict else None
      `);

      return {
        success: true,
        output: result.output || '',
        plotData: plotJson || undefined
      };
    } else {
      return {
        success: false,
        output: '',
        error: result.error
      };
    }
  } catch (error) {
    return {
      success: false,
      output: '',
      error: String(error)
    };
  }
}

/**
 * Hook for managing Plotly execution state
 */
export function usePlotlyExecution() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const executeCode = async (
    code: string, 
    plotContainer?: React.RefObject<HTMLDivElement | null>
  ) => {
    setIsLoading(true);
    setError('');
    
    const executionResult = await executePythonWithPlotly(code, setResult);
    
    if (executionResult.success) {
      setResult(`Success!\n\nOutput:\n${executionResult.output}`);
      
      // Render plot if available
      if (executionResult.plotData && plotContainer?.current) {
        try {
          await renderPlotlyPlot(plotContainer.current, executionResult.plotData);
        } catch (plotError) {
          setError(`Plot rendering failed: ${plotError}`);
        }
      }
    } else {
      setError(executionResult.error || 'Unknown error');
    }
    
    setIsLoading(false);
  };

  return {
    isLoading,
    result,
    error,
    executeCode
  };
}