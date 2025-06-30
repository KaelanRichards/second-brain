// Optimized markdown processor for better performance
export interface MarkdownToken {
  type: 'text' | 'heading' | 'bold' | 'italic' | 'code' | 'link' | 'list' | 'blockquote' | 'line-break';
  content: string;
  level?: number; // for headings
  start: number;
  end: number;
}

// Cache for commonly used regexes
const REGEX_CACHE = {
  heading: /^(#{1,6})\s+(.+)$/,
  blockquote: /^>\s+/,
  unorderedList: /^[\s]*[-*+]\s+/,
  orderedList: /^[\s]*\d+\.\s+/,
};

export function tokenizeMarkdown(text: string): MarkdownToken[] {
  // Skip tokenization for very short text (performance optimization)
  if (text.length < 3) {
    return [{
      type: 'text',
      content: text,
      start: 0,
      end: text.length
    }];
  }

  const tokens: MarkdownToken[] = [];
  const lines = text.split('\n');
  let currentPos = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    const lineStart = currentPos;
    
    // Skip empty lines
    if (line.length === 0) {
      tokens.push({
        type: 'line-break',
        content: line,
        start: lineStart,
        end: lineStart
      });
      currentPos += 1; // +1 for \n
      continue;
    }

    // Fast path for plain text (no markdown syntax)
    if (!line.includes('#') && !line.includes('*') && !line.includes('`') && 
        !line.includes('[') && !line.includes('>') && !line.includes('-')) {
      tokens.push({
        type: 'text',
        content: line,
        start: lineStart,
        end: lineStart + line.length
      });
      currentPos += line.length + 1;
      continue;
    }

    // Check for headings (using cached regex)
    const headingMatch = REGEX_CACHE.heading.exec(line);
    if (headingMatch) {
      tokens.push({
        type: 'heading',
        content: line,
        level: headingMatch[1]?.length || 1,
        start: lineStart,
        end: lineStart + line.length
      });
      currentPos += line.length + 1;
      continue;
    }

    // Check for blockquotes (using cached regex)
    if (REGEX_CACHE.blockquote.test(line)) {
      tokens.push({
        type: 'blockquote',
        content: line,
        start: lineStart,
        end: lineStart + line.length
      });
      currentPos += line.length + 1;
      continue;
    }

    // Check for lists (using cached regex)
    if (REGEX_CACHE.unorderedList.test(line) || REGEX_CACHE.orderedList.test(line)) {
      tokens.push({
        type: 'list',
        content: line,
        start: lineStart,
        end: lineStart + line.length
      });
      currentPos += line.length + 1;
      continue;
    }

    // Process inline formatting for regular text
    if (line) {
      const inlineTokens = tokenizeInline(line, lineStart);
      tokens.push(...inlineTokens);
    }
    
    currentPos += line.length + 1;
  }

  return tokens;
}

