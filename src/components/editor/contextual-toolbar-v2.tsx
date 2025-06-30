import { useEffect, useState, useRef, useCallback } from 'react';
import { Bold, Italic, Code, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextualToolbarProps {
  onFormat: (type: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  className?: string;
}

export function ContextualToolbarV2({ onFormat, textareaRef, className }: ContextualToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const selectionCheckRef = useRef<number>();

  const tools = [
    { type: 'bold', icon: Bold, title: 'Bold (⌘B)' },
    { type: 'italic', icon: Italic, title: 'Italic (⌘I)' },
    { type: 'code', icon: Code, title: 'Code (⌘⇧`)' },
    { type: 'link', icon: Link, title: 'Link (⌘⇧K)' },
  ];

  const checkSelection = useCallback(() => {
    const textarea = textareaRef?.current;
    if (!textarea || document.activeElement !== textarea) {
      setIsVisible(false);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const hasSelection = start !== end;

    if (hasSelection) {
      // Simple positioning: center above textarea
      const rect = textarea.getBoundingClientRect();
      const toolbarHeight = 48;
      const gap = 12;
      
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - toolbarHeight - gap + window.scrollY
      });
      
      // Use RAF to avoid flickering
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
    }
  }, [textareaRef]);

  // Throttled selection check
  const throttledCheck = useCallback(() => {
    if (selectionCheckRef.current) {
      cancelAnimationFrame(selectionCheckRef.current);
    }
    
    selectionCheckRef.current = requestAnimationFrame(checkSelection);
  }, [checkSelection]);

  useEffect(() => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    // Use more performant events
    const handleSelectionChange = () => throttledCheck();
    
    // Listen to multiple events to catch all selection changes
    textarea.addEventListener('mouseup', handleSelectionChange);
    textarea.addEventListener('keyup', handleSelectionChange);
    textarea.addEventListener('select', handleSelectionChange);
    
    // Also listen for focus events
    textarea.addEventListener('focus', handleSelectionChange);
    textarea.addEventListener('blur', () => setIsVisible(false));

    return () => {
      textarea.removeEventListener('mouseup', handleSelectionChange);
      textarea.removeEventListener('keyup', handleSelectionChange);
      textarea.removeEventListener('select', handleSelectionChange);
      textarea.removeEventListener('focus', handleSelectionChange);
      textarea.removeEventListener('blur', () => setIsVisible(false));
      
      if (selectionCheckRef.current) {
        cancelAnimationFrame(selectionCheckRef.current);
      }
    };
  }, [textareaRef, throttledCheck]);

  // Hide toolbar when clicking outside
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const textarea = textareaRef?.current;
      
      // Don't hide if clicking on toolbar or textarea
      if (
        toolbarRef.current?.contains(target) ||
        textarea?.contains(target)
      ) {
        return;
      }
      
      setIsVisible(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible, textareaRef]);

  if (!isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      className={cn(
        'fixed z-50 flex items-center gap-1 p-2',
        'glass-surface backdrop-blur-sm rounded-lg shadow-xl border border-white/10',
        'transform -translate-x-1/2',
        'animate-in fade-in-0 zoom-in-95 duration-150',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.type}
            onMouseDown={(e) => {
              // Prevent losing focus from textarea
              e.preventDefault();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFormat(tool.type);
              
              // Keep focus on textarea and hide toolbar
              requestAnimationFrame(() => {
                textareaRef?.current?.focus();
                setIsVisible(false);
              });
            }}
            title={tool.title}
            className={cn(
              'p-2 rounded-md transition-all duration-200',
              'hover:bg-white/10 active:bg-white/20',
              'text-text-muted hover:text-text'
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}