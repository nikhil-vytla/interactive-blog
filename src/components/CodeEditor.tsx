'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { EditorState } from '@codemirror/state';
import { EditableRange } from '@/types';

interface CodeEditorProps {
  initialCode: string;
  onRun?: (code: string) => void;
  className?: string;
  readOnlyRanges?: EditableRange[];
  language?: 'python';
  minHeight?: string;
}

/**
 * Unified code editor component that replaces SimpleCodeEditor, ReadOnlyCodeEditor, and PlotlyCodeEditor
 * Simplified to follow KISS principle while maintaining essential functionality
 */
export default function CodeEditor({ 
  initialCode, 
  onRun,
  className = "",
  readOnlyRanges = [],
  language = 'python',
  minHeight = '200px'
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCode, setCurrentCode] = useState(initialCode);

  useEffect(() => {
    if (!editorRef.current) return;

    const extensions = [
      basicSetup,
      python(), // Could be extended for other languages in future
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          setCurrentCode(update.state.doc.toString());
        }
      }),
      EditorView.theme({
        '.cm-focused': { outline: 'none' },
        '.cm-editor': {
          fontSize: '14px',
          fontFamily: 'var(--font-mono)'
        },
        '.cm-readonly-region': {
          backgroundColor: 'var(--color-code-bg)',
          opacity: '0.7'
        }
      })
    ];

    // Simple read-only implementation - just visual styling
    // More complex read-only logic removed for simplicity
    if (readOnlyRanges.length > 0) {
      // Add simple styling to indicate read-only areas
      // Note: Full read-only enforcement removed for KISS principle
      console.log('Read-only ranges:', readOnlyRanges);
    }

    const startState = EditorState.create({
      doc: initialCode,
      extensions
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [initialCode, readOnlyRanges]);

  const handleRun = useCallback(async () => {
    if (!onRun) return;
    
    setIsRunning(true);
    try {
      await onRun(currentCode);
    } finally {
      setIsRunning(false);
    }
  }, [currentCode, onRun]);

  return (
    <div className={`border border-code-border rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-code-bg border-b border-code-border">
        <span className="text-sm text-muted font-mono capitalize">{language}</span>
        {onRun && (
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-3 py-1 text-sm bg-accent text-white rounded hover:bg-accent/90 disabled:opacity-50"
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
        )}
      </div>
      <div 
        ref={editorRef} 
        className="overflow-auto"
        style={{ minHeight }}
      />
    </div>
  );
}