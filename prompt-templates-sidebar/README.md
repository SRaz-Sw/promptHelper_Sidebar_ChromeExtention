<h1 align="center">Prompt Helper - AI Assistant Sidebar</h1>

<h2 align="center">A modern, TypeScript-powered Chrome extension with React, Shadcn/UI, and full internationalization (i18n) support.</h2>

<p align="center">
<a href="https://github.com/tooniez/chrome-extension-vite-shadcn-framer/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/tooniez/chrome-extension-vite-shadcn-framer"></a>
<a href="https://github.com/tooniez/chrome-extension-vite-shadcn-framer/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/tooniez/chrome-extension-vite-shadcn-framer"></a>
<a href="https://github.com/tooniez/chrome-extension-vite-shadcn-framer/stargazers"><img alt="Github Stars" src="https://img.shields.io/github/stars/tooniez/chrome-extension-vite-shadcn-framer"></a>
<a href="https://github.com/tooniez/chrome-extension-vite-shadcn-framer/blob/master/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/tooniez/chrome-extension-vite-shadcn-framer"></a>
</p>

## Features

- ✨ **Modern UI**: Built with React, TypeScript, and Shadcn/UI components
- 🎨 **Dark/Light Mode**: Automatic theme switching with system preference detection
- 🔄 **Drag & Drop**: Reorder prompts with smooth animations
- 🏷️ **Tag System**: Organize prompts with customizable tags
- 🔍 **Search & Filter**: Find prompts quickly with real-time search
- 📥 **Import/Export**: Backup and share your prompt collections
- 🌍 **Internationalization**: Full i18n support with Hebrew and English languages
- ↔️ **RTL Support**: Right-to-left layout support for Hebrew
- 💾 **Chrome Storage**: Persistent storage using Chrome extension APIs
- 🎯 **Type Safety**: Full TypeScript coverage with strict type checking

## Supported Languages

- **English** (en) - Default language
- **עברית** (he) - Hebrew with full RTL support

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd prompt-templates-sidebar
```

2. Install dependencies:

```bash
npm install
```

3. Build the extension:

```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Chrome browser

### Development Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. The extension will be built in `dist/` folder. Load it as an unpacked extension in Chrome.

### i18n Development

The project uses `react-i18next` for internationalization with full i18n Ally support.

#### Translation Files Structure

```
src/
├── locales/
│   ├── en/
│   │   └── common.json     # English translations
│   ├── he/
│   │   └── common.json     # Hebrew translations
│   └── index.ts            # Locale exports
├── i18n/
│   ├── config.ts           # i18next configuration
│   └── types.ts            # TypeScript types
```

#### Adding New Languages

1. Create a new folder in `src/locales/` (e.g., `fr/`)
2. Add `common.json` with translations
3. Update `src/locales/index.ts` to include the new language
4. Add language to `supportedLanguages` array
5. Update `LanguageSwitcher.tsx` with language name and flag

#### Translation Keys

Use nested dot notation for translation keys:

```typescript
// Usage in components
const { t } = useTranslation();
t("sidebar.title"); // "Prompt Helper"
t("buttons.newPrompt"); // "New Prompt"
t("messages.copied"); // "Copied to clipboard!"
```

#### i18n Ally Configuration

The project includes `i18n-ally.config.json` for VS Code integration:

- Automatic key extraction
- Translation management
- Real-time preview
- Missing translation detection

### RTL Support

Hebrew language includes full RTL (Right-to-Left) support:

- Automatic direction switching (`dir="rtl"`)
- CSS logical properties for layout
- Icon orientation adjustments
- Proper text alignment

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview built extension
- `npm run clean` - Clean build artifacts

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Shadcn/UI components
│   ├── PromptSidebar.tsx
│   ├── PromptForm.tsx
│   ├── PromptCard.tsx
│   ├── LanguageSwitcher.tsx
│   └── DarkModeToggle.tsx
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
├── locales/             # Translation files
├── i18n/                # i18n configuration
├── assets/              # Static assets
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles with RTL support
```

## Chrome Extension Configuration

The extension is configured as a Chrome Extension Manifest V3:

- **Side Panel**: Integrated with Chrome's side panel API
- **Storage**: Uses Chrome storage for persistence
- **Permissions**: Minimal required permissions
- **Content Security Policy**: Strict CSP for security

## Language Switching

Users can switch languages using the globe icon in the header:

1. Click the globe icon (🌍)
2. Select desired language from dropdown
3. Language preference is saved automatically
4. Interface updates immediately with RTL support for Hebrew

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add translations for new features
4. Test with both LTR and RTL languages
5. Submit a pull request

### Translation Guidelines

- Keep translations concise and contextual
- Test UI layout with longer Hebrew text
- Ensure proper RTL behavior
- Use i18n Ally for translation management
- Follow existing key naming conventions

## License

MIT License - see LICENSE file for details

## Tech Stack

- **Frontend**: React 18, TypeScript
- **UI Components**: Shadcn/UI, Radix UI
- **Styling**: Tailwind CSS with RTL support
- **Animation**: Framer Motion
- **Drag & Drop**: @hello-pangea/dnd
- **i18n**: react-i18next, i18next
- **Build Tool**: Vite
- **Linting**: ESLint
- **Type Checking**: TypeScript

## Browser Support

- Chrome 88+ (Manifest V3 support)
- Chromium-based browsers (Edge, Brave, etc.)
