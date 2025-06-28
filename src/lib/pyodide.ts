// Define minimal types to avoid importing the full package
interface PyodideInterface {
  runPython(code: string): unknown;
  loadPackage(packages: string[]): Promise<void>;
  globals: Record<string, unknown>;
}

declare global {
  interface Window {
    loadPyodide?: (config?: Record<string, unknown>) => Promise<PyodideInterface>;
  }
}

let pyodideInstance: PyodideInterface | null = null;
let isLoading = false;

export async function loadPyodide(): Promise<PyodideInterface> {
  // Ensure we're running in the browser
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
    // Load Pyodide from CDN if not already loaded
    if (!window.loadPyodide) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    
    pyodideInstance = await window.loadPyodide!({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'
    });

    // Install additional packages
    await pyodideInstance.loadPackage(['numpy', 'matplotlib', 'pandas', 'scipy']);

    // Set up matplotlib backend for web
    await pyodideInstance.runPython(`
      import matplotlib
      matplotlib.use('Agg')  # Use non-interactive backend
      import matplotlib.pyplot as plt
      import numpy as np
      import pandas as pd
      
      # Helper function to capture plot output
      import io
      import base64
      
      # Global variable to store plots
      _plots = []
      
      def capture_plot():
          buf = io.BytesIO()
          plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
          buf.seek(0)
          img_b64 = base64.b64encode(buf.read()).decode('utf-8')
          buf.close()
          plt.close()  # Clear the current figure
          return img_b64
      
      # Override plt.show to capture plots
      original_show = plt.show
      def custom_show(*args, **kwargs):
          plot_data = capture_plot()
          _plots.append(plot_data)
          return None
      plt.show = custom_show
    `);

    console.log('Pyodide loaded successfully');
    return pyodideInstance;
  } catch (error) {
    console.error('Failed to load Pyodide:', error);
    throw error;
  } finally {
    isLoading = false;
  }
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  plots?: string[]; // base64 encoded images
}

export async function executePythonCode(code: string): Promise<ExecutionResult> {
  console.log('Executing Python code:', code);
  try {
    console.log('Loading Pyodide...');
    const pyodide = await loadPyodide();
    console.log('Pyodide loaded, executing code...');
    
    // Capture stdout and reset plots
    await pyodide.runPython(`
      import sys
      from io import StringIO
      
      # Capture stdout
      old_stdout = sys.stdout
      sys.stdout = captured_output = StringIO()
      
      # Reset plots array
      _plots = []
    `);

    // Execute user code
    try {
      const result = await pyodide.runPython(code);
      
      // Get captured output and plots
      const output = await pyodide.runPython(`
        output_str = captured_output.getvalue()
        sys.stdout = old_stdout
        output_str
      `);

      // Get plots
      const plots = await pyodide.runPython(`_plots`);

      const finalResult = {
        success: true,
        output: String(output || (result !== undefined ? String(result) : '')),
        plots: Array.isArray(plots) ? plots : []
      };
      console.log('Python execution successful:', finalResult);
      return finalResult;
    } catch (pythonError) {
      // Restore stdout
      await pyodide.runPython(`sys.stdout = old_stdout`);
      
      return {
        success: false,
        error: String(pythonError)
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute Python code: ${String(error)}`
    };
  }
}

export function isPyodideLoaded(): boolean {
  return pyodideInstance !== null;
}

export function getPyodideInstance(): PyodideInterface | null {
  return pyodideInstance;
}