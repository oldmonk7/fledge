/**
 * Design System Component Showcase
 * 
 * This file demonstrates all available components in the design system.
 * Use this as a reference when building new features.
 */

import React from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Alert,
  ProgressBar,
  LoadingSpinner,
} from '@/components/ui';

export function ComponentShowcase() {
  return (
    <div className="page-container space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Design System Showcase</h1>
        <p className="text-neutral-600">All available components and their variants</p>
      </div>

      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Buttons</h2>
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button leftIcon={<span>←</span>}>With Left Icon</Button>
                <Button rightIcon={<span>→</span>}>With Right Icon</Button>
                <Button isLoading>Loading</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="default">
            <CardHeader title="Default Card" />
            <CardBody>
              <p>This is a default card with shadow.</p>
            </CardBody>
          </Card>
          <Card variant="elevated">
            <CardHeader title="Elevated Card" />
            <CardBody>
              <p>This card has a larger shadow.</p>
            </CardBody>
          </Card>
          <Card variant="outlined">
            <CardHeader title="Outlined Card" />
            <CardBody>
              <p>This card has a border instead of shadow.</p>
            </CardBody>
          </Card>
        </div>
        <Card className="mt-4">
          <CardHeader title="Full Card Example" subtitle="With all sections" />
          <CardBody>
            <p>This is the card body content.</p>
          </CardBody>
          <CardFooter>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button variant="primary">Save</Button>
            </div>
          </CardFooter>
        </Card>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Badges</h2>
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="neutral">Neutral</Badge>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge rounded="full">Full Rounded</Badge>
                <Badge rounded="md">Medium Rounded</Badge>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Inputs</h2>
        <Card>
          <CardBody>
            <div className="space-y-4 max-w-md">
              <Input label="Default Input" placeholder="Enter text..." />
              <Input label="With Helper Text" helperText="This is helpful information" />
              <Input label="With Error" error="This field is required" />
              <Input label="With Left Icon" leftIcon={<span>@</span>} />
              <Input label="Full Width" fullWidth />
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Alerts */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Alerts</h2>
        <div className="space-y-4">
          <Alert variant="success" title="Success!">
            Your changes have been saved successfully.
          </Alert>
          <Alert variant="info" title="Information">
            Here's some important information you should know.
          </Alert>
          <Alert variant="warning" title="Warning">
            Please review your input before proceeding.
          </Alert>
          <Alert variant="error" title="Error">
            An error occurred while processing your request.
          </Alert>
        </div>
      </section>

      {/* Progress Bars */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Progress Bars</h2>
        <Card>
          <CardBody>
            <div className="space-y-6">
              <ProgressBar value={25} variant="primary" showLabel />
              <ProgressBar value={50} variant="success" showLabel label="Success Progress" />
              <ProgressBar value={75} variant="warning" showLabel label="Warning Progress" />
              <ProgressBar value={90} variant="error" showLabel label="Error Progress" />
              <div className="space-y-2">
                <ProgressBar value={60} size="sm" />
                <ProgressBar value={60} size="md" />
                <ProgressBar value={60} size="lg" />
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Loading Spinner */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Loading Spinner</h2>
        <Card>
          <CardBody>
            <div className="flex gap-8 items-center">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
              <LoadingSpinner size="md" text="Loading data..." />
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Table */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Tables</h2>
        <Card>
          <CardBody>
            <Table striped hoverable>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>
                    <Badge variant="warning">Pending</Badge>
                  </TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bob Johnson</TableCell>
                  <TableCell>
                    <Badge variant="error">Inactive</Badge>
                  </TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </section>

      {/* Color Palette */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Color Palette</h2>
        <Card>
          <CardBody>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Primary</h3>
                <div className="flex gap-2 flex-wrap">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-50 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">50</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">100</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-200 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">200</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-300 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">300</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-400 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">400</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-500 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">500</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-600 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">600</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-700 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">700</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-800 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">800</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-900 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">900</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Neutral</h3>
                <div className="flex gap-2 flex-wrap">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-50 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">50</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-100 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">100</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-200 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">200</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-300 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">300</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-400 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">400</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-500 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">500</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-600 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">600</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-700 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">700</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-800 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">800</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-900 rounded border border-neutral-200" />
                    <p className="text-xs mt-1">900</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Semantic Colors</h3>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-success-500 rounded" />
                    <p className="text-xs mt-1">Success</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-warning-500 rounded" />
                    <p className="text-xs mt-1">Warning</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-error-500 rounded" />
                    <p className="text-xs mt-1">Error</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-info-500 rounded" />
                    <p className="text-xs mt-1">Info</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