// Optimized inline tokenizer with better performance
function tokenizeInline(text: string, lineStart: number): MarkdownToken[] {
  // Fast path for text without inline formatting
  if (!text.includes('*') && !text.includes('`') && !text.includes('[')) {
    return [{
      type: 'text',
      content: text,
      start: lineStart,
      end: lineStart + text.length
    }];
  }

  const tokens: MarkdownToken[] = [];
  let currentPos = 0;
  const textLength = text.length;

  while (currentPos < textLength) {
    
    // Look for code first (highest priority)
    if (text[currentPos] === '`') {
      const codeEnd = text.indexOf('`', currentPos + 1);
      if (codeEnd !== -1) {
        if (currentPos > 0) {
          // Add text before code
          tokens.push({
            type: 'text',
            content: text.slice(0, currentPos),
            start: lineStart,
            end: lineStart + currentPos
          });
        }
        
        // Add code token
        tokens.push({
          type: 'code',
          content: text.slice(currentPos, codeEnd + 1),
          start: lineStart + currentPos,
          end: lineStart + codeEnd + 1
        });
        
        // Continue from after the code
        const remaining = text.slice(codeEnd + 1);
        if (remaining) {
          const remainingTokens = tokenizeInline(remaining, lineStart + codeEnd + 1);
          tokens.push(...remainingTokens);
        }
        return tokens;
      }
    }
    
    // Look for bold (**text**)
    if (text.startsWith('**', currentPos)) {
      const boldEnd = text.indexOf('**', currentPos + 2);
      if (boldEnd !== -1) {
        if (currentPos > 0) {
          tokens.push({
            type: 'text',
            content: text.slice(0, currentPos),
            start: lineStart,
            end: lineStart + currentPos
          });
        }
        
        tokens.push({
          type: 'bold',
          content: text.slice(currentPos, boldEnd + 2),
          start: lineStart + currentPos,
          end: lineStart + boldEnd + 2
        });
        
        const remaining = text.slice(boldEnd + 2);
        if (remaining) {
          const remainingTokens = tokenizeInline(remaining, lineStart + boldEnd + 2);
          tokens.push(...remainingTokens);
        }
        return tokens;
      }
    }
    
    // Look for italic (*text*) - but not if it's part of **
    if (text[currentPos] === '*' && !text.startsWith('**', currentPos)) {
      const italicEnd = text.indexOf('*', currentPos + 1);
      if (italicEnd !== -1 && !text.startsWith('**', italicEnd)) {
        if (currentPos > 0) {
          tokens.push({
            type: 'text',
            content: text.slice(0, currentPos),
            start: lineStart,
            end: lineStart + currentPos
          });
        }
        
        tokens.push({
          type: 'italic',
          content: text.slice(currentPos, italicEnd + 1),
          start: lineStart + currentPos,
          end: lineStart + italicEnd + 1
        });
        
        const remaining = text.slice(italicEnd + 1);
        if (remaining) {
          const remainingTokens = tokenizeInline(remaining, lineStart + italicEnd + 1);
          tokens.push(...remainingTokens);
        }
        return tokens;
      }
    }
    
    // Look for links [text](url)
    if (text[currentPos] === '[') {
      const linkTextEnd = text.indexOf(']', currentPos + 1);
      if (linkTextEnd !== -1 && text[linkTextEnd + 1] === '(') {
        const linkEnd = text.indexOf(')', linkTextEnd + 2);
        if (linkEnd !== -1) {
          if (currentPos > 0) {
            tokens.push({
              type: 'text',
              content: text.slice(0, currentPos),
              start: lineStart,
              end: lineStart + currentPos
            });
          }
          
          tokens.push({
            type: 'link',
            content: text.slice(currentPos, linkEnd + 1),
            start: lineStart + currentPos,
            end: lineStart + linkEnd + 1
          });
          
          const remaining = text.slice(linkEnd + 1);
          if (remaining) {
            const remainingTokens = tokenizeInline(remaining, lineStart + linkEnd + 1);
            tokens.push(...remainingTokens);
          }
          return tokens;
        }
      }
    }
    
    currentPos++;
  }

  // No formatting found, return as text
  return [{
    type: 'text',
    content: text,
    start: lineStart,
    end: lineStart + text.length
  }];
}

// Optimized markdown to HTML converter with caching
const HTML_CACHE = new Map<string, string>();
const MAX_CACHE_SIZE = 100;

export function markdownToHtml(text: string): string {
  // Check cache first for performance
  if (HTML_CACHE.has(text)) {
    return HTML_CACHE.get(text)!;
  }

  let html = text;

  // Process in order of complexity (simple replacements first)
  // Headers (must be done in reverse order to avoid conflicts)
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Code blocks (process first to avoid conflicts with other formatting)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold (process before italic to avoid conflicts)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Italic (after bold)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Lists (improved pattern)
  html = html.replace(/^[-*+] (.+)/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');

  // Numbered lists
  html = html.replace(/^\d+\. (.+)/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ol>$1</ol>');

  // Blockquotes
  html = html.replace(/^> (.+)/gm, '<blockquote>$1</blockquote>');

  // Paragraphs (wrap non-html lines)
  html = html.replace(/^(?!<[h1-6]|<ul|<ol|<blockquote|<li)(.+)$/gm, '<p>$1</p>');

  // Line breaks
  html = html.replace(/\n(?!<)/g, '<br>');

  // Cache the result (with size limit)
  if (HTML_CACHE.size >= MAX_CACHE_SIZE) {
    const firstKey = HTML_CACHE.keys().next().value;
    if (firstKey) {
      HTML_CACHE.delete(firstKey);
    }
  }
  HTML_CACHE.set(text, html);

  return html;
}

// Get markdown formatting shortcuts
export const markdownShortcuts = {
  bold: { key: 'b', symbol: '**', description: 'Bold' },
  italic: { key: 'i', symbol: '*', description: 'Italic' },
  code: { key: '`', symbol: '`', description: 'Inline code' },
  heading1: { key: '1', symbol: '# ', description: 'Heading 1' },
  heading2: { key: '2', symbol: '## ', description: 'Heading 2' },
  heading3: { key: '3', symbol: '### ', description: 'Heading 3' },
  link: { key: 'k', symbol: '[]()', description: 'Link' },
  quote: { key: 'q', symbol: '> ', description: 'Blockquote' },
  list: { key: 'l', symbol: '- ', description: 'List item' },
};