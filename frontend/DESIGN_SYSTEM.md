# Fledge Design System

## Overview

A comprehensive design system has been created for the Fledge DCFSA Management application. This system provides consistent design tokens, reusable UI components, and styling guidelines to ensure a cohesive user experience across the application.

## What's Included

### 1. Design Tokens (`/src/design-system/tokens.ts`)

Centralized design values including:
- **Color Palette**: Primary, secondary, neutral, and semantic colors (success, warning, error, info)
- **Typography**: Font families, sizes, weights, and letter spacing
- **Spacing**: Consistent spacing scale based on 4px units
- **Border Radius**: Standardized border radius values
- **Shadows**: Elevation system with multiple shadow levels
- **Z-Index**: Semantic z-index scale for layering
- **Breakpoints**: Responsive design breakpoints
- **Transitions**: Animation timing and easing functions

### 2. Tailwind Configuration (`tailwind.config.ts`)

Extended Tailwind configuration that integrates all design tokens, making them available as utility classes throughout the application.

### 3. Global Styles (`/src/app/globals.css`)

Enhanced global stylesheet with:
- CSS variables for all design tokens
- Base styles for typography, links, and focus states
- Utility classes for common patterns (container-padding, page-container, card, etc.)
- Custom scrollbar styling
- Dark mode support (via CSS variables)

### 4. UI Components (`/src/components/ui/`)

Reusable React components with TypeScript support:

- **Button**: Multiple variants (primary, secondary, outline, ghost, danger) and sizes
- **Card**: Container component with header, body, and footer sections
- **Badge**: Status indicators with semantic color variants
- **Input**: Form input with label, error, and helper text support
- **Table**: Data table with header, body, and cell components
- **Alert**: Notification component for success, warning, error, and info messages
- **ProgressBar**: Progress indicator with multiple variants
- **LoadingSpinner**: Loading state indicator

### 5. Utilities (`/src/lib/utils.ts`)

Helper function for merging Tailwind CSS classes with conflict resolution.

### 6. Documentation

- **README.md**: Comprehensive documentation with usage examples
- **QUICK_REFERENCE.md**: Quick reference guide for common patterns
- **COMPONENT_SHOWCASE.tsx**: Visual showcase of all components

## Getting Started

### Installation

Install the required dependencies:

```bash
cd frontend
pnpm install
```

This will install:
- `clsx`: For conditional class names
- `tailwind-merge`: For merging Tailwind classes with conflict resolution

### Usage

Import components from the UI library:

```tsx
import { Button, Card, CardHeader, CardBody, Input, Badge } from '@/components/ui';

function MyComponent() {
  return (
    <Card>
      <CardHeader title="My Card" />
      <CardBody>
        <Input label="Email" type="email" />
        <Button variant="primary">Submit</Button>
      </CardBody>
    </Card>
  );
}
```

### Using Design Tokens

Access design tokens programmatically:

```tsx
import { tokens } from '@/design-system/tokens';

const primaryColor = tokens.colors.primary[500];
const spacing = tokens.spacing[4];
```

Or use Tailwind utilities:

```tsx
<div className="bg-primary-500 p-4 rounded-lg shadow-md">
  Content
</div>
```

## File Structure

```
frontend/
├── src/
│   ├── design-system/
│   │   ├── tokens.ts              # Design tokens
│   │   ├── README.md              # Full documentation
│   │   ├── QUICK_REFERENCE.md     # Quick reference guide
│   │   └── COMPONENT_SHOWCASE.tsx # Component showcase
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Input.tsx
│   │       ├── Table.tsx
│   │       ├── Alert.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── index.ts            # Central export
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   └── app/
│       └── globals.css            # Global styles with CSS variables
├── tailwind.config.ts            # Extended Tailwind config
└── package.json                   # Updated with dependencies
```

## Key Features

### ✅ Type Safety
All components are fully typed with TypeScript, providing excellent IDE support and compile-time error checking.

### ✅ Accessibility
Components follow accessibility best practices:
- Proper focus states
- Semantic HTML
- ARIA attributes where needed
- Keyboard navigation support

### ✅ Responsive Design
All components are responsive and work seamlessly across different screen sizes using Tailwind's responsive utilities.

### ✅ Customization
Components accept className props for additional styling while maintaining design system consistency.

### ✅ Consistency
Design tokens ensure consistent spacing, colors, typography, and other design elements throughout the application.

## Next Steps

1. **Install Dependencies**: Run `pnpm install` in the frontend directory
2. **Review Documentation**: Read `/src/design-system/README.md` for detailed usage
3. **Explore Components**: Check `/src/design-system/COMPONENT_SHOWCASE.tsx` to see all components
4. **Start Building**: Use the components in your pages and features

## Migration Guide

If you have existing components, you can gradually migrate them to use the design system:

1. Replace hardcoded colors with design token colors
2. Use the UI components instead of custom implementations
3. Apply consistent spacing using the spacing scale
4. Use semantic color variants (success, error, etc.) instead of arbitrary colors

## Support

For questions or issues:
- Check the documentation in `/src/design-system/README.md`
- Review the quick reference guide in `/src/design-system/QUICK_REFERENCE.md`
- Examine the component showcase for examples

## Contributing

When adding new components or tokens:
1. Follow existing patterns and conventions
2. Include TypeScript types
3. Add to the component index
4. Update documentation
5. Ensure accessibility compliance

