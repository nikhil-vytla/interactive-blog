'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { EditorState } from '@codemirror/state';

interface SimpleCodeEditorProps {
  initialCode: string;
  onRun?: (code: string) => void;
  className?: string;
}

export default function SimpleCodeEditor({ 
  initialCode, 
  onRun,
  className = ""
}: SimpleCodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCode, setCurrentCode] = useState(initialCode);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: initialCode,
      extensions: [
        basicSetup,
        python(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCurrentCode(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '.cm-focused': {
            outline: 'none'
          },
          '.cm-editor': {
            fontSize: '14px',
            fontFamily: 'var(--font-mono)'
          }
        })
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [initialCode]);

  const handleRun = useCallback(async () => {
    if (!onRun) return;
    
    setIsRunning(true);
    await onRun(currentCode);
    setIsRunning(false);
  }, [currentCode, onRun]);

  return (
    <div className={`border border-code-border rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-code-bg border-b border-code-border">
        <span className="text-sm text-muted font-mono">Python</span>
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
      <div ref={editorRef} className="min-h-[200px]" />
    </div>
  );
}