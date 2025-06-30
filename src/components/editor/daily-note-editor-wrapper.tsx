import { format } from 'date-fns';
import { forwardRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNotesStore } from '@/stores/notes-store';
import { DailyNoteEditor, type DailyNoteEditorRef } from './daily-note-editor';

export type { DailyNoteEditorRef };

interface DailyNoteEditorWrapperProps {
  sidebarOpen?: boolean;
}

export const DailyNoteEditorWrapper = forwardRef<DailyNoteEditorRef, DailyNoteEditorWrapperProps>(
  ({ sidebarOpen = true }, ref) => {
    const { date } = useParams<{ date: string }>();
    const noteDate = date || format(new Date(), 'yyyy-MM-dd');
    const [initialContent, setInitialContent] = useState<string | null>(null);
    const { loadNote } = useNotesStore();

    // Load note content
    useEffect(() => {
      let cancelled = false;

      const loadNoteContent = async () => {
        try {
          const note = await loadNote(noteDate);
          if (!cancelled) {
            setInitialContent(note?.content || '');
          }
        } catch (error) {
          console.error('Failed to load note:', error);
          if (!cancelled) {
            setInitialContent('');
          }
        }
      };

      loadNoteContent();

      return () => {
        cancelled = true;
      };
    }, [noteDate, loadNote]);

    // Show loading state
    if (initialContent === null) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading note...</div>
        </div>
      );
    }

    return (
      <DailyNoteEditor
        ref={ref}
        noteDate={noteDate}
        initialContent={initialContent}
        sidebarOpen={sidebarOpen}
      />
    );
  }
);

DailyNoteEditorWrapper.displayName = 'DailyNoteEditorWrapper';
