import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, NoteMetadata } from '@/types/note';

interface NotesState {
  notes: Record<string, Note>; // Keyed by date
  currentDate: string;
  isLoading: boolean;
  
  // Actions
  setCurrentDate: (date: string) => void;
  getNote: (date: string) => Note | undefined;
  saveNote: (date: string, content: string) => void;
  deleteNote: (date: string) => void;
  getAllNotes: () => NoteMetadata[];
  searchNotes: (query: string) => NoteMetadata[];
}

const generateId = () => crypto.randomUUID();

const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const getPreview = (content: string, length = 100): string => {
  const cleaned = content.replace(/\n+/g, ' ').trim();
  return cleaned.length > length ? cleaned.substring(0, length) + '...' : cleaned;
};

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: {},
      currentDate: new Date().toISOString().split('T')[0] as string,
      isLoading: false,

      setCurrentDate: (date) => set({ currentDate: date }),

      getNote: (date) => {
        return get().notes[date];
      },

      saveNote: (date, content) => {
        const existingNote = get().notes[date];
        const now = new Date().toISOString();
        
        const note: Note = {
          id: existingNote?.id || generateId(),
          date,
          content,
          createdAt: existingNote?.createdAt || now,
          updatedAt: now,
          wordCount: getWordCount(content),
        };

        set((state) => ({
          notes: {
            ...state.notes,
            [date]: note,
          },
        }));
      },

      deleteNote: (date) => {
        set((state) => {
          const { [date]: deleted, ...rest } = state.notes;
          return { notes: rest };
        });
      },

      getAllNotes: () => {
        const notes = get().notes;
        return Object.values(notes)
          .map((note): NoteMetadata => ({
            id: note.id,
            date: note.date,
            wordCount: note.wordCount,
            preview: getPreview(note.content),
            updatedAt: note.updatedAt,
          }))
          .sort((a, b) => b.date.localeCompare(a.date));
      },

      searchNotes: (query) => {
        const notes = get().notes;
        const lowerQuery = query.toLowerCase();
        
        return Object.values(notes)
          .filter((note) => 
            note.content.toLowerCase().includes(lowerQuery) ||
            note.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
          )
          .map((note): NoteMetadata => ({
            id: note.id,
            date: note.date,
            wordCount: note.wordCount,
            preview: getPreview(note.content),
            updatedAt: note.updatedAt,
          }))
          .sort((a, b) => b.date.localeCompare(a.date));
      },
    }),
    {
      name: 'daily-notes-storage',
    }
  )
);