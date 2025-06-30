import { format } from 'date-fns';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useCodeMirrorEditor } from '@/hooks/editor/use-codemirror-editor';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/stores/notes-store';
import { CodeMirrorEditor } from './codemirror-editor';
import { CodeMirrorToolbar } from './codemirror-toolbar';
import { EditorStatusBar } from './editor-status-bar';
import { EditorToolbar } from './editor-toolbar';
import { MarkdownPreview } from './markdown-preview';

export interface DailyNoteEditorRef {
  toggleFocusMode: () => void;
  changeFontSize: (delta: number) => void;
  togglePreview: () => void;
}

export const DailyNoteEditor = forwardRef<DailyNoteEditorRef, {}>((_, ref) => {
  const { date } = useParams<{ date: string }>();
  const noteDate = date || format(new Date(), 'yyyy-MM-dd');
  const [initialContent, setInitialContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { loadNote, saveNote } = useNotesStore();

  // Load note on mount or date change
  useEffect(() => {
    let cancelled = false;
    
    const loadNoteContent = async () => {
      setIsLoading(true);
      try {
        const note = await loadNote(noteDate);
        if (!cancelled) {
          setInitialContent(note?.content || '');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load note:', error);
        if (!cancelled) {
          setInitialContent('');
          setIsLoading(false);
        }
      }
    };

    loadNoteContent();

    return () => {
      cancelled = true;
    };
  }, [noteDate, loadNote]);

  // Memoize the save handler to prevent recreating the editor
  const handleSave = useCallback(async (value: string) => {
    try {
      await saveNote(noteDate, value);
    } catch (error) {
      console.error('Failed to save note:', error);
      // TODO: Show error notification
    }
  }, [noteDate, saveNote]);

  const editor = useCodeMirrorEditor({
    initialValue: '', // Start with empty value
    onChange: undefined, // We don't need onChange since we have auto-save
    onSave: handleSave,
    autoSaveDelay: 1000, // Increase to 1 second to reduce backend calls
    showLineNumbers: false,
  });

  // Update editor value only once when content is loaded for a new date
  useEffect(() => {
    if (!isLoading) {
      editor.setValue(initialContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteDate, isLoading]); // Re-run when date changes or loading completes

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      toggleFocusMode: editor.toggleFocusMode,
      changeFontSize: (delta: number) => {
        const newSize = editor.fontSize + delta;
        if (newSize >= 12 && newSize <= 24) {
          editor.setFontSize(newSize);
        }
      },
      togglePreview: editor.togglePreview,
    }),
    [editor]
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading note...</div>
      </div>
    );
  }

  return (
    <div className={cn('flex-1 flex flex-col h-full', editor.focusMode && 'focus-mode')}>
      {/* Toolbar */}
      <div className={cn('transition-all duration-300', editor.focusMode && 'focus-mode-hidden')}>
        <EditorToolbar
          onBold={editor.commands.toggleBold}
          onItalic={editor.commands.toggleItalic}
          onCode={editor.commands.toggleCode}
          onLink={editor.commands.insertLink}
          onQuote={editor.commands.insertQuote}
          onBulletList={editor.commands.insertBulletList}
          onNumberedList={editor.commands.insertNumberedList}
          onHeading1={() => editor.commands.insertHeading(1)}
          onHeading2={() => editor.commands.insertHeading(2)}
          onHeading3={() => editor.commands.insertHeading(3)}
          onToggleFocusMode={editor.toggleFocusMode}
          onTogglePreview={editor.togglePreview}
          focusModeActive={editor.focusMode}
          previewActive={editor.showPreview}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor */}
        <div
          className={cn(
            'flex-1 flex flex-col transition-all duration-300',
            editor.showPreview && 'w-1/2',
            editor.focusMode && 'max-w-3xl mx-auto px-8'
          )}
        >
          <Card
            className={cn(
              'flex-1 overflow-hidden relative',
              'bg-background/30 backdrop-blur-sm',
              'border-0',
              editor.focusMode && 'shadow-2xl'
            )}
          >
            <CodeMirrorEditor
              value={editor.value}
              onChange={editor.setValue}
              onSelectionChange={editor.handleSelectionChange}
              onViewCreated={editor.onViewCreated}
              placeholder="Start writing..."
              fontSize={editor.fontSize}
              autoFocus
              extensions={editor.extensions}
              className="h-full"
            />
            {/* Contextual Toolbar */}
            <CodeMirrorToolbar view={editor.viewRef.current} commands={editor.commands} />
          </Card>
        </div>

        {/* Preview */}
        {editor.showPreview && (
          <div className="w-1/2 px-2">
            <Card className="h-full overflow-hidden bg-background/30 backdrop-blur-sm border-border/50">
              <MarkdownPreview content={editor.value} />
            </Card>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className={cn('transition-all duration-300', editor.focusMode && 'focus-mode-hidden')}>
        <EditorStatusBar
          wordCount={editor.stats.words}
          charCount={editor.stats.characters}
          readingTime={editor.stats.readingTime}
          fontSize={editor.fontSize}
          onFontSizeChange={editor.setFontSize}
          isAutoSaving={editor.isAutoSaving}
          lastSaved={editor.lastSaved}
        />
      </div>
    </div>
  );
});

DailyNoteEditor.displayName = 'DailyNoteEditor';
