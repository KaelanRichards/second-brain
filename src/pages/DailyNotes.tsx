import { useEffect, useRef, useState } from 'react';
import { CommandPalette } from '@/components/command-palette/command-palette';
import {
  DailyNoteEditorWrapper as DailyNoteEditor,
  type DailyNoteEditorRef,
} from '@/components/editor/daily-note-editor-wrapper';
import { NotesSidebar } from '@/components/sidebar/notes-sidebar';

export function DailyNotes() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });
  const editorRef = useRef<DailyNoteEditorRef>(null);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarOpen', String(sidebarOpen));
  }, [sidebarOpen]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette (Cmd+K / Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }

      // Toggle sidebar (Cmd+B / Ctrl+B)
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
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
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}
      >
        <NotesSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Editor */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full relative">
          {/* Sidebar toggle button */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute left-6 top-5 z-10 p-2 rounded-lg hover:bg-accent/10 transition-all duration-200"
              title="Show sidebar (⌘B)"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}

          <DailyNoteEditor ref={editorRef} sidebarOpen={sidebarOpen} />
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
