'use client';

import { useEffect, useState } from 'react';
import { AggregateUsage } from '@fledge/shared';
import { LoadingSpinner, Alert, Card, CardHeader, CardBody, ProgressBar } from '@/components/ui';

export default function Home() {
  const [aggregateData, setAggregateData] = useState<AggregateUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAggregateData = async () => {
      try {
        const response = await fetch('/api/employees/aggregate/usage');

        if (!response.ok) {
          throw new Error('Failed to fetch aggregate usage data');
        }

        const data = await response.json();
        setAggregateData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAggregateData();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" text="Loading aggregate usage data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      </div>
    );
  }

  if (!aggregateData) {
    return (
      <div className="page-container">
        <p className="text-neutral-600 text-center">No aggregate data found</p>
      </div>
    );
  }

  const usagePercentage = aggregateData.totalAnnualLimit > 0
    ? (aggregateData.totalUsedAmount / aggregateData.totalAnnualLimit) * 100
    : 0;

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">FSA Account Aggregate Usage</h1>
        <p className="mt-2 text-sm text-neutral-600">Overview of all employees' FSA account usage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Employees Card */}
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">Total Employees</dt>
                  <dd className="text-2xl font-semibold text-neutral-900">{aggregateData.totalEmployees}</dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Active Accounts Card */}
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-success-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">Active Accounts</dt>
                  <dd className="text-2xl font-semibold text-neutral-900">{aggregateData.activeAccounts}</dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Inactive Accounts Card */}
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-neutral-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">Inactive Accounts</dt>
                  <dd className="text-2xl font-semibold text-neutral-900">{aggregateData.inactiveAccounts}</dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <CardHeader title="Financial Summary" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Annual Limit */}
            <div>
              <dt className="text-sm font-medium text-neutral-500">Total Annual Limit</dt>
              <dd className="mt-1 text-3xl font-semibold text-neutral-900">
                ${aggregateData.totalAnnualLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>

            {/* Total Used Amount */}
            <div>
              <dt className="text-sm font-medium text-neutral-500">Total Used Amount</dt>
              <dd className="mt-1 text-3xl font-semibold text-error-600">
                ${aggregateData.totalUsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>

            {/* Total Remaining Balance */}
            <div>
              <dt className="text-sm font-medium text-neutral-500">Total Remaining Balance</dt>
              <dd className={`mt-1 text-3xl font-semibold ${aggregateData.totalRemainingBalance >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                ${aggregateData.totalRemainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>

            {/* Average Usage Percentage */}
            <div>
              <dt className="text-sm font-medium text-neutral-500">Average Usage Percentage</dt>
              <dd className="mt-1 text-3xl font-semibold text-primary-600">
                {aggregateData.averageUsagePercentage.toFixed(2)}%
              </dd>
            </div>
          </div>

          {/* Usage Progress Bar */}
          <div className="mt-6 bg-neutral-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-neutral-900 mb-2">Overall Usage</h4>
            <ProgressBar
              value={usagePercentage}
              variant="primary"
              size="lg"
              showLabel
            />
            <div className="flex justify-between text-xs text-neutral-600 mt-2">
              <span>Used: ${aggregateData.totalUsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span>Remaining: ${aggregateData.totalRemainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
