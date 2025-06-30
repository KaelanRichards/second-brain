import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import type { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

export const glassTheme = EditorView.theme({
  '&': {
    color: 'var(--foreground)',
    backgroundColor: 'transparent',
    fontSize: '16px',
  },
  '.cm-content': {
    caretColor: 'var(--primary)',
    fontFamily: 'Charter, Georgia, serif',
    lineHeight: '1.8',
    padding: '2rem',
    minHeight: '100%',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-focused .cm-cursor': {
    borderLeftColor: 'var(--primary)',
    borderLeftWidth: '2px',
  },
  '.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: 'var(--accent)',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--accent/5)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--accent/10)',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: 'var(--muted-foreground)',
    border: 'none',
    borderRight: '1px solid var(--border)',
  },
  '.cm-lineNumbers': {
    minWidth: '3rem',
    padding: '0 0.5rem',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    textAlign: 'right',
    padding: '0 0.5rem 0 0',
  },
  '.cm-scroller': {
    fontFamily: 'inherit',
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--muted) transparent',
  },
  '.cm-scroller::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '.cm-scroller::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '.cm-scroller::-webkit-scrollbar-thumb': {
    background: 'var(--muted)',
    borderRadius: '4px',
  },
  '.cm-scroller::-webkit-scrollbar-thumb:hover': {
    background: 'var(--muted-foreground)',
  },
  '.cm-placeholder': {
    color: 'var(--muted-foreground)',
    fontStyle: 'italic',
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    backdropFilter: 'blur(8px)',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul': {
      fontFamily: 'var(--font-sans)',
      maxHeight: '200px',
      '& > li': {
        padding: '2px 1em 2px 3px',
      },
      '& > li[aria-selected]': {
        backgroundColor: 'var(--accent)',
        color: 'var(--accent-foreground)',
      },
    },
  },
  '.cm-search': {
    '& input, & button': {
      fontFamily: 'var(--font-sans)',
    },
  },
  '.cm-panels': {
    backgroundColor: 'var(--background/80)',
    backdropFilter: 'blur(8px)',
    color: 'var(--foreground)',
  },
  '.cm-panels.cm-panels-top': {
    borderBottom: '1px solid var(--border)',
  },
  '.cm-panels.cm-panels-bottom': {
    borderTop: '1px solid var(--border)',
  },
  '.cm-searchMatch': {
    backgroundColor: 'var(--primary/20)',
  },
  '.cm-searchMatch-selected': {
    backgroundColor: 'var(--primary/40)',
  },
  '.cm-foldGutter .cm-gutterElement': {
    cursor: 'pointer',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'var(--muted)',
    border: 'none',
    color: 'var(--muted-foreground)',
    borderRadius: '3px',
    padding: '0 4px',
    margin: '0 4px',
  },
});

export const glassSyntaxHighlighting = HighlightStyle.define([
  // Headings
  { tag: tags.heading1, fontSize: '2em', fontWeight: '600', lineHeight: '1.2' },
  { tag: tags.heading2, fontSize: '1.5em', fontWeight: '600', lineHeight: '1.3' },
  { tag: tags.heading3, fontSize: '1.25em', fontWeight: '600', lineHeight: '1.4' },
  { tag: tags.heading4, fontSize: '1.1em', fontWeight: '600' },
  { tag: tags.heading5, fontSize: '1em', fontWeight: '600' },
  { tag: tags.heading6, fontSize: '0.9em', fontWeight: '600' },

  // Text formatting
  { tag: tags.strong, fontWeight: '700' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strikethrough, textDecoration: 'line-through', opacity: '0.7' },

  // Links
  { tag: tags.link, color: 'var(--primary)', textDecoration: 'underline' },
  { tag: tags.url, color: 'var(--primary)', textDecoration: 'underline' },

  // Code
  { tag: tags.monospace, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9em' },

  // Lists
  { tag: tags.list, marginLeft: '1em' },

  // Quotes
  {
    tag: tags.quote,
    color: 'var(--muted-foreground)',
    fontStyle: 'italic',
    borderLeft: '3px solid var(--border)',
    paddingLeft: '1em',
  },

  // Comments and meta
  { tag: tags.comment, color: 'var(--muted-foreground)', fontStyle: 'italic' },
  { tag: tags.meta, color: 'var(--muted-foreground)' },

  // Syntax highlighting for code blocks
  { tag: tags.keyword, color: 'var(--primary)' },
  { tag: tags.operator, color: 'var(--primary)' },
  { tag: tags.className, color: '#f39c12' },
  { tag: tags.variableName, color: '#3498db' },
  { tag: tags.function(tags.variableName), color: '#8b5cf6' },
  { tag: tags.string, color: '#27ae60' },
  { tag: tags.number, color: '#e74c3c' },
  { tag: tags.bool, color: '#e74c3c', fontWeight: '600' },
  { tag: tags.null, color: '#e74c3c', fontWeight: '600' },
  { tag: tags.propertyName, color: '#3498db' },
  { tag: tags.punctuation, color: 'var(--muted-foreground)' },
  { tag: tags.bracket, color: 'var(--muted-foreground)' },
]);

export function createGlassTheme(): Extension[] {
  return [glassTheme, syntaxHighlighting(glassSyntaxHighlighting)];
}
