import { useCallback } from 'react';
import { useEditorContent } from './use-editor-content';
import { useAutoSave } from './use-auto-save';
import { useTextStats } from './use-text-stats';
import { useEditorState } from './use-editor-state';
import { useEditorCommands } from './use-editor-commands';
import { useKeyboardShortcuts } from './use-keyboard-shortcuts';

export interface UnifiedEditorHook {
  // Content
  content: string;
  updateContent: (content: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  
  // State
  state: ReturnType<typeof useEditorState>['state'];
  actions: ReturnType<typeof useEditorState>['actions'];
  
  // Auto-save
  isSaving: boolean;
  lastSaved: Date | null;
  saveNow: () => void;
  
  // Statistics
  stats: ReturnType<typeof useTextStats>['stats'];
  isCalculatingStats: boolean;
  
  // Commands & Formatting
  applyFormat: ReturnType<typeof useEditorCommands>['applyFormat'];
  commandService: ReturnType<typeof useEditorCommands>['commandService'];
  
  // Keyboard shortcuts
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  
  // Utility functions
  hasSelection: () => boolean;
  getSelection: () => { start: number; end: number };
}

export function useUnifiedEditor(date: string): UnifiedEditorHook {
  // Core content management
  const { 
    content, 
    updateContent, 
    textareaRef, 
    hasSelection, 
    getSelection 
  } = useEditorContent(date);
  
  // UI state management
  const { state, actions } = useEditorState(content);
  
  // Auto-save functionality
  const { isSaving, lastSaved, saveNow } = useAutoSave(content, date);
  
  // Text statistics with debouncing
  const { stats, isCalculating: isCalculatingStats } = useTextStats(content);
  
  // Enhanced content update that syncs with state
  const handleContentChange = useCallback((newContent: string) => {
    updateContent(newContent);
    actions.setContent(newContent);
  }, [updateContent, actions]);
  
  // Editor actions for commands
  const editorActions = {
    toggleFocusMode: actions.toggleFocusMode,
    togglePreview: actions.togglePreview,
    increaseFontSize: useCallback(() => 
      actions.setFontSize(state.ui.fontSize + 2), [actions, state.ui.fontSize]),
    decreaseFontSize: useCallback(() => 
      actions.setFontSize(state.ui.fontSize - 2), [actions, state.ui.fontSize]),
    resetFontSize: useCallback(() => 
      actions.setFontSize(18), [actions])
  };
  
  // Commands and formatting
  const { applyFormat, commandService } = useEditorCommands(
    textareaRef,
    content,
    handleContentChange,
    editorActions
  );
  
  // Keyboard shortcuts
  const { handleKeyDown } = useKeyboardShortcuts(commandService);
  
  return {
    // Content
    content,
    updateContent: handleContentChange,
    textareaRef,
    
    // State
    state,
    actions,
    
    // Auto-save
    isSaving,
    lastSaved,
    saveNow,
    
    // Statistics  
    stats,
    isCalculatingStats,
    
    // Commands & Formatting
    applyFormat,
    commandService,
    
    // Keyboard shortcuts
    handleKeyDown,
    
    // Utility functions
    hasSelection,
    getSelection
  };
}