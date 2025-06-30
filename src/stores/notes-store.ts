import { create } from 'zustand';
import { api } from '@/services/api';
import type { Note, NoteMetadata } from '@/types/note';

interface NotesState {
  notes: Record<string, Note>; // Keyed by date
  currentDate: string;
  isLoading: boolean;

  // Actions
  setCurrentDate: (date: string) => void;
  getNote: (date: string) => Note | undefined;
  loadNote: (date: string) => Promise<Note | undefined>;
  saveNote: (date: string, content: string) => Promise<void>;
  deleteNote: (date: string) => Promise<void>;
  getAllNotes: () => Promise<NoteMetadata[]>;
  searchNotes: (query: string) => Promise<NoteMetadata[]>;
}

const getPreview = (content: string, length = 100): string => {
  const cleaned = content.replace(/\n+/g, ' ').trim();
  return cleaned.length > length ? cleaned.substring(0, length) + '...' : cleaned;
};

export const useNotesStore = create<NotesState>()((set, get) => ({
  notes: {},
  currentDate: new Date().toISOString().split('T')[0] as string,
  isLoading: false,

  setCurrentDate: (date) => set({ currentDate: date }),

  getNote: (date) => {
    // Return from cache if available
    return get().notes[date];
  },

  loadNote: async (date) => {
    try {
      // Check cache first
      const cachedNote = get().notes[date];
      if (cachedNote) {
        return cachedNote;
      }

      set({ isLoading: true });
      
      // Load from backend
      const note = await api.notes.getNote(date);
      
      if (note) {
        // Update cache
        set((state) => ({
          notes: {
            ...state.notes,
            [date]: note,
          },
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
      
      return note || undefined;
    } catch (error) {
      console.error('Failed to load note:', error);
      set({ isLoading: false });
      return undefined;
    }
  },

  saveNote: async (date, content) => {
    try {
      set({ isLoading: true });
      
      // Save to backend
      const note = await api.notes.saveNote(date, content);
      
      // Update local cache
      set((state) => ({
        notes: {
          ...state.notes,
          [date]: {
            ...note,
            wordCount: note.wordCount,
          },
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to save note:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteNote: async (date) => {
    try {
      set({ isLoading: true });
      
      // Delete from backend
      await api.notes.deleteNote(date);
      
      // Update local cache
      set((state) => {
        const { [date]: deleted, ...rest } = state.notes;
        return { notes: rest, isLoading: false };
      });
    } catch (error) {
      console.error('Failed to delete note:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getAllNotes: async () => {
    try {
      set({ isLoading: true });
      
      // Fetch from backend
      const notesMetadata = await api.notes.getAllNotes();
      
      set({ isLoading: false });
      return notesMetadata;
    } catch (error) {
      console.error('Failed to get all notes:', error);
      set({ isLoading: false });
      // Return from cache as fallback
      const notes = get().notes;
      return Object.values(notes)
        .map(
          (note): NoteMetadata => ({
            id: note.id,
            date: note.date,
            wordCount: note.wordCount,
            preview: getPreview(note.content),
            updatedAt: note.updatedAt,
          })
        )
        .sort((a, b) => b.date.localeCompare(a.date));
    }
  },

  searchNotes: async (query) => {
    try {
      set({ isLoading: true });
      
      // Search in backend
      const notesMetadata = await api.notes.searchNotes(query);
      
      set({ isLoading: false });
      return notesMetadata;
    } catch (error) {
      console.error('Failed to search notes:', error);
      set({ isLoading: false });
      // Search in cache as fallback
      const notes = get().notes;
      const lowerQuery = query.toLowerCase();

      return Object.values(notes)
        .filter(
          (note) =>
            note.content.toLowerCase().includes(lowerQuery) ||
            note.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        )
        .map(
          (note): NoteMetadata => ({
            id: note.id,
            date: note.date,
            wordCount: note.wordCount,
            preview: getPreview(note.content),
            updatedAt: note.updatedAt,
          })
        )
        .sort((a, b) => b.date.localeCompare(a.date));
    }
  },
}));
