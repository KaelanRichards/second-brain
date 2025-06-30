import { useMemo } from 'react';
import { createEditorCommandService, EditorCommandService } from '@/services/editor-commands';
import { useMarkdownFormatter, FormatType } from './use-markdown-formatter';

export interface EditorCommandsHook {
  commandService: EditorCommandService;
  applyFormat: (type: FormatType) => void;
}

export function useEditorCommands(
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  content: string,
  onContentChange: (content: string) => void,
  editorActions: {
    toggleFocusMode: () => void;
    togglePreview: () => void;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    resetFontSize: () => void;
  }
): EditorCommandsHook {
  
  const { applyFormat } = useMarkdownFormatter(
    textareaRef,
    content,
    onContentChange
  );
  
  const commandService = useMemo(() => 
    createEditorCommandService(applyFormat, editorActions),
    [applyFormat, editorActions]
  );
  
  return {
    commandService,
    applyFormat
  };
}