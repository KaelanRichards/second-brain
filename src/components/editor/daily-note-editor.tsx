import { useImperativeHandle, forwardRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedEditor } from '@/hooks/use-unified-editor';
import { FormatType } from '@/hooks/use-markdown-formatter';
import { EditorLayout, EditorHeader, EditorStatusBar } from './editor-layout';
import { MarkdownToolbar } from './markdown-toolbar';
import { MarkdownPreview } from './markdown-preview';
import { ContextualToolbarV2 as ContextualToolbar } from './contextual-toolbar-v2';

interface DailyNoteEditorProps {
  date: string;
}

export interface DailyNoteEditorRef {
  toggleFocusMode: () => void;
  changeFontSize: (delta: number) => void;
  togglePreview: () => void;
}

export const DailyNoteEditor = forwardRef<DailyNoteEditorRef, DailyNoteEditorProps>(
  ({ date }, ref) => {
    const {
      content,
      updateContent,
      textareaRef,
      state,
      actions,
      isSaving,
      stats,
      applyFormat,
      handleKeyDown
    } = useUnifiedEditor(date);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      toggleFocusMode: actions.toggleFocusMode,
      changeFontSize: (delta: number) => 
        actions.setFontSize(state.ui.fontSize + delta),
      togglePreview: actions.togglePreview,
    }));

    // Enhanced content change handler
    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target;
      const newContent = textarea.value;
      const cursorPosition = textarea.selectionStart;
      const scrollTop = textarea.scrollTop;
      
      updateContent(newContent);
      
      // Preserve cursor position and scroll after React re-render
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
          textareaRef.current.scrollTop = scrollTop;
        }
      });
    }, [updateContent, textareaRef]);

    // Enhanced format handler
    const handleFormat = useCallback((type: string) => {
      const formatType = type as FormatType;
      applyFormat(formatType);
    }, [applyFormat]);

    // Enhanced keyboard handler
    const handleSpecialKeys = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Let the unified handler process first
      handleKeyDown(e);
      
      // Handle special cases that need content updates
      if (e.key === 'Tab' && !e.defaultPrevented) {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const scrollTop = textarea.scrollTop;
        
        if (e.shiftKey) {
          // Shift+Tab: Unindent
          const lineStart = value.lastIndexOf('\n', start - 1) + 1;
          const lineEnd = value.indexOf('\n', start);
          const line = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);
          
          if (line.startsWith('  ')) {
            const newValue = value.substring(0, lineStart) + line.substring(2) + value.substring(lineStart + line.length);
            updateContent(newValue);
            
            requestAnimationFrame(() => {
              if (textareaRef.current) {
                const newStart = Math.max(lineStart, start - 2);
                const newEnd = Math.max(lineStart, end - 2);
                textareaRef.current.setSelectionRange(newStart, newEnd);
                textareaRef.current.scrollTop = scrollTop;
                textareaRef.current.focus();
              }
            });
          }
        } else {
          // Tab: Indent
          const newValue = value.substring(0, start) + '  ' + value.substring(end);
          updateContent(newValue);
          
          requestAnimationFrame(() => {
            if (textareaRef.current) {
              textareaRef.current.setSelectionRange(start + 2, end + 2);
              textareaRef.current.scrollTop = scrollTop;
              textareaRef.current.focus();
            }
          });
        }
      }
      
      if (e.key === 'Enter' && !e.defaultPrevented) {
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const beforeCursor = content.slice(0, start);
        const currentLineStart = beforeCursor.lastIndexOf('\n') + 1;
        const currentLine = beforeCursor.slice(currentLineStart);
        
        // Continue list items
        const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s/);
        if (listMatch) {
          e.preventDefault();
          const indent = listMatch[1] || '';
          const marker = listMatch[2] || '';
          const isNumbered = /\d+\./.test(marker);
          
          let newMarker;
          if (isNumbered) {
            const num = parseInt(marker) + 1;
            newMarker = `${num}.`;
          } else {
            newMarker = marker;
          }
          
          const newText = `\n${indent}${newMarker} `;
          const afterCursor = content.slice(start);
          const newContent = beforeCursor + newText + afterCursor;
          
          updateContent(newContent);
          
          requestAnimationFrame(() => {
            if (textareaRef.current) {
              const newPosition = start + newText.length;
              textareaRef.current.setSelectionRange(newPosition, newPosition);
            }
          });
        }
        
        // Continue blockquotes
        const quoteMatch = currentLine.match(/^(\s*)>\s/);
        if (quoteMatch) {
          e.preventDefault();
          const indent = quoteMatch[1] || '';
          const newText = `\n${indent}> `;
          const afterCursor = content.slice(start);
          const newContent = beforeCursor + newText + afterCursor;
          
          updateContent(newContent);
          
          requestAnimationFrame(() => {
            if (textareaRef.current) {
              const newPosition = start + newText.length;
              textareaRef.current.setSelectionRange(newPosition, newPosition);
            }
          });
        }
      }
    }, [handleKeyDown, content, updateContent, textareaRef]);

    // Auto-resize textarea
    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const cursorPosition = textarea.selectionStart;
      const scrollTop = textarea.scrollTop;
      
      // Auto-resize
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(400, textarea.scrollHeight) + 'px';
      
      // Restore cursor position and scroll
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
          textareaRef.current.scrollTop = scrollTop;
        }
      });
    }, [content, textareaRef]);

    // Format date for display
    const formatDate = (dateStr: string) => {
      const dateObj = new Date(dateStr + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const isToday = dateObj.getTime() === today.getTime();
      
      return { isToday };
    };

    const { isToday } = formatDate(date);

    return (
      <EditorLayout focusMode={state.ui.focusMode}>
        {/* Header */}
        <EditorHeader 
          date={date} 
          isToday={isToday} 
          focusMode={state.ui.focusMode} 
        />

        {/* Markdown Toolbar - Hidden by default, shown in preview mode */}
        {!state.ui.focusMode && state.ui.showPreview && (
          <MarkdownToolbar
            onFormat={handleFormat}
            showPreview={state.ui.showPreview}
            onTogglePreview={actions.togglePreview}
            className="mb-4"
          />
        )}
        
        {/* Contextual Toolbar - Shows on text selection */}
        <ContextualToolbar onFormat={handleFormat} textareaRef={textareaRef} />

        {/* Editor and Preview */}
        <div className="flex-1 relative">
          {state.ui.showPreview ? (
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Editor Side */}
              <div className="flex flex-col">
                <div className="text-xs text-text-muted mb-2 font-medium">MARKDOWN</div>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleContentChange}
                  onKeyDown={handleSpecialKeys}
                  placeholder="Write in markdown..."
                  className={cn(
                    'w-full min-h-[400px] bg-transparent resize-none flex-1',
                    'placeholder:text-text-muted/50',
                    'focus:outline-none',
                    'text-enhanced writing-focus',
                    'transition-all duration-200'
                  )}
                  style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: `${state.ui.fontSize - 2}px`,
                    lineHeight: 1.5,
                  }}
                />
              </div>
              
              {/* Preview Side */}
              <div className="flex flex-col">
                <div className="text-xs text-text-muted mb-2 font-medium">PREVIEW</div>
                <div className="flex-1 overflow-y-auto">
                  <MarkdownPreview
                    content={content}
                    fontSize={state.ui.fontSize}
                    lineHeight={1.6}
                  />
                </div>
              </div>
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleSpecialKeys}
              placeholder={state.ui.focusMode ? "Write..." : "Start writing..."}
              className={cn(
                'w-full min-h-[400px] bg-transparent resize-none',
                'placeholder:text-text-muted/50',
                'focus:outline-none',
                'text-enhanced writing-focus',
                'transition-all duration-200',
                state.ui.focusMode && 'min-h-[600px]'
              )}
              style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: `${state.ui.fontSize}px`,
                lineHeight: 1.6,
              }}
            />
          )}
        </div>

        {/* Status Bar */}
        <EditorStatusBar 
          stats={stats} 
          isSaving={isSaving} 
          focusMode={state.ui.focusMode}
        >
          {/* Font Size Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => actions.setFontSize(state.ui.fontSize - 2)}
              className="px-2 py-1 text-xs hover:bg-white/10 rounded transition-colors"
              title="Decrease font size (⌘-)"
            >
              A-
            </button>
            <span className="text-xs px-2">{state.ui.fontSize}px</span>
            <button
              onClick={() => actions.setFontSize(state.ui.fontSize + 2)}
              className="px-2 py-1 text-xs hover:bg-white/10 rounded transition-colors"
              title="Increase font size (⌘+)"
            >
              A+
            </button>
          </div>
          
          {/* Preview Toggle */}
          <button
            onClick={actions.togglePreview}
            className={cn(
              "px-2 py-1 text-xs rounded transition-colors",
              state.ui.showPreview 
                ? "bg-accent/20 text-accent" 
                : "hover:bg-white/10"
            )}
            title="Toggle preview (⌘P)"
          >
            {state.ui.showPreview ? 'Hide Preview' : 'Preview'}
          </button>
          
          {/* Focus Mode Toggle */}
          <button
            onClick={actions.toggleFocusMode}
            className={cn(
              "px-2 py-1 text-xs rounded transition-colors",
              state.ui.focusMode 
                ? "bg-accent/20 text-accent" 
                : "hover:bg-white/10"
            )}
            title="Toggle focus mode (⌘⇧F)"
          >
            {state.ui.focusMode ? 'Exit Focus' : 'Focus'}
          </button>
          
          {/* Command Palette Hint */}
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 text-xs bg-white/10 rounded border border-white/20">⌘K</kbd>
            <span>Commands</span>
          </div>
        </EditorStatusBar>
      </EditorLayout>
    );
  }
);

DailyNoteEditor.displayName = 'DailyNoteEditor';