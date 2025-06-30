import { Calendar, Eye, FileText, Focus, Monitor, Moon, Search, Sun, Type } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/stores/notes-store';
import { useThemeStore } from '@/stores/theme-store';
import type { NoteMetadata } from '@/types/note';

interface Command {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusModeToggle?: () => void;
  onFontSizeChange?: (delta: number) => void;
  onPreviewToggle?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onFocusModeToggle,
  onFontSizeChange,
  onPreviewToggle,
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentNotes, setRecentNotes] = useState<NoteMetadata[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { setCurrentDate, getAllNotes } = useNotesStore();
  const { setTheme } = useThemeStore();

  // Load recent notes when palette opens
  useEffect(() => {
    if (isOpen) {
      getAllNotes()
        .then((notes) => setRecentNotes(notes.slice(0, 5)))
        .catch((error) => {
          console.error('Failed to load recent notes:', error);
          setRecentNotes([]);
        });
    }
  }, [isOpen, getAllNotes]);

  // Helper to navigate to specific dates
  const navigateToDate = (offset: number) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offset);
    const dateStr = targetDate.toISOString().split('T')[0];
    if (dateStr) {
      setCurrentDate(dateStr);
    }
    onClose();
  };

  // Generate commands
  const commands: Command[] = [
    {
      id: 'today',
      title: 'Go to Today',
      description: "Open today's daily note",
      icon: <Calendar className="h-4 w-4" />,
      action: () => navigateToDate(0),
      keywords: ['today', 'now'],
    },
    {
      id: 'yesterday',
      title: 'Go to Yesterday',
      description: "Open yesterday's daily note",
      icon: <Calendar className="h-4 w-4" />,
      action: () => navigateToDate(-1),
      keywords: ['yesterday', 'prev', 'previous'],
    },
    {
      id: 'tomorrow',
      title: 'Go to Tomorrow',
      description: "Open tomorrow's daily note",
      icon: <Calendar className="h-4 w-4" />,
      action: () => navigateToDate(1),
      keywords: ['tomorrow', 'next'],
    },
    {
      id: 'search',
      title: 'Search Notes',
      description: 'Search through all your notes',
      icon: <Search className="h-4 w-4" />,
      action: () => {
        // This would open a search interface
        onClose();
      },
      keywords: ['search', 'find'],
    },
    {
      id: 'light-mode',
      title: 'Light Mode',
      description: 'Switch to light theme',
      icon: <Sun className="h-4 w-4" />,
      action: () => {
        setTheme('light');
        onClose();
      },
      keywords: ['theme', 'light', 'mode'],
    },
    {
      id: 'dark-mode',
      title: 'Dark Mode',
      description: 'Switch to dark theme',
      icon: <Moon className="h-4 w-4" />,
      action: () => {
        setTheme('dark');
        onClose();
      },
      keywords: ['theme', 'dark', 'mode'],
    },
    {
      id: 'system-theme',
      title: 'System Theme',
      description: 'Follow system preference',
      icon: <Monitor className="h-4 w-4" />,
      action: () => {
        setTheme('system');
        onClose();
      },
      keywords: ['theme', 'system', 'auto', 'mode'],
    },
    {
      id: 'focus-mode',
      title: 'Toggle Focus Mode',
      description: 'Distraction-free writing mode',
      icon: <Focus className="h-4 w-4" />,
      action: () => {
        onFocusModeToggle?.();
        onClose();
      },
      keywords: ['focus', 'distraction', 'zen', 'writing'],
    },
    {
      id: 'increase-font',
      title: 'Increase Font Size',
      description: 'Make text larger for better readability',
      icon: <Type className="h-4 w-4" />,
      action: () => {
        onFontSizeChange?.(2);
        onClose();
      },
      keywords: ['font', 'size', 'larger', 'zoom', 'text'],
    },
    {
      id: 'decrease-font',
      title: 'Decrease Font Size',
      description: 'Make text smaller',
      icon: <Type className="h-4 w-4" />,
      action: () => {
        onFontSizeChange?.(-2);
        onClose();
      },
      keywords: ['font', 'size', 'smaller', 'zoom', 'text'],
    },
    {
      id: 'toggle-preview',
      title: 'Toggle Preview',
      description: 'Show/hide markdown preview',
      icon: <Eye className="h-4 w-4" />,
      action: () => {
        onPreviewToggle?.();
        onClose();
      },
      keywords: ['preview', 'markdown', 'render', 'view'],
    },
  ];

  // Add recent notes as commands
  const noteCommands: Command[] = recentNotes.map((note: NoteMetadata) => ({
    id: `note-${note.id}`,
    title: `Note: ${new Date(note.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })}`,
    description: note.preview,
    icon: <FileText className="h-4 w-4" />,
    action: () => {
      setCurrentDate(note.date);
      onClose();
    },
  }));

  const allCommands = [...commands, ...noteCommands];

  // Filter commands based on search
  const filteredCommands = search
    ? allCommands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(search.toLowerCase()) ||
          cmd.description?.toLowerCase().includes(search.toLowerCase()) ||
          cmd.keywords?.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      )
    : allCommands;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Reset and focus when opened
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const items = listRef.current.querySelectorAll('[data-command-item]');
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Command Palette */}
      <div className="fixed inset-x-0 top-[20vh] mx-auto max-w-2xl z-50 px-4">
        <div className="glass-surface rounded-2xl overflow-hidden shadow-2xl">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search..."
              className="w-full bg-transparent px-12 py-4 text-lg focus:outline-none"
            />
          </div>

          {/* Commands List */}
          <div ref={listRef} className="max-h-[50vh] overflow-y-auto border-t border-white/10">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-text-muted">No commands found</div>
            ) : (
              filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  data-command-item
                  onClick={command.action}
                  className={cn(
                    'w-full px-4 py-3 flex items-start gap-3 transition-colors text-left',
                    'hover:bg-white/10',
                    index === selectedIndex && 'bg-white/10'
                  )}
                >
                  <div className="mt-0.5 text-text-muted">{command.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{command.title}</div>
                    {command.description && (
                      <div className="text-sm text-text-muted truncate">{command.description}</div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
