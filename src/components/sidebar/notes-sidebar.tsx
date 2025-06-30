import { Calendar, ChevronLeft, ChevronRight, Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/stores/notes-store';
import { useThemeStore } from '@/stores/theme-store';
import type { NoteMetadata } from '@/types/note';

interface NotesSidebarProps {
  onClose?: () => void;
}

export function NotesSidebar({ onClose }: NotesSidebarProps) {
  const { currentDate, setCurrentDate, getAllNotes, isLoading: isSaving } = useNotesStore();
  const { theme, toggleTheme } = useThemeStore();
  const [notes, setNotes] = useState<NoteMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [_lastRefresh, _setLastRefresh] = useState(Date.now());

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
  }, [getAllNotes]); // Only load once on mount

  const navigateDate = (direction: 'prev' | 'next') => {
    const current = new Date(`${currentDate}T00:00:00`);
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
    const date = new Date(`${dateStr}T00:00:00`);
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
    <div className="w-64 h-full bg-muted/30 border-r border-border/10 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notes</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
            title="Hide sidebar (⌘B)"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between">
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
                  'w-full text-left px-3 py-2 rounded-md transition-colors text-sm',
                  'hover:bg-muted',
                  note.date === currentDate && 'bg-muted font-medium'
                )}
              >
                {formatDateForList(note.date)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{notes.length} notes</div>
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
    </div>
  );
}
