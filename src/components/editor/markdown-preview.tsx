import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { markdownToHtml } from '@/utils/markdown';
import '@/styles/markdown-preview.css';

interface MarkdownPreviewProps {
  content: string;
  fontSize?: number;
  lineHeight?: number;
  className?: string;
}

export function MarkdownPreview({
  content,
  fontSize = 16,
  lineHeight = 1.8,
  className,
}: MarkdownPreviewProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    setHtml(markdownToHtml(content));
  }, [content]);

  return (
    <div
      className={cn('prose prose-invert max-w-none', 'text-enhanced writing-focus', className)}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        fontFamily: 'var(--font-serif)',
      }}
    >
      {content.trim() === '' ? (
        <div className="text-text-muted/50 italic">Start writing to see the preview...</div>
      ) : (
        <>
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is sanitized with DOMPurify */}
          <div dangerouslySetInnerHTML={{ __html: html }} className="markdown-content" />
        </>
      )}
    </div>
  );
}
