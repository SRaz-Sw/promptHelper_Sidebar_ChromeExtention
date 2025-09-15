# How to Build a Feature on This Chrome Extension Template

## High-Level Overview

This template provides a modern foundation for building Chrome extensions with React, TypeScript, Vite, and Shadcn/UI. Building a feature follows this workflow:

1. **Setup** - Install dependencies and start development server
2. **Design** - Plan your feature and identify required components
3. **Develop** - Create React components using Shadcn/UI design system
4. **Build** - Compile for production and test in Chrome
5. **Deploy** - Package and distribute your extension

---

## Detailed Development Guide

### 🚀 Initial Setup

#### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Chrome browser for testing

#### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint your code
npm run lint
```

### 🏗️ Project Architecture

```
src/
├── components/ui/     # Shadcn/UI components (Button, Input, etc.)
├── lib/utils.ts      # Utility functions and helpers
├── assets/           # Images, icons, and static files
├── App.tsx          # Main application component
├── App.css          # Global styles
└── main.tsx         # React entry point
```

### 🎨 Building UI Components

#### Using Shadcn/UI Components
The template includes pre-configured Shadcn/UI components in `src/components/ui/`:

```tsx
// Example: Using the Button component
import { Button } from "@/components/ui/button"

function MyFeature() {
  return (
    <div>
      <Button onClick={() => console.log('Clicked!')}>
        Click Me
      </Button>
    </div>
  )
}
```

#### Creating New Components
1. Create component files in `src/components/`
2. Follow TypeScript conventions with proper typing
3. Use Tailwind CSS for styling
4. Import and use in your main App.tsx

```tsx
// src/components/MyNewFeature.tsx
interface MyNewFeatureProps {
  title: string;
  onAction: () => void;
}

export function MyNewFeature({ title, onAction }: MyNewFeatureProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button onClick={onAction}>Take Action</Button>
    </div>
  )
}
```

### 🔧 Chrome Extension APIs

#### Manifest Configuration
Edit `manifest.json` to add required permissions:

```json
{
  "manifest_version": 3,
  "name": "Your Extension Name",
  "permissions": [
    "activeTab",    // Access current tab
    "storage",      // Use chrome.storage API
    "scripting"     // Inject scripts
  ],
  "host_permissions": [
    "https://*/*"   // Access specific websites
  ]
}
```

#### Using Chrome APIs
```tsx
// Example: Using Chrome storage
const saveData = async (key: string, value: any) => {
  await chrome.storage.local.set({ [key]: value })
}

const loadData = async (key: string) => {
  const result = await chrome.storage.local.get([key])
  return result[key]
}
```

### 🎯 Feature Development Workflow

#### 1. Plan Your Feature
- Define what your feature does
- List required Chrome permissions
- Identify UI components needed
- Plan data storage requirements

#### 2. Update Manifest
Add necessary permissions to `manifest.json`:
```json
{
  "permissions": ["tabs", "storage", "activeTab"]
}
```

#### 3. Create Components
Build React components in `src/components/`:
```tsx
// src/components/MyFeature.tsx
import { useState } from 'react'
import { Button } from "@/components/ui/button"

export function MyFeature() {
  const [data, setData] = useState('')
  
  const handleAction = async () => {
    // Feature logic here
    const tabs = await chrome.tabs.query({ active: true })
    console.log('Current tab:', tabs[0])
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">My Feature</h2>
      <Button onClick={handleAction}>Execute Feature</Button>
    </div>
  )
}
```

#### 4. Integrate in App
Add your feature to `src/App.tsx`:
```tsx
import { MyFeature } from './components/MyFeature'

function App() {
  return (
    <div className="w-96 p-4">
      <h1>My Chrome Extension</h1>
      <MyFeature />
    </div>
  )
}
```

#### 5. Test and Build
```bash
# Test in development
npm run dev

# Build for production
npm run build

# Load unpacked extension in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the 'build' folder
```

### 📦 Common Feature Patterns

#### Background Scripts
For features requiring background processing, add to `manifest.json`:
```json
{
  "background": {
    "service_worker": "background.js"
  }
}
```

#### Content Scripts
To interact with web pages:
```json
{
  "content_scripts": [{
    "matches": ["https://*/*"],
    "js": ["content.js"]
  }]
}
```

#### Options Page
For extension settings:
```json
{
  "options_page": "options.html"
}
```

### 🎨 Styling Guidelines

- Use Tailwind CSS utility classes
- Follow Shadcn/UI design system
- Keep components responsive
- Use semantic HTML elements

```tsx
// Good styling example
<div className="flex flex-col space-y-4 p-4">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <p className="text-gray-600">Description</p>
</div>
```

### 🧪 Testing Your Extension

1. **Development Testing**
   ```bash
   npm run dev
   # Test in browser with hot reload
   ```

2. **Production Testing**
   ```bash
   npm run build
   # Load unpacked extension in Chrome
   ```

3. **Code Quality**
   ```bash
   npm run lint
   # Fix any linting errors
   ```

### 🚀 Publishing Checklist

- [ ] Feature works in development and production builds
- [ ] All required permissions are in manifest.json
- [ ] Code passes linting checks
- [ ] Extension tested in Chrome
- [ ] Privacy policy updated (if needed)
- [ ] Screenshots and description prepared
- [ ] Version number updated in manifest.json

### 📚 Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Shadcn/UI Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

**Happy coding! 🎉**