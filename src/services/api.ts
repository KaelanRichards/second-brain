import { invoke } from '@tauri-apps/api/core';

// Type-safe Tauri command wrappers
export const api = {
  // System commands
  system: {
    async getSystemInfo() {
      return invoke<SystemInfo>('get_system_info');
    },
  },

  // User commands
  user: {
    async getProfile(userId: string) {
      return invoke<User>('get_user_profile', { userId });
    },

    async updateProfile(data: UpdateUserDto) {
      return invoke<User>('update_user_profile', { data });
    },

    async createUser(email: string, name: string) {
      return invoke<User>('create_user', { email, name });
    },
  },

  // Note commands
  notes: {
    async saveNote(date: string, content: string) {
      return invoke<Note>('save_note', { date, content });
    },

    async getNote(date: string) {
      return invoke<Note | null>('get_note', { date });
    },

    async deleteNote(date: string) {
      return invoke<void>('delete_note', { date });
    },

    async getAllNotes() {
      return invoke<NoteMetadata[]>('get_all_notes');
    },

    async searchNotes(query: string) {
      return invoke<NoteMetadata[]>('search_notes', { query });
    },
  },
};

// Types
export interface SystemInfo {
  platform: string;
  version: string;
  arch: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface Note {
  id: string;
  date: string;
  content: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoteMetadata {
  id: string;
  date: string;
  wordCount: number;
  preview: string;
  updatedAt: string;
}
