'use client';

import { useEffect, useState } from 'react';
import { EmployeeWithFSA, User } from '@fledge/shared';
import { Card, CardHeader, CardBody, ProgressBar, Badge, Button, Alert, LoadingSpinner } from '@/components/ui';
import { usePlaidLink } from 'react-plaid-link';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

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

  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [plaidItems, setPlaidItems] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const userId = user.id;

  useEffect(() => {
    if (userId) {
      loadPlaidItems();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      if (plaidItems.length > 0) {
        loadTransactions();
      } else {
        setTransactions([]);
      }
    }
  }, [userId, plaidItems.length]);

  const loadPlaidItems = async () => {
    if (!userId) return;
    try {
      const items = await apiClient.getPlaidItems(userId);
      setPlaidItems(items);
    } catch (err) {
      console.error('Error loading Plaid items:', err);
    }
  };

  const loadTransactions = async () => {
    if (!userId || plaidItems.length === 0) {
      setTransactions([]);
      return;
    }
    setLoadingTransactions(true);
    setError(null);
    try {
      const data = await apiClient.getPlaidTransactions(userId);
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('Error loading transactions:', err);
      // Don't show error if it's just that there are no items
      if (err instanceof Error && !err.message.includes('No Plaid items')) {
        setError(err.message);
      }
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handlePlaidLink = async () => {
    if (!userId) return;
    try {
      const response = await apiClient.createPlaidLinkToken(userId);
      setLinkToken(response.link_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create Plaid link');
    }
  };

  const onSuccess = async (publicToken: string) => {
    if (!userId) return;
    try {
      await apiClient.exchangePlaidToken(userId, publicToken);
      setSuccess('Bank account connected successfully!');
      setError(null);
      await loadPlaidItems();
      await loadTransactions();
      setLinkToken(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect bank account');
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit: () => {
      setLinkToken(null);
    },
  });

  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

          {/* Action Buttons */}
          {fsaAccount.status === 'active' && user.employee?.id && (
            <div className="mt-6 flex justify-end gap-3">
              <Link href={`/employees/${user.employee.id}/allocate`}>
                <Button variant="primary" leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }>
                  Allocate money
                </Button>
              </Link>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Plaid Integration Section */}
      <Card className="mt-6">
        <CardHeader title="Bank Account Integration" />
        <CardBody>
          {error && (
            <Alert variant="error" title="Error" className="mb-4">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" title="Success" className="mb-4">
              {success}
            </Alert>
          )}

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-neutral-900">Connect Your Bank Account</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Connect your bank account to automatically import transactions and track your FSA spending.
              </p>
            </div>
            {plaidItems.length === 0 ? (
              <Button
                variant="primary"
                onClick={handlePlaidLink}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              >
                Connect Bank Account
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">
                    {plaidItems[0].institutionName || 'Bank Account'}
                  </p>
                  <p className="text-xs text-neutral-500">Connected</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={handlePlaidLink}
                  leftIcon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  }
                >
                  Reconnect
                </Button>
              </div>
            )}
          </div>

          {/* Transactions Section */}
          {plaidItems.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-neutral-900">Recent Transactions</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={loadTransactions}
                  disabled={loadingTransactions}
                  leftIcon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  }
                >
                  Refresh
                </Button>
              </div>

              {loadingTransactions ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" text="Loading transactions..." />
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-sm text-neutral-600 text-center py-8">No transactions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Merchant
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.transaction_id} className="hover:bg-neutral-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                            {transaction.merchant_name || transaction.name || 'Unknown'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                            {transaction.category?.[0] || 'Uncategorized'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                            <span className={transaction.amount > 0 ? 'text-error-600' : 'text-success-600'}>
                              {formatCurrency(Math.abs(transaction.amount))}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
