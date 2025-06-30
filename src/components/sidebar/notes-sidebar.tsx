import { Calendar, ChevronLeft, ChevronRight, Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/stores/notes-store';
import { useThemeStore } from '@/stores/theme-store';
import type { NoteMetadata } from '@/types/note';

export function NotesSidebar() {
  const { currentDate, setCurrentDate, getAllNotes, isLoading: isSaving } = useNotesStore();
  const { theme, toggleTheme } = useThemeStore();
  const [notes, setNotes] = useState<NoteMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const allNotes = await getAllNotes();
        setNotes(allNotes);
      } catch (error) {
        console.error('Failed to load notes:', error);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []); // Only load once on mount

  const navigateDate = (direction: 'prev' | 'next') => {
    const current = new Date(currentDate + 'T00:00:00');
    const newDate = new Date(current);
    newDate.setDate(current.getDate() + (direction === 'next' ? 1 : -1));
    const dateStr = newDate.toISOString().split('T')[0];
    if (dateStr) {
      setCurrentDate(dateStr);
    }
  };

  const goToToday = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    if (dateStr) {
      setCurrentDate(dateStr);
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'light':
        return <Sun className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const formatDateForList = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === yesterday.getTime()) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="w-64 h-full glass-surface border-r border-white/10 flex flex-col">
      {/* Navigation Controls */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <Button size="sm" variant="ghost" onClick={() => navigateDate('prev')} className="p-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button size="sm" variant="ghost" onClick={goToToday} className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Today
          </Button>

          <Button size="sm" variant="ghost" onClick={() => navigateDate('next')} className="p-2">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-center text-text-muted py-4">Loading notes...</div>
        ) : (
          <div className="space-y-1">
            {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setCurrentDate(note.date)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg transition-colors',
                'hover:bg-white/10',
                note.date === currentDate && 'bg-white/15 font-medium'
              )}
            >
              <div className="text-sm">{formatDateForList(note.date)}</div>
              {note.preview && (
                <div className="text-xs text-text-muted mt-1 line-clamp-2">{note.preview}</div>
              )}
            </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats & Theme Toggle */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleTheme}
            className="p-2"
            title={`Current: ${theme} theme`}
          >
            {getThemeIcon()}
          </Button>
        </div>
        <div className="text-sm text-text-muted space-y-1">
          <div>{notes.length} notes</div>
          <div>{notes.reduce((sum, n) => sum + n.wordCount, 0).toLocaleString()} total words</div>
        </div>
      </div>
    </div>
  );
}
