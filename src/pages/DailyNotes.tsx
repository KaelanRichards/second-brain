import { useEffect, useRef, useState } from 'react';
import { CommandPalette } from '@/components/command-palette/command-palette';
import { DailyNoteEditor, type DailyNoteEditorRef } from '@/components/editor/daily-note-editor';
import { NotesSidebar } from '@/components/sidebar/notes-sidebar';

export function DailyNotes() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const editorRef = useRef<DailyNoteEditorRef>(null);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette (Cmd+K / Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }

      // Close command palette on Escape
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen]);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <NotesSidebar />

      {/* Main Editor */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-12">
          <div className="max-w-3xl mx-auto h-full">
            <DailyNoteEditor ref={editorRef} />
          </div>
        </div>
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onFocusModeToggle={() => editorRef.current?.toggleFocusMode()}
        onFontSizeChange={(delta) => editorRef.current?.changeFontSize(delta)}
        onPreviewToggle={() => editorRef.current?.togglePreview()}
      />
    </div>
  );
}
