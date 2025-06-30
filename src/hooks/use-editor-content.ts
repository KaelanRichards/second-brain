import { useState, useCallback, useRef, useEffect } from 'react';
import { useNotesStore } from '@/stores/notes-store';

export interface EditorContentHook {
  content: string;
  updateContent: (newContent: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  getSelection: () => { start: number; end: number };
  hasSelection: () => boolean;
}

export function useEditorContent(date: string): EditorContentHook {
  const { getNote } = useNotesStore();
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Load content when date changes
  useEffect(() => {
    const note = getNote(date);
    setContent(note?.content || '');
  }, [date, getNote]);
  
  const updateContent = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);
  
  const getSelection = useCallback(() => {
    const textarea = textareaRef.current;
    return {
      start: textarea?.selectionStart || 0,
      end: textarea?.selectionEnd || 0
    };
  }, []);
  
  const hasSelection = useCallback(() => {
    const selection = getSelection();
    return selection.start !== selection.end;
  }, [getSelection]);
  
  return {
    content,
    updateContent,
    textareaRef,
    getSelection,
    hasSelection
  };
}