# Design System Quick Reference

Quick reference guide for common design system patterns and utilities.

## Color Utilities

```tsx
// Primary colors
bg-primary-50 to bg-primary-950
text-primary-50 to text-primary-950
border-primary-50 to border-primary-950

// Neutral colors
bg-neutral-50 to bg-neutral-950
text-neutral-50 to text-neutral-950

// Semantic colors
bg-success-500, text-success-600
bg-warning-500, text-warning-600
bg-error-500, text-error-600
bg-info-500, text-info-600
```

## Typography

```tsx
// Font sizes
text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl, text-5xl

// Font weights
font-light, font-normal, font-medium, font-semibold, font-bold, font-extrabold

// Headings
<h1 className="text-3xl font-semibold text-neutral-900">
<h2 className="text-2xl font-semibold text-neutral-900">
<h3 className="text-xl font-semibold text-neutral-900">
```

## Spacing

```tsx
// Padding
p-1, p-2, p-4, p-6, p-8, p-12, p-16

// Margin
m-1, m-2, m-4, m-6, m-8, m-12, m-16

// Gap (for flex/grid)
gap-1, gap-2, gap-4, gap-6, gap-8

// Space between (for vertical spacing)
space-y-1, space-y-2, space-y-4, space-y-6
space-x-1, space-x-2, space-x-4, space-x-6
```

## Layout Utilities

```tsx
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

// Page container (utility class)
<div className="page-container">

// Card container
<div className="card">
  <div className="card-header">Header</div>
  <div className="card-body">Body</div>
</div>
```

## Border Radius

```tsx
rounded-sm, rounded, rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-full
```

## Shadows

```tsx
shadow-sm, shadow, shadow-md, shadow-lg, shadow-xl, shadow-2xl, shadow-none
```

## Common Patterns

### Page Layout
```tsx
<div className="page-container">
  <h1 className="text-3xl font-bold text-neutral-900 mb-2">
    Page Title
  </h1>
  <p className="text-sm text-neutral-600 mb-6">
    Page description
  </p>
  {/* Content */}
</div>
```

### Card with Header
```tsx
<Card>
  <CardHeader title="Title" subtitle="Subtitle" />
  <CardBody>
    Content
  </CardBody>
</Card>
```

### Form Layout
```tsx
<div className="space-y-4">
  <Input label="Field 1" fullWidth />
  <Input label="Field 2" fullWidth />
  <div className="flex justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button variant="primary">Submit</Button>
  </div>
</div>
```

### Status Badge
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
```

### Loading State
```tsx
{loading ? (
  <LoadingSpinner size="md" text="Loading..." />
) : (
  <Content />
)}
```

### Error State
```tsx
{error && (
  <Alert variant="error" title="Error">
    {error}
  </Alert>
)}
```

### Progress Indicator
```tsx
<ProgressBar
  value={percentage}
  variant="primary"
  showLabel
  label="Progress"
/>
```

## Responsive Breakpoints

```tsx
// Mobile first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Hide/show at breakpoints
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

## Component Size Variants

```tsx
// Buttons
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Inputs
<Input size="sm" />
<Input size="md" />
<Input size="lg" />

// Badges
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

## Focus States

All interactive elements have focus states:
- Buttons: `focus:ring-2 focus:ring-primary-500`
- Inputs: `focus:ring-2 focus:ring-primary-500`
- Links: `focus:outline-none focus:ring-2`

## Transitions

```tsx
// Standard transition
transition-all duration-200

// Fast transition
transition-all duration-150

// Slow transition
transition-all duration-300
```

## Z-Index Scale

```tsx
// Use semantic z-index values
z-0    // base
z-10   // docked
z-50   // dropdown
z-40   // sticky
z-50   // overlay
z-50   // modal
```

## Common Color Combinations

```tsx
// Primary action
bg-primary-600 text-white hover:bg-primary-700

// Success state
bg-success-50 border-success-200 text-success-800

// Error state
bg-error-50 border-error-200 text-error-800

// Neutral background
bg-neutral-50 text-neutral-900

// Card background
bg-white shadow-md
```

