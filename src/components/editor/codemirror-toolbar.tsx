import { StateEffect } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { Bold, Code, Hash, Italic, Link, List, ListOrdered, Quote } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { EditorCommands } from '@/hooks/editor/use-codemirror-commands';
import { cn } from '@/lib/utils';

interface CodeMirrorToolbarProps {
  view: EditorView | null;
  commands: EditorCommands;
  className?: string;
}

interface ToolbarPosition {
  top: number;
  left: number;
  visible: boolean;
}

const TOOLBAR_OFFSET = 8;

export const CodeMirrorToolbar: React.FC<CodeMirrorToolbarProps> = ({
  view,
  commands,
  className,
}) => {
  const [position, setPosition] = useState<ToolbarPosition>({
    top: 0,
    left: 0,
    visible: false,
  });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const selectionCheckRef = useRef<number | null>(null);

  const updatePosition = useCallback(() => {
    if (!view || !toolbarRef.current) {
      setPosition((prev) => ({ ...prev, visible: false }));
      return;
    }

    const selection = view.state.selection.main;
    if (selection.empty) {
      setPosition((prev) => ({ ...prev, visible: false }));
      return;
    }

    // Get the coordinates of the selection
    const coords = view.coordsAtPos(selection.from);
    const endCoords = view.coordsAtPos(selection.to);

    if (!coords || !endCoords) {
      setPosition((prev) => ({ ...prev, visible: false }));
      return;
    }

    // Get editor position
    const editorRect = view.dom.getBoundingClientRect();
    const toolbarRect = toolbarRef.current.getBoundingClientRect();

    // Calculate center position between start and end
    const left = Math.max(
      TOOLBAR_OFFSET,
      Math.min(
        (coords.left + endCoords.right) / 2 - toolbarRect.width / 2 - editorRect.left,
        editorRect.width - toolbarRect.width - TOOLBAR_OFFSET
      )
    );

    // Position above the selection
    const top = coords.top - editorRect.top - toolbarRect.height - TOOLBAR_OFFSET;

    setPosition({
      top: Math.max(TOOLBAR_OFFSET, top),
      left,
      visible: true,
    });
  }, [view]);

  // Throttled check for selection changes
  const checkSelection = useCallback(() => {
    if (selectionCheckRef.current) {
      cancelAnimationFrame(selectionCheckRef.current);
    }

    selectionCheckRef.current = requestAnimationFrame(() => {
      updatePosition();
    });
  }, [updatePosition]);

  useEffect(() => {
    if (!view) return;

    // Listen for selection changes
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.selectionSet || update.docChanged) {
        checkSelection();
      }
    });

    // Add the extension to the editor
    view.dispatch({
      effects: StateEffect.appendConfig.of(updateListener),
    });

    // Initial check
    checkSelection();

    return () => {
      if (selectionCheckRef.current) {
        cancelAnimationFrame(selectionCheckRef.current);
      }
    };
  }, [view, checkSelection]);

  const tools = [
    { icon: Bold, action: commands.toggleBold, title: 'Bold (⌘B)' },
    { icon: Italic, action: commands.toggleItalic, title: 'Italic (⌘I)' },
    { icon: Code, action: commands.toggleCode, title: 'Code (⌘`)' },
    { icon: Link, action: commands.insertLink, title: 'Link (⌘K)' },
    { icon: Quote, action: commands.insertQuote, title: 'Quote' },
    { icon: List, action: commands.insertBulletList, title: 'Bullet List' },
    { icon: ListOrdered, action: commands.insertNumberedList, title: 'Numbered List' },
    { icon: Hash, action: () => commands.insertHeading(2), title: 'Heading' },
  ];

  return (
    <div
      ref={toolbarRef}
      className={cn(
        'absolute z-50 flex items-center gap-1 p-1',
        'bg-background/95 backdrop-blur-sm',
        'border border-border/50 rounded-lg shadow-lg',
        'transition-all duration-200',
        position.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {tools.map((tool, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            tool.action();
          }}
          className={cn(
            'p-1.5 rounded hover:bg-accent/50',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-accent/50'
          )}
          title={tool.title}
          type="button"
        >
          <tool.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};
