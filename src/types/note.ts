export interface Note {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  content: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  tags?: string[];
}

export interface NoteMetadata {
  id: string;
  date: string;
  wordCount: number;
  preview: string; // First 100 chars
  updatedAt: string;
}
