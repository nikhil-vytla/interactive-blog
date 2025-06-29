/**
 * Common type definitions for the blog
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

// Article configuration system types
export interface Parameter {
  name: string;
  label: string;
  type: 'number' | 'range' | 'select' | 'checkbox' | 'text' | 'array';
  defaultValue: unknown;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: unknown }>;
  description?: string;
}

export interface ContentSection {
  type: 'text' | 'math' | 'alert' | 'code' | 'interactive';
  title?: string;
  content?: string;
  alertType?: 'info' | 'warning' | 'error' | 'success' | 'note' | 'correct' | 'wrong' | 'definition' | 'takeaways';
  mathExpression?: string;
  mathDisplay?: boolean;
  codeTemplate?: string;
  parameters?: Parameter[];
  editableRanges?: EditableRange[];
}

export interface ArticleConfig {
  id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  publishedAt: string;
  tags: string[];
  parameters?: Parameter[];
  sections: ContentSection[];
  colorScheme?: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

export interface MathFormula {
  id: string;
  name: string;
  description: string;
  expression: string;
  variables?: Array<{
    symbol: string;
    description: string;
  }>;
  category: string;
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  parameters: Parameter[];
  category: 'visualization' | 'statistics' | 'ml' | 'simulation';
  libraries: string[];
}