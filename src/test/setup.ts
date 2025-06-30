import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Tauri API for tests
(globalThis as any).window = Object.assign((globalThis as any).window || {}, {
  __TAURI__: {
    invoke: vi.fn(),
    event: {
      listen: vi.fn(),
      emit: vi.fn(),
      once: vi.fn(),
    },
  },
});
