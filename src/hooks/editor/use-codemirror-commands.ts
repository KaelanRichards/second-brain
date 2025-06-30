import { cursorDocEnd, cursorDocStart, redo, selectAll, undo } from '@codemirror/commands';
import type { EditorView } from '@codemirror/view';
import { useCallback } from 'react';

export interface EditorCommands {
  // Text formatting
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleCode: () => void;
  toggleStrikethrough: () => void;
  insertLink: (url?: string) => void;
  insertQuote: () => void;
  insertBulletList: () => void;
  insertNumberedList: () => void;
  insertHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
  insertHorizontalRule: () => void;

  // Editor commands
  undo: () => void;
  redo: () => void;
  selectAll: () => void;
  deleteSelection: () => void;

  // Navigation
  goToStart: () => void;
  goToEnd: () => void;

  // Utility
  getSelectedText: () => string;
  insertText: (text: string) => void;
  replaceSelection: (text: string) => void;
  focus: () => void;
  blur: () => void;
}

export function useCodeMirrorCommands(viewRef: React.RefObject<EditorView | null>): EditorCommands {
  const wrapSelection = useCallback(
    (before: string, after: string = before) => {
      const view = viewRef.current;
      if (!view) return;

      const { from, to } = view.state.selection.main;
      const selectedText = view.state.doc.sliceString(from, to);

      view.dispatch({
        changes: {
          from,
          to,
          insert: `${before}${selectedText}${after}`,
        },
        selection: {
          anchor: from + before.length,
          head: from + before.length + selectedText.length,
        },
      });
      view.focus();
    },
    [viewRef]
  );

  const insertAtCursor = useCallback(
    (text: string) => {
      const view = viewRef.current;
      if (!view) return;

      view.dispatch({
        changes: {
          from: view.state.selection.main.from,
          to: view.state.selection.main.to,
          insert: text,
        },
      });
      view.focus();
    },
    [viewRef]
  );

  const insertLinePrefix = useCallback(
    (prefix: string) => {
      const view = viewRef.current;
      if (!view) return;

      const { from } = view.state.selection.main;
      const line = view.state.doc.lineAt(from);

      view.dispatch({
        changes: {
          from: line.from,
          to: line.from,
          insert: prefix,
        },
      });
      view.focus();
    },
    [viewRef]
  );

  return {
    // Text formatting
    toggleBold: () => wrapSelection('**'),
    toggleItalic: () => wrapSelection('*'),
    toggleCode: () => wrapSelection('`'),
    toggleStrikethrough: () => wrapSelection('~~'),

    insertLink: (url) => {
      const view = viewRef.current;
      if (!view) return;

      const { from, to } = view.state.selection.main;
      const selectedText = view.state.doc.sliceString(from, to) || 'link text';
      const linkUrl = url || 'https://example.com';

      view.dispatch({
        changes: {
          from,
          to,
          insert: `[${selectedText}](${linkUrl})`,
        },
        selection: {
          anchor: from + 1,
          head: from + 1 + selectedText.length,
        },
      });
      view.focus();
    },

    insertQuote: () => insertLinePrefix('> '),
    insertBulletList: () => insertLinePrefix('- '),
    insertNumberedList: () => insertLinePrefix('1. '),
    insertHorizontalRule: () => insertAtCursor('\n---\n'),

    insertHeading: (level) => {
      const prefix = `${'#'.repeat(level)} `;
      insertLinePrefix(prefix);
    },

    // Editor commands
    undo: () => {
      const view = viewRef.current;
      if (view) {
        undo(view);
        view.focus();
      }
    },

    redo: () => {
      const view = viewRef.current;
      if (view) {
        redo(view);
        view.focus();
      }
    },

    selectAll: () => {
      const view = viewRef.current;
      if (view) {
        selectAll(view);
        view.focus();
      }
    },

    deleteSelection: () => {
      const view = viewRef.current;
      if (view) {
        view.dispatch({
          changes: {
            from: view.state.selection.main.from,
            to: view.state.selection.main.to,
            insert: '',
          },
        });
        view.focus();
      }
    },

    // Navigation
    goToStart: () => {
      const view = viewRef.current;
      if (view) {
        cursorDocStart(view);
        view.focus();
      }
    },

    goToEnd: () => {
      const view = viewRef.current;
      if (view) {
        cursorDocEnd(view);
        view.focus();
      }
    },

    // Utility
    getSelectedText: () => {
      const view = viewRef.current;
      if (!view) return '';

      const { from, to } = view.state.selection.main;
      return view.state.doc.sliceString(from, to);
    },

    insertText: (text) => insertAtCursor(text),

    replaceSelection: (text) => {
      const view = viewRef.current;
      if (!view) return;

      view.dispatch({
        changes: {
          from: view.state.selection.main.from,
          to: view.state.selection.main.to,
          insert: text,
        },
      });
      view.focus();
    },

    focus: () => viewRef.current?.focus(),
    blur: () => viewRef.current?.contentDOM.blur(),
  };
}
