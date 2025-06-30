import { useEffect, useState } from 'react';
import { markdownToHtml } from '@/utils/markdown';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  fontSize: number;
  lineHeight: number;
  className?: string;
}

export function MarkdownPreview({ content, fontSize, lineHeight, className }: MarkdownPreviewProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    setHtml(markdownToHtml(content));
  }, [content]);

  return (
    <div 
      className={cn(
        'prose prose-invert max-w-none',
        'text-enhanced writing-focus',
        className
      )}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        fontFamily: 'var(--font-serif)',
      }}
    >
      {content.trim() === '' ? (
        <div className="text-text-muted/50 italic">
          Start writing to see the preview...
        </div>
      ) : (
        <div 
          dangerouslySetInnerHTML={{ __html: html }}
          className="markdown-content"
        />
      )}
      
      <style>{`
        .markdown-content h1 {
          font-size: 2em;
          font-weight: 600;
          margin: 1.5em 0 0.5em 0;
          color: hsl(var(--color-text));
          border-bottom: 2px solid hsl(var(--color-accent) / 0.2);
          padding-bottom: 0.3em;
        }
        
        .markdown-content h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 1.3em 0 0.4em 0;
          color: hsl(var(--color-text));
        }
        
        .markdown-content h3 {
          font-size: 1.2em;
          font-weight: 600;
          margin: 1.2em 0 0.3em 0;
          color: hsl(var(--color-text));
        }
        
        .markdown-content p {
          margin: 1em 0;
          color: hsl(var(--color-text));
        }
        
        .markdown-content strong {
          font-weight: 600;
          color: hsl(var(--color-text));
        }
        
        .markdown-content em {
          font-style: italic;
          color: hsl(var(--color-text-muted));
        }
        
        .markdown-content code {
          background: hsl(var(--color-accent) / 0.1);
          color: hsl(var(--color-accent));
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: var(--font-mono);
          font-size: 0.9em;
        }
        
        .markdown-content a {
          color: hsl(var(--color-accent));
          text-decoration: underline;
          text-decoration-color: hsl(var(--color-accent) / 0.5);
        }
        
        .markdown-content a:hover {
          text-decoration-color: hsl(var(--color-accent));
        }
        
        .markdown-content blockquote {
          border-left: 4px solid hsl(var(--color-accent) / 0.3);
          margin: 1em 0;
          padding: 0.5em 0 0.5em 1em;
          background: hsl(var(--color-accent) / 0.05);
          font-style: italic;
          color: hsl(var(--color-text-muted));
        }
        
        .markdown-content ul, .markdown-content ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        .markdown-content li {
          margin: 0.5em 0;
          color: hsl(var(--color-text));
        }
        
        .markdown-content li::marker {
          color: hsl(var(--color-accent));
        }
      `}</style>
    </div>
  );
}