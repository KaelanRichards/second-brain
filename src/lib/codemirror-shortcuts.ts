import type { Extension } from '@codemirror/state';
import { keymap } from '@codemirror/view';

export interface ShortcutHandlers {
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleCode: () => void;
  toggleStrikethrough: () => void;
  insertLink: () => void;
  insertQuote: () => void;
  insertBulletList: () => void;
  insertNumberedList: () => void;
  insertHeading1: () => void;
  insertHeading2: () => void;
  insertHeading3: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleFocusMode: () => void;
  togglePreview: () => void;
  save: () => void;
}

export function createKeyboardShortcuts(handlers: ShortcutHandlers): Extension {
  return keymap.of([
    // Text formatting
    {
      key: 'Mod-b',
      run: () => {
        handlers.toggleBold();
        return true;
      },
    },
    {
      key: 'Mod-i',
      run: () => {
        handlers.toggleItalic();
        return true;
      },
    },
    {
      key: 'Mod-`',
      run: () => {
        handlers.toggleCode();
        return true;
      },
    },
    {
      key: 'Mod-Shift-x',
      run: () => {
        handlers.toggleStrikethrough();
        return true;
      },
    },
    {
      key: 'Mod-k',
      run: () => {
        handlers.insertLink();
        return true;
      },
    },

    // Block formatting
    {
      key: 'Mod-Shift-q',
      run: () => {
        handlers.insertQuote();
        return true;
      },
    },
    {
      key: 'Mod-Shift-8',
      run: () => {
        handlers.insertBulletList();
        return true;
      },
    },
    {
      key: 'Mod-Shift-7',
      run: () => {
        handlers.insertNumberedList();
        return true;
      },
    },

    // Headings
    {
      key: 'Mod-1',
      run: () => {
        handlers.insertHeading1();
        return true;
      },
    },
    {
      key: 'Mod-2',
      run: () => {
        handlers.insertHeading2();
        return true;
      },
    },
    {
      key: 'Mod-3',
      run: () => {
        handlers.insertHeading3();
        return true;
      },
    },

    // UI controls
    {
      key: 'Mod-=',
      run: () => {
        handlers.increaseFontSize();
        return true;
      },
    },
    {
      key: 'Mod-Plus',
      run: () => {
        handlers.increaseFontSize();
        return true;
      },
    },
    {
      key: 'Mod--',
      run: () => {
        handlers.decreaseFontSize();
        return true;
      },
    },
    {
      key: 'Mod-Minus',
      run: () => {
        handlers.decreaseFontSize();
        return true;
      },
    },
    {
      key: 'Mod-Shift-f',
      run: () => {
        handlers.toggleFocusMode();
        return true;
      },
    },
    {
      key: 'Mod-Shift-p',
      run: () => {
        handlers.togglePreview();
        return true;
      },
    },

    // Save
    {
      key: 'Mod-s',
      run: () => {
        handlers.save();
        return true;
      },
    },

    // Custom Tab behavior for lists
    {
      key: 'Tab',
      run: (view) => {
        const { from } = view.state.selection.main;
        const line = view.state.doc.lineAt(from);
        const lineText = line.text;

        // Check if we're in a list
        if (/^(\s*)([-*+]|\d+\.)\s/.test(lineText)) {
          // Indent the list item
          view.dispatch({
            changes: { from: line.from, to: line.from, insert: '  ' },
          });
          return true;
        }

        // Default tab behavior
        view.dispatch({
          changes: { from, to: from, insert: '\t' },
        });
        return true;
      },
    },

    // Shift-Tab for outdenting lists
    {
      key: 'Shift-Tab',
      run: (view) => {
        const { from } = view.state.selection.main;
        const line = view.state.doc.lineAt(from);
        const lineText = line.text;

        // Check if we're in an indented list
        if (/^(\s+)([-*+]|\d+\.)\s/.test(lineText)) {
          // Remove up to 2 spaces
          const match = lineText.match(/^(\s+)/);
          if (match && match[1]) {
            const spaces = match[1];
            const toRemove = Math.min(2, spaces.length);
            view.dispatch({
              changes: { from: line.from, to: line.from + toRemove, insert: '' },
            });
            return true;
          }
        }

        return false;
      },
    },

    // Enter key for smart list continuation
    {
      key: 'Enter',
      run: (view) => {
        const { from } = view.state.selection.main;
        const line = view.state.doc.lineAt(from);
        const lineText = line.text;

        // Check for list patterns
        const bulletMatch = lineText.match(/^(\s*)([-*+])\s+(.*)$/);
        const numberedMatch = lineText.match(/^(\s*)(\d+)\.\s+(.*)$/);
        const quoteMatch = lineText.match(/^(\s*)(>+)\s*(.*)$/);

        if (bulletMatch) {
          const [, indent, bullet, content] = bulletMatch;
          if (!content?.trim()) {
            // Empty list item - break out of list
            view.dispatch({
              changes: { from: line.from, to: line.to, insert: '' },
            });
          } else {
            // Continue list
            view.dispatch({
              changes: { from, to: from, insert: `\n${indent}${bullet} ` },
            });
          }
          return true;
        }

        if (numberedMatch) {
          const [, indent, num, content] = numberedMatch;
          if (!content?.trim()) {
            // Empty list item - break out of list
            view.dispatch({
              changes: { from: line.from, to: line.to, insert: '' },
            });
          } else {
            // Continue numbered list
            const nextNum = parseInt(num || '1') + 1;
            view.dispatch({
              changes: { from, to: from, insert: `\n${indent}${nextNum}. ` },
            });
          }
          return true;
        }

        if (quoteMatch) {
          const [, indent, quotes, content] = quoteMatch;
          if (!content?.trim() && from === line.to) {
            // Empty quote line at end - break out
            view.dispatch({
              changes: { from: line.from, to: line.to, insert: '' },
            });
          } else {
            // Continue quote
            view.dispatch({
              changes: { from, to: from, insert: `\n${indent}${quotes} ` },
            });
          }
          return true;
        }

        // Default Enter behavior
        view.dispatch({
          changes: { from, to: from, insert: '\n' },
        });
        return true;
      },
    },
  ]);
}
