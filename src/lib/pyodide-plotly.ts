// Reusable Pyodide + Plotly execution utilities
'use client';

import React from 'react';

export interface PyodideInstance {
  runPython(code: string): unknown;
  runPythonAsync?(code: string): Promise<unknown>;
  loadPackage(packages: string[]): Promise<void>;
}

export interface PlotlyExecutionResult {
  success: boolean;
  output: string;
  plotData?: unknown;
  error?: string;
}

let pyodideInstance: PyodideInstance | null = null;
let isLoading = false;

/**
 * Loads Pyodide with common packages (numpy, scipy, micropip) and installs Plotly
 */
export async function loadPyodideWithPlotly(): Promise<PyodideInstance> {
  if (typeof window === 'undefined') {
    throw new Error('Pyodide can only be loaded in the browser');
  }

  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (isLoading) {
    // Wait for the current loading to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return pyodideInstance!;
  }

  isLoading = true;

  try {
    const windowWithPyodide = window as Window & { 
      loadPyodide?: (config: Record<string, unknown>) => Promise<PyodideInstance> 
    };

    // Load Pyodide script if not already loaded
    if (!windowWithPyodide.loadPyodide) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // Initialize Pyodide
    pyodideInstance = await windowWithPyodide.loadPyodide!({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'
    });

    // Load common packages
    await pyodideInstance.loadPackage(['numpy', 'scipy', 'micropip']);

    // Install Plotly via micropip
    await pyodideInstance.runPythonAsync!(`
      import micropip
      await micropip.install('plotly')
    `);

    return pyodideInstance;
  } finally {
    isLoading = false;
  }
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
  
  const defaultOptions = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
  };

  await Plotly.newPlot(
    plotContainer, 
    parsedData.data, 
    parsedData.layout, 
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
    const pyodide = await loadPyodideWithPlotly();

    onProgress?.('Running Python code...');
    
    // Set up stdout capture
    await pyodide.runPython(`
      import sys
      from io import StringIO
      old_stdout = sys.stdout
      sys.stdout = captured_output = StringIO()
      fig_json = None
    `);

    // Execute user code
    await pyodide.runPython(code);
    
    // Get output
    const output = await pyodide.runPython(`
      output_str = captured_output.getvalue()
      sys.stdout = old_stdout
      output_str
    `);

    // Get plot data if available
    const plotJson = await pyodide.runPython(`
      import json
      fig_dict = fig.to_dict() if 'fig' in locals() else None
      json.dumps(fig_dict) if fig_dict else None
    `);

    return {
      success: true,
      output: String(output || ''),
      plotData: plotJson || undefined
    };

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