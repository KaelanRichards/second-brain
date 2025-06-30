# Legendary App - Modern Tauri v2 + React Architecture

A production-ready desktop application built with Tauri v2, React, and Rust, featuring modern tooling and best practices.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for lightning-fast builds
- **Tailwind CSS v3** for styling
- **shadcn/ui** for beautiful, accessible components
- **Zustand** for client state management
- **TanStack Query v5** for server state management

### Backend
- **Rust** with Tokio async runtime
- **SQLx** for type-safe database queries
- **SQLite** for embedded database
- **Clean Architecture** patterns

### Development Tools
- **pnpm** for fast package management
- **Biome** for 25x faster linting/formatting
- **Vitest** for unit testing
- **Playwright** for E2E testing

## 📁 Project Structure

```
legendary-app/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # Zustand stores
│   ├── services/          # API service layer
│   ├── providers/         # React providers
│   └── styles/            # Global styles
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands/      # Tauri commands
│   │   ├── db/           # Database layer
│   │   ├── services/     # Business logic
│   │   ├── models/       # Data models
│   │   └── error.rs      # Error handling
│   └── migrations/        # SQL migrations
└── components.json        # shadcn/ui config
```

## 🛠️ Development Setup

### Prerequisites

1. **Node.js** (v18 or later)
2. **pnpm** (v8 or later)
3. **Rust** (latest stable)
4. **Platform-specific dependencies:**

   **macOS:**
   ```bash
   xcode-select --install
   ```

   **Windows:**
   - Visual Studio C++ Build Tools
   - WebView2 Runtime

   **Linux:**
   ```bash
   sudo apt install libwebkit2gtk-4.1-dev \
       build-essential \
       curl \
       wget \
       libssl-dev \
       libayatana-appindicator3-dev \
       librsvg2-dev
   ```

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm tauri:dev
```

## 📜 Available Scripts

- `pnpm dev` - Start Vite dev server
- `pnpm tauri:dev` - Start Tauri development
- `pnpm tauri:build` - Build for production
- `pnpm lint` - Lint and format code
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run E2E tests

## 🏗️ Architecture Overview

### Frontend Architecture

The frontend uses a modern React setup with:
- **Zustand** for local UI state
- **TanStack Query** for server state and caching
- **Type-safe Tauri commands** via custom hooks

### Backend Architecture

The Rust backend follows Clean Architecture principles:
- **Commands**: Entry points for Tauri IPC
- **Services**: Business logic layer
- **Models**: Domain entities
- **Database**: Repository pattern with SQLx

### State Management

```typescript
// Client state (Zustand)
const { theme, sidebarOpen } = useAppStore();

// Server state (TanStack Query)
const { data: user } = useTauriQuery('get_user_profile', { userId });
```

### Error Handling

Comprehensive error handling with custom error types:
```rust
#[derive(Error, Debug, Serialize)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(String),
    #[error("Not found: {0}")]
    NotFound(String),
    // ...
}
```

## 🔒 Security

- Tauri's capability system for granular permissions
- Input validation on both frontend and backend
- Secure IPC communication
- SQLx for SQL injection prevention

## 🚀 Building for Production

```bash
# Build the application
pnpm tauri:build

# Output will be in:
# - macOS: src-tauri/target/release/bundle/macos/
# - Windows: src-tauri/target/release/bundle/windows/
# - Linux: src-tauri/target/release/bundle/appimage/
```

## 📝 License

MIT