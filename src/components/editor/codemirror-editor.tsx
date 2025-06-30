import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { lintKeymap } from '@codemirror/lint';
import { searchKeymap } from '@codemirror/search';
import { EditorState, type Extension, StateEffect } from '@codemirror/state';
import {
  EditorView,
  keymap,
  placeholder as placeholderExt,
  type ViewUpdate,
} from '@codemirror/view';
import { tags } from '@lezer/highlight';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CodeMirrorEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSelectionChange?: (selection: { from: number; to: number; text: string }) => void;
  onViewCreated?: (view: EditorView) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  fontSize?: number;
  autoFocus?: boolean;
  extensions?: Extension[];
}

const CodeMirrorEditorComponent: React.FC<CodeMirrorEditorProps> = ({
  value,
  onChange,
  onSelectionChange,
  onViewCreated,
  placeholder = 'Start writing...',
  className,
  readOnly = false,
  fontSize = 16,
  autoFocus = false,
  extensions: userExtensions = [],
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onSelectionChangeRef = useRef(onSelectionChange);
  const isLocalUpdate = useRef(false);

  // Update refs on each render
  onChangeRef.current = onChange;
  onSelectionChangeRef.current = onSelectionChange;

  // Create theme with dynamic font size
  const theme = useMemo(
    () =>
      EditorView.theme({
        '&': {
          fontSize: `${fontSize}px`,
          height: '100%',
        },
        '.cm-scroller': {
          fontFamily: 'Charter, Georgia, serif',
          lineHeight: 1.6,
          padding: '1rem',
        },
        '.cm-content': {
          caretColor: 'var(--foreground)',
          minHeight: '100%',
        },
        '.cm-focused': {
          outline: 'none',
        },
        '.cm-editor': {
          height: '100%',
        },
        '.cm-editor.cm-focused': {
          outline: 'none',
        },
        '.cm-placeholder': {
          color: 'var(--muted-foreground)',
          fontStyle: 'italic',
        },
        '.cm-cursor': {
          borderLeftColor: 'var(--foreground)',
        },
        '.cm-selectionBackground': {
          backgroundColor: 'var(--accent)',
        },
        '.cm-focused .cm-selectionBackground': {
          backgroundColor: 'var(--accent)',
        },
        '.cm-line': {
          padding: '0',
        },
      }),
    [fontSize]
  );

  // Create syntax highlighting theme
  const highlightTheme = useMemo(
    () =>
      HighlightStyle.define([
        { tag: tags.heading1, fontSize: '1.75em', fontWeight: 'bold' },
        { tag: tags.heading2, fontSize: '1.5em', fontWeight: 'bold' },
        { tag: tags.heading3, fontSize: '1.25em', fontWeight: 'bold' },
        { tag: tags.heading4, fontSize: '1.1em', fontWeight: 'bold' },
        { tag: tags.heading5, fontSize: '1em', fontWeight: 'bold' },
        { tag: tags.heading6, fontSize: '0.9em', fontWeight: 'bold' },
        { tag: tags.strong, fontWeight: 'bold' },
        { tag: tags.emphasis, fontStyle: 'italic' },
        { tag: tags.strikethrough, textDecoration: 'line-through' },
        { tag: tags.link, color: 'var(--primary)', textDecoration: 'underline' },
        { tag: tags.url, color: 'var(--primary)', textDecoration: 'underline' },
        { tag: tags.quote, color: 'var(--muted-foreground)', fontStyle: 'italic' },
        { tag: tags.monospace, fontFamily: 'JetBrains Mono, monospace' },
        { tag: tags.content, color: 'var(--foreground)' },
      ]),
    []
  );

  // Handle document changes
  const handleUpdate = useCallback((update: ViewUpdate) => {
    if (update.docChanged) {
      isLocalUpdate.current = true;
      const value = update.state.doc.toString();
      onChangeRef.current(value);
      // Reset flag synchronously (the effect check happens after this)
      isLocalUpdate.current = false;
    }

    if (update.selectionSet && onSelectionChangeRef.current) {
      const selection = update.state.selection.main;
      const text = update.state.doc.sliceString(selection.from, selection.to);
      onSelectionChangeRef.current({
        from: selection.from,
        to: selection.to,
        text,
      });
    }
  }, []);

  // Create editor extensions
  const extensions = useMemo(
    () => [
      theme,
      syntaxHighlighting(highlightTheme),
      history(),
      EditorView.lineWrapping,
      EditorView.updateListener.of(handleUpdate),
      EditorState.readOnly.of(readOnly),
      placeholderExt(placeholder),
      markdown({
        codeLanguages: languages,
        addKeymap: true,
      }),
      autocompletion(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
        ...completionKeymap,
        ...lintKeymap,
      ]),
      ...userExtensions,
    ],
    [readOnly, placeholder, fontSize] // Only re-create when these critical props change
  );

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    if (autoFocus) {
      view.focus();
    }

    // Notify parent component about view creation
    if (onViewCreated) {
      onViewCreated(view);
    }

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []); // Only run once on mount

  // Update editor value when prop changes
  // Only update if the value is different and it's not a local update
  useEffect(() => {
    const view = viewRef.current;
    if (!view || isLocalUpdate.current) return;

    const currentValue = view.state.doc.toString();
    if (value !== currentValue) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value,
        },
      });
    }
  }, [value]);

  // Update extensions when they change
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    view.dispatch({
      effects: StateEffect.reconfigure.of(extensions),
    });
  }, [extensions]);

  return (
    <div
      ref={editorRef}
      className={cn(
        'h-full w-full overflow-auto',
        'bg-background/50 backdrop-blur-sm',
        'rounded-lg border border-border/50',
        className
      )}
    />
  );
};

export const CodeMirrorEditor = React.memo(CodeMirrorEditorComponent);
