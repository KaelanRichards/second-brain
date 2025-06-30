import { Bold, Italic, Code, Link, Quote, List, Heading1, Heading2, Heading3, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkdownToolbarProps {
  onFormat: (type: string, value?: string) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  className?: string;
}

export function MarkdownToolbar({ onFormat, showPreview, onTogglePreview, className }: MarkdownToolbarProps) {
  const tools = [
    { type: 'bold', icon: Bold, title: 'Bold (⌘B)', shortcut: '⌘B' },
    { type: 'italic', icon: Italic, title: 'Italic (⌘I)', shortcut: '⌘I' },
    { type: 'code', icon: Code, title: 'Inline Code (⌘⇧`)', shortcut: '⌘⇧`' },
    { type: 'divider' },
    { type: 'heading1', icon: Heading1, title: 'Heading 1 (⌘⇧1)', shortcut: '⌘⇧1' },
    { type: 'heading2', icon: Heading2, title: 'Heading 2 (⌘⇧2)', shortcut: '⌘⇧2' },
    { type: 'heading3', icon: Heading3, title: 'Heading 3 (⌘⇧3)', shortcut: '⌘⇧3' },
    { type: 'divider' },
    { type: 'link', icon: Link, title: 'Link (⌘⇧K)', shortcut: '⌘⇧K' },
    { type: 'quote', icon: Quote, title: 'Blockquote (⌘⇧Q)', shortcut: '⌘⇧Q' },
    { type: 'list', icon: List, title: 'List (⌘⇧L)', shortcut: '⌘⇧L' },
    { type: 'divider' },
    { 
      type: 'preview', 
      icon: showPreview ? EyeOff : Eye, 
      title: showPreview ? 'Hide Preview (⌘P)' : 'Show Preview (⌘P)',
      shortcut: '⌘P'
    },
  ];

  return (
    <div className={cn(
      'flex items-center gap-1 p-2 border-b border-white/10',
      'glass-surface/50 backdrop-blur-sm',
      className
    )}>
      {tools.map((tool, index) => {
        if (tool.type === 'divider') {
          return (
            <div 
              key={index} 
              className="w-px h-6 bg-white/20 mx-1" 
            />
          );
        }

        const Icon = tool.icon!;
        const isPreview = tool.type === 'preview';
        const isActive = isPreview && showPreview;

        return (
          <button
            key={tool.type}
            onClick={() => isPreview ? onTogglePreview() : onFormat(tool.type)}
            title={tool.title}
            className={cn(
              'p-2 rounded-md transition-all duration-200',
              'hover:bg-white/10 active:bg-white/20',
              'text-text-muted hover:text-text',
              isActive && 'bg-accent/20 text-accent'
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}