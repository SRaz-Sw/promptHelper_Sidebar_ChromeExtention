# How to Implement a Feature in Prompt Helper Chrome Extension

This guide provides a step-by-step approach to implementing new features in the Prompt Helper Chrome Extension, following the established patterns and architecture.

## 🏗️ Architecture Overview

The extension follows a React-based architecture with:

- **React 18** with TypeScript for the UI
- **Vite** for build tooling and development
- **Tailwind CSS + Shadcn/UI** for styling
- **Chrome Extension Manifest V3** for browser integration
- **Framer Motion** for animations
- **React Hook Form + Zod** for form validation

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (Shadcn/UI)
│   ├── PromptSidebar.tsx    # Main sidebar component
│   ├── PromptCard.tsx       # Individual prompt display
│   ├── PromptForm.tsx       # Add/edit prompt form
│   └── DragDropContext.tsx  # Drag & drop functionality
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
│   ├── storage.ts      # Chrome storage abstraction
│   └── utils.ts        # General utilities
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🔧 Implementation Steps

### Step 1: Define Types (if needed)

If your feature requires new data structures, add them to `src/types/`:

```typescript
// src/types/yourFeature.ts
export interface YourFeatureType {
  id: string;
  name: string;
  // ... other properties
}
```

### Step 2: Create Storage Functions

If your feature needs data persistence, extend `src/lib/storage.ts`:

```typescript
// In src/lib/storage.ts
export const storageUtils = {
  // ... existing methods

  async saveYourFeatureData(data: YourFeatureType[]): Promise<void> {
    try {
      if (typeof chrome !== "undefined" && chrome.storage) {
        await chrome.storage.local.set({ yourFeatureKey: data });
      } else {
        localStorage.setItem("yourFeatureKey", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error saving your feature data:", error);
      localStorage.setItem("yourFeatureKey", JSON.stringify(data));
    }
  },

  async getYourFeatureData(): Promise<YourFeatureType[]> {
    // Similar pattern to existing methods
  },
};
```

### Step 3: Create Custom Hooks (if needed)

For complex state management, create custom hooks in `src/hooks/`:

```typescript
// src/hooks/useYourFeature.ts
import { useState, useEffect } from "react";
import { storageUtils } from "@/lib/storage";

export const useYourFeature = () => {
  const [data, setData] = useState<YourFeatureType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const loadedData = await storageUtils.getYourFeatureData();
      setData(loadedData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, loadData };
};
```

### Step 4: Create UI Components

Follow the established component patterns:

```typescript
// src/components/YourFeatureComponent.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface YourFeatureComponentProps {
  // Define props
}

export function YourFeatureComponent({}: YourFeatureComponentProps) {
  const [state, setState] = useState();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card>
        <CardHeader>
          <CardTitle>Your Feature</CardTitle>
        </CardHeader>
        <CardContent>{/* Your component content */}</CardContent>
      </Card>
    </motion.div>
  );
}
```

### Step 5: Integrate with Main Components

Add your feature to the main sidebar or create new navigation:

```typescript
// In src/components/PromptSidebar.tsx
import { YourFeatureComponent } from "./YourFeatureComponent";

// Add state for your feature
const [showYourFeature, setShowYourFeature] = useState(false);

// Add UI elements in the appropriate section
<Button onClick={() => setShowYourFeature(true)} variant="ghost" size="sm">
  Your Feature
</Button>;

// Conditionally render your component
{
  showYourFeature && (
    <YourFeatureComponent onClose={() => setShowYourFeature(false)} />
  );
}
```

### Step 6: Add Form Validation (if needed)

Use Zod for schema validation:

```typescript
import * as z from "zod";

const yourFeatureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().max(500, "Description too long"),
});

type YourFeatureFormData = z.infer<typeof yourFeatureSchema>;
```

### Step 7: Handle Animations

Use Framer Motion consistently:

```typescript
import { motion, AnimatePresence } from "framer-motion";

<AnimatePresence>
  {condition && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Content */}
    </motion.div>
  )}
</AnimatePresence>;
```

## 🎨 Styling Guidelines

### Use Tailwind Classes

- Follow the existing color scheme with CSS variables
- Use `bg-background`, `text-foreground`, `text-muted-foreground`
- Apply consistent spacing: `p-3`, `gap-2`, `space-y-2`

### Component Sizing

- Cards: `w-full` with responsive max-widths
- Buttons: Use size variants (`sm`, `default`)
- Icons: Typically `h-4 w-4` or `h-5 w-5`

### Dark Mode Support

- All components automatically support dark mode via Tailwind's `dark:` prefix
- Use semantic color classes that adapt to theme

## 🔌 Chrome Extension Integration

### Permissions

If your feature needs new permissions, update `manifest.json`:

```json
{
  "permissions": ["storage", "sidePanel", "newPermission"]
}
```

### Background Script

For background functionality, extend `src/background.ts`:

```typescript
// Handle your feature's background events
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "YOUR_FEATURE_ACTION") {
    // Handle the action
    sendResponse({ success: true });
  }
});
```

## 🧪 Testing Your Feature

### Manual Testing

1. Run `npm run build` to build the extension
2. Load the unpacked extension in Chrome
3. Test all user interactions
4. Verify data persistence across browser sessions
5. Test in both light and dark modes

### Code Quality

- Run `npm run lint` to check for issues
- Ensure TypeScript compilation passes
- Follow existing naming conventions

## 📋 Feature Implementation Checklist

- [ ] Types defined in `src/types/`
- [ ] Storage functions implemented (if needed)
- [ ] Custom hooks created (if needed)
- [ ] UI components follow established patterns
- [ ] Framer Motion animations added
- [ ] Form validation with Zod (if applicable)
- [ ] Integration with main sidebar
- [ ] Dark mode support verified
- [ ] Chrome extension permissions updated (if needed)
- [ ] Manual testing completed
- [ ] Code linting passes

## 🚀 Deployment

After implementing your feature:

1. Test thoroughly in development
2. Build the extension: `npm run build`
3. Test the built version
4. Update version in `manifest.json` if needed
5. Create distribution package

## 💡 Best Practices

1. **Follow existing patterns** - Look at similar components for guidance
2. **Keep components small** - Break complex features into smaller components
3. **Use TypeScript strictly** - Define proper types for all data
4. **Handle errors gracefully** - Always provide fallbacks
5. **Maintain accessibility** - Use proper ARIA labels and semantic HTML
6. **Optimize performance** - Use React.memo() for expensive components
7. **Document complex logic** - Add comments for non-obvious code

## 🔍 Common Patterns

### State Management

```typescript
const [data, setData] = useState<Type[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string>("");
```

### Error Handling

```typescript
try {
  await someAsyncOperation();
} catch (error) {
  console.error("Operation failed:", error);
  setError("User-friendly error message");
}
```

### Component Props

```typescript
interface ComponentProps {
  data: Type[];
  onAction: (item: Type) => void;
  className?: string;
}
```

This guide should help you implement features that integrate seamlessly with the existing codebase while maintaining code quality and user experience standards.
