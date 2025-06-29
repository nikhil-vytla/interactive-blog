'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { EditorState, StateField, StateEffect } from '@codemirror/state';
import { Decoration, DecorationSet } from '@codemirror/view';

interface ReadOnlyRange {
  from: number;
  to: number;
}

interface CodeEditorProps {
  initialCode: string;
  readOnlyRanges?: ReadOnlyRange[];
  onChange?: (code: string) => void;
  onRun?: (code: string) => void;
  className?: string;
}

const readOnlyRangesEffect = StateEffect.define<ReadOnlyRange[]>();

const readOnlyRangesField = StateField.define<ReadOnlyRange[]>({
  create: () => [],
  update: (ranges, tr) => {
    for (const effect of tr.effects) {
      if (effect.is(readOnlyRangesEffect)) {
        return effect.value;
      }
    }
    return ranges;
  }
});

const readOnlyDecorations = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update: (decorations, tr) => {
    const ranges = tr.state.field(readOnlyRangesField);
    const newDecorations = ranges.map(range => 
      Decoration.mark({
        class: 'cm-readonly',
        attributes: { 'data-readonly': 'true' }
      }).range(range.from, range.to)
    );
    return Decoration.set(newDecorations);
  },
  provide: f => EditorView.decorations.from(f)
});

const readOnlyFilter = EditorState.transactionFilter.of((tr) => {
  if (!tr.docChanged) return tr;
  
  const ranges = tr.state.field(readOnlyRangesField);
  if (ranges.length === 0) return tr; // No read-only ranges
  
  // Check if any changes overlap with read-only ranges
  let hasReadOnlyChange = false;
  tr.changes.iterChanges((fromA, toA) => {
    for (const range of ranges) {
      // Check if the change overlaps with a read-only range
      if (fromA < range.to && toA > range.from) {
        hasReadOnlyChange = true;
        return false; // Stop iteration
      }
    }
  });
  
  return hasReadOnlyChange ? [] : tr; // Reject if touching read-only area
});

export default function CodeEditor({ 
  initialCode, 
  readOnlyRanges = [], 
  onChange,
  onRun,
  className = ""
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    console.log('CodeEditor: Initializing with readOnlyRanges:', readOnlyRanges);

    const startState = EditorState.create({
      doc: initialCode,
      extensions: [
        basicSetup,
        python(),
        readOnlyRangesField.init(() => readOnlyRanges),
        readOnlyDecorations,
        readOnlyFilter,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '.cm-readonly': {
            backgroundColor: 'var(--color-code-bg)',
            opacity: '0.7'
          },
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
  }, [initialCode, onChange, readOnlyRanges]);

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: readOnlyRangesEffect.of(readOnlyRanges)
      });
    }
  }, [readOnlyRanges]);

  const handleRun = () => {
    if (!viewRef.current || !onRun) return;
    
    setIsRunning(true);
    const code = viewRef.current.state.doc.toString();
    onRun(code);
    
    setTimeout(() => setIsRunning(false), 1000);
  };

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