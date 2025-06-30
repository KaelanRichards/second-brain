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
        'flex items-center justify-between px-4 py-2',
        'bg-background/50 backdrop-blur-sm border-t border-border/50',
        'text-xs text-muted-foreground',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
        <span>{readingTime} min read</span>
      </div>

      <div className="flex items-center gap-4">
        {isAutoSaving && <span className="text-primary animate-pulse">Saving...</span>}
        {!isAutoSaving && lastSaved && <span>Saved {formatLastSaved(lastSaved)}</span>}

        <div className="flex items-center gap-2">
          <button
            onClick={() => onFontSizeChange(Math.max(12, fontSize - 2))}
            className="p-1 hover:bg-accent/50 rounded"
            title="Decrease font size"
            type="button"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10H7M21 10L18 7M21 10L18 13" />
            </svg>
          </button>

          <span className="min-w-[3ch] text-center">{fontSize}</span>

          <button
            onClick={() => onFontSizeChange(Math.min(24, fontSize + 2))}
            className="p-1 hover:bg-accent/50 rounded"
            title="Increase font size"
            type="button"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M13 5L16 8M16 8L13 11M16 8H3M11 19L8 16M8 16L11 13M8 16H21" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
