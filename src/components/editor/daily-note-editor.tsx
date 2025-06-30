import { forwardRef, useCallback, useImperativeHandle } from 'react';
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

interface DailyNoteEditorProps {
  noteDate: string;
  initialContent: string;
  sidebarOpen?: boolean;
}

export const DailyNoteEditor = forwardRef<DailyNoteEditorRef, DailyNoteEditorProps>(
  ({ noteDate, initialContent, sidebarOpen = true }, ref) => {
    const { saveNote } = useNotesStore();

    // Memoize the save handler to prevent recreating the editor
    const handleSave = useCallback(
      async (value: string) => {
        try {
          await saveNote(noteDate, value);
        } catch (error) {
          console.error('Failed to save note:', error);
          // TODO: Show error notification
        }
      },
      [noteDate, saveNote]
    );

    const editor = useCodeMirrorEditor({
      initialValue: initialContent,
      onChange: undefined, // We don't need onChange since we have auto-save
      onSave: handleSave,
      autoSaveDelay: 1000, // Increase to 1 second to reduce backend calls
      showLineNumbers: false,
    });

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

    return (
      <div className={cn('flex-1 flex flex-col h-full', editor.focusMode && 'focus-mode')}>
        {/* Header Section */}
        <div
          className={cn(
            'transition-all duration-300 border-b border-border/10',
            editor.focusMode && 'opacity-0 pointer-events-none'
          )}
        >
          {/* Toolbar */}
          <div className="py-3 px-6 lg:px-8 xl:px-12 max-w-6xl mx-auto">
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
        </div>

        {/* Main content area */}
        <div
          className={cn(
            'flex-1 overflow-hidden mx-auto w-full',
            editor.showPreview ? 'flex max-w-none' : 'max-w-6xl'
          )}
        >
          {/* Editor */}
          <div
            className={cn(
              'flex-1 overflow-hidden relative px-6 lg:px-8 xl:px-12 py-8',
              editor.focusMode && 'max-w-4xl mx-auto',
              editor.showPreview && 'w-1/2 border-r border-border/10'
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
            <CodeMirrorToolbar view={editor.view} commands={editor.commands} />
          </div>

          {/* Preview */}
          {editor.showPreview && (
            <div className="w-1/2 px-6 lg:px-8 xl:px-12 py-8 overflow-hidden">
              <MarkdownPreview content={editor.value} />
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div
          className={cn(
            'transition-all duration-300 border-t border-border/10',
            editor.focusMode && 'opacity-0 pointer-events-none'
          )}
        >
          {/* Status bar */}
          <div className="py-3 px-6 lg:px-8 xl:px-12 max-w-6xl mx-auto">
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
      </div>
    );
  }
);

DailyNoteEditor.displayName = 'DailyNoteEditor';
