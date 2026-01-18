'use client';

import { EmployeeWithFSA, User } from '@fledge/shared';
import { Card, CardHeader, CardBody, ProgressBar, Badge, Button } from '@/components/ui';
import Link from 'next/link';

interface EmployeeViewProps {
  employeeData: EmployeeWithFSA;
  user: User;
}

export default function EmployeeView({ employeeData, user }: EmployeeViewProps) {
  const { fsaAccount } = employeeData;
  const remainingBalance = fsaAccount.annualLimit - fsaAccount.usedAmount;
  const usagePercentage = fsaAccount.annualLimit > 0
    ? (fsaAccount.usedAmount / fsaAccount.annualLimit) * 100
    : 0;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'neutral';
      default:
        return 'error';
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">My DCFSA Account</h1>
        <p className="mt-2 text-sm text-neutral-600">Welcome back, {employeeData.firstName}! Here's your FSA account overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Annual Limit Card */}
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">Annual Limit</dt>
                  <dd className="text-2xl font-semibold text-neutral-900">
                    ${fsaAccount.annualLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Used Amount Card */}
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-error-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">Used Amount</dt>
                  <dd className="text-2xl font-semibold text-neutral-900">
                    ${fsaAccount.usedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Remaining Balance Card */}
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`flex items-center justify-center h-12 w-12 rounded-md ${remainingBalance >= 0 ? 'bg-success-500' : 'bg-error-500'} text-white`}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">Remaining Balance</dt>
                  <dd className={`text-2xl font-semibold ${remainingBalance >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                    ${remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Account Details */}
      <Card>
        <CardHeader title="Account Details" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Information */}
            <div>
              <h3 className="text-md font-medium text-neutral-900 mb-4">Account Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Account Type</dt>
                  <dd className="text-sm text-neutral-900">{fsaAccount.accountType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Status</dt>
                  <dd className="text-sm text-neutral-900">
                    <Badge variant={getStatusBadgeVariant(fsaAccount.status) as any}>
                      {fsaAccount.status.charAt(0).toUpperCase() + fsaAccount.status.slice(1)}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Plan Year</dt>
                  <dd className="text-sm text-neutral-900">
                    {new Date(fsaAccount.planYearStart).getFullYear()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Employee ID</dt>
                  <dd className="text-sm text-neutral-900">{employeeData.employeeId}</dd>
                </div>
              </dl>
            </div>

            {/* Usage Summary */}
            <div>
              <h3 className="text-md font-medium text-neutral-900 mb-4">Usage Summary</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Usage Percentage</dt>
                  <dd className="text-sm text-neutral-900 font-semibold">
                    {usagePercentage.toFixed(2)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Plan Year Start</dt>
                  <dd className="text-sm text-neutral-900">
                    {new Date(fsaAccount.planYearStart).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Plan Year End</dt>
                  <dd className="text-sm text-neutral-900">
                    {new Date(fsaAccount.planYearEnd).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Balance Progress Bar */}
          <div className="mt-6 bg-neutral-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-neutral-900 mb-2">Account Balance</h4>
            <ProgressBar
              value={usagePercentage}
              variant="primary"
              size="lg"
              showLabel
            />
            <div className="flex justify-between text-xs text-neutral-600 mt-2">
              <span>Used: ${fsaAccount.usedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span>Remaining: ${remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Action Button */}
          {fsaAccount.status === 'active' && user.employee?.id && (
            <div className="mt-6 flex justify-end">
              <Link href={`/employees/${user.employee.id}/allocate`}>
                <Button variant="primary" leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }>
                  Allocate Funds
                </Button>
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
