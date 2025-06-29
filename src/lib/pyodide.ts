import { ExecutionResult } from '@/types';
import { PYODIDE_CONFIG } from '@/constants';
import { validatePythonCode, sanitizeCode, CodeValidationError } from '@/utils/validation';

// Define minimal types to avoid importing the full package
interface PyodideInterface {
  runPython(code: string): unknown;
  runPythonAsync?(code: string): Promise<unknown>;
  loadPackage(packages: string[]): Promise<void>;
  globals: Record<string, unknown>;
}

declare global {
  interface Window {
    loadPyodide?: (config?: Record<string, unknown>) => Promise<PyodideInterface>;
  }
}

let pyodideInstance: PyodideInterface | null = null;
let loadingPromise: Promise<PyodideInterface> | null = null;

export async function loadPyodide(): Promise<PyodideInterface> {
  // Ensure we're running in the browser
  if (typeof window === 'undefined') {
    throw new Error('Pyodide can only be loaded in the browser');
  }

  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (loadingPromise) {
    // Return the existing loading promise
    return loadingPromise;
  }

  // Create the loading promise
  loadingPromise = (async () => {
    try {
      // Load Pyodide from CDN if not already loaded
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = PYODIDE_CONFIG.CDN_URL;
        script.async = true;
        script.crossOrigin = 'anonymous';
        // TODO: Add SRI hash for security
        // script.integrity = 'sha384-[hash]';
        
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide script'));
          document.head.appendChild(script);
        });
      }
      
      pyodideInstance = await window.loadPyodide!({
        indexURL: `https://cdn.jsdelivr.net/pyodide/${PYODIDE_CONFIG.VERSION}/full/`
      });

      // Install additional packages
      await pyodideInstance.loadPackage(PYODIDE_CONFIG.PACKAGES);
      
      // Install plotly via micropip
      await pyodideInstance.runPython(`
        import micropip
      `);
      
      // Use runPythonAsync for the await call
      if (pyodideInstance.runPythonAsync) {
        await pyodideInstance.runPythonAsync(`
          await micropip.install('plotly')
        `);
      } else {
        // Fallback for older Pyodide versions
        await pyodideInstance.runPython(`
          import asyncio
          asyncio.run(micropip.install('plotly'))
        `);
      }
      
      console.log('Plotly installed successfully');

      console.log('Pyodide loaded successfully');
      return pyodideInstance;
    } catch (error) {
      console.error('Failed to load Pyodide:', error);
      pyodideInstance = null;
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
}


export async function executePythonCode(code: string): Promise<ExecutionResult> {
  console.log('Executing Python code:', code);
  try {
    // Validate and sanitize input
    validatePythonCode(code);
    const sanitizedCode = sanitizeCode(code);
    
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

    // Execute user code with timeout
    try {
      const result = await Promise.race([
        pyodide.runPython(sanitizedCode),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Code execution timeout')), PYODIDE_CONFIG.EXECUTION_TIMEOUT)
        )
      ]);
      
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
    if (error instanceof CodeValidationError) {
      return {
        success: false,
        error: `Security validation failed: ${error.message}`
      };
    }
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