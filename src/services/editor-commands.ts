import { FormatType } from '@/hooks/use-markdown-formatter';

export interface EditorCommand {
  id: string;
  name: string;
  description: string;
  shortcut?: string;
  category: 'format' | 'navigation' | 'edit' | 'view';
  execute: () => void;
  canExecute?: () => boolean;
}

export interface EditorCommandService {
  commands: Map<string, EditorCommand>;
  registerCommand: (command: EditorCommand) => void;
  executeCommand: (id: string) => boolean;
  getCommandsByCategory: (category: string) => EditorCommand[];
  getCommandByShortcut: (shortcut: string) => EditorCommand | undefined;
}

export function createEditorCommandService(
  applyFormat: (type: FormatType) => void,
  editorActions: {
    toggleFocusMode: () => void;
    togglePreview: () => void;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    resetFontSize: () => void;
  }
): EditorCommandService {
  const commands = new Map<string, EditorCommand>();
  
  // Format commands
  const formatCommands: EditorCommand[] = [
    {
      id: 'format.bold',
      name: 'Bold',
      description: 'Make text bold',
      shortcut: 'Cmd+B',
      category: 'format',
      execute: () => applyFormat('bold')
    },
    {
      id: 'format.italic',
      name: 'Italic', 
      description: 'Make text italic',
      shortcut: 'Cmd+I',
      category: 'format',
      execute: () => applyFormat('italic')
    },
    {
      id: 'format.code',
      name: 'Code',
      description: 'Format as inline code',
      shortcut: 'Cmd+Shift+`',
      category: 'format',
      execute: () => applyFormat('code')
    },
    {
      id: 'format.heading1',
      name: 'Heading 1',
      description: 'Format as heading 1',
      shortcut: 'Cmd+Shift+1',
      category: 'format',
      execute: () => applyFormat('heading1')
    },
    {
      id: 'format.heading2',
      name: 'Heading 2',
      description: 'Format as heading 2', 
      shortcut: 'Cmd+Shift+2',
      category: 'format',
      execute: () => applyFormat('heading2')
    },
    {
      id: 'format.heading3',
      name: 'Heading 3',
      description: 'Format as heading 3',
      shortcut: 'Cmd+Shift+3', 
      category: 'format',
      execute: () => applyFormat('heading3')
    },
    {
      id: 'format.quote',
      name: 'Quote',
      description: 'Format as blockquote',
      shortcut: 'Cmd+Shift+Q',
      category: 'format',
      execute: () => applyFormat('quote')
    },
    {
      id: 'format.list',
      name: 'List',
      description: 'Format as list item',
      shortcut: 'Cmd+Shift+L',
      category: 'format',
      execute: () => applyFormat('list')
    },
    {
      id: 'format.link',
      name: 'Link',
      description: 'Insert link',
      shortcut: 'Cmd+Shift+K',
      category: 'format',
      execute: () => applyFormat('link')
    }
  ];
  
  // View commands
  const viewCommands: EditorCommand[] = [
    {
      id: 'view.focus-mode',
      name: 'Focus Mode',
      description: 'Toggle distraction-free writing mode',
      shortcut: 'Cmd+Shift+F',
      category: 'view',
      execute: editorActions.toggleFocusMode
    },
    {
      id: 'view.preview',
      name: 'Preview',
      description: 'Toggle markdown preview',
      shortcut: 'Cmd+P',
      category: 'view',
      execute: editorActions.togglePreview
    },
    {
      id: 'view.font-increase',
      name: 'Increase Font Size',
      description: 'Make text larger',
      shortcut: 'Cmd+=',
      category: 'view',
      execute: editorActions.increaseFontSize
    },
    {
      id: 'view.font-decrease',
      name: 'Decrease Font Size',
      description: 'Make text smaller',
      shortcut: 'Cmd+-',
      category: 'view',
      execute: editorActions.decreaseFontSize
    },
    {
      id: 'view.font-reset',
      name: 'Reset Font Size',
      description: 'Reset to default font size',
      shortcut: 'Cmd+0',
      category: 'view',
      execute: editorActions.resetFontSize
    }
  ];
  
  // Register all commands
  [...formatCommands, ...viewCommands].forEach(cmd => {
    commands.set(cmd.id, cmd);
  });
  
  return {
    commands,
    registerCommand: (command) => commands.set(command.id, command),
    executeCommand: (id) => {
      const command = commands.get(id);
      if (command && (!command.canExecute || command.canExecute())) {
        command.execute();
        return true;
      }
      return false;
    },
    getCommandsByCategory: (category) => 
      Array.from(commands.values()).filter(cmd => cmd.category === category),
    getCommandByShortcut: (shortcut) =>
      Array.from(commands.values()).find(cmd => cmd.shortcut === shortcut)
  };
}