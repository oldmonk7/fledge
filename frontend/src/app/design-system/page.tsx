'use client';

import { useState } from 'react';
import { ComponentShowcase } from '@/design-system/COMPONENT_SHOWCASE';
import { Card, CardHeader, CardBody, Button, Input, Alert, ProgressBar } from '@/components/ui';
import Link from 'next/link';

export default function DesignSystemPage() {
  const [showAlert, setShowAlert] = useState(true);
  const [progress, setProgress] = useState(45);
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <ComponentShowcase />
      
      {/* Interactive Examples */}
      <div className="page-container border-t border-neutral-200 pt-8 mt-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Interactive Examples</h2>
            <p className="text-neutral-600">See the components in action with real interactivity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alert Dismissible Example */}
            <Card>
              <CardHeader title="Dismissible Alert" />
              <CardBody>
                {showAlert && (
                  <Alert
                    variant="info"
                    title="Interactive Alert"
                    dismissible
                    onDismiss={() => setShowAlert(false)}
                    className="mb-4"
                  >
                    Click the X button to dismiss this alert.
                  </Alert>
                )}
                {!showAlert && (
                  <div className="text-center py-4">
                    <p className="text-sm text-neutral-600 mb-4">Alert dismissed!</p>
                    <Button variant="outline" size="sm" onClick={() => setShowAlert(true)}>
                      Show Alert Again
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Progress Bar Example */}
            <Card>
              <CardHeader title="Animated Progress" />
              <CardBody>
                <ProgressBar
                  value={progress}
                  variant="primary"
                  showLabel
                  label="Progress"
                  className="mb-4"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProgress(Math.max(0, progress - 10))}
                  >
                    -10%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProgress(Math.min(100, progress + 10))}
                  >
                    +10%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProgress(0)}
                  >
                    Reset
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Input Example */}
            <Card>
              <CardHeader title="Form Input" />
              <CardBody>
                <div className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    helperText="Enter your email address"
                  />
                  {inputValue && (
                    <div className="text-sm text-neutral-600">
                      <p>You entered: <strong>{inputValue}</strong></p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Button States Example */}
            <Card>
              <CardHeader title="Button States" />
              <CardBody>
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="primary" size="sm">Normal</Button>
                    <Button variant="primary" size="sm" disabled>Disabled</Button>
                    <Button variant="primary" size="sm" isLoading>Loading</Button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Hover over buttons to see their interactive states
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Additional Design System Information */}
      <div className="page-container border-t border-neutral-200 pt-8 mt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Design System Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="outlined">
              <CardHeader title="Documentation" />
              <CardBody>
                <p className="text-sm text-neutral-600 mb-4">
                  Comprehensive guide to using the design system, including all components, tokens, and best practices.
                </p>
                <p className="text-xs text-neutral-500 font-mono bg-neutral-50 px-2 py-1 rounded">
                  /src/design-system/README.md
                </p>
              </CardBody>
            </Card>
            
            <Card variant="outlined">
              <CardHeader title="Quick Reference" />
              <CardBody>
                <p className="text-sm text-neutral-600 mb-4">
                  Quick reference guide for common patterns, utilities, and component usage.
                </p>
                <p className="text-xs text-neutral-500 font-mono bg-neutral-50 px-2 py-1 rounded">
                  /src/design-system/QUICK_REFERENCE.md
                </p>
              </CardBody>
            </Card>
            
            <Card variant="outlined">
              <CardHeader title="Design Tokens" />
              <CardBody>
                <p className="text-sm text-neutral-600 mb-4">
                  All design tokens including colors, typography, spacing, and more are defined in the tokens file.
                </p>
                <p className="text-xs text-neutral-500 font-mono bg-neutral-50 px-2 py-1 rounded">
                  /src/design-system/tokens.ts
                </p>
              </CardBody>
            </Card>
            
            <Card variant="outlined">
              <CardHeader title="Components" />
              <CardBody>
                <p className="text-sm text-neutral-600 mb-4">
                  All reusable UI components are located in the components directory.
                </p>
                <p className="text-xs text-neutral-500 font-mono bg-neutral-50 px-2 py-1 rounded">
                  /src/components/ui/
                </p>
              </CardBody>
            </Card>
          </div>
          
          <div className="mt-6 flex gap-4">
            <Link href="/">
              <Button variant="outline">
                ← Back to Home
              </Button>
            </Link>
            <Link href="/employees">
              <Button variant="outline">
                View Employees →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

