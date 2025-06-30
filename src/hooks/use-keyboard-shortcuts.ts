import { useCallback } from 'react';
import { EditorCommandService } from '@/services/editor-commands';

export interface KeyboardShortcutsHook {
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function useKeyboardShortcuts(
  commandService: EditorCommandService
): KeyboardShortcutsHook {
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMod = e.metaKey || e.ctrlKey;
    
    // Build shortcut string
    let shortcut = '';
    if (isMod) shortcut += 'Cmd+';
    if (e.shiftKey) shortcut += 'Shift+';
    if (e.altKey) shortcut += 'Alt+';
    shortcut += e.key;
    
    // Normalize some key names
    const normalizedShortcut = shortcut
      .replace('Cmd+Shift+!', 'Cmd+Shift+1')
      .replace('Cmd+Shift+@', 'Cmd+Shift+2')
      .replace('Cmd+Shift+#', 'Cmd+Shift+3')
      .replace('Cmd+Shift+>', 'Cmd+Shift+Q')
      .replace('Cmd+Shift+~', 'Cmd+Shift+`');
    
    // Try to find and execute command
    const command = commandService.getCommandByShortcut(normalizedShortcut);
    if (command) {
      e.preventDefault();
      e.stopPropagation();
      commandService.executeCommand(command.id);
      return;
    }
  }, [commandService]);
  
  return { handleKeyDown };
}