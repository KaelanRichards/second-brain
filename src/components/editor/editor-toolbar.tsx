import {
  Bold,
  Code,
  Eye,
  EyeOff,
  Focus,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onCode: () => void;
  onLink: () => void;
  onQuote: () => void;
  onBulletList: () => void;
  onNumberedList: () => void;
  onHeading1: () => void;
  onHeading2: () => void;
  onHeading3: () => void;
  onToggleFocusMode: () => void;
  onTogglePreview: () => void;
  focusModeActive: boolean;
  previewActive: boolean;
  className?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  active?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  icon: Icon,
  title,
  active = false,
}) => (
  <button
    onClick={onClick}
    className={cn(
      'p-2 rounded-md transition-colors',
      'hover:bg-muted',
      active && 'bg-muted text-foreground'
    )}
    title={title}
    type="button"
  >
    <Icon className="h-4 w-4" />
  </button>
);

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onBold,
  onItalic,
  onCode,
  onLink,
  onQuote,
  onBulletList,
  onNumberedList,
  onHeading1,
  onHeading2,
  onHeading3,
  onToggleFocusMode,
  onTogglePreview,
  focusModeActive,
  previewActive,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <ToolbarButton onClick={onBold} icon={Bold} title="Bold (⌘B)" />
        <ToolbarButton onClick={onItalic} icon={Italic} title="Italic (⌘I)" />
        <ToolbarButton onClick={onHeading1} icon={Heading1} title="Heading (⌘1)" />
        <ToolbarButton onClick={onBulletList} icon={List} title="List (⌘⇧8)" />
        <ToolbarButton onClick={onLink} icon={Link} title="Link (⌘K)" />
      </div>

      {/* View controls */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={onTogglePreview}
          icon={previewActive ? EyeOff : Eye}
          title={previewActive ? 'Hide Preview (⌘⇧P)' : 'Show Preview (⌘⇧P)'}
          active={previewActive}
        />
        <ToolbarButton
          onClick={onToggleFocusMode}
          icon={Focus}
          title="Focus Mode (⌘⇧F)"
          active={focusModeActive}
        />
      </div>
    </div>
  );
};
