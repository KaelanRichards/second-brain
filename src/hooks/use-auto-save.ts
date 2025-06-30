import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotesStore } from '@/stores/notes-store';

export interface AutoSaveHook {
  isSaving: boolean;
  lastSaved: Date | null;
  saveNow: () => void;
}

export function useAutoSave(content: string, date: string, delay: number = 300): AutoSaveHook {
  const { saveNote } = useNotesStore();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<number>();

  const saveNow = useCallback(() => {
    if (content.trim()) {
      setIsSaving(true);
      try {
        saveNote(date, content);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to save note:', error);
      } finally {
        setIsSaving(false);
      }
    }
  }, [content, date, saveNote]);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (content.trim() === '') {
      setIsSaving(false);
      return;
    }

    setIsSaving(true);
    saveTimeoutRef.current = window.setTimeout(() => {
      saveNow();
    }, delay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, delay, saveNow]);

  return { isSaving, lastSaved, saveNow };
}
