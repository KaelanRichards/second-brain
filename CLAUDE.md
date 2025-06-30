# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Second Brain / Note-Taking Desktop Application built with:
- **Tauri v2** (Rust backend with SQLite)
- **React 18** with TypeScript (frontend)
- **Tailwind CSS** + **shadcn/ui** components
- **Zustand** for state management
- **TanStack Query v5** for server state

## Essential Commands

```bash
# Development
pnpm dev          # Frontend dev server only
pnpm tauri:dev    # Full Tauri development (use this for desktop features)

# Building
pnpm build        # Build frontend
pnpm tauri:build  # Build complete desktop app

# Code Quality
pnpm lint         # Lint and auto-fix with Biome
pnpm lint:check   # Check linting without fixing
pnpm test         # Run unit tests with Vitest
pnpm test:ui      # Run tests with UI
pnpm test:e2e     # Run E2E tests with Playwright

# Run a single test
pnpm test -- path/to/test.spec.ts
```

## Architecture & Key Patterns

### Frontend Architecture

The frontend follows a modular, hook-based architecture:

1. **Editor System** (`/src/components/editor/`)
   - Modular design with 8 specialized hooks
   - Master orchestration via `use-unified-editor.ts`
   - Each hook has single responsibility (e.g., formatting, selection, shortcuts)
   - Auto-save with 300ms debounce

2. **State Management**
   - **Zustand stores** in `/src/store/`:
     - `theme-store.ts` - Theme management
     - `sidebar-store.ts` - Sidebar state
     - `user-store.ts` - User preferences
   - **TanStack Query** for server state with custom Tauri bindings

3. **Component Organization**
   - `/components/ui/` - Reusable shadcn/ui components
   - `/components/editor/` - Editor-specific components
   - `/components/layout/` - Layout components
   - `/components/sidebar/` - Sidebar components

### Backend Architecture (Rust)

Clean architecture with clear separation:

1. **Entry Points** (`/src-tauri/src/commands/`)
   - Tauri command handlers
   - Thin layer that delegates to services

2. **Business Logic** (`/src-tauri/src/services/`)
   - Core application logic
   - Database operations via SQLx

3. **Data Layer**
   - `/models/` - Domain entities
   - `/db/` - Database migrations and queries
   - SQLite with type-safe SQLx queries

4. **Error Handling**
   - Centralized in `error.rs`
   - Consistent error types across the application

### Key Design Patterns

1. **Command Pattern** - Extensible command system for editor actions
2. **Hook Composition** - Small, focused hooks composed together
3. **Type-Safe IPC** - Tauri commands with full TypeScript types
4. **Optimistic Updates** - UI updates before server confirmation

## Important Context

1. **Recent Refactoring** (see CLEANUP_COMPLETE.md)
   - Editor was refactored from 591-line monolith to modular architecture
   - Accessibility features were removed for simplification
   - Focus on clean, maintainable code

2. **TypeScript Configuration**
   - Strict mode enabled
   - Path alias: `@/*` maps to `./src/*`
   - All TypeScript errors have been resolved

3. **Styling Approach**
   - Tailwind CSS for utility classes
   - Glass-morphism design with animated gradients
   - Dark/light theme support via CSS variables

4. **Testing Strategy**
   - Unit tests with Vitest
   - E2E tests with Playwright
   - Test files co-located with source files

## Development Tips

1. **Always use `pnpm tauri:dev`** for full desktop functionality
2. **Biome** is used for linting/formatting (not ESLint/Prettier)
3. **TypeScript strict mode** - be explicit with types
4. **Hook dependencies** - carefully manage to avoid infinite renders
5. **Tauri IPC** - all backend calls are async, handle errors appropriately