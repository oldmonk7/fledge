# Fledge Design System

A comprehensive design system for the Fledge DCFSA Management application, providing consistent design tokens, reusable components, and styling guidelines.

## Table of Contents

- [Overview](#overview)
- [Design Tokens](#design-tokens)
- [Components](#components)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)

## Overview

The Fledge Design System is built on top of Tailwind CSS and provides:

- **Design Tokens**: Centralized color palette, typography, spacing, and other design values
- **Reusable Components**: Pre-built UI components following consistent patterns
- **CSS Variables**: Theme-aware CSS variables for dynamic styling
- **Type Safety**: Full TypeScript support for all components and tokens

## Design Tokens

Design tokens are defined in `/src/design-system/tokens.ts` and include:

### Colors

The color palette includes:

- **Primary**: Blue scale for primary actions and branding
- **Secondary**: Green scale for secondary actions
- **Neutral**: Gray scale for text, borders, and backgrounds
- **Semantic Colors**: Success, Warning, Error, and Info variants

```typescript
import { tokens } from '@/design-system/tokens';

// Access colors
tokens.colors.primary[500] // Main primary color
tokens.colors.success[600] // Success color
```

### Typography

Typography system includes:

- **Font Families**: Sans-serif (Inter) and monospace
- **Font Sizes**: From xs (12px) to 5xl (48px)
- **Font Weights**: Light (300) to Extrabold (800)
- **Letter Spacing**: Tighter to widest

### Spacing

Spacing scale based on 4px base unit:

- `1` = 4px
- `2` = 8px
- `4` = 16px
- `8` = 32px
- etc.

### Other Tokens

- Border radius (sm to full)
- Shadows (sm to 2xl)
- Z-index scale
- Breakpoints
- Transitions

## Components

All components are located in `/src/components/ui/` and can be imported from the index file:

```typescript
import { Button, Card, Badge, Input, Table, Alert, ProgressBar, LoadingSpinner } from '@/components/ui';
```

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="outline" size="lg" leftIcon={<Icon />} isLoading={loading}>
  Submit
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `leftIcon` / `rightIcon`: React.ReactNode
- `fullWidth`: boolean

### Card

A container component for grouping related content.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

<Card variant="elevated" padding="lg">
  <CardHeader title="Card Title" subtitle="Card subtitle" />
  <CardBody>
    Card content goes here
  </CardBody>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined'
- `padding`: 'none' | 'sm' | 'md' | 'lg'

### Badge

A small status indicator or label.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="md">Active</Badge>
<Badge variant="error" rounded="md">Error</Badge>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
- `size`: 'sm' | 'md' | 'lg'
- `rounded`: 'full' | 'md'

### Input

A form input with label, error, and helper text support.

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  helperText="We'll never share your email"
  leftIcon={<MailIcon />}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon` / `rightIcon`: React.ReactNode
- `fullWidth`: boolean

### Table

A data table component with header, body, and cell components.

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';

<Table striped hoverable>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Props:**
- `striped`: boolean
- `hoverable`: boolean

### Alert

A notification component for displaying messages.

```tsx
import { Alert } from '@/components/ui';

<Alert variant="success" title="Success!" dismissible onDismiss={handleDismiss}>
  Your changes have been saved.
</Alert>

<Alert variant="error">
  An error occurred. Please try again.
</Alert>
```

**Props:**
- `variant`: 'success' | 'warning' | 'error' | 'info'
- `title`: string
- `dismissible`: boolean
- `onDismiss`: () => void

### ProgressBar

A progress indicator component.

```tsx
import { ProgressBar } from '@/components/ui';

<ProgressBar
  value={75}
  variant="primary"
  size="md"
  showLabel
  label="Upload Progress"
/>
```

**Props:**
- `value`: number (0-100)
- `max`: number (default: 100)
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'primary' | 'success' | 'warning' | 'error'
- `showLabel`: boolean
- `label`: string

### LoadingSpinner

A loading indicator component.

```tsx
import { LoadingSpinner } from '@/components/ui';

<LoadingSpinner size="md" text="Loading data..." />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `text`: string

## Usage Examples

### Complete Form Example

```tsx
import { Card, CardHeader, CardBody, Input, Button, Alert } from '@/components/ui';
import { useState } from 'react';

function ContactForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  return (
    <Card>
      <CardHeader title="Contact Us" subtitle="Send us a message" />
      <CardBody>
        {success && (
          <Alert variant="success" className="mb-4">
            Message sent successfully!
          </Alert>
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          fullWidth
        />
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
```

### Data Display Example

```tsx
import { Card, CardHeader, CardBody, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from '@/components/ui';

function EmployeeList({ employees }) {
  return (
    <Card>
      <CardHeader title="Employees" />
      <CardBody>
        <Table striped hoverable>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>
                  <Badge variant={employee.active ? 'success' : 'neutral'}>
                    {employee.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{employee.department}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
```

## Best Practices

### 1. Use Design Tokens

Always use design tokens instead of hardcoded values:

```tsx
// ✅ Good
<div className="bg-primary-500 text-white p-4 rounded-lg">

// ❌ Bad
<div className="bg-blue-500 text-white p-4 rounded-lg">
```

### 2. Consistent Spacing

Use the spacing scale consistently:

```tsx
// ✅ Good
<div className="space-y-4">
  <div className="p-6">...</div>
</div>

// ❌ Bad
<div className="space-y-3">
  <div className="p-5">...</div>
</div>
```

### 3. Component Composition

Compose components to build complex UIs:

```tsx
// ✅ Good
<Card>
  <CardHeader title="Title" />
  <CardBody>
    <Input label="Email" />
    <Button>Submit</Button>
  </CardBody>
</Card>
```

### 4. Type Safety

Always use TypeScript types for component props:

```tsx
// ✅ Good
<Button variant="primary" size="md" onClick={handleClick}>

// ❌ Bad
<Button variant="primary" size="medium" onClick={handleClick}>
```

### 5. Accessibility

- Always provide labels for form inputs
- Use semantic HTML elements
- Ensure proper focus states
- Include ARIA attributes when needed

### 6. Responsive Design

Use Tailwind's responsive prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

## CSS Variables

CSS variables are available for use in custom CSS:

```css
.custom-element {
  background-color: var(--color-primary-500);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base) var(--easing-in-out);
}
```

## Tailwind Configuration

The design system extends Tailwind's default configuration. All tokens are available as Tailwind utilities:

```tsx
// Colors
<div className="bg-primary-500 text-white">

// Spacing
<div className="p-4 m-6">

// Typography
<h1 className="text-3xl font-semibold text-neutral-900">

// Shadows
<div className="shadow-lg">

// Border Radius
<div className="rounded-lg">
```

## Contributing

When adding new components or tokens:

1. Follow the existing patterns
2. Include TypeScript types
3. Add to the component index
4. Update this documentation
5. Ensure accessibility compliance

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Design Tokens Specification](https://tr.designtokens.org/format/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

