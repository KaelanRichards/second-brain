import type React from 'react';
import { cn } from '@/lib/utils';

interface EditorStatusBarProps {
  wordCount: number;
  charCount: number;
  readingTime: number;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  isAutoSaving?: boolean;
  lastSaved?: Date | null;
  className?: string;
}

export const EditorStatusBar: React.FC<EditorStatusBarProps> = ({
  wordCount,
  charCount,
  readingTime,
  fontSize,
  onFontSizeChange,
  isAutoSaving = false,
  lastSaved,
  className,
}) => {
  const formatLastSaved = (date: Date | null) => {
    if (!date) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 5) return 'just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;

    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'text-xs text-muted-foreground',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span>{wordCount.toLocaleString()} words</span>
        {readingTime > 0 && <span>{readingTime} min read</span>}
      </div>

      <div className="flex items-center gap-3">
        {isAutoSaving && <span className="text-muted-foreground">Saving...</span>}
        {!isAutoSaving && lastSaved && <span className="text-muted-foreground">Saved</span>}
      </div>
    </div>
  );
};
