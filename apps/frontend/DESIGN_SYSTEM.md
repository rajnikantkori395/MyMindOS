# Design System Documentation

This document outlines the design system, theming, and UI components for MyMindOS.

## 🎨 Theme System

### Light & Dark Mode

The application supports both light and dark themes with automatic system preference detection.

**Theme Provider:**
- Located in `lib/theme/ThemeProvider.tsx`
- Manages theme state (light, dark, system)
- Persists theme preference to localStorage
- Automatically syncs with system preferences when set to "system"

**Usage:**
```tsx
import { useTheme } from '@/lib/theme/ThemeProvider';

function MyComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {resolvedTheme}
    </button>
  );
}
```

### Theme Toggle Component

A ready-to-use theme toggle button component:

```tsx
import { ThemeToggle } from '@/components/common';

<ThemeToggle />
```

## 🎨 Design Tokens

### Colors

The design system uses semantic color tokens that adapt to light/dark themes:

- **Primary**: Main brand color (blue)
- **Secondary**: Secondary actions
- **Muted**: Subtle backgrounds and text
- **Accent**: Highlighted elements
- **Destructive**: Error states and dangerous actions
- **Border**: Borders and dividers
- **Input**: Form input borders
- **Ring**: Focus rings

### Typography

**Font Families:**
- Sans: Geist Sans (primary)
- Mono: Geist Mono (code)

**Font Sizes:**
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

### Spacing

Consistent spacing scale:
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

### Border Radius

- sm: 0.25rem (4px)
- md: 0.5rem (8px)
- lg: 0.75rem (12px)
- xl: 1rem (16px)
- full: 9999px

## 🧩 Components

### Button

Multi-variant button component with loading states.

```tsx
import { Button } from '@/components/common';

<Button variant="primary" size="lg" isLoading={false}>
  Click me
</Button>
```

**Variants:**
- `primary`: Main action (blue)
- `secondary`: Secondary action
- `outline`: Outlined button
- `ghost`: Minimal button
- `danger`: Destructive action (red)

**Sizes:**
- `sm`: Small (h-8)
- `md`: Medium (h-10) - default
- `lg`: Large (h-12)

**Props:**
- `variant`: Button style variant
- `size`: Button size
- `isLoading`: Show loading spinner
- `fullWidth`: Full width button
- All standard button HTML attributes

### Input

Form input with label, error, and helper text support.

```tsx
import { Input } from '@/components/common';

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  error={errors.email?.message}
  helperText="We'll never share your email"
/>
```

**Props:**
- `label`: Input label
- `error`: Error message
- `helperText`: Helper text below input
- All standard input HTML attributes

### Card

Container component for grouping related content.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/common';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Alert

Alert component for notifications and messages.

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/common';

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong</AlertDescription>
</Alert>
```

**Variants:**
- `default`: Standard alert
- `destructive`: Error alert (red)
- `success`: Success alert (green)
- `warning`: Warning alert (yellow)

### Label

Form label component.

```tsx
import { Label } from '@/components/common';

<Label htmlFor="email">Email Address</Label>
```

## 🎨 Styling Guidelines

### Using Design Tokens

Always use semantic color tokens instead of hardcoded colors:

```tsx
// ✅ Good
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="border-border">

// ❌ Bad
<div className="bg-white text-black">
<div className="bg-blue-500 text-white">
```

### Dark Mode Support

All components automatically support dark mode through CSS variables. No need for `dark:` prefixes when using semantic tokens.

### Transitions

Smooth transitions are applied globally for theme changes. Components should use the design system's transition utilities.

## 📐 Layout Patterns

### Page Layout

```tsx
<div className="min-h-screen bg-background">
  <div className="mx-auto max-w-7xl px-4 py-8">
    {/* Content */}
  </div>
</div>
```

### Card Grid

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### Form Layout

```tsx
<Form onSubmit={handleSubmit}>
  <div className="space-y-4">
    <Input label="Email" />
    <Input label="Password" />
    <Button type="submit">Submit</Button>
  </div>
</Form>
```

## 🔧 Customization

### Changing Theme Colors

Edit `app/globals.css` to modify CSS variables:

```css
:root {
  --primary: #0ea5e9; /* Change primary color */
  --background: #ffffff; /* Change background */
  /* ... */
}

.dark {
  --primary: #38bdf8; /* Dark mode primary */
  --background: #0a0a0a; /* Dark mode background */
  /* ... */
}
```

### Adding New Components

1. Create component in `components/common/`
2. Use design tokens for styling
3. Support dark mode automatically
4. Export from `components/common/index.ts`
5. Document in this file

## 📱 Responsive Design

The design system is mobile-first:

- **Mobile**: Default styles
- **Tablet**: `sm:` breakpoint (640px+)
- **Desktop**: `md:` breakpoint (768px+)
- **Large Desktop**: `lg:` breakpoint (1024px+)

## ♿ Accessibility

All components include:

- Proper ARIA attributes
- Keyboard navigation support
- Focus indicators
- Semantic HTML
- Color contrast compliance

## 🚀 Best Practices

1. **Use Semantic Tokens**: Always use design tokens instead of hardcoded values
2. **Component Composition**: Compose components rather than creating new ones
3. **Consistent Spacing**: Use the spacing scale consistently
4. **Theme Awareness**: Test components in both light and dark modes
5. **Accessibility First**: Ensure all components are accessible

## 📚 Resources

- Design tokens: `lib/theme/theme.config.ts`
- Theme provider: `lib/theme/ThemeProvider.tsx`
- Components: `components/common/`
- Global styles: `app/globals.css`

