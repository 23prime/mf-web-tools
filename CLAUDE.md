# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoneyForward Web Tools is a Chrome Extension (Manifest V3) that provides tools for MoneyForward websites. The project uses:

- **Build System**: WXT
- **Language**: TypeScript
- **UI Framework**: React 19
- **Styling**: Tailwind CSS v4 (with `@tailwindcss/postcss`)
- **Package Manager**: pnpm
- **Testing**: Vitest with WxtVitest plugin and React Testing Library
- **Task Manager**: [mise](https://mise.jdx.dev/)

## Common Commands

This project uses [mise](https://mise.jdx.dev/) for task management. Use `mise tasks` to see all available tasks.

### Development Setup

```bash
mise run setup
```

### Development

```bash
mise run dev   # Start WXT dev server with HMR (alias: mise d)
mise run build # Production build with WXT (alias: mise b)
```

### Testing

```bash
mise run check
```

### Composite Tasks

```bash
mise run fix   # Fix all issues (format + lint:fix) (alias: mise f)
mise run check # Run all checks (typecheck + format:check + lint + test) (alias: mise c)
```

## Development Rules

**CRITICAL**: After editing any source code, you MUST run `mise run fix-and-check` and ensure all checks pass before completing the task. This ensures:

- Code is properly formatted (Prettier)
- No linting errors (ESLint)
- No type errors (TypeScript)

This rule applies to all code changes, no exceptions.

**CRITICAL**: After source code changes pass all checks, you MUST run `mise run build` and instruct the user to load the built extension in Chrome and verify the actual behavior manually. Tests verify correctness of logic, not real-world behavior in the browser.

## Architecture

### Chrome Extension Structure (WXT)

The extension consists of three main components using WXT's entry point structure:

1. **Popup UI** (`src/entrypoints/popup/`)
   - React application shown when clicking the extension icon
   - Entry point: `src/entrypoints/popup/index.html` → `src/entrypoints/popup/index.tsx`
   - Uses Tailwind CSS via `src/styles/global.css`

2. **Content Script** (`src/entrypoints/content.tsx`)
   - React component injected into MoneyForward pages (`https://*.moneyforward.com/*`)
   - Uses Shadow DOM via WXT's `createShadowRootUi` API for complete style isolation
   - CSS injected into Shadow DOM using `<style>` element
   - Uses `src/styles/content.css` with explicit Tailwind utility definitions (imported with `?inline` suffix)

3. **Background Service Worker** (`src/entrypoints/background.ts`)
   - Service worker running in the background
   - Defined with `defineBackground` from WXT
   - Handles extension lifecycle events and message passing

### Build System

- **WXT** handles the multi-entry point build automatically:
  - Entry points defined in `src/entrypoints/` directory
  - Popup HTML/JS/CSS
  - Content scripts with Shadow DOM support
  - Background service worker
  - Static assets (icons in `public/`)
  - Manifest auto-generated from `wxt.config.ts`
- Output directory: `.output/chrome-mv3/` (ready to load as unpacked extension)
- Multi-browser support: Can build for Chrome, Firefox, Edge, Safari with `--browser` flag
- Configuration: `wxt.config.ts` defines manifest, aliases, and Vite settings

### Tailwind CSS v4 Important Notes

This project uses Tailwind CSS v4, which has different syntax:

- **CSS imports**: Use `@import 'tailwindcss';` instead of `@tailwind` directives
- **PostCSS plugin**: Uses `@tailwindcss/postcss` not `tailwindcss`
- **No @apply in CSS**: Write vanilla CSS instead of `@apply` utility classes
- Configuration: `tailwind.config.js` still works but syntax may differ

### Testing Setup

- **Test framework**: Vitest with globals enabled
- **WXT integration**: WxtVitest plugin automatically mocks Chrome APIs
- **Environment**: jsdom for DOM testing
- Chrome API types are available via `@types/chrome`
- Import `@testing-library/jest-dom` in test files for DOM matchers

### Path Aliases

TypeScript and Vite are configured with `@/*` alias pointing to `src/*`:

```typescript
import Component from '@/components/Component';
```

## Loading the Extension in Chrome

1. Build the extension: `mise run build`
2. Open `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `.output/chrome-mv3/` directory

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to main:

1. Prettier check
2. ESLint
3. TypeScript type check
4. Tests
5. Build

All checks must pass before merging.

## Important Implementation Details

### WXT Entry Point Imports

This project has auto-imports disabled (`imports: false` in `wxt.config.ts`) for explicit control. Therefore, use the following explicit import paths:

- Background: `import { defineBackground } from 'wxt/utils/define-background'`
- Content scripts: `import { defineContentScript } from 'wxt/utils/define-content-script'`
- Shadow DOM UI: `import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root'`

**Note:** WXT v0.20+ supports `#imports` virtual module when auto-imports are enabled, but this project intentionally uses explicit imports for better clarity and IDE support.

### Chrome API Mocking for Tests

The WxtVitest plugin automatically provides Chrome API mocks. For custom mocking in specific tests:

- Import `@testing-library/jest-dom` for DOM matchers
- Mock specific Chrome APIs in `beforeEach` using `vi.fn()`
- Assign to `globalThis.chrome` as needed

### Content Script Isolation with Shadow DOM

Content scripts use WXT's Shadow DOM integration for complete style isolation:

- Uses `createShadowRootUi` API from WXT
- Styles injected via `<style>` element with CSS text from `?inline` import
- `src/styles/content.css` contains explicit Tailwind utility class definitions (not `@import 'tailwindcss'`)
- React component rendered into wrapper div inside Shadow DOM
- No style conflicts with host page

**Important:** When importing CSS for Shadow DOM, use the `?inline` suffix to get raw CSS text:

```typescript
import contentCssText from '@/styles/content.css?inline';
```

The `@import 'tailwindcss'` directive won't be processed in `?inline` imports, so use explicit CSS rules instead.

### Manifest V3 Service Worker

Background scripts in MV3 are service workers, not persistent background pages:

- No DOM access
- May be terminated when idle
- Use `chrome.storage` for persistence, not in-memory variables
