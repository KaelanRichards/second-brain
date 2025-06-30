import { useCallback } from 'react';

export type FormatType = 'bold' | 'italic' | 'code' | 'heading1' | 'heading2' | 'heading3' | 'link' | 'quote' | 'list';

export interface FormatterHook {
  applyFormat: (type: FormatType) => void;
  canFormat: boolean;
}

export function useMarkdownFormatter(
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  content: string,
  onContentChange: (content: string) => void
): FormatterHook {
  
  const applyFormat = useCallback((type: FormatType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);
    const beforeText = content.slice(0, start);
    const afterText = content.slice(end);
    
    let newText = '';
    let newCursorStart = start;
    let newCursorEnd = start;
    
    // Format mapping with proper cursor positioning
    const formatMap: Record<FormatType, () => void> = {
      bold: () => {
        if (selectedText) {
          newText = `**${selectedText}**`;
          newCursorStart = start + 2;
          newCursorEnd = start + 2 + selectedText.length;
        } else {
          newText = `****`;
          newCursorStart = newCursorEnd = start + 2;
        }
      },
      italic: () => {
        if (selectedText) {
          newText = `*${selectedText}*`;
          newCursorStart = start + 1;
          newCursorEnd = start + 1 + selectedText.length;
        } else {
          newText = `**`;
          newCursorStart = newCursorEnd = start + 1;
        }
      },
      code: () => {
        if (selectedText) {
          newText = `\`${selectedText}\``;
          newCursorStart = start + 1;
          newCursorEnd = start + 1 + selectedText.length;
        } else {
          newText = `\`\``;
          newCursorStart = newCursorEnd = start + 1;
        }
      },
      heading1: () => {
        newText = `# ${selectedText || ''}`;
        newCursorStart = newCursorEnd = start + 2 + (selectedText?.length || 0);
      },
      heading2: () => {
        newText = `## ${selectedText || ''}`;
        newCursorStart = newCursorEnd = start + 3 + (selectedText?.length || 0);
      },
      heading3: () => {
        newText = `### ${selectedText || ''}`;
        newCursorStart = newCursorEnd = start + 4 + (selectedText?.length || 0);
      },
      link: () => {
        if (selectedText) {
          newText = `[${selectedText}](url)`;
          newCursorStart = start + selectedText.length + 3;
          newCursorEnd = start + selectedText.length + 6;
        } else {
          newText = `[link text](url)`;
          newCursorStart = start + 1;
          newCursorEnd = start + 10;
        }
      },
      quote: () => {
        newText = `> ${selectedText || ''}`;
        newCursorStart = newCursorEnd = start + 2 + (selectedText?.length || 0);
      },
      list: () => {
        newText = `- ${selectedText || ''}`;
        newCursorStart = newCursorEnd = start + 2 + (selectedText?.length || 0);
      }
    };
    
    formatMap[type]();
    
    const updatedContent = beforeText + newText + afterText;
    onContentChange(updatedContent);
    
    // Restore cursor position
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorStart, newCursorEnd);
      }
    });
  }, [content, onContentChange, textareaRef]);
  
  const canFormat = textareaRef.current !== null;
  
  return { applyFormat, canFormat };
}