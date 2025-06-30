import { useEffect, useMemo, useState } from 'react';

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  readingTime: number; // in minutes
  sentences: number;
}

export interface TextStatsHook {
  stats: TextStats;
  isEmpty: boolean;
  isCalculating: boolean;
}

export function useTextStats(content: string, debounceMs: number = 100): TextStatsHook {
  const [debouncedContent, setDebouncedContent] = useState(content);
  const [isCalculating, setIsCalculating] = useState(false);

  // Debounce content changes to avoid excessive calculations
  useEffect(() => {
    setIsCalculating(true);
    const timeout = setTimeout(() => {
      setDebouncedContent(content);
      setIsCalculating(false);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [content, debounceMs]);

  const stats = useMemo((): TextStats => {
    if (!debouncedContent.trim()) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        paragraphs: 0,
        readingTime: 0,
        sentences: 0,
      };
    }

    const trimmed = debouncedContent.trim();

    // Word count (split by whitespace, filter empty)
    const words = trimmed.split(/\s+/).filter((word) => word.length > 0).length;

    // Character counts
    const characters = debouncedContent.length;
    const charactersNoSpaces = debouncedContent.replace(/\s/g, '').length;

    // Paragraph count (split by double newlines)
    const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

    // Sentence count (rough estimate)
    const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);

    return {
      words,
      characters,
      charactersNoSpaces,
      paragraphs,
      readingTime,
      sentences,
    };
  }, [debouncedContent]);

  const isEmpty = !content.trim();

  return { stats, isEmpty, isCalculating };
}
