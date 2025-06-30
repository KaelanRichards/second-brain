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

  // File commands
  file: {
    async readFile(path: string) {
      return invoke<string>('read_file', { path });
    },

    async writeFile(path: string, content: string) {
      return invoke<void>('write_file', { path, content });
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
