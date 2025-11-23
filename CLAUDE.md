# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoneyForward Web Tools is a Chrome Extension (Manifest V3) that provides tools for MoneyForward websites. The project uses:

- **Build System**: Vite with `vite-plugin-web-extension`
- **Language**: TypeScript
- **UI Framework**: React 19
- **Styling**: Tailwind CSS v4 (with `@tailwindcss/postcss`)
- **Package Manager**: pnpm
- **Testing**: Vitest with React Testing Library
- **Task Manager**: [Taskfile](https://taskfile.dev/)

## Common Commands

This project uses [Task](https://taskfile.dev/) for task management. Use `task --list` to see all available tasks.

### Development Setup

```bash
task setup
```

### Development

```bash
task dev   # Start Vite dev server (alias: task d)
task build # Production build (runs tsc + vite build) (alias: task b)
```

### Testing

```bash
task test
```

### Composite Tasks

```bash
task fix   # Fix all issues (format + lint:fix) (alias: task f)
task check # Run all checks (format:check + lint + typecheck) (alias: task c)
```

## Architecture

### Chrome Extension Structure

The extension consists of three main components:

1. **Popup UI** (`src/popup/`)
   - React application shown when clicking the extension icon
   - Entry point: `src/popup/index.tsx` → `src/popup/index.html`
   - Uses Tailwind CSS via `src/styles/global.css`

2. **Content Script** (`src/content/`)
   - React component injected into MoneyForward pages (`https://*.moneyforward.com/*`)
   - Entry point: `src/content/index.tsx`
   - Injects itself by creating a root div and rendering into it
   - Uses `src/styles/content.css` for isolated styling

3. **Background Service Worker** (`src/background/`)
   - Service worker running in the background
   - Entry point: `src/background/index.ts`
   - Handles extension lifecycle events and message passing

### Build System

- **vite-plugin-web-extension** handles the multi-entry point build:
  - Popup HTML/JS/CSS
  - Content script (specified in `additionalInputs`)
  - Background service worker
  - Static assets (icons in `public/`)
- Output directory: `dist/` (ready to load as unpacked extension)
- Manifest is processed from `src/manifest.json` to `dist/manifest.json`

### Tailwind CSS v4 Important Notes

This project uses Tailwind CSS v4, which has different syntax:

- **CSS imports**: Use `@import 'tailwindcss';` instead of `@tailwind` directives
- **PostCSS plugin**: Uses `@tailwindcss/postcss` not `tailwindcss`
- **No @apply in CSS**: Write vanilla CSS instead of `@apply` utility classes
- Configuration: `tailwind.config.js` still works but syntax may differ

### Testing Setup

- **Test framework**: Vitest with globals enabled
- **Test setup**: `src/test/setup.ts` mocks Chrome APIs (`globalThis.chrome`)
- **Environment**: jsdom for DOM testing
- Chrome API types are available via `@types/chrome`

### Path Aliases

TypeScript and Vite are configured with `@/*` alias pointing to `src/*`:

```typescript
import Component from '@/components/Component';
```

## Loading the Extension in Chrome

1. Build the extension: `pnpm build`
2. Open `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist/` directory

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to main:

1. Prettier check
2. ESLint
3. TypeScript type check
4. Tests
5. Build

All checks must pass before merging.

## Important Implementation Details

### Chrome API Mocking for Tests

Tests mock the Chrome API in `src/test/setup.ts`. When adding new Chrome API usage:

- Add the API to the mock object
- Use `vi.fn()` for methods
- Cast to `typeof chrome` with `as unknown as typeof chrome` to avoid type errors

### Content Script Isolation

Content scripts run in an isolated context but share the DOM with the page. The content script:

- Creates its own root element (`mf-tools-root`)
- Renders React into that element
- Uses scoped CSS to avoid conflicts with the host page

### Manifest V3 Service Worker

Background scripts in MV3 are service workers, not persistent background pages:

- No DOM access
- May be terminated when idle
- Use `chrome.storage` for persistence, not in-memory variables
