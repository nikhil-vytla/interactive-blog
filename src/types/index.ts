/**
 * Common type definitions for the Interactive Blog application
 */

export interface EditableRange {
  from: number;
  to: number;
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  plot?: string;
}

export interface PyodideInstance {
  runPython: (code: string) => unknown;
  loadPackage: (packages: string[]) => Promise<void>;
  globals: {
    get: (name: string) => unknown;
    set: (name: string, value: unknown) => void;
  };
}

export interface CodeEditorProps {
  initialCode: string;
  editableRanges?: EditableRange[];
  language?: string;
  className?: string;
  onCodeChange?: (code: string) => void;
}

export interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHomeButton?: boolean;
  showTopNavigation?: boolean;
  className?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  tags: string[];
}