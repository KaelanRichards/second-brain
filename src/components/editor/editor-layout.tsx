import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EditorLayoutProps {
  children: ReactNode;
  focusMode?: boolean;
  className?: string;
}

export function EditorLayout({ children, focusMode = false, className }: EditorLayoutProps) {
  return (
    <div className={cn(
      "flex flex-col h-full transition-all duration-300",
      focusMode && "max-w-4xl mx-auto",
      className
    )}>
      {children}
    </div>
  );
}

interface EditorHeaderProps {
  date: string;
  isToday?: boolean;
  focusMode?: boolean;
  className?: string;
}

export function EditorHeader({ date, isToday, focusMode, className }: EditorHeaderProps) {
  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    return {
      day: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
      date: dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
  };

  const { day, date: formattedDate } = formatDate(date);

  if (focusMode) {
    return (
      <div className={cn("mb-4 text-center", className)}>
        <div className="text-sm text-text-muted">
          {isToday ? 'Today' : formattedDate}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mb-8", className)}>
      <h1 className="text-3xl font-light text-text-muted mb-1">{day}</h1>
      <div className="flex items-baseline gap-4">
        <h2 className="text-xl">{formattedDate}</h2>
        {isToday && (
          <span className="text-sm text-accent font-medium">Today</span>
        )}
      </div>
    </div>
  );
}

interface EditorStatusBarProps {
  stats: {
    words: number;
    characters: number;
    readingTime: number;
  };
  isSaving: boolean;
  focusMode?: boolean;
  children?: ReactNode;
  className?: string;
}

export function EditorStatusBar({ 
  stats, 
  isSaving, 
  focusMode, 
  children, 
  className 
}: EditorStatusBarProps) {
  return (
    <div className={cn(
      "pt-8 border-t border-white/10 text-sm text-text-muted transition-opacity duration-300",
      focusMode && "opacity-50 hover:opacity-100",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>{stats.words} words</span>
          <span>•</span>
          <span>{stats.characters} characters</span>
          {stats.readingTime > 0 && (
            <>
              <span>•</span>
              <span>{stats.readingTime} min read</span>
            </>
          )}
          <span>•</span>
          <span className={cn(
            "transition-colors",
            isSaving ? "text-yellow-500" : "text-green-500"
          )}>
            {isSaving ? 'Saving...' : 'Saved'}
          </span>
        </div>
        
        {children && (
          <div className="flex items-center gap-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}