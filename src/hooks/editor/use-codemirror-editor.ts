import { foldGutter } from '@codemirror/language';
import type { Extension } from '@codemirror/state';
import {
  drawSelection,
  type EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  lineNumbers,
} from '@codemirror/view';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { createKeyboardShortcuts } from '@/lib/codemirror-shortcuts';
import { createGlassTheme } from '@/lib/codemirror-theme';
import { getCharCount, getReadingTime, getWordCount } from '@/utils/text-stats';
import { type EditorCommands, useCodeMirrorCommands } from './use-codemirror-commands';

interface UseCodeMirrorEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  autoSaveDelay?: number;
  showLineNumbers?: boolean;
}

interface UseCodeMirrorEditorReturn {
  value: string;
  setValue: (value: string) => void;
  viewRef: React.RefObject<EditorView | null>;
  commands: EditorCommands;
  selection: { from: number; to: number; text: string };
  handleSelectionChange: (selection: { from: number; to: number; text: string }) => void;
  stats: {
    words: number;
    characters: number;
    readingTime: number;
  };
  fontSize: number;
  setFontSize: (size: number) => void;
  focusMode: boolean;
  toggleFocusMode: () => void;
  showPreview: boolean;
  togglePreview: () => void;
  isAutoSaving: boolean;
  lastSaved: Date | null;
  extensions: Extension[];
  onViewCreated: (view: EditorView) => void;
}

export function useCodeMirrorEditor({
  initialValue = '',
  onChange,
  onSave,
  autoSaveDelay = 300,
  showLineNumbers = false,
}: UseCodeMirrorEditorProps): UseCodeMirrorEditorReturn {
  const [value, setValue] = useState(initialValue);
  const [selection, setSelection] = useState({ from: 0, to: 0, text: '' });
  const [fontSize, setFontSize] = useState(16);
  const [focusMode, setFocusMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Handle value changes
  const handleValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  // Handle selection changes
  const handleSelectionChange = useCallback((sel: { from: number; to: number; text: string }) => {
    setSelection(sel);
  }, []);

  const viewRef = useRef<EditorView | null>(null);
  const commands = useCodeMirrorCommands(viewRef);

  // Handle view creation
  const onViewCreated = useCallback((view: EditorView) => {
    viewRef.current = view;
  }, []);

  // Debounced value for auto-save
  const debouncedValue = useDebounce(value, autoSaveDelay);

  // Calculate text stats
  const stats = useMemo(
    () => ({
      words: getWordCount(value),
      characters: getCharCount(value),
      readingTime: getReadingTime(value),
    }),
    [value]
  );

  // Auto-save effect
  useEffect(() => {
    if (debouncedValue && onSave && debouncedValue !== initialValue) {
      let timeout: ReturnType<typeof setTimeout>;
      
      const performSave = async () => {
        setIsAutoSaving(true);
        try {
          await onSave(debouncedValue);
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          // Reset auto-saving indicator after a delay
          timeout = setTimeout(() => {
            setIsAutoSaving(false);
          }, 1000);
        }
      };

      performSave();

      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [debouncedValue, onSave, initialValue]);

  // Font size controls
  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(24, prev + 2));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(12, prev - 2));
  }, []);

  // UI toggles
  const toggleFocusMode = useCallback(() => {
    setFocusMode((prev) => !prev);
  }, []);

  const togglePreview = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);

  // Manual save
  const save = useCallback(() => {
    if (onSave) {
      onSave(value);
      setLastSaved(new Date());
    }
  }, [value, onSave]);

  // Create keyboard shortcuts
  const shortcuts = useMemo(
    () =>
      createKeyboardShortcuts({
        toggleBold: commands.toggleBold,
        toggleItalic: commands.toggleItalic,
        toggleCode: commands.toggleCode,
        toggleStrikethrough: commands.toggleStrikethrough,
        insertLink: commands.insertLink,
        insertQuote: commands.insertQuote,
        insertBulletList: commands.insertBulletList,
        insertNumberedList: commands.insertNumberedList,
        insertHeading1: () => commands.insertHeading(1),
        insertHeading2: () => commands.insertHeading(2),
        insertHeading3: () => commands.insertHeading(3),
        increaseFontSize,
        decreaseFontSize,
        toggleFocusMode,
        togglePreview,
        save,
      }),
    [commands, increaseFontSize, decreaseFontSize, toggleFocusMode, togglePreview, save]
  );

  // Build extensions
  const extensions = useMemo(() => {
    const exts: Extension[] = [
      ...createGlassTheme(),
      shortcuts,
      drawSelection(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
    ];

    if (showLineNumbers) {
      exts.push(lineNumbers());
      exts.push(foldGutter());
    }

    return exts;
  }, [shortcuts, showLineNumbers]);

  return {
    value,
    setValue: handleValueChange,
    viewRef,
    commands,
    selection,
    handleSelectionChange,
    stats,
    fontSize,
    setFontSize,
    focusMode,
    toggleFocusMode,
    showPreview,
    togglePreview,
    isAutoSaving,
    lastSaved,
    extensions,
    onViewCreated,
  };
}
