'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { EditorState, StateField, StateEffect } from '@codemirror/state';
import { Decoration, DecorationSet } from '@codemirror/view';
import { EditableRange } from '@/types';
import { getReadOnlyRanges, validateRanges } from '@/utils/codeEditor';
import { RunButton } from './Button';

interface ReadOnlyCodeEditorProps {
  initialCode: string;
  editableRanges: EditableRange[];
  onRun?: (code: string) => void;
  className?: string;
}

// State field to store read-only ranges
const readOnlyRangesEffect = StateEffect.define<EditableRange[]>();

const readOnlyRangesField = StateField.define<EditableRange[]>({
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

// Create decorations for read-only regions
const readOnlyDecorations = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update: (decorations, tr) => {
    const ranges = tr.state.field(readOnlyRangesField);
    const newDecorations = ranges.map(range => 
      Decoration.mark({
        class: 'cm-readonly-region',
        attributes: { 'data-readonly': 'true' }
      }).range(range.from, range.to)
    );
    return Decoration.set(newDecorations);
  },
  provide: f => EditorView.decorations.from(f)
});

// Transaction filter to prevent editing read-only regions
const readOnlyFilter = EditorState.transactionFilter.of((tr) => {
  if (!tr.docChanged) return tr;
  
  const ranges = tr.state.field(readOnlyRangesField);
  if (ranges.length === 0) return tr;
  
  // Check if any changes overlap with read-only ranges
  let hasReadOnlyChange = false;
  tr.changes.iterChanges((fromA, toA) => {
    for (const range of ranges) {
      if (fromA < range.to && toA > range.from) {
        hasReadOnlyChange = true;
        return false;
      }
    }
  });
  
  return hasReadOnlyChange ? [] : tr;
});

export default function ReadOnlyCodeEditor({ 
  initialCode, 
  editableRanges,
  onRun,
  className = ""
}: ReadOnlyCodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const currentCodeRef = useRef(initialCode);

  // Validate editable ranges
  if (!validateRanges(initialCode, editableRanges)) {
    console.warn('Invalid editable ranges detected:', editableRanges);
  }

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const readOnlyRanges = getReadOnlyRanges(initialCode, editableRanges);
    console.log('Setting up editor with:');
    console.log('Editable ranges:', editableRanges);
    console.log('Read-only ranges:', readOnlyRanges);

    const startState = EditorState.create({
      doc: initialCode,
      extensions: [
        basicSetup,
        python(),
        readOnlyRangesField.init(() => readOnlyRanges),
        readOnlyDecorations,
        readOnlyFilter,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            currentCodeRef.current = update.state.doc.toString();
          }
        }),
        EditorView.theme({
          '.cm-readonly-region': {
            backgroundColor: 'var(--color-border)',
            opacity: '0.75',
            borderRadius: '2px'
          },
          '.cm-focused .cm-readonly-region': {
            backgroundColor: 'var(--color-border)',
            opacity: '0.9'
          },
          '.cm-focused': {
            outline: 'none'
          },
          '.cm-editor': {
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--color-code-bg)'
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
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [initialCode, editableRanges]);

  const handleRun = useCallback(async () => {
    if (!onRun) return;
    
    setIsRunning(true);
    await onRun(currentCodeRef.current);
    setIsRunning(false);
  }, [onRun]);

  return (
    <div className={`border border-code-border rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-code-bg border-b border-code-border">
        <span className="text-sm text-muted font-mono">Python</span>
        {onRun && (
          <RunButton
            isRunning={isRunning}
            onClick={handleRun}
          />
        )}
      </div>
      <div ref={editorRef} className="min-h-[200px]" />
    </div>
  );
}